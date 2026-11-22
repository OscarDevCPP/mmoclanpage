import { BOOK_GUIDE } from './book-guide';
import { BOOK_INDEX } from './book-index';
import type { InlineRun } from './book-content';

// noscript is parsed as text when scripting is enabled: Angular cannot hydrate
// components inside it. Serialize the same trusted semantic model, never the DOM.
const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const runs = (items: readonly InlineRun[]) => items.map(item => {
  let text = escape(item.text);
  for (const mark of item.marks) {
    if (mark.kind === 'link') {
      // Only known internal fragments or ordinary web links may survive in this trusted HTML.
      if (/^(?:#[a-z0-9-]+|https?:\/\/[^\s]+)$/i.test(mark.href)) text = `<a href="${escape(mark.href)}">${text}</a>`;
    }
    else if (mark.kind === 'strong') text = `<strong>${text}</strong>`;
    else text = `<i>${text}</i>`;
  }
  return text;
}).join('');

export const BOOK_NOSCRIPT = `<section><h1>El Compendio</h1><p>«Recopilación de conocimientos prácticos con mucho cariño para la comunidad»</p></section>` +
  [BOOK_INDEX, ...BOOK_GUIDE].map(section => `<section id="${escape(section.id)}">${section.blocks.map(block => {
    if (block.kind === 'heading') return `<h${block.level} id="${escape(block.id)}">${runs(block.runs)}</h${block.level}>`;
    if (block.kind === 'paragraph') return `<p>${runs(block.runs)}</p>`;
    if (block.kind === 'diagram') return `<p>${escape(block.description)}</p>`;
    const tag = block.ordered ? 'ol' : 'ul';
    return `<${tag}>${block.items.map(item => `<li${item.ordinal ? ` value="${item.ordinal}"` : ''}>${runs(item.runs)}</li>`).join('')}</${tag}>`;
  }).join('')}</section>`).join('') + '<p><a href="./">Volver al inicio</a></p>';
