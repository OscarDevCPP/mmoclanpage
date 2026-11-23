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
    { kind: 'paragraph', id: "introduccion-competitivo-1", runs: text("En el competitivo de PokeMMO, conocer buenos movimientos es solo una parte del juego. También importa cómo preparas tus Pokémon, cómo se complementan y qué decisiones tomas frente a otra persona.", 'introduccion-competitivo') },
    { kind: 'paragraph', id: "introduccion-competitivo-2", runs: text("Al comenzar encontrarás términos como IV, EV, tiers o cores. No necesitas dominarlos todos antes de jugar. Esta introducción te ayudará a reconocer esas piezas, entender para qué sirven y saber qué tendrás que aprender para preparar tus primeros equipos.", 'introduccion-competitivo') },
  ] },
  { id: "introduccion-modalidades", blocks: [
    { kind: 'heading', id: "introduccion-modalidades-h", level: 2, runs: text("Modalidades", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-1", runs: text("Antes de preparar un equipo, conviene conocer las distintas formas de jugar.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-2", runs: text("En Singles, cada jugador tiene un Pokémon activo a la vez. Atacar o cambiar determina qué enfrentamiento habrá en el campo y qué oportunidades tendrá cada equipo.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-3", runs: text("En Doubles, cada jugador tiene dos Pokémon activos. Además de enfrentarte al rival, debes considerar cómo colaboran tus dos compañeros. Sus movimientos, habilidades y posibles objetivos hacen que las decisiones sean diferentes de las de Singles.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-4", runs: text("En Randoms, recibes un equipo generado con una preparación predefinida. No construyes ese equipo antes de combatir: debes reconocer las herramientas que te han tocado y encontrar cómo aprovecharlas.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-5", runs: text("Estas opciones ofrecen experiencias distintas. Puedes familiarizarte con ellas antes de decidir dónde quieres concentrar tu aprendizaje.", 'introduccion-modalidades') },
  ] },
  { id: "introduccion-tiers", blocks: [
    { kind: 'heading', id: "introduccion-tiers-h", level: 2, runs: text("Tiers", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-1", runs: text("Dentro de Singles encontrarás categorías como OU, UU y NU, conocidas como tiers. Cada una delimita qué Pokémon pueden participar.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-2", runs: text("Sus nombres provienen del inglés: OverUsed, UnderUsed y NeverUsed. La clasificación está relacionada con el uso de los Pokémon, pero también intervienen restricciones de equilibrio. No conviene interpretar los nombres como una escala de calidad: un Pokémon de una tier inferior no es necesariamente inútil en otra.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-3", runs: text("Elegir una tier te da un entorno concreto para aprender: conocerás sus amenazas habituales y prepararás un equipo que cumpla sus reglas. Las listas pueden cambiar, por lo que debes consultar la clasificación vigente antes de invertir en un Pokémon.", 'introduccion-tiers') },
  ] },
  { id: "introduccion-tipos", blocks: [
    { kind: 'heading', id: "introduccion-tipos-h", level: 2, runs: text("Tipos", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-1", runs: text("La tabla de tipos es una herramienta básica para atacar y defender. Permite reconocer debilidades, resistencias e inmunidades; cuando un Pokémon tiene dos tipos, ambos influyen en cómo recibe un ataque.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-2", runs: text("También existe el STAB: la bonificación de daño que recibe un movimiento cuando comparte tipo con el Pokémon que lo utiliza.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-3", runs: text("Sin embargo, la efectividad no explica por sí sola el resultado de un enfrentamiento. También cuentan las estadísticas, los movimientos, las habilidades y los objetos. Que un Pokémon resista un tipo no significa que pueda entrar sin riesgo ante cualquier rival que lo utilice.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-4", runs: text("Consultar la tabla y relacionarla con lo que ocurre en combate resulta más útil que intentar memorizarlo todo de una vez.", 'introduccion-tipos') },
  ] },
  { id: "introduccion-genetica", blocks: [
    { kind: 'heading', id: "introduccion-genetica-h", level: 2, runs: text("Genética", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-1", runs: text("Dos Pokémon de la misma especie pueden tener estadísticas diferentes. Parte de esa diferencia está en sus IV, los valores individuales de cada estadística.", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-2", runs: text("La naturaleza también influye: puede favorecer una estadística a costa de otra, aunque existen naturalezas neutras. Por eso, una naturaleza conveniente depende de cómo quieras utilizar al Pokémon.", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-3", runs: text("No todos necesitan los mismos atributos. Un atacante especial no tiene las mismas prioridades que uno físico, y algunas estrategias incluso buscan una velocidad baja. Antes de perseguir valores perfectos, necesitas entender qué características favorecen la función que tendrá tu Pokémon.", 'introduccion-genetica') },
  ] },
  { id: "introduccion-entrenamiento", blocks: [
    { kind: 'heading', id: "introduccion-entrenamiento-h", level: 2, runs: text("Entrenamiento", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-1", runs: text("Los EV son valores de esfuerzo que se obtienen mediante entrenamiento e influyen en las estadísticas. A diferencia de los IV, representan cómo distribuyes esa preparación.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-2", runs: text("Entrenar no consiste únicamente en subir de nivel. También implica decidir qué estadísticas quieres reforzar: un Pokémon puede necesitar más capacidad ofensiva, mayor resistencia o una combinación adecuada para su tarea.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-3", runs: text("IV, naturaleza y EV actúan juntos, pero no son lo mismo. Comprender esa diferencia te permitirá seguir después una guía de entrenamiento sin confundir las características del Pokémon con las decisiones que tomas al prepararlo.", 'introduccion-entrenamiento') },
  ] },
  { id: "introduccion-crianza", blocks: [
    { kind: 'heading', id: "introduccion-crianza-h", level: 2, runs: text("Crianza", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-1", runs: text("La crianza es una herramienta para obtener Pokémon con características adecuadas, como determinados IV o una naturaleza conveniente.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-2", runs: text("En PokeMMO tiene reglas y recursos propios. Por eso, antes de comenzar una crianza conviene definir qué buscas y conocer el proceso, en lugar de invertir primero y decidir después.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-3", runs: text("Aquí basta con entender su propósito: ayudarte a conseguir una base apropiada para el Pokémon que quieres preparar. Los pasos, la herencia y los costes corresponden a una guía específica.", 'introduccion-crianza') },
  ] },
  { id: "introduccion-preparacion", blocks: [
    { kind: 'heading', id: "introduccion-preparacion-h", level: 2, runs: text("Preparación", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-1", runs: text("Un Pokémon preparado para competir necesita más que buenos IV. Sus movimientos, habilidad, objeto, naturaleza y EV deben tener sentido juntos.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-2", runs: text("La comunidad utiliza expresiones como «competitivo» y «semicompetitivo» para describir distintos grados de preparación. No son categorías oficiales con una frontera universal, y la etiqueta por sí sola no explica si un Pokémon es adecuado para tu equipo.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-3", runs: text("Un Pokémon con IV perfectos puede estar mal preparado. Otro sin perfección en todas sus estadísticas puede cumplir bien su función. Lo importante es reconocer qué necesita y qué limitaciones estás aceptando.", 'introduccion-preparacion') },
  ] },
  { id: "introduccion-sinergia", blocks: [
    { kind: 'heading', id: "introduccion-sinergia-h", level: 2, runs: text("Sinergia y cores", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-1", runs: text("Un equipo no es simplemente una colección de Pokémon fuertes. Necesita sinergia: que sus integrantes se complementen y se ayuden a cumplir un plan.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-2", runs: text("Un compañero puede responder a una amenaza que incomoda a otro, facilitarle una entrada o debilitar a un rival que dificulta su avance.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-3", runs: text("Un core es un pequeño grupo de Pokémon que colaboran alrededor de una idea. Puede buscar cubrir amenazas, ejercer presión ofensiva o combinar ambas cosas.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-4", runs: text("La pregunta no es solo «¿este Pokémon es bueno?», sino también «¿qué aporta aquí y qué necesita de sus compañeros?».", 'introduccion-sinergia') },
  ] },
  { id: "introduccion-arquetipos", blocks: [
    { kind: 'heading', id: "introduccion-arquetipos-h", level: 2, runs: text("Arquetipos", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-1", runs: text("Los equipos pueden organizarse alrededor de distintos enfoques, conocidos como arquetipos.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-2", runs: text("Los ofensivos buscan mantener la presión y crear oportunidades para atacar. Los defensivos se apoyan más en resistir, recuperarse y desgastar al rival. Los equilibrados combinan herramientas ofensivas y defensivas.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-3", runs: text("Son orientaciones generales, no recetas rígidas. Conocerlas ayuda a entender qué intenta conseguir un equipo y por qué sus integrantes han sido elegidos.", 'introduccion-arquetipos') },
  ] },
  { id: "introduccion-combate", blocks: [
    { kind: 'heading', id: "introduccion-combate-h", level: 2, runs: text("El combate", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-1", runs: text("Durante una partida no solo importa qué puedes hacer, sino qué opciones tiene el rival.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-2", runs: text("Atacar puede permitirte avanzar, pero cambiar puede conservar un Pokémon importante o mejorar el enfrentamiento. Ninguna opción es buena por sí misma: depende de la información disponible y del riesgo que aceptas.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-3", runs: text("Al comenzar, observa los Pokémon activos, su salud y lo que ya has descubierto. Intenta reconocer qué amenaza tienes delante y qué integrantes de tu equipo necesitarás más adelante.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-4", runs: text("No necesitas anticipar cada acción. Primero aprende a comparar opciones y a entender por qué elegiste una.", 'introduccion-combate') },
  ] },
  { id: "introduccion-practica", blocks: [
    { kind: 'heading', id: "introduccion-practica-h", level: 2, runs: text("Práctica", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-1", runs: text("Elige una modalidad que te interese y familiarízate con sus reglas. Si utilizas un equipo propio, procura saber para qué sirve cada integrante; si juegas Randoms, empieza por reconocer las herramientas disponibles.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-2", runs: text("Después de una partida, revisa una decisión concreta: qué querías conseguir, qué información tenías y qué alternativa podrías haber considerado.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-3", runs: text("El objetivo inicial no es preparar un equipo perfecto ni ganar siempre. Es comprender cada vez mejor qué ocurre y tomar decisiones con más fundamento.", 'introduccion-practica') },
  ] },
];

export const PVP_CONTENTS = PVP_GUIDE.slice(1).map(section => ({
  id: section.id, title: section.blocks[0].kind === 'heading' ? section.blocks[0].runs[0].text : '',
}));
