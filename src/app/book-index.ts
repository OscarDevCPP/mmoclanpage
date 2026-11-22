import type { BookBlock, BookSection, InlineRun } from './book-content';
import { PVP_DICTIONARY, PVP_TOPICS, type PvpLevel } from './pvp-catalog';

const text = (value: string): InlineRun[] => [{ text: value, marks: [] }];
const heading = (id: string, label: string, level: 2 | 3): BookBlock => ({ kind: 'heading', id, level, runs: text(label) });
const levels: readonly { id: string; label: string; level: PvpLevel }[] = [
  { id: 'pvp-basico', label: 'Básico', level: 'básico' },
  { id: 'pvp-intermedio', label: 'Intermedio', level: 'intermedio' },
  { id: 'pvp-avanzado', label: 'Avanzado', level: 'avanzado' },
];

/** One continuous index, not a separate alphabetical catalogue. */
export const BOOK_INDEX: BookSection = {
  id: 'indice',
  blocks: [
    heading('indice-titulo', 'Índice', 2),
    { kind: 'paragraph', id: 'indice-ramas', runs: [
      { text: 'PvP', marks: [{ kind: 'link', href: '#pvp' }] },
      ...levels.flatMap(({ id, label }): InlineRun[] => [
        { text: ' · ', marks: [] }, { text: label, marks: [{ kind: 'link', href: `#${id}` }] },
      ]),
      { text: ' · ', marks: [] }, { text: 'PvE', marks: [{ kind: 'link', href: '#pve' }] },
      { text: ' · ', marks: [] }, { text: 'Eventos', marks: [{ kind: 'link', href: '#eventos' }] },
    ] },
    heading('pvp', 'Guías de PvP', 2),
    ...levels.flatMap(({ id, label, level }): BookBlock[] => [
      heading(id, label, 3),
      {
        kind: 'list', id: `${id}-temas`, ordered: true,
        items: PVP_TOPICS.filter(topic => topic.level === level).map(topic => ({
          id: `tema-${topic.learningOrder}`, ordinal: topic.learningOrder,
          runs: topic.status === 'available'
            ? [{ text: topic.title, marks: [{ kind: 'link', href: topic.href }] }]
            : text(`${topic.title} · pendiente`),
        })),
      },
    ]),
    { kind: 'paragraph', id: 'diccionario', runs: text(`${PVP_DICTIONARY.title} · pendiente`) },
    heading('pve', 'Guías de PvE', 2),
    { kind: 'paragraph', id: 'pve-pendiente', runs: text('Esta categoría está en preparación; aún no hay guías publicadas.') },
    heading('eventos', 'Eventos del juego', 2),
    { kind: 'paragraph', id: 'eventos-pendiente', runs: text('Esta categoría está en preparación; aún no hay recursos publicados.') },
  ],
};
