/** Public guide destinations and the table of contents shared by both indexes. */
export const GUIDE_CATALOG = {
  pvp: {
    topicsId: 'pvp-introduction-topics', loadComponent: () => import('./pvp-fundamentos').then(m => m.PvpFundamentos),
    title: 'Introducción al competitivo', category: 'PvP', path: '/compendio/pvp/fundamentos',
    subtitle: 'Una primera mirada al PvP de PokeMMO',
    contents: [
      { id: 'introduccion-modalidades', title: 'Formas de jugar al PvP' },
      { id: 'introduccion-tipos', title: 'Lo esencial antes de crear un equipo' },
      { id: 'introduccion-sinergia', title: 'Construcción de equipos' },
      { id: 'introduccion-combate', title: 'La idea detrás de cada combate' },
    ],
  },
  breeding: {
    topicsId: 'breeding-topics', loadComponent: () => import('./breeding-guide').then(m => m.BreedingGuide),
    title: 'CRIANZA EN POKEMMO', category: 'PvE', path: '/compendio/pve/crianza',
    subtitle: 'Planea qué heredará el huevo antes de entregar a los padres.',
    contents: [
      { id: 'introduccion', title: 'Introducción' },
      { id: 'conceptos', title: 'Conceptos fundamentales' },
      { id: 'ahorro', title: 'Consejos de ahorro' },
      { id: 'antes-de-criar', title: 'Consejos antes de criar' },
      { id: 'simulador', title: 'Simulador de cruce' },
    ],
  },
  gymIntro: {
    topicsId: 'pve-gym-intro-topics', loadComponent: () => import('./gym-intro').then(m => m.GymIntro),
    title: 'INTRODUCCION A RE-RUNS DE GYMS', category: 'PvE', path: '/compendio/pve/introduccion-farmeo-gimnasios',
    subtitle: 'Aprende a preparar tu equipo y completar tus primeras rondas de revanchas.',
    contents: [
      { id: 'introduccion', title: 'Qué es un re-run de gimnasios' },
      { id: 'requisitos', title: 'Antes de empezar' },
      { id: 'equipo-inicial', title: 'El equipo' },
      { id: 'secuencia', title: 'Cómo combatir' },
      { id: 'ruta', title: 'Ruta por regiones' },
    ],
  },
  pve: {
    topicsId: 'pve-pillars-topics', loadComponent: () => import('./pve-pilares').then(m => m.PvePilares),
    title: 'LOS SEIS PILARES, FARMEO DE GYMS (AVANZADO)', category: 'PvE', path: '/compendio/pve/seis-pilares',
    subtitle: 'Una estrategia para revanchas de gimnasio en PokeMMO',
    contents: [
      { id: 'preparacion', title: 'Introducción' },
      { id: 'equipo', title: 'El equipo' },
      { id: 'estrategia', title: 'La idea principal' },
      { id: 'basica', title: 'Ruta básica y avanzadas' },
    ],
  },
} as const;

export const GUIDES = Object.values(GUIDE_CATALOG);
export const GUIDE_CATEGORIES = [...new Set(GUIDES.map(guide => guide.category))].map(category => ({
  id: category.toLowerCase(), name: category, guides: GUIDES.filter(guide => guide.category === category),
}));
