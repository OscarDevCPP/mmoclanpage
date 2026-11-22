import { describe, expect, it } from 'vitest';
import { PVP_DICTIONARY, PVP_TOPICS } from './pvp-catalog';

describe('catálogo PvP', () => {
  it('contiene los 24 títulos únicos en el orden aprobado de aprendizaje', () => {
    expect(PVP_TOPICS.map(topic => topic.title)).toEqual([
      'Introducción al competitivo', 'La ficha de un Pokémon', 'Tipos y daño', 'Movimientos',
      'Habilidades normales y ocultas', 'Objetos competitivos', 'IV, EV y naturalezas',
      'Tu primer equipo semicompetitivo', 'Formatos y tiers', 'Entrenamiento EV',
      'Crianza en PokeMMO', 'Roles competitivos', 'Checks y counters', 'Sinergia y cores',
      'Herramientas del equipo', 'Estilos de equipo', 'Construcción de un equipo completo',
      'Win conditions y plan de partida', 'Momentum, cambios y predicción', 'Gestión del riesgo',
      'Speed control y benchmarks', 'Arquetipos en profundidad', 'Análisis de partidas',
      'Lectura del metajuego de PokeMMO',
    ]);
    expect(new Set(PVP_TOPICS.map(topic => topic.title)).size).toBe(24);
    expect(PVP_TOPICS.map(topic => topic.learningOrder)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
    expect(PVP_TOPICS.map(topic => topic.level)).toEqual([
      ...Array(9).fill('básico'), ...Array(7).fill('intermedio'), ...Array(8).fill('avanzado'),
    ]);
  });

  it('sólo señala la introducción como disponible y no da enlaces a pendientes', () => {
    expect(PVP_TOPICS.filter(topic => topic.status === 'available')).toEqual([
      expect.objectContaining({ title: 'Introducción al competitivo', href: '/compendio/pvp/fundamentos#introduccion-competitivo' }),
    ]);
    const pending = PVP_TOPICS.filter(topic => topic.status === 'pending');
    expect(pending).toHaveLength(23);
    pending.forEach(topic => expect(topic).not.toHaveProperty('href'));
    expect(PVP_DICTIONARY.status).toBe('pending');
    expect(PVP_DICTIONARY).not.toHaveProperty('href');
  });

  it('conserva los ocho apartados previstos de crianza sin publicarlos', () => {
    const breeding = PVP_TOPICS.find(topic => topic.title === 'Crianza en PokeMMO');
    expect(breeding?.status).toBe('pending');
    expect(breeding?.sections).toHaveLength(8);
  });
});
