import { describe, expect, it } from 'vitest';
import { splitRuns, type InlineRun } from './book-content';

describe('fragmentos semánticos del libro', () => {
  const runs: readonly InlineRun[] = [
    { text: 'Lee ', marks: [] },
    { text: 'la guía', marks: [{ kind: 'strong' }, { kind: 'link', href: 'https://example.org' }] },
    { text: ' completa.', marks: [{ kind: 'emphasis' }] },
  ];

  it('conserva texto, marcas y enlace al dividir dentro de una secuencia', () => {
    const [before, after] = splitRuns(runs, 7);
    expect(before.map((run) => run.text).join('')).toBe('Lee la ');
    expect(after.map((run) => run.text).join('')).toBe('guía completa.');
    expect(before[1].marks).toEqual(runs[1].marks);
    expect(after[0].marks).toEqual(runs[1].marks);
    expect([...before, ...after].map((run) => run.text).join('')).toBe(runs.map((run) => run.text).join(''));
  });

  it('admite extremos y rechaza offsets fuera de rango', () => {
    const length = runs.map((run) => run.text).join('').length;
    expect(splitRuns(runs, 0)[0]).toEqual([]);
    expect(splitRuns(runs, length)[1]).toEqual([]);
    expect(() => splitRuns(runs, -1)).toThrow(RangeError);
    expect(() => splitRuns(runs, length + 1)).toThrow(RangeError);
    expect(() => splitRuns(runs, 1.5)).toThrow(RangeError);
  });
});
