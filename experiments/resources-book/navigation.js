export function pageForHash(hash, ids) {
  const index = ids.indexOf(hash.replace(/^#/, ''));
  return index < 0 ? 0 : index;
}
export function hashForPage(index, ids) {
  return `#${ids[index] ?? ids[0]}`;
}
// Cubierta y contracubierta separadas; las hojas interiores forman pliegos.
export function spreadFor(index, count, wide) {
  index = Math.max(0, Math.min(count - 1, index));
  if (!wide || index === 0 || index === count - 1) return [index];
  const first = index % 2 === 0 ? index - 1 : index;
  return first + 1 < count - 1 ? [first, first + 1] : [first];
}
export function adjacentPage(index, count, wide, direction) {
  const spread = spreadFor(index, count, wide);
  return Math.max(0, Math.min(count - 1, direction > 0 ? spread.at(-1) + 1 : spread[0] - 1));
}
