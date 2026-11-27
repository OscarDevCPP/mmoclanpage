import { crossPreview, inheritedParticles, shinyPreview, traitPreview } from './breeding-cross';

const a = [31, 20, 16, 12, 18, 20];
const b = [18, 20, 24, 12, 18, 31];

describe('Vista previa de crianza', () => {
  it('muestra los valores de los padres y el promedio redondeado hacia abajo', () => {
    const result = crossPreview(a, b, 'none', 'none');
    expect(result?.stats[5].values).toEqual([20, 25, 31]);
    expect(result?.stats[1].values).toEqual([20]);
    expect(result?.nature).toBeNull();
  });
  it('fija los IVs de dos brazales o garantiza naturaleza y un IV', () => {
    const result = crossPreview(a, b, '0', '5');
    expect(result?.stats[0].values).toEqual([31]);
    expect(result?.stats[5].values).toEqual([31]);
    expect(crossPreview(a, b, 'everstone', '5')).toMatchObject({ nature: 'A' });
    expect(crossPreview(a, b, '0', 'everstone')).toMatchObject({ nature: 'B' });
  });
  it('rechaza entradas inválidas o fuera del alcance', () => {
    expect(crossPreview([32, ...a.slice(1)], b, 'none', 'none')).toBeNull();
    expect(crossPreview([NaN, ...a.slice(1)], b, 'none', 'none')).toBeNull();
    expect(crossPreview(a, b, '5', '5')).toBeNull();
    expect(crossPreview(a, b, 'everstone', 'everstone')).toBeNull();
  });
});

describe('Rasgos de crianza', () => {
  const plain = { alpha: false, hidden: false, costume: false };
  it('distingue Alfa del acceso a habilidad oculta', () => {
    const alpha = { ...plain, alpha: true };
    expect(traitPreview(alpha, { ...plain, hidden: true })).toMatchObject({ alpha: false, hidden: true });
    expect(traitPreview(alpha, alpha)).toMatchObject({ alpha: true, hidden: false });
  });
  it('solo confirma el caso de un traje en el supuesto del ejercicio', () => {
    const costume = { ...plain, costume: true };
    expect(traitPreview(plain, plain).costume).toBe('none');
    expect(traitPreview(plain, costume).costume).toBe('inherited');
    expect(traitPreview(costume, costume).costume).toBe('check');
  });
});

it('reúne las partículas de ambos padres sin repetir las compartidas', () => {
  expect(inheritedParticles([], [])).toEqual([]);
  expect(inheritedParticles(['Bats'], ['Ghosts'])).toEqual(['Bats', 'Ghosts']);
  expect(inheritedParticles(['Bats'], ['Bats', 'Ghosts'])).toEqual(['Bats', 'Ghosts']);
});

it('solo garantiza variocolor con dos padres variocolor y prioriza Secret Shiny', () => {
  expect(shinyPreview('normal', 'normal')).toBe('normal');
  expect(shinyPreview('shiny', 'normal')).toBe('incompatible');
  expect(shinyPreview('normal', 'secret')).toBe('incompatible');
  expect(shinyPreview('shiny', 'shiny')).toBe('shiny');
  expect(shinyPreview('shiny', 'secret')).toBe('secret');
  expect(shinyPreview('secret', 'shiny')).toBe('secret');
  expect(shinyPreview('secret', 'secret')).toBe('secret');
});
