export type PvpLevel = 'básico' | 'intermedio' | 'avanzado';

type PendingTopic = { readonly status: 'pending'; readonly href?: never };
type AvailableTopic = { readonly status: 'available'; readonly href: `#${string}` };
export type PvpTopic = {
  readonly title: string;
  readonly level: PvpLevel;
  readonly learningOrder: number;
  readonly sections?: readonly string[];
} & (PendingTopic | AvailableTopic);

// The order is the learning path shown in the single hierarchical index.
export const PVP_TOPICS: readonly PvpTopic[] = [
  { learningOrder: 1, level: 'básico', title: 'Introducción al competitivo', status: 'available', href: '#introduccion-competitivo' },
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
