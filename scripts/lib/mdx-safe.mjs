/**
 * Make untrusted markdown safe to hand to Docusaurus.
 *
 * Docusaurus 3 parses `.md` as MDX. That is fine for content we author — the
 * repo's own convention is a JSX comment instead of an HTML one — but a GitHub
 * release note is written by whoever cut the release, and MDX turns three
 * ordinary characters into hard build errors:
 *
 *   `<!-- … -->`   HTML comment            → parse error
 *   `<` , `<foo>`  anything tag-shaped     → parsed as JSX, usually unknown
 *   `{` , `}`      MDX expression braces   → "Could not parse expression"
 *
 * A build error on a file no human wrote is the worst kind: the workflow that
 * generated it has already pushed, and the failure surfaces on somebody else's
 * unrelated commit. So the conversion happens at generation time.
 *
 * Split out of scripts/changelog-from-releases.mjs so it can be exercised
 * directly — the generator's own entry point starts by calling the GitHub API,
 * which makes importing it to test one pure function impossible.
 */

/* Attribute-less inline and block HTML that MDX renders happily. Anything
   outside this set, and anything carrying attributes, is escaped to text
   rather than guessed at: JSX needs quoted attribute values and self-closed
   void elements, and a wrong guess is a build error on generated content. */
const ALLOWED_TAGS = new Set([
  'b', 'i', 'em', 'strong', 'code', 'pre', 'kbd', 'sub', 'sup', 'del', 's',
  'ul', 'ol', 'li', 'p', 'blockquote', 'details', 'summary',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

const VOID_TAGS = new Set(['br', 'hr', 'wbr']);

function escapeAngles(s) {
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sanitiseSegment(text) {
  let out = text;

  // HTML comments are a hard MDX error and carry nothing a reader needs.
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // CommonMark autolinks. MDX reads `<https://…>` as the start of a JSX tag.
  out = out.replace(/<((?:https?|mailto):[^>\s]+)>/g, (_m, url) =>
    url.replace(/^mailto:/, ''),
  );

  // Every remaining tag-shaped run: keep the safe ones, escape the rest.
  out = out.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>/g,
    (match, name, attrs) => {
      const tag = name.toLowerCase();
      const bare = attrs.trim() === '' || attrs.trim() === '/';
      if (VOID_TAGS.has(tag) && bare) {
        return `<${tag} />`;
      }
      if (ALLOWED_TAGS.has(tag) && bare) {
        return match.startsWith('</') ? `</${tag}>` : `<${tag}>`;
      }
      return escapeAngles(match);
    },
  );

  // A lone `<` that survived is a less-than sign, not markup.
  out = out.replace(/<(?![a-zA-Z/])/g, '&lt;');

  // Braces open an MDX expression. As character references they render as the
  // literal characters and cannot be parsed as code.
  out = out.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

  return out;
}

/**
 * Applies the conversions above to prose only. Fenced blocks and inline code
 * are passed through untouched — escaping inside them would corrupt the very
 * payload examples a release note is most likely to contain, and MDX does not
 * parse expressions inside code anyway.
 */
export function sanitiseForMdx(body) {
  const parts = body.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/g);
  return parts
    .map((part, i) => (i % 2 === 1 ? part : sanitiseSegment(part)))
    .join('');
}

/**
 * One h1 per page, and a generated post's title front matter already is it.
 * Only shifts when the body actually contains an h1, so notes that correctly
 * start at `##` keep their levels — demoting those would skip from h1 to h3
 * and fail the heading-order audit.
 */
export function demoteHeadings(body) {
  if (!/^#\s/m.test(body)) {
    return body;
  }
  return body.replace(/^(#{1,5})(\s)/gm, '#$1$2');
}
