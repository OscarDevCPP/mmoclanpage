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
    { kind: 'paragraph', id: "introduccion-competitivo-1", runs: text("En PvP te enfrentas a otra persona. Cada combate reúne decisiones que empiezan antes del primer turno: qué modalidad jugar, cómo preparar a tus Pokémon y cómo combinar sus capacidades.", 'introduccion-competitivo') },
    { kind: 'paragraph', id: "introduccion-competitivo-2", runs: text("Esta introducción recorre esas ideas y muestra cómo llevarlas a la práctica durante una partida. Encontrarás términos como IV, EV, tiers o cores; no necesitas dominarlos todos para empezar.", 'introduccion-competitivo') },
  ] },
  { id: "introduccion-modalidades", blocks: [
    { kind: 'heading', id: "introduccion-modalidades-grupo-h", level: 2, runs: text("Formas de jugar al PvP", 'introduccion-modalidades') },
    { kind: 'heading', id: "introduccion-modalidades-h", level: 3, runs: text("Modalidades", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-1", runs: text("La modalidad cambia cuántos Pokémon participan a la vez y cómo llegas al combate. Conocer esas diferencias te ayuda a elegir qué quieres probar y cómo prepararte.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-2", runs: text("En Singles, tú y tu rival tienen un Pokémon cada uno en el campo. Durante el combate puedes atacar o cambiarlo por otro de tu equipo.", 'introduccion-modalidades') },
    { kind: 'image', id: 'imagen-singles', src: 'compendio/pvp/introduction/combate-singles.png', alt: 'Combate individual entre Scizor y Metagross.', width: 929, height: 415, caption: 'En Singles hay un Pokémon por lado en el campo.', layout: 'wide' },
    { kind: 'paragraph', id: "introduccion-modalidades-3", runs: text("En Doubles, tú y tu rival tienen dos Pokémon cada uno en el campo. Tus compañeros pueden ayudarse entre sí; al elegir un movimiento también tendrás que pensar en sus posibles objetivos.", 'introduccion-modalidades') },
    { kind: 'image', id: 'imagen-doubles', src: 'compendio/pvp/introduction/combate-doubles.jpg', alt: 'Combate doble con dos Pokémon por lado.', width: 784, height: 391, caption: 'En Doubles participan dos Pokémon por lado a la vez.', layout: 'wide' },
    { kind: 'paragraph', id: "introduccion-modalidades-4", runs: text("En Randoms recibes un equipo generado y preparado de antemano. En lugar de construirlo antes de combatir, descubres qué puede hacer y buscas cómo aprovecharlo.", 'introduccion-modalidades') },
    { kind: 'paragraph', id: "introduccion-modalidades-5", runs: text("Puedes probar estas opciones y elegir cuál te interesa aprender primero. Si decides construir un equipo, también conviene conocer las reglas de la categoría en la que jugarás.", 'introduccion-modalidades') },
  ] },
  { id: "introduccion-tiers", blocks: [
    { kind: 'heading', id: "introduccion-tiers-h", level: 3, runs: text("Tiers", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-1", runs: text("En Singles encontrarás categorías llamadas tiers, como OU, UU y NU. Cada una tiene reglas que delimitan qué Pokémon pueden participar.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-2", runs: text("Sus nombres vienen del inglés: OverUsed, UnderUsed y NeverUsed. La clasificación tiene relación con el uso de los Pokémon y también considera restricciones de equilibrio. Una tier inferior no significa que un Pokémon sea inútil en otra.", 'introduccion-tiers') },
    { kind: 'paragraph', id: "introduccion-tiers-3", runs: text("Elegir una tier orienta tanto la composición del equipo como los rivales para los que conviene prepararse. Las listas cambian, así que consulta la clasificación vigente antes de invertir en un Pokémon.", 'introduccion-tiers') },
  ] },
  { id: "introduccion-tipos", blocks: [
    { kind: 'heading', id: "introduccion-tipos-grupo-h", level: 2, runs: text("Lo esencial antes de crear un equipo", 'introduccion-tipos') },
    { kind: 'heading', id: "introduccion-tipos-h", level: 3, runs: text("Tipos", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-1", runs: text("La tabla de tipos te ayuda a ver qué ataques son eficaces, cuáles se resisten y cuáles no afectan al rival. Si un Pokémon tiene dos tipos, ambos influyen al recibir un ataque.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-2", runs: text("También encontrarás el STAB: un movimiento recibe una bonificación de daño cuando comparte tipo con el Pokémon que lo usa.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-3", runs: text("El tipo no lo decide todo. Las estadísticas, los movimientos, las habilidades y los objetos también importan. Resistir un tipo no garantiza que puedas entrar sin riesgo ante cualquier Pokémon de ese tipo.", 'introduccion-tipos') },
    { kind: 'paragraph', id: "introduccion-tipos-4", runs: text("Antes de elegir compañeros, la tabla te permite detectar debilidades compartidas y pensar qué respuestas podrías necesitar. Puedes consultarla mientras juegas, sin memorizarla de golpe.", 'introduccion-tipos') },
  ] },
  { id: "introduccion-genetica", blocks: [
    { kind: 'heading', id: "introduccion-genetica-h", level: 3, runs: text("Genética", 'introduccion-genetica') },
    { kind: 'image', id: 'imagen-iv', src: 'compendio/pvp/introduction/resumen-iv.png', alt: 'Panel de valores individuales de un Pokémon.', width: 261, height: 239, caption: 'Un ejemplo de IV en el resumen; no todos los Pokémon necesitan todos sus IV perfectos.', layout: 'aside' },
    { kind: 'paragraph', id: "introduccion-genetica-1", runs: text("Dos Pokémon de la misma especie pueden tener números distintos en sus estadísticas. Una de las razones son sus IV: valores individuales que influyen en cada estadística.", 'introduccion-genetica') },
    { kind: 'image', id: 'imagen-naturaleza', src: 'compendio/pvp/introduction/resumen-naturaleza-detalle.png', alt: 'Campo Naturaleza del resumen: Alegre (Jolly).', width: 237, height: 37, caption: 'El campo muestra la naturaleza Alegre (Jolly).', layout: 'aside' },
    { kind: 'paragraph', id: "introduccion-genetica-2", runs: text("La naturaleza también influye en las estadísticas: puede favorecer una a costa de otra, aunque algunas son neutras. La que te conviene depende de cómo quieras usar a tu Pokémon.", 'introduccion-genetica') },
    { kind: 'paragraph', id: "introduccion-genetica-3", runs: text("Antes de preparar un Pokémon, piensa qué tarea cumplirá: un atacante especial y uno físico tienen prioridades distintas; algunas estrategias incluso buscan poca velocidad. Así puedes valorar qué atributos necesitas antes de buscar valores perfectos.", 'introduccion-genetica') },
  ] },
  { id: "introduccion-entrenamiento", blocks: [
    { kind: 'heading', id: "introduccion-entrenamiento-h", level: 3, runs: text("Entrenamiento", 'introduccion-entrenamiento') },
    { kind: 'image', id: 'imagen-ev', src: 'compendio/pvp/introduction/resumen-ev.png', alt: 'Panel de entrenamiento de un Pokémon.', width: 263, height: 221, caption: 'El resumen también muestra el reparto de EV.', layout: 'aside' },
    { kind: 'paragraph', id: "introduccion-entrenamiento-1", runs: text("Los EV son valores de esfuerzo que se obtienen al entrenar y afectan a las estadísticas. A diferencia de los IV, reflejan cómo has repartido ese entrenamiento.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-2", runs: text("Entrenar no es solo subir de nivel. También eliges qué reforzar: según su tarea, un Pokémon puede necesitar más ataque, más resistencia o una combinación de ambos.", 'introduccion-entrenamiento') },
    { kind: 'paragraph', id: "introduccion-entrenamiento-3", runs: text("IV, naturaleza y EV influyen juntos, pero son cosas distintas. Distinguirlos antes de preparar el equipo te ayuda a decidir qué reforzar en cada integrante y a seguir una guía de entrenamiento.", 'introduccion-entrenamiento') },
  ] },
  { id: "introduccion-crianza", blocks: [
    { kind: 'heading', id: "introduccion-crianza-h", level: 3, runs: text("Crianza", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-1", runs: text("La crianza te ayuda a conseguir Pokémon con características que buscas, como ciertos IV o una naturaleza adecuada.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-2", runs: text("PokeMMO tiene sus propias reglas y recursos para la crianza. Antes de invertir en ella, conviene saber qué necesitas para el equipo y entender el proceso.", 'introduccion-crianza') },
    { kind: 'paragraph', id: "introduccion-crianza-3", runs: text("Por ahora basta con saber para qué sirve: conseguir una base adecuada para tu Pokémon. Los pasos, la herencia y los costes necesitan una guía aparte.", 'introduccion-crianza') },
  ] },
  { id: "introduccion-preparacion", blocks: [
    { kind: 'heading', id: "introduccion-preparacion-h", level: 3, runs: text("Preparación", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-1", runs: text("Al reunir estas bases, recuerda que los IV son solo una parte de la preparación. Los movimientos, la habilidad, el objeto, la naturaleza y los EV deben funcionar juntos para la tarea que has elegido.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-2", runs: text("Entre jugadores escucharás «competitivo» y «semicompetitivo» para hablar de distintos grados de preparación. Son etiquetas informales, sin una frontera universal; por sí solas no dicen si un Pokémon encaja en tu equipo.", 'introduccion-preparacion') },
    { kind: 'paragraph', id: "introduccion-preparacion-3", runs: text("Un Pokémon con IV perfectos puede estar mal preparado, y otro sin todas sus estadísticas perfectas puede cumplir bien su tarea. Fíjate en lo que necesita y en las limitaciones que aceptas.", 'introduccion-preparacion') },
  ] },
  { id: "introduccion-sinergia", blocks: [
    { kind: 'heading', id: "introduccion-sinergia-grupo-h", level: 2, runs: text("Construcción de equipos", 'introduccion-sinergia') },
    { kind: 'heading', id: "introduccion-sinergia-h", level: 3, runs: text("Sinergia y cores", 'introduccion-sinergia') },
    { kind: 'image', id: 'imagen-equipo', src: 'compendio/pvp/introduction/equipo-pvp.png', alt: 'Seis integrantes en una lista de equipo.', width: 182, height: 134, caption: 'Un ejemplo de equipo mostrado en el juego, sin que sea una recomendación.', layout: 'aside' },
    { kind: 'paragraph', id: "introduccion-sinergia-1", runs: text("Una vez que conoces las bases, puedes pensar en el equipo como conjunto. Reunir Pokémon fuertes no garantiza que funcionen bien juntos: la sinergia consiste en complementarse para seguir un plan.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-2", runs: text("Por ejemplo, si varios compañeros tienen dificultades ante la misma amenaza, puedes buscar una respuesta que cubra esa debilidad. Otro integrante podría ayudar a entrar al campo a quien quieres usar para atacar.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-3", runs: text("Un core es un grupo pequeño de Pokémon que colaboran con una idea en común. Pueden cubrir amenazas, ayudar a atacar o combinar ambas funciones.", 'introduccion-sinergia') },
    { kind: 'paragraph', id: "introduccion-sinergia-4", runs: text("Al elegir cada integrante, pregúntate qué aporta al plan, qué amenazas puede afrontar y qué necesita de sus compañeros. La cobertura y las respuestas del equipo importan tanto como las cualidades individuales.", 'introduccion-sinergia') },
  ] },
  { id: "introduccion-arquetipos", blocks: [
    { kind: 'heading', id: "introduccion-arquetipos-h", level: 3, runs: text("Arquetipos", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-1", runs: text("Ese plan puede tener distintos enfoques generales, llamados arquetipos.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-2", runs: text("Un equipo ofensivo busca presionar y abrir oportunidades para atacar. Uno defensivo se apoya más en resistir, recuperarse y desgastar al rival. Un equipo equilibrado combina herramientas de ambos.", 'introduccion-arquetipos') },
    { kind: 'paragraph', id: "introduccion-arquetipos-3", runs: text("No son recetas obligatorias. Estos nombres ayudan a reconocer qué quiere hacer un equipo y por qué eligió a sus integrantes.", 'introduccion-arquetipos') },
  ] },
  { id: "introduccion-combate", blocks: [
    { kind: 'heading', id: "introduccion-combate-grupo-h", level: 2, runs: text("La idea detrás de cada combate", 'introduccion-combate') },
    { kind: 'heading', id: "introduccion-combate-h", level: 3, runs: text("Decisiones", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-1", runs: text("El plan del equipo te da una dirección, pero cada partida plantea situaciones distintas. Piensa qué necesitas conseguir para avanzar y ajusta ese objetivo según lo que ocurra.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-2", runs: text("Atacar puede acercarte a tu objetivo; cambiar puede proteger a un compañero importante o darte un enfrentamiento más favorable. La mejor opción depende de lo que sabes y del riesgo que estás dispuesto a correr.", 'introduccion-combate') },
    { kind: 'paragraph', id: "introduccion-combate-3", runs: text("En cada turno, mira qué Pokémon están en el campo, cuánta salud les queda y qué información has descubierto. Considera las opciones del rival, qué te amenaza ahora y a quién podrías necesitar después.", 'introduccion-combate') },
    { kind: 'image', id: 'imagen-decision', src: 'compendio/pvp/introduction/decision-combate.png', alt: 'Combate entre Excadrill y Cofagrigus.', width: 930, height: 339, caption: 'La salud y los mensajes del combate aportan información para observar la situación.', layout: 'wide' },
    { kind: 'paragraph', id: "introduccion-combate-4", runs: text("No tienes que adivinar todas las jugadas. Compara tus opciones, acepta que cada una puede tener riesgos y adapta tu plan cuando aparezca nueva información.", 'introduccion-combate') },
  ] },
  { id: "introduccion-practica", blocks: [
    { kind: 'heading', id: "introduccion-practica-h", level: 3, runs: text("Lo importante al final es practicar, fallar, mejorar y superar tus límites", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-1", runs: text("Elige una modalidad que te guste y empieza a jugar, sin esperar a tener un equipo perfecto ni entenderlo todo. Con un equipo propio, aprende qué aporta cada integrante; en Randoms, explora las herramientas del equipo que recibiste. Habrá errores y derrotas: son parte del aprendizaje, no una razón para dejar de intentarlo.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-2", runs: text("Después de una partida, vuelve a una decisión que te haya generado dudas: ¿qué querías conseguir, qué sabías en ese momento y qué podrías probar de otra manera? No hace falta corregirlo todo a la vez. Elige algo concreto, ponlo a prueba en los siguientes combates y observa qué cambia.", 'introduccion-practica') },
    { kind: 'paragraph', id: "introduccion-practica-3", runs: text("Superar tus límites no significa ganar siempre. A veces es reconocer una amenaza que antes pasabas por alto, cuidar mejor a un compañero o entender por qué una jugada no funcionó. Compara lo que sabes hacer hoy con lo que te costaba al empezar: practicar, equivocarte y aprender de ello es lo que te permite seguir mejorando.", 'introduccion-practica') },
  ] },
];

export const PVP_CONTENTS = [
  { id: 'introduccion-modalidades', title: 'Formas de jugar al PvP' },
  { id: 'introduccion-tipos', title: 'Lo esencial antes de crear un equipo' },
  { id: 'introduccion-sinergia', title: 'Construcción de equipos' },
  { id: 'introduccion-combate', title: 'La idea detrás de cada combate' },
] as const;
