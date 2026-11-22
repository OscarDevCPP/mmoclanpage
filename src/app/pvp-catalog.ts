export type PvpLevel = 'básico' | 'intermedio' | 'avanzado';

type PendingTopic = { readonly status: 'pending'; readonly href?: never };
type AvailableTopic = { readonly status: 'available'; readonly href: `/compendio/pvp/fundamentos#${string}` };
export type PvpTopic = {
  readonly title: string;
  readonly level: PvpLevel;
  readonly learningOrder: number;
  readonly sections?: readonly string[];
} & (PendingTopic | AvailableTopic);

// Learning order is advisory; chapters organize the central index.
export const PVP_TOPICS: readonly PvpTopic[] = [
  { learningOrder: 1, level: 'básico', title: 'Introducción al competitivo', status: 'available', href: '/compendio/pvp/fundamentos#introduccion-competitivo' },
  { learningOrder: 2, level: 'básico', title: 'La ficha de un Pokémon', status: 'pending' },
  { learningOrder: 3, level: 'básico', title: 'Tipos y daño', status: 'pending' },
  { learningOrder: 4, level: 'básico', title: 'Movimientos', status: 'pending' },
  { learningOrder: 5, level: 'básico', title: 'Habilidades normales y ocultas', status: 'pending' },
  { learningOrder: 6, level: 'básico', title: 'Objetos competitivos', status: 'pending' },
  { learningOrder: 7, level: 'básico', title: 'IV, EV y naturalezas', status: 'pending' },
  { learningOrder: 8, level: 'básico', title: 'Tu primer equipo semicompetitivo', status: 'pending' },
  { learningOrder: 9, level: 'básico', title: 'Formatos y tiers', status: 'pending' },
  { learningOrder: 10, level: 'intermedio', title: 'Entrenamiento EV', status: 'pending' },
  { learningOrder: 11, level: 'intermedio', title: 'Crianza en PokeMMO', status: 'pending', sections: [
    'Plan y presupuesto',
    'Compatibilidad',
    'Herencia de IV y naturaleza y previsualización',
    'Huevo e incubadoras',
    'Movimientos huevo y habilidades',
    'Alpha, shiny y trajes',
    'Ejemplos y costos',
    'Comparación con FireRed, Emerald, HeartGold, Platinum, Black y White',
  ] },
  { learningOrder: 12, level: 'intermedio', title: 'Roles competitivos', status: 'pending' },
  { learningOrder: 13, level: 'intermedio', title: 'Checks y counters', status: 'pending' },
  { learningOrder: 14, level: 'intermedio', title: 'Sinergia y cores', status: 'pending' },
  { learningOrder: 15, level: 'intermedio', title: 'Herramientas del equipo', status: 'pending' },
  { learningOrder: 16, level: 'intermedio', title: 'Estilos de equipo', status: 'pending' },
  { learningOrder: 17, level: 'avanzado', title: 'Construcción de un equipo completo', status: 'pending' },
  { learningOrder: 18, level: 'avanzado', title: 'Win conditions y plan de partida', status: 'pending' },
  { learningOrder: 19, level: 'avanzado', title: 'Momentum, cambios y predicción', status: 'pending' },
  { learningOrder: 20, level: 'avanzado', title: 'Gestión del riesgo', status: 'pending' },
  { learningOrder: 21, level: 'avanzado', title: 'Speed control y benchmarks', status: 'pending' },
  { learningOrder: 22, level: 'avanzado', title: 'Arquetipos en profundidad', status: 'pending' },
  { learningOrder: 23, level: 'avanzado', title: 'Análisis de partidas', status: 'pending' },
  { learningOrder: 24, level: 'avanzado', title: 'Lectura del metajuego de PokeMMO', status: 'pending' },
];

export const PVP_DICTIONARY = { title: 'Diccionario de términos en inglés', status: 'pending' } as const;

/** Chapter membership is separate from optional learning levels and does not create routes. */
export const PVP_CHAPTERS = [
  { title: 'Fundamentos del competitivo', orders: [1, 9, 2, 3, 4, 5, 6], status: 'partial' },
  { title: 'Preparación de Pokémon', orders: [7, 10, 11, 8], status: 'pending' },
  { title: 'Construcción de equipos', orders: [12, 13, 14, 15, 16, 22, 17], status: 'pending' },
  { title: 'Decisiones en combate', orders: [18, 19, 20, 21], status: 'pending' },
  { title: 'Análisis y mejora', orders: [23, 24], status: 'pending' },
] as const;
