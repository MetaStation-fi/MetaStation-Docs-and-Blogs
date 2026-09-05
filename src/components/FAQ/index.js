import React from 'react';
import Head from '@docusaurus/Head';
import styles from './styles.module.css';

/**
 * A visible FAQ block that also emits FAQPage structured data.
 *
 * The two halves are generated from ONE `items` array on purpose. Google's
 * FAQPage guidelines require that every question and answer in the markup is
 * also visible on the page — schema that describes content a reader cannot see
 * is a structured-data violation, not a clever shortcut. Deriving both from the
 * same source makes that impossible to get wrong, and means an edit to the copy
 * cannot silently leave the schema behind.
 *
 * Answers accept plain strings. Keep them self-contained: an answer that only
 * makes sense after reading the paragraph above it reads badly when an answer
 * engine quotes it in isolation, which is the entire reason this block exists.
 *
 * Only ONE FAQPage block should exist per URL. If a page needs several topical
 * groups, pass them as one <FAQ> with all the items rather than stacking
 * multiple instances.
 */
export default function FAQ({title = 'Frequently asked questions', items = []}) {
  if (!items.length) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({question, answer}) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <section className={styles.faq}>
      <h2 id="faq">{title}</h2>
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      {items.map(({question, answer}) => (
        // Native <details> rather than a JS accordion: it is keyboard
        // accessible and findable by in-page search (Ctrl+F opens it) without
        // shipping any behaviour of our own.
        <details key={question} className={styles.item}>
          <summary className={styles.question}>{question}</summary>
          <div className={styles.answer}>{answer}</div>
        </details>
      ))}
    </section>
  );
}
