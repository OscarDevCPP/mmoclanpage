import type { GuideBlock, GuideSection } from './guide-content';

const text = (text: string) => [{ text, marks: [] }];
const heading = (id: string, title: string, level: 2 | 3 = 2): GuideBlock => ({ kind: 'heading', id, level, runs: text(title) });
const paragraph = (id: string, content: string): GuideBlock => ({ kind: 'paragraph', id, runs: text(content) });
const diagram = (id: string, description: string): GuideBlock => ({ kind: 'diagram', id, description });
const list = (id: string, items: string[]): GuideBlock => ({ kind: 'list', id, ordered: false, items: items.map((item, i) => ({ id: `${id}-${i}`, runs: text(item) })) });

/** Conceptos introductorios; las reglas concretas dependen del formato vigente. */
export const PVP_GUIDE: readonly GuideSection[] = [
  { id: 'introduccion-competitivo', blocks: [
    heading('inicio-h', '¿Qué es competir en Singles?'),
    paragraph('inicio-1', 'Si vienes de la historia y quieres probar combates contra otras personas, esta guía te acompaña a observar un turno, pensar un plan y aprender de cada partida. No necesitas memorizar todos los términos antes de empezar.'),
    paragraph('inicio-2', 'PvP significa jugador contra jugador (player versus player). Tu rival también toma decisiones: puede atacar, cambiar de Pokémon o intentar conservar una pieza importante. En Singles hay un Pokémon activo por cada lado; sus compañeros esperan su oportunidad. Esta introducción se concentra en esa modalidad.'),
    paragraph('inicio-3', 'La meta es ganar respetando las reglas del combate, habitualmente dejando al rival sin Pokémon disponibles. La fuerza de un movimiento importa, pero también el momento de usarlo y la colaboración del equipo. Un miembro que no consiga debilitar a nadie todavía puede abrir espacio para otro.'),
    paragraph('inicio-4', 'Un formato establece las condiciones de una competencia; puede limitar qué participantes o recursos se admiten. Las categorías o tiers agrupan la competencia según sus propios criterios. Las reglas y clasificaciones pueden cambiar: consulta el formato vigente antes de preparar tu equipo. No hace falta conocer de memoria todas las categorías para dar tus primeros pasos.'),
    paragraph('inicio-5', 'A diferencia de muchos encuentros de la aventura, aquí otra persona intenta responder a tu plan. Una derrota no invalida todo tu equipo: puede revelar una amenaza que no habías considerado o una pieza que necesitabas conservar. Empieza por entender una decisión cada vez.'),
  ] },
  { id: 'introduccion-turno', blocks: [
    heading('turno-h', 'Un turno, varias preguntas'),
    paragraph('turno-1', 'Antes de elegir, observa la salud de ambos Pokémon, sus estados y la información que ya has visto: movimientos revelados, compañeros conocidos y posibles respuestas. También importa lo que no sabes. Una suposición razonable no equivale a conocer la elección del rival.'),
    paragraph('turno-2', 'Los tipos pueden orientar qué ataques son eficaces o resistidos, pero no cuentan toda la historia. Considera también la salud restante y los efectos que conozcas. Pregúntate qué amenaza inmediata existe y qué ocurriría si tu acción no sale como esperabas.'),
    paragraph('turno-3', 'La velocidad ayuda a determinar quién actúa primero cuando las acciones corresponden al mismo nivel de prioridad. Algunos movimientos tienen una prioridad distinta y pueden adelantarse a otros aunque su usuario sea más lento. Otros efectos también pueden alterar el orden: no reduzcas la decisión a mirar una sola estadística.'),
    diagram('introduccion-turno-diagrama', 'Identifica la amenaza; compara atacar o cambiar y su riesgo; después observa y ajusta.'),
    paragraph('turno-4', 'Imagina que tu atacante, importante para el final, está amenazado. Puedes atacar para presionar ahora, pero podrías perderlo antes de volver a usarlo. Puedes cambiar a un compañero que resista el ataque esperado y conservar al atacante; aun así, el compañero recibe las consecuencias de la acción rival y quizá no soporte otra opción.'),
    paragraph('turno-5', 'Una tercera posibilidad es usar un movimiento de apoyo disponible para mejorar la situación, si el riesgo lo permite. Ninguna opción es automáticamente correcta: compara lo que ganas con lo que podrías perder. Si el rival anticipa tu cambio, puede elegir otra acción. Predecir es valorar posibilidades con la información disponible, no adivinar siempre ni perseguir la jugada más espectacular.'),
    paragraph('turno-6', 'Después del turno, incorpora lo aprendido. Un movimiento revelado puede cambiar la evaluación del siguiente cambio; una pieza dañada quizá ya no pueda cumplir la misma función. Ajustar el plan es parte del combate, no una señal de que el plan inicial haya sido inútil.'),
  ] },
  { id: 'introduccion-plan', blocks: [
    heading('plan-h', 'Un equipo con un plan'),
    paragraph('plan-1', 'Un equipo funciona mejor cuando sus miembros se ayudan. Una pieza puede presionar al rival, otra resistir amenazas y otra aportar apoyo o facilitar la entrada de sus compañeros. Son funciones, no casillas obligatorias: un mismo Pokémon puede cumplir varias, y varias piezas pueden compartir una tarea.'),
    diagram('introduccion-plan-diagrama', 'El apoyo y la defensa colaboran con el atacante: pueden facilitar su entrada o cubrir amenazas para conservarlo.'),
    paragraph('plan-2', 'La condición de victoria (win condition) es una situación plausible que intentas crear para cerrar la partida, no una promesa. Por ejemplo, tu atacante rápido podría resultar decisivo al final, pero un defensor rival lo frena. Tu plan puede ser debilitar primero a ese defensor y guardar al atacante para cuando tenga una oportunidad.'),
    paragraph('plan-3', 'Conservar no significa negarse a usar una pieza. Significa valorar cuánto daño puede recibir y si aún necesitas su función. Si pierdes al atacante demasiado pronto, busca otra ruta: quizá un compañero pueda presionar o el rival haya dejado una nueva oportunidad. Los planes cambian con la información y los recursos de ambos lados.'),
    paragraph('plan-4', 'Si el formato ofrece una vista previa del equipo rival, úsala para plantear preguntas: ¿qué amenaza puede frenar mi idea?, ¿quién podría responder?, ¿qué compañero necesito cuidar? La vista previa no muestra necesariamente todas las decisiones ni garantiza que el rival siga el plan que imaginas.'),
    paragraph('plan-5', 'Al observar una amenaza, una respuesta útil no tiene que resolverla en cualquier circunstancia. Puede servir solo si conserva suficiente salud o si entra ante una acción concreta. Piensa en la cooperación entre compañeros y evita dar por seguro un enfrentamiento sin conocer sus condiciones.'),
  ] },
  { id: 'introduccion-practica', blocks: [
    heading('practica-h', 'Antes de combatir'),
    paragraph('practica-1', 'Elige primero un formato y revisa sus reglas y la elegibilidad del equipo. Prepara algo funcional dentro de tus posibilidades: saber para qué sirve cada miembro y cómo se ayudan es un buen punto de partida. No necesitas resolver toda la construcción competitiva antes de jugar una primera partida.'),
    paragraph('practica-2', 'Revisa que movimientos, habilidades y objetos acompañen el papel que imaginas para cada Pokémon. Una opción que parece fuerte por separado puede aportar poco si no ayuda al equipo. Comprueba también qué amenazas se repiten y si tienes alguna manera razonable de responder sin depender siempre del mismo compañero.'),
    paragraph('practica-3', 'Los IV son valores individuales asociados a las estadísticas; los EV representan inversión mediante entrenamiento, y la naturaleza también influye en estadísticas. Son aspectos útiles de preparación, pero seis IV de 31 en cada integrante no son un requisito universal para comenzar. Prioriza lo que necesita cada función y tu presupuesto; esta guía no pretende ser una receta de crianza.'),
    heading('lista-h', 'Lista antes de empezar', 3),
    list('lista', ['Elegí formato y consulté sus reglas y elegibilidad.', 'Entiendo qué hace cada miembro y cuál podría necesitar conservar.', 'Identifico una amenaza y una posible respuesta, con su riesgo.', 'Mis movimientos, habilidades y objetos apoyan el plan.', 'Después de jugar revisaré una decisión concreta.']),
    heading('ejercicio-h', 'Un pequeño ejercicio', 3),
    paragraph('ejercicio-1', 'Tu atacante podría cerrar la partida más adelante, pero ahora está amenazado. Un compañero resistente puede entrar ante el ataque que esperas. ¿Lo cambiarías inmediatamente? ¿Qué información necesitas y qué alternativa compararías?'),
    paragraph('ejercicio-2', 'Una respuesta posible es revisar la salud del compañero, las acciones conocidas del rival y si el atacante tiene una opción útil ahora. El cambio puede conservarlo, pero el rival podría elegir otra acción y dañar al compañero. Sin conocer movimientos, salud y contexto no hay una respuesta garantizada: explica qué riesgo aceptas y por qué.'),
    paragraph('practica-4', 'Tras combatir, anota un momento en que dudaste. ¿Qué intentabas conservar? ¿Qué esperabas del rival? ¿Qué otra acción tenías? Si dispones de un video o repetición, revísalo; unas notas también sirven. Elige una mejora para la próxima partida en vez de cambiar todo por una sola derrota.'),
    { kind: 'paragraph', id: 'fuentes', runs: [
      ...text('Para ampliar conceptos: '),
      { text: 'Getting Started', marks: [{ kind: 'link', href: 'https://www.smogon.com/articles/getting-started' }] }, ...text(', '),
      { text: 'Move Priority', marks: [{ kind: 'link', href: 'https://www.smogon.com/dp/articles/move_priority' }] }, ...text(' y '),
      { text: 'PKMN 101', marks: [{ kind: 'link', href: 'https://www.smogon.com/xy/articles/pkmn-101' }] },
      ...text(' de Smogon. Son referencias conceptuales de otros juegos y generaciones, no una autoridad sobre las reglas actuales de PokeMMO.')
    ] },
  ] },
];
