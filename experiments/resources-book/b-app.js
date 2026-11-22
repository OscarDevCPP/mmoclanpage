import { pageForHash, hashForPage, spreadFor, adjacentPage } from './navigation.js';

const root = document.querySelector('#book');
const pages = [...root.children];
const ids = pages.map(page => page.id);
const previous = document.querySelector('#prev');
const next = document.querySelector('#next');
const status = document.querySelector('#status');
const mode = new URLSearchParams(location.search).get('mode') === 'b' ? 'b' : 'a';
const media = matchMedia('(min-width: 650px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let current = pageForHash(location.hash, ids);
let busy = false;
let pending = null;
let book;

for (const link of document.querySelectorAll('[data-mode]')) {
  const url = new URL(location.href);
  url.searchParams.set('mode', link.dataset.mode);
  link.href = (link.dataset.mode === 'a' ? './' : './b.html') + url.search + url.hash;
  if (link.dataset.mode === mode) link.setAttribute('aria-current', 'page');
}
document.querySelector('#mode-name').textContent = mode === 'a' ? 'A · OpenPageFlip' : 'B · Motor propio';

function wide() { return mode === 'a' ? book.orientation === 'landscape' : media.matches; }
function visible() { return spreadFor(current, pages.length, wide()); }
function refresh() {
  const shown = visible();
  pages.forEach((page, index) => { page.inert = !shown.includes(index); });
  previous.disabled = busy || shown[0] === 0;
  next.disabled = busy || shown.at(-1) === pages.length - 1;
  status.textContent = shown.length === 2 ? `Hojas ${shown[0] + 1}–${shown[1] + 1} de ${pages.length}` : `Hoja ${shown[0] + 1} de ${pages.length}`;
  if (mode === 'b') pages.forEach((page, index) => { page.hidden = !shown.includes(index); });
}
function focusPage(index) {
  const heading = pages[index].querySelector('h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}
function setHistory(index, replace = false) {
  history[replace ? 'replaceState' : 'pushState'](null, '', hashForPage(index, ids));
  for (const link of document.querySelectorAll('[data-mode]')) {
    const url = new URL(link.href); url.hash = hashForPage(index, ids); link.href = url;
  }
}
async function turnOwn(index) {
  const old = visible();
  const nextSpread = spreadFor(index, pages.length, wide());
  if (old.join() === nextSpread.join()) { current = index; refresh(); return; }
  const forward = nextSpread[0] > old[0];
  const source = pages[forward ? old.at(-1) : old[0]];
  const sheet = source.cloneNode(true);
  sheet.removeAttribute('id');
  sheet.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  sheet.inert = true;
  sheet.setAttribute('aria-hidden', 'true');
  sheet.classList.add('turning-sheet');
  const box = source.getBoundingClientRect();
  const stage = root.getBoundingClientRect();
  Object.assign(sheet.style, { left: `${box.left - stage.left}px`, top: `${box.top - stage.top}px`, width: `${box.width}px`, height: `${box.height}px`, transformOrigin: forward ? 'left center' : 'right center' });
  current = index;
  refresh();
  if (reduced.matches || !sheet.animate) return;
  root.append(sheet);
  try {
    await sheet.animate([
      { transform: 'perspective(1600px) rotateY(0deg)', filter: 'brightness(1)' },
      { transform: `perspective(1600px) rotateY(${forward ? -88 : 88}deg)`, filter: 'brightness(.68)', offset: .52 },
      { transform: `perspective(1600px) rotateY(${forward ? -155 : 155}deg)`, filter: 'brightness(.85)' }
    ], { duration: 480, easing: 'ease-in-out', fill: 'forwards' }).finished;
  } finally { sheet.remove(); }
}
async function go(index, { focus = true } = {}) {
  if (busy) { pending = { index, focus }; return; }
  busy = true;
  refresh();
  try {
    if (mode === 'a') { await book.flipTo(index); current = index; }
    else await turnOwn(index);
  } finally {
    busy = false;
    refresh();
    if (pending) { const queued = pending; pending = null; await go(queued.index, queued); }
    else if (focus) focusPage(index);
  }
}
try {
  if (mode === 'a') {
    const { createBook } = await import('./node_modules/@openpageflip/core/dist/index.js');
    book = createBook(root, { width: 440, height: 650, minWidth: 290, maxWidth: 440, size: 'stretch', cover: true, startPage: current, flipDuration: 450, click: 'off', hover: false, drag: false, swipe: false });
    book.on('changeOrientation', () => refresh());
  } else {
    root.classList.add('own-book');
    media.addEventListener('change', () => refresh());
  }
  for (const inner of document.querySelectorAll('.page-inner')) inner.tabIndex = 0;
  document.documentElement.classList.add('ready');
  refresh();
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const index = ids.indexOf(link.getAttribute('href').slice(1));
    if (index < 0) return;
    event.preventDefault();
    setHistory(index);
    go(index);
  });
  window.addEventListener('popstate', () => go(pageForHash(location.hash, ids)));
  window.addEventListener('hashchange', () => go(pageForHash(location.hash, ids)));
  for (const [button, direction] of [[previous, -1], [next, 1]]) button.addEventListener('click', () => {
    const index = adjacentPage(current, pages.length, wide(), direction);
    setHistory(index);
    go(index);
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous.click(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next.click(); }
  });
} catch (error) {
  pages.forEach(page => { page.hidden = false; page.inert = false; });
  document.documentElement.classList.remove('ready');
  console.error('No se pudo iniciar el libro; se conserva el documento legible.', error);
}
