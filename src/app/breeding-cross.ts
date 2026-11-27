export const STATS = ['PS', 'Ataque', 'Defensa', 'Ataque Especial', 'Defensa Especial', 'Velocidad'] as const;
export type HeldItem = 'none' | 'everstone' | `${0 | 1 | 2 | 3 | 4 | 5}`;

export function normalizeIv(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(31, Math.trunc(value))) : 0;
}

export function crossPreview(a: readonly number[], b: readonly number[], first: HeldItem, second: HeldItem) {
  if (a.length !== 6 || b.length !== 6 || [...a, ...b].some(iv => !Number.isInteger(iv) || iv < 0 || iv > 31)) {
    return null;
  }
  // The exercise does not model two objects targeting the same trait.
  if (first !== 'none' && first === second) return null;

  return {
    nature: first === 'everstone' ? 'A' : second === 'everstone' ? 'B' : null,
    stats: STATS.map((name, i) => {
      const brace = first === String(i) ? 'A' : second === String(i) ? 'B' : null;
      const values = brace ? [brace === 'A' ? a[i] : b[i]] :
        [...new Set([a[i], Math.floor((a[i] + b[i]) / 2), b[i]])].sort((x, y) => x - y);
      return { name, values, brace };
    }),
  };
}

export interface ParentTraits {
  alpha: boolean;
  hidden: boolean;
  costume: boolean;
}

// The exercise assumes each contributor of a line-dependent trait belongs to the offspring line.
export function traitPreview(a: ParentTraits, b: ParentTraits) {
  const parents = [a, b];
  const costumed = parents.filter(parent => parent.costume);
  return {
    alpha: a.alpha && b.alpha,
    hidden: parents.some(parent => parent.hidden),
    costume: !costumed.length ? 'none' : costumed.length === 1 ? 'inherited' : 'check',
  } as const;
}

export function inheritedParticles<T extends string>(a: readonly T[], b: readonly T[]): readonly T[] {
  return [...new Set([...a, ...b])];
}

export type ShinyKind = 'normal' | 'shiny' | 'secret';

export function shinyPreview(a: ShinyKind, b: ShinyKind): ShinyKind | 'incompatible' {
  if (a === 'normal' || b === 'normal') return a === b ? 'normal' : 'incompatible';
  return a === 'secret' || b === 'secret' ? 'secret' : 'shiny';
}
