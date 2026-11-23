import type { GuideSection } from './guide-content';

const seen = new Set<string>();
const glossaryTerms: Record<string, string[]> = {
  'introduccion-modalidades': ['Singles', 'Doubles', 'Randoms'],
  'introduccion-tiers': ['OU', 'UU', 'NU', 'tiers'],
  'introduccion-tipos': ['STAB'],
  'introduccion-genetica': ['IV'],
  'introduccion-entrenamiento': ['EV'],
  'introduccion-sinergia': ['core'],
};
const text = (value: string, section: string) => {
  const terms = glossaryTerms[section] ?? [];
  const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'g');
  if (!terms.length) return [{ text: value, marks: [] }];
  return value.split(pattern).filter(Boolean).map(part => {
    if (terms.includes(part) && !seen.has(part)) {
      seen.add(part);
      return { text: part, marks: [{ kind: 'glossary' as const, term: part }] };
    }
    return { text: part, marks: [] };
  });
};

export const PVP_GUIDE: readonly GuideSection[] = [
  { id: "introduccion-competitivo", blocks: [
    { kind: 'paragraph', id: "introduccion-competitivo-1", runs: text("En PvP te enfrentas a otra persona. Los movimientos importan, pero también la preparación de tus Pokémon, cómo se ayudan entre sí y las decisiones que tomas durante el combate.", 'introduccion-competitivo') },
    { kind: 'paragraph', id: "introduccion-competitivo-2", runs: text("Quizá encuentres palabras como IV, EV, tiers o cores. No hace falta aprenderlas todas antes de jugar: aquí veremos qué significan y cómo encajan al preparar un equipo.", 'introduccion-competitivo') },
  ] },
  { id: "introduccion-modalidades", blocks: [
    { kind: 'heading', id: "introduccion-modalidades-grupo-h", level: 2, runs: text("Modalidades", 'introduccion-modalidades') },
    { kind: 'heading', id: "introduccion-modalidades-h", level: 3, runs: text("Formas de jugar", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-1", runs: text("Antes de elegir un equipo, veamos algunas formas de jugar.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-2", runs: text("En Singles, tú y tu rival tienen un Pokémon cada uno en el campo. Durante el combate puedes atacar o cambiarlo por otro de tu equipo.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-3", runs: text("En Doubles, tú y tu rival tienen dos Pokémon cada uno en el campo. Tus compañeros pueden ayudarse entre sí; al elegir un movimiento también tendrás que pensar en sus posibles objetivos.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-4", runs: text("En Randoms recibes un equipo generado y preparado de antemano. En lugar de construirlo antes de combatir, descubres qué puede hacer y buscas cómo aprovecharlo.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-5", runs: text("Cada opción se juega de forma distinta. Puedes probarlas y elegir cuál te interesa aprender primero.", 'introduccion-modalidades') },
  ] },
  { id: "introduccion-tiers", blocks: [
    { kind: 'heading', id: "introduccion-tiers-h", level: 3, runs: text("Tiers", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-1", runs: text("En Singles encontrarás categorías llamadas tiers, como OU, UU y NU. Cada una tiene reglas que delimitan qué Pokémon pueden participar.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-2", runs: text("Sus nombres vienen del inglés: OverUsed, UnderUsed y NeverUsed. La clasificación tiene relación con el uso de los Pokémon y también considera restricciones de equilibrio. Una tier inferior no significa que un Pokémon sea inútil en otra.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-3", runs: text("Al elegir una tier puedes aprender sus reglas y los rivales que aparecen con frecuencia. Las listas cambian, así que consulta la clasificación vigente antes de invertir en un Pokémon.", 'introduccion-tiers') },
  ] },
  { id: "introduccion-tipos", blocks: [
    { kind: 'heading', id: "introduccion-tipos-grupo-h", level: 2, runs: text("Tu Pokémon", 'introduccion-tipos') },
    { kind: 'heading', id: "introduccion-tipos-h", level: 3, runs: text("Tipos", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-1", runs: text("La tabla de tipos te ayuda a ver qué ataques son eficaces, cuáles se resisten y cuáles no afectan al rival. Si un Pokémon tiene dos tipos, ambos influyen al recibir un ataque.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-2", runs: text("También encontrarás el STAB: un movimiento recibe una bonificación de daño cuando comparte tipo con el Pokémon que lo usa.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-3", runs: text("El tipo no lo decide todo. Las estadísticas, los movimientos, las habilidades y los objetos también importan. Resistir un tipo no garantiza que puedas entrar sin riesgo ante cualquier Pokémon de ese tipo.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-4", runs: text("Puedes consultar la tabla mientras juegas y relacionarla con lo que ves, sin intentar memorizarla de golpe.", 'introduccion-tipos') },
  ] },
  { id: "introduccion-genetica", blocks: [
    { kind: 'heading', id: "introduccion-genetica-h", level: 3, runs: text("Genética", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-1", runs: text("Dos Pokémon de la misma especie pueden tener números distintos en sus estadísticas. Una de las razones son sus IV: valores individuales que influyen en cada estadística.", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-2", runs: text("La naturaleza también influye en las estadísticas: puede favorecer una a costa de otra, aunque algunas son neutras. La que te conviene depende de cómo quieras usar a tu Pokémon.", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-3", runs: text("Cada Pokémon necesita atributos acordes con su función. Por ejemplo, un atacante especial y uno físico tienen prioridades distintas; algunas estrategias incluso buscan poca velocidad. Piensa primero en su tarea, antes de buscar valores perfectos.", 'introduccion-genetica') },
  ] },
  { id: "introduccion-entrenamiento", blocks: [
    { kind: 'heading', id: "introduccion-entrenamiento-h", level: 3, runs: text("Entrenamiento", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-1", runs: text("Los EV son valores de esfuerzo que se obtienen al entrenar y afectan a las estadísticas. A diferencia de los IV, reflejan cómo has repartido ese entrenamiento.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-2", runs: text("Entrenar no es solo subir de nivel. También eliges qué reforzar: según su tarea, un Pokémon puede necesitar más ataque, más resistencia o una combinación de ambos.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-3", runs: text("IV, naturaleza y EV influyen juntos, pero son cosas distintas. Tener clara esa diferencia te ayudará a seguir una guía de entrenamiento y a decidir cómo preparar a tu Pokémon.", 'introduccion-entrenamiento') },
  ] },
  { id: "introduccion-crianza", blocks: [
    { kind: 'heading', id: "introduccion-crianza-h", level: 3, runs: text("Crianza", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-1", runs: text("La crianza te ayuda a conseguir Pokémon con características que buscas, como ciertos IV o una naturaleza adecuada.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-2", runs: text("PokeMMO tiene sus propias reglas y recursos para la crianza. Antes de empezar, conviene saber qué quieres obtener y entender el proceso.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-3", runs: text("Por ahora basta con saber para qué sirve: conseguir una base adecuada para tu Pokémon. Los pasos, la herencia y los costes necesitan una guía aparte.", 'introduccion-crianza') },
  ] },
  { id: "introduccion-preparacion", blocks: [
    { kind: 'heading', id: "introduccion-preparacion-h", level: 3, runs: text("Preparación", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-1", runs: text("Los IV son solo una parte de la preparación. Los movimientos, la habilidad, el objeto, la naturaleza y los EV deben funcionar juntos para la tarea que has elegido.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-2", runs: text("Entre jugadores escucharás «competitivo» y «semicompetitivo» para hablar de distintos grados de preparación. Son etiquetas informales, sin una frontera universal; por sí solas no dicen si un Pokémon encaja en tu equipo.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-3", runs: text("Un Pokémon con IV perfectos puede estar mal preparado, y otro sin todas sus estadísticas perfectas puede cumplir bien su tarea. Fíjate en lo que necesita y en las limitaciones que aceptas.", 'introduccion-preparacion') },
  ] },
  { id: "introduccion-sinergia", blocks: [
    { kind: 'heading', id: "introduccion-sinergia-grupo-h", level: 2, runs: text("Tu equipo", 'introduccion-sinergia') },
    { kind: 'heading', id: "introduccion-sinergia-h", level: 3, runs: text("Sinergia y cores", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-1", runs: text("Reunir Pokémon fuertes no garantiza que formen un buen equipo. La sinergia consiste en que se complementen y se ayuden a seguir un plan.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-2", runs: text("Por ejemplo, un compañero puede responder a un rival que incomoda a otro, ayudarlo a entrar al campo o debilitar a un rival que frena su avance.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-3", runs: text("Un core es un grupo pequeño de Pokémon que colaboran con una idea en común. Pueden cubrir amenazas, ayudar a atacar o combinar ambas funciones.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-4", runs: text("Al elegir un integrante, pregúntate no solo si es bueno, sino qué aporta a este equipo y qué necesita de sus compañeros.", 'introduccion-sinergia') },
  ] },
  { id: "introduccion-arquetipos", blocks: [
    { kind: 'heading', id: "introduccion-arquetipos-h", level: 3, runs: text("Arquetipos", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-1", runs: text("Un arquetipo describe el enfoque general de un equipo.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-2", runs: text("Un equipo ofensivo busca presionar y abrir oportunidades para atacar. Uno defensivo se apoya más en resistir, recuperarse y desgastar al rival. Un equipo equilibrado combina herramientas de ambos.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-3", runs: text("No son recetas obligatorias. Estos nombres ayudan a reconocer qué quiere hacer un equipo y por qué eligió a sus integrantes.", 'introduccion-arquetipos') },
  ] },
  { id: "introduccion-combate", blocks: [
    { kind: 'heading', id: "introduccion-combate-grupo-h", level: 2, runs: text("El combate", 'introduccion-combate') },
    { kind: 'heading', id: "introduccion-combate-h", level: 3, runs: text("Decisiones", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-1", runs: text("En cada turno, piensa tanto en tus opciones como en las del rival.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-2", runs: text("Atacar puede acercarte a tu objetivo; cambiar puede proteger a un compañero importante o darte un enfrentamiento más favorable. La mejor opción depende de lo que sabes y del riesgo que estás dispuesto a correr.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-3", runs: text("Mira qué Pokémon están en el campo, cuánta salud les queda y qué información has descubierto. Considera qué te amenaza ahora y a quién podrías necesitar después.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-4", runs: text("No tienes que adivinar todas las jugadas. Empieza por comparar tus opciones y entender por qué eliges una.", 'introduccion-combate') },
  ] },
  { id: "introduccion-practica", blocks: [
    { kind: 'heading', id: "introduccion-practica-h", level: 3, runs: text("Práctica", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-1", runs: text("Elige una modalidad que te llame la atención y conoce sus reglas. Con un equipo propio, intenta entender la función de cada integrante; en Randoms, empieza por revisar qué puede hacer el equipo que recibiste.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-2", runs: text("Después de jugar, repasa una decisión: qué querías lograr, qué sabías en ese momento y qué otra opción tenías.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-3", runs: text("Al empezar no necesitas ganar siempre ni tener un equipo perfecto. La práctica te ayuda a entender lo que pasa y a elegir con más información.", 'introduccion-practica') },
  ] },
];

export const PVP_CONTENTS = [
  { id: 'introduccion-modalidades', title: 'Modalidades' },
  { id: 'introduccion-tipos', title: 'Tu Pokémon' },
  { id: 'introduccion-sinergia', title: 'Tu equipo' },
  { id: 'introduccion-combate', title: 'El combate' },
] as const;
