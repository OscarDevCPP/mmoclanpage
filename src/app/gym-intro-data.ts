import { GUIDE_CATALOG } from './guide-catalog';
import type { GuideBlock, GuideSection, InlineRun } from './guide-content';
import { STATS, type PokemonBuild, type Stat, type NumericRequirement, type Requirement } from './pokemon-build';
const run = (text: string): InlineRun[] => [{ text, marks: [] }];
const heading = (id: string, text: string): GuideBlock => ({ kind: 'heading', id, level: 2, runs: run(text) });
const paragraph = (id: string, text: string): GuideBlock => ({ kind: 'paragraph', id, runs: run(text) });
const exact = <T>(value: T): Requirement<T> => ({ kind: 'exact', value });
const unknown = { kind: 'unknown' } as const;
const stats = (special = false, ev = false): Record<Stat, NumericRequirement> => Object.fromEntries(STATS.map(stat => [stat, special && (stat === 'Ataque Especial' || stat === 'Velocidad') ? { kind: 'exact', value: ev ? 252 : 31, recommended: true } : unknown])) as Record<Stat, NumericRequirement>;
const move = (value: string, optional = false): Requirement<string> => ({ kind: 'exact', value, optional });
const builds: PokemonBuild[] = [
  { name: 'Murkrow', iv: stats(), ev: stats(), nature: unknown, ability: exact('Bromista'), item: { kind: 'exact', value: 'Amuleto', optional: true }, moves: [move('Viento Afín')], note: 'Nivel 39 en el equipo de referencia. Bromista es su habilidad oculta; Viento Afín es el movimiento esencial.' },
  { name: 'Torkoal', iv: stats(), ev: stats(), nature: unknown, ability: exact('Sequía'), item: { kind: 'exact', value: 'Amuleto', optional: true }, moves: [move('Explosión')], note: 'Nivel 23 en el equipo de referencia. Sequía activa el sol y Explosión abre paso a los atacantes.' },
  { name: 'Typhlosion ×2', image: { src: 'pokemon/typhlosion.png', alt: '' }, iv: stats(true), ev: stats(true, true), nature: exact('Modesta'), ability: exact('Mar Llamas'), item: exact('Gafas Elegidas'), moves: [move('Estallido'), move('Rapidez', true), move('Humareda', true), move('Lanzallamas', true)], note: 'Dos ejemplares con esta configuración. Rapidez se usa para los entrenadores de la ruta 13; los demás movimientos adicionales son de apoyo.' },
  { name: 'Blastoise', image: { src: 'pokemon/blastoise.png', alt: '' }, iv: stats(true), ev: stats(true, true), nature: exact('Modesta'), ability: exact('Torrente'), item: exact('Gafas Elegidas'), moves: [move('Salpicar'), move('Danza Lluvia', true), move('Rayo Hielo', true), move('Rompecoraza', true)], note: 'Respaldo frente a equipos que resisten Fuego. Los movimientos adicionales son opcionales para esta ruta.' },
];
const route = (id: string, title: string, entries: string[]): GuideBlock => ({ kind: 'disclosure', id, title, blocks: [{ kind: 'list', id: id + '-lista', ordered: true, items: entries.map((text, index) => ({ id: `${id}-${index}`, runs: run(text) })) }] });
export const GYM_SECTIONS: GuideSection[] = [
  { id: 'introduccion', blocks: [heading('introduccion-h', 'Qué es un re-run de gimnasios'), paragraph('introduccion-p', 'Un re-run de gimnasios consiste en volver a enfrentarte a varios líderes seguidos para ganar dinero en PokeMMO. En estas revanchas se combate en dobles: no necesitas un equipo distinto para cada líder, sino una apertura que puedas repetir y un respaldo para los combates en los que no funcione.'), paragraph('introduccion-practica', 'Esta guía te enseña a preparar ese equipo, usarlo en combate y seguir una ruta por las cinco regiones. Para tus primeras rondas, puedes practicar en una sola región antes de hacer el recorrido completo.'),
    { kind: 'paragraph', id: 'introduccion-siguiente', runs: [
      { text: 'Esta es una guía básica. Cuando domines las revanchas y hayas ahorrado lo suficiente, puedes pasar a un equipo avanzado con la guía de ', marks: [] },
      { text: 'Los seis pilares', marks: [{ kind: 'link', href: GUIDE_CATALOG.pve.path }] },
      { text: '.', marks: [] },
    ] },
  ] },
  { id: 'requisitos', blocks: [heading('requisitos-h', 'Antes de empezar'), paragraph('requisitos-p', 'Para repetir un gimnasio debes vencer primero al Alto Mando de su región. Tras cada victoria espera 18 horas y derrota a otros cinco entrenadores elegibles, en cualquier región. Solo cuentan los entrenadores con tiempo de espera de revancha; el Alto Mando y el Frente Batalla no cuentan. Los tres líderes de Ciudad Gres cuentan por separado. Los entrenadores normales tienen una espera de seis horas.'), paragraph('requisitos-p2', 'Esta ruta comunitaria propone 21 líderes y tres entrenadores extra. El orden ahorra desplazamientos, pero no es obligatorio. Cura en un centro Pokémon después de cada combate salvo que se indique lo contrario; las ocarinas de Vuelo y Teletransporte ayudan a desplazarse. No hay ganancias garantizadas.') ] },
  { id: 'equipo-inicial', blocks: [
    heading('equipo-h', 'El equipo'),
    paragraph('equipo-apertura', 'La pareja inicial prepara el campo para los dos Typhlosion. Murkrow puede sustituirse por cualquier Pokémon con Viento Afín y Bromista. Esta habilidad da prioridad a los movimientos de estado, aunque Sorpresa aún puede adelantarse e impedir que salga Viento Afín.'),
    paragraph('equipo-clima', 'Conviene mantener a Torkoal a nivel bajo para que siga siendo lento. Si dos Pokémon entran a la vez con habilidades que cambian el clima, la del más lento se activa al final. Así es más probable que Sequía deje el sol en el campo para potenciar el Estallido de los Typhlosion.'),
    paragraph('equipo-amuleto', 'El Amuleto es opcional: reduce los encuentros con Pokémon salvajes si lo lleva el primer Pokémon del equipo. Basta con equipárselo al que vaya primero. No afecta a los combates ni a sus premios.'),
    paragraph('equipo-p', 'Las fichas muestran la configuración recomendada. Los guiones indican datos no especificados y el asterisco marca los movimientos opcionales.'),
    { kind: 'builds', id: 'equipo-fichas', builds },
  ] },
  { id: 'secuencia', blocks: [heading('secuencia-h', 'Cómo combatir'), { kind: 'list', id: 'secuencia-pasos', ordered: true, items: [
    { id: 'uno', runs: run('Torkoal y el usuario de Viento Afín abren el combate: Sequía activa el sol y Bromista da prioridad a Viento Afín.') },
    { id: 'dos', runs: run('Torkoal usa Explosión, que también golpea a su compañero; normalmente ambos caen y dejan paso a los atacantes.') },
    { id: 'tres', runs: run('Entran los dos Typhlosion y usan Estallido con los PS completos, bajo sol y Viento Afín.') },
    { id: 'cuatro', runs: run('Si un rival resiste Fuego o un Typhlosion cae, usa Blastoise con Salpicar. La apertura estándar no sirve para todos los combates: consulta las excepciones de cada región.') },
  ] }] },
  { id: 'ruta', blocks: [heading('ruta-h', 'Ruta por regiones'), paragraph('ruta-p', 'El recorrido completo es recomendado, no obligatorio. Lo fundamental es dominar la apertura y saber cuándo cambiar de atacantes. Puedes empezar en cualquier región con las revanchas desbloqueadas; sigue la apertura habitual salvo indicación.'),
    route('hoenn', 'Hoenn · 6 gimnasios', ['Ciudad Algaria: gimnasio Psíquico. Atajo: evita los teletransportes. Si cae un Typhlosion, entra Blastoise.', 'Ciudad Arborada: gimnasio Volador. Atajo: paso directo por las plataformas.', 'Ciudad Malvalona: gimnasio Eléctrico.', 'Pueblo Azuliza: gimnasio Lucha.', 'Ciudad Petalia: gimnasio Normal. Atajo: evita el puzle de salas.', 'Ciudad Férrica: gimnasio Roca. No cures antes de ir a Sinnoh.']),
    route('sinnoh', 'Sinnoh · 3 gimnasios y un entrenador extra', ['Ruta 214, al sur de Ciudad Rocavelo: entrenador rico extra. Usa un Typhlosion y Estallido; Teletransporte ayuda a volver.', 'Ciudad Marina: gimnasio Eléctrico.', 'Ciudad Pirita: gimnasio Roca. No cures antes de Vetusta.', 'Ciudad Vetusta: gimnasio Planta.']),
    route('johto', 'Johto · 5 gimnasios', ['Ciudad Orquídea: gimnasio Lucha.', 'Ciudad Trigal: gimnasio Normal.', 'Pueblo Azalea: gimnasio Bicho. Si abre con Forretress y Beedrill, usa Typhlosion y Blastoise por el Tyranitar de ese equipo.', 'Ciudad Malva: gimnasio Volador.', 'Pueblo Caoba: gimnasio Hielo.']),
    route('kanto', 'Kanto · 2 gimnasios', ['Ciudad Carmín: gimnasio Eléctrico. Cura antes; Politoed puede cambiar el sol por lluvia.', 'Ciudad Azulona: gimnasio Planta. Cura antes por la posible salida de Dragonite. Atajo: paso libre entre los árboles.']),
    route('teselia', 'Teselia · 5 líderes y dos entrenadores extra', ['Ciudad Gres, líder de Agua: apertura estándar. No cures.', 'Ciudad Gres, líder de Planta: usa los dos Typhlosion. No cures.', 'Ciudad Gres, líder de Fuego: usa Typhlosion y Blastoise.', 'Ciudad Teja: gimnasio Hielo.', 'Ciudad Fayenza: gimnasio Tierra.', 'Ruta 13: primer entrenador rico extra; usa Rapidez de Typhlosion.', 'Ruta 13: segundo entrenador rico extra; usa Rapidez de Typhlosion.']),
    paragraph('ruta-limites', 'Los gimnasios de Ciudad Canal y Ciudad Puntaneva tienen atajos por teletransporte, pero quedan fuera de esta ruta, al igual que Ciudad Corazón, por posibles rivales con Absorbe Fuego. Ciudad Porcelana y Ciudad Esmalte son alternativas opcionales. La composición rival puede exigir adaptarse.') ] },
];
export const GYM_FOOTER: GuideBlock[] = [heading('fuentes-h', 'Fuentes'), { kind: 'list', id: 'fuentes-lista', ordered: false, items: [
  ['ChihuahuanRaven — Easy Gym Rerun Guide', 'https://forums.pokemmo.com/index.php?/topic/172877-chihuahuanravens-easy-gym-rerun-guide/'],
  ['MMO Breeder — Ruta de Estallido de ChihuahuanRaven', 'https://mmobreeder.com/guides/money-making/chihuahuanraven-gym-rerun'],
  ['PokeMMO Support — Revanchas de entrenadores y líderes', 'https://support.pokemmo.com/knowledgebase/article/trainer-and-gym-leader-rematches'],
  ['PokeMMO — Notas de Shiny Wars 2026', 'https://forums.pokemmo.com/index.php?/topic/199536-changelog-shiny-wars-2026/'],
  ['WikiDex: localidades', 'https://www.wikidex.net/wiki/Lista_de_ciudades'],
].map(([text, href], index) => ({ id: `fuente-${index}`, runs: [{ text, marks: [{ kind: 'link', href }] }] })) }];
