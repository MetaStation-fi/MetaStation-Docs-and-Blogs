/**
 * Composes a captured screenshot with a legend panel underneath it.
 *
 * The screenshot itself is never drawn over. Rings and small numbered badges
 * mark the targets; the explanations live in a panel below the image, keyed by
 * the same numbers. A reader can see the UI and read the explanation without
 * one hiding the other.
 *
 * Built by rendering an HTML page in the same browser and screenshotting that,
 * so there is no image library to install - which matters here, because the
 * network already refused to deliver a bundled Chromium.
 */

export async function composeWithLegend({ browser, pngBuffer, labels, cssWidth, deviceScaleFactor, theme, title }) {
  const b64 = pngBuffer.toString('base64');

  const rows = labels
    .map(
      (text, i) => `
      <li>
        <span class="n">${i + 1}</span>
        <span class="t">${escapeHtml(text)}</span>
      </li>`
    )
    .join('');

  const html = `
<!doctype html>
<meta charset="utf-8">
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: ${theme.canvas};
    font: 400 14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: ${theme.ink};
    width: ${cssWidth}px;
  }
  figure { margin: 0; }
  img { display: block; width: ${cssWidth}px; height: auto; }
  figcaption {
    padding: 18px 22px 20px;
    background: ${theme.panel};
    border-top: 2px solid ${theme.accent};
  }
  .hd {
    font-size: 11px;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: ${theme.muted};
    margin-bottom: 12px;
    font-weight: 600;
  }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  li { display: grid; grid-template-columns: 22px 1fr; gap: 11px; align-items: start; }
  .n {
    width: 22px; height: 22px; border-radius: 50%;
    background: ${theme.accent}; color: ${theme.onAccent};
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px; line-height: 1;
    margin-top: 1px;
  }
  .t { color: ${theme.ink}; }
</style>
<figure>
  <img src="data:image/png;base64,${b64}">
  <figcaption>
    <div class="hd">${escapeHtml(title || 'What to look at')}</div>
    <ul>${rows}</ul>
  </figcaption>
</figure>`;

  const ctx = await browser.newContext({
    viewport: { width: cssWidth, height: 800 },
    deviceScaleFactor,
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const fig = page.locator('figure');
  const buf = await fig.screenshot();
  await ctx.close();
  return buf;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
