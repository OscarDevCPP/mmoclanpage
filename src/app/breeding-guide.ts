import { BREEDING_GLOSSARY } from './breeding-glossary';
import { Component } from '@angular/core';
import { GUIDE_CATALOG } from './guide-catalog';
import type { GuideBlock, GuideDefinition, InlineRun } from './guide-content';
import { GuidePage } from './guide-page';

const text = (text: string): InlineRun => ({ text, marks: [] });
const term = (key: keyof typeof BREEDING_GLOSSARY, label = key as string): InlineRun => ({ text: label, marks: [{ kind: 'glossary', term: key }] });
const link = (text: string, href: string): InlineRun => ({ text, marks: [{ kind: 'link', href }] });
const p = (id: string, ...runs: (string | InlineRun)[]): GuideBlock => ({ kind: 'paragraph', id, runs: runs.map(run => typeof run === 'string' ? text(run) : run) });
const strong = (text: string): InlineRun => ({ text, marks: [{ kind: 'strong' }] });
const item = (id: string, label: string, ...runs: (string | InlineRun)[]) => ({
  id, runs: [strong(label), ...runs.map(run => typeof run === 'string' ? text(run) : run)],
});
const list = (id: string, ...items: ReturnType<typeof item>[]): GuideBlock => ({ kind: 'list', id, ordered: false, items });
const heading = (id: string, title: string): GuideBlock => ({ kind: 'heading', id, level: 3, runs: [text(title)] });
const hub = link('PokeMMO Hub', 'https://pokemmohub.com/');
const guide = GUIDE_CATALOG.breeding;
const body: Record<typeof guide.contents[number]['id'], readonly GuideBlock[]> = {
  introduccion: [
    p('que-es-criar', 'Criar consiste en cruzar dos Pokémon compatibles para conseguir un huevo. Si ya criaste en los juegos originales, no des por hecho que las reglas son las mismas: en PokeMMO entregas a ambos padres definitivamente a cambio de un solo huevo. Planea el cruce antes de confirmar.'),
  ],
  conceptos: [
    heading('compatibilidad', 'Qué padres pueden criar'),
    list('tipos-de-pareja',
      item('regla-general', 'Regla general. ', 'Busca dos Pokémon de distinto sexo que compartan un ', term('grupo huevo'), '. La cría suele salir de la ', term('línea evolutiva'), ' de la hembra.'),
      item('ditto', 'Con Ditto. ', 'La cría sale de la línea del otro Pokémon, aunque sea macho o no tenga sexo. Dos Ditto no pueden criar entre sí. Ditto tampoco vuelve criable a una especie que no admite crianza.'),
      item('sexo', 'Especies de un solo sexo. ', 'Si solo hay machos, normalmente necesitas Ditto para obtener la misma línea; una hembra de otra línea suele dar una cría de su propia línea. Si solo hay hembras, puedes usar un macho compatible o Ditto.'),
      item('sin-sexo', 'Especies sin sexo. ', 'Si admiten crianza, por lo general pueden cruzarse con Ditto o con otro Pokémon de su línea. Por ejemplo, Magnemite puede criar con Magneton. Compartir grupo huevo con otra línea no basta.'),
    ),
    heading('herencia', 'IVs y naturaleza'),
    list('reglas-de-herencia',
      item('regla-ivs', 'IVs sin brazal. ', 'En un cruce normal, tres ', term('IV', 'IVs'), ' se copian de los padres y los otros tres se promedian, redondeando hacia abajo. Con 20 y 31, una estadística puede salir con 20, 25 o 31. Si ambos valores son iguales, el huevo los conserva.'),
      item('fijar-iv', 'Cómo fijar un IV. ', 'Un ', term('brazal'), ' fija el valor de una estadística al IV de quien lo lleva. Cuenta como uno de los tres IVs copiados.'),
      item('fijar-naturaleza', 'Cómo fijar la naturaleza. ', 'La ', term('Piedra Eterna'), ' garantiza la ', term('naturaleza'), ' de quien la lleva. Cada padre solo puede llevar un objeto: si uno usa Piedra Eterna, solo queda espacio para un brazal.'),
    ),
    heading('ejemplo-de-crianza', 'Ejemplo: tres cruces para un 3×31 Firme'),
    p('cadena', 'Ejemplo: quieres 31 en PS, Ataque y Velocidad, con naturaleza Firme. Supón que las parejas son compatibles y que eliges el sexo necesario para el último cruce.'),
    { kind: 'list', id: 'cadena-3x31', ordered: true, items: [
      { id: 'cruce-uno', runs: [text('Cruza un padre Firme con 31 en PS (Piedra Eterna) y otro con 31 en PS y Ataque (brazal de Ataque). PS se conserva porque ambos tienen 31. Obtienes PS y Ataque en 31, con naturaleza Firme.')] },
      { id: 'cruce-dos', runs: [text('Cruza un padre con 31 en PS y Ataque (brazal de PS) y otro con 31 en Ataque y Velocidad (brazal de Velocidad). Ataque se conserva porque ambos tienen 31. Obtienes un segundo padre con PS, Ataque y Velocidad en 31.')] },
      { id: 'cruce-tres', runs: [text('En el cruce final, el padre Firme lleva Piedra Eterna y el otro lleva brazal de Velocidad. PS y Ataque se conservan porque los dos padres tienen 31. El brazal fija Velocidad y la Piedra Eterna transmite Firme. El resultado es un '), term('3×31'), text(' Firme.')] },
    ] },
    heading('rasgos', 'Movimientos y otros rasgos heredables'),
    list('herencia-de-rasgos',
      item('movimientos-huevo', 'Movimientos huevo. ', 'Un ', term('movimiento huevo'), ' puede pasar a la cría si uno de los padres lo conoce y la especie de la cría lo admite. Para buscar una cadena de especies, consulta Egg Moves Calculator en ', hub, '.'),
      item('habilidad-oculta', 'Habilidades. ', 'El cruce no te permite elegir qué habilidad quedará activa. Lo que puedes conservar es el acceso a la ', term('habilidad oculta'), ': busca un padre que la tenga desbloqueada y pertenezca a la línea de la cría. No hace falta que la tenga activa. Comprueba que el acceso se mantenga después de cada cruce.'),
      item('pildora-habilidad', 'Píldora Habilidad. ', 'Este objeto cambia la habilidad activa del Pokémon. Puedes usarlo para seleccionar la habilidad oculta si ese Pokémon ya la tiene desbloqueada, pero la píldora no la desbloquea. Úsala en la cría final: cambiar la habilidad de un padre no garantiza que su cría nazca con esa misma habilidad activa. Consulta la ', link('ficha de la Píldora Habilidad', 'https://www.pikammo.fr/Pokemmo/en/items/ability-pill'), '.'),
      item('alfa', 'Alfa. ', 'Ambos padres deben ser ', term('Alfa'), ' para obtener una cría Alfa. Este rasgo no garantiza el acceso a la habilidad oculta.'),
      item('trajes', 'Traje. ', 'Un ', term('traje'), ' cambia la apariencia, no la especie ni las estadísticas. El ', link('changelog de Shiny Wars 2026', 'https://forums.pokemmo.com/index.php?/topic/199536-changelog-shiny-wars-2026/'), ' confirma que se hereda, pero no des por hecho que pasará a una cría de otra línea.'),
      item('particulas', 'Partículas. ', 'Las ', term('partícula', 'partículas'), ' son efectos visuales. Según la ', link('guía de partículas del foro', 'https://forums.pokemmo.com/index.php?/topic/149548-particles-guide-previews-and-release-information-20/'), ', la cría reúne las partículas de ambos padres sin duplicar las que comparten. Por ejemplo, si uno tiene Bats y el otro Ghosts, el huevo hereda ambas.'),
      item('particulas-variocolor', 'Excepción variocolor. ', 'Las partículas Shiny y Secret Shiny no se acumulan entre sí: si cruzas un variocolor normal con uno secreto, prevalece Secret Shiny. Un Pokémon variocolor no puede criar con uno normal. Dos variocolor sí garantizan un huevo variocolor; dos padres normales no lo garantizan.'),
    ),
    heading('entrenador-original', '¿Con qué entrenador original sale la cría?'),
    list('reglas-eo',
      item('eo-normal', 'Cruce normal. ', 'Si la Pokédex registra la especie del huevo como capturada por ti, la cría puede llevar tu ', term('EO'), ' sin asterisco aunque hayas comprado ambos padres. Si no consta como captura propia, puede mostrar tu nombre con asterisco (EO* u OT*). Un intercambio no cuenta como captura propia.'),
      item('eo-variocolor', 'Cruce variocolor. ', 'Capturar la especie no basta. La ', link('guía del foro', 'https://forums.pokemmo.com/index.php?/topic/49440-the-breeding-guide/'), ' indica que conservas tu EO si un padre con tu EO pertenece a la línea del huevo. Por ejemplo, tu Charmeleon variocolor puede transmitirlo a Charmander aunque la madre Charizard tenga otro EO.'),
      item('eo-asterisco', 'Si ya tiene EO*. ', 'La ', link('guía de variocolor del foro', 'https://forums.pokemmo.com/index.php?/topic/120706-pokemmo-shiny-hunting-guide-2026-encnespt-released-in-2020/'), ' advierte que volver a criar un variocolor con EO* puede dar entrenador desconocido (Unknown OT). Confirma el EO en la vista previa.'),
    ),
    heading('eclosion', 'Cómo eclosionar el huevo'),
    { kind: 'list', id: 'pasos-de-eclosion', ordered: true, items: [
      item('incubadoras', 'Coloca el huevo en una ', term('incubadora'), '. Puedes gestionarla sin estar junto a un PC. El ', link('changelog de Shiny Wars 2025', 'https://forums.pokemmo.com/index.php?/topic/189893-changelog-shiny-wars-2025/'), ' documenta hasta ocho incubadoras permanentes.'),
      item('acelerar-eclosion', 'Acorta la espera. ', 'Coloca un Pokémon con Cuerpo Llama (Flame Body) o Escudo Magma (Magma Armor) en la ranura especial del PC para incubación. Llevarlo solo en el equipo no sustituye este paso.'),
    ] },
  ],
  ahorro: [
    p('ivs-utiles', 'Compra IVs que cumplan una función. Si un atacante solo usa movimientos físicos, no pagues por un 31 en Ataque Especial salvo que tu estrategia lo necesite. Aprovecha también los IVs iguales: compartir el valor deseado en ambos padres ahorra un brazal en ese cruce.'),
    p('precio-total', 'Antes de comprar en el ', term('GTL'), ', suma el precio de los padres, los brazales, las Piedras Eternas y la selección de sexo de los pasos que la necesiten. Compara el total con el precio del Pokémon terminado. Compara también comprar un padre con varios IVs útiles frente a construirlo desde cero; no des por hecho que una opción siempre es más barata.'),
    list('crianza-semiperfecta',
      item('umbral-de-ivs', 'Si no necesitas 5×31, busca mínimos útiles. ', 'Por ejemplo, filtra en el GTL por padres compatibles con al menos 25 en PS, Defensa y Defensa Especial. Si ambos cumplen esos mínimos, la cría también: copiar o promediar dos IVs de 25 o más nunca da menos de 25. Comprueba esos mínimos en los dos padres de cada cruce.'),
      item('combinar-ivs-utiles', 'Fija solo los 31 que importan. ', 'Si un padre trae 31 en Ataque y el otro 31 en Velocidad, equipa a cada uno con su brazal. La cría tendrá esos dos 31 y conservará los tres mínimos del ejemplo.'),
      item('naturaleza-semiperfecta', 'Añade naturaleza sin perder lo que ya ganaste. ', 'Busca otro padre con la naturaleza deseada, los mismos mínimos y 31 en Ataque. Dale Piedra Eterna y equipa a la cría anterior con el brazal de Velocidad. Ataque queda en 31 porque ambos padres lo comparten; Velocidad se fija con el brazal.'),
    ),
    p('brazales-con-pb', 'Si ya tienes puntos de batalla (PB), puedes canjearlos por brazales en los vendedores de PB en lugar de pagar con Pokéyenes. Puedes ganar PB en combates clasificatorios de PvP y al superar el Alto Mando, incluidas sus revanchas. Consulta la ', link('referencia de puntos de batalla', 'https://pokemmo.fandom.com/wiki/Battle_Point'), '.'),
    p('naturaleza-al-azar', 'Si tu presupuesto admite un cruce extra, puedes dejar la naturaleza para el final. Sin Piedra Eterna, la cría puede salir por azar con la naturaleza que buscas. Si aciertas, te ahorras el cruce que habrías hecho para fijarla; si no, tendrás que preparar otro cruce con Piedra Eterna sin perder los IVs ni los rasgos que ya reuniste. Si no tienes margen para ese coste, es mejor garantizar la naturaleza desde el principio.'),
    p('plan-sexo', 'Paga por elegir el sexo cuando haga falta para el siguiente cruce, para conservar la línea o para cumplir el objetivo final. Si el Pokémon ya está terminado y el sexo no importa, puedes evitar ese gasto. Consulta el coste en la vista del criador y usa el Breeding Simulator de ', hub, ' para estimar cuántos padres necesitas.'),
  ],
  'antes-de-criar': [
    list('preguntas',
      item('funcion', '¿Para qué lo usaré? ', 'Define su función antes de gastar: competir en PvP, hacer revanchas, capturar Pokémon u otra actividad. Así evitas pagar por características que no mejoran esa función.'),
      item('objetivo', '¿Qué naturaleza e IVs necesita? ', 'Elige solo las estadísticas que aportan al plan. Un atacante físico normalmente no necesita 31 en Ataque Especial. Para Espacio Raro, incluso puede interesarte 0 en Velocidad.'),
      item('habilidad', '¿Necesita la habilidad oculta? ', 'Si la estrategia depende de ella, empieza con un padre de la línea adecuada que ya tenga acceso. Comprueba que la cría lo conserve en cada paso. Dejarlo para el final puede encarecer el proyecto o forzarte a rehacer cruces.'),
      item('movimiento', '¿Necesita algún movimiento huevo? ', 'Busca el movimiento en la Pokédex. Si solo figura como movimiento huevo, planifica desde el principio qué padre lo transmitirá. El recordador puede recuperar uno ya heredado, pero no añadir el que omitiste. Otro cruce al final puede costar padres y objetos que ya habías invertido.'),
      item('apariencia', '¿Quiero Alfa, traje o partículas? ', 'Son extras de presentación, no sustituyen los rasgos que necesita tu estrategia. Pueden encarecer el cruce al limitar tus opciones de padres. Decide cuánto quieres pagar por ellos después de cubrir lo imprescindible.'),
      item('presupuesto', '¿Cuánto puedo gastar? ', 'Calcula padres, objetos y selección de sexo por cruce. Deja margen para los pasos que exigen una pareja concreta y compara el total con el precio del Pokémon terminado.'),
    ),
    p('comprobacion', 'Antes de confirmar, compara la vista previa del criador con tu objetivo: especie, sexo si lo elegiste, IVs, naturaleza, movimientos, EO y rasgos extra. Si no puedes confirmar un rasgo imprescindible, no entregues los padres todavía.'),
  ],
  simulador: [
    p('reto-ivs', 'Practica con una pareja ya compatible. A tiene 31 en PS y B tiene 31 en Velocidad. Equipa a cada uno con el brazal correspondiente para fijar ambos IVs. Luego sustituye el brazal de A por Piedra Eterna: ¿qué dejas de garantizar?'),
    { kind: 'breeding-simulator', id: 'mesa-de-crianza' },
  ],
};

@Component({ selector: 'app-breeding-guide', imports: [GuidePage], template: '<app-guide-page [guide]="guide" />' })
export class BreedingGuide {
  readonly guide: GuideDefinition = {
    ...guide,
    glossary: BREEDING_GLOSSARY,
    aliases: { introduccion: 'originales', conceptos: 'antes-del-cruce' },
    sections: guide.contents.map(({ id, title }) => ({ id, blocks: [{ kind: 'heading', level: 2, id: `${id}-titulo`, runs: [text(title)] }, ...body[id]] })),
    footer: [p('fuentes-crianza', 'Fuentes consultadas en noviembre de 2026: ',
      link('guía de crianza de PokeMMO Companion', 'https://pokemmo.wiki/guides/pokemmo-breeding-guide'), ', ',
      link('guía comunitaria sobre Alfa y habilidad oculta', 'https://forums.pokemmo.com/index.php?/topic/142087-my-breeding-guide-revised-nov-2022/'), ' y ',
      link('reglas de compatibilidad del foro', 'https://forums.pokemmo.com/index.php?/topic/49440-the-breeding-guide/'), ', ',
      link('casos de trajes en MMOBreeder', 'https://mmobreeder.com/guides/costume-pokemon'), ' y ',
      link('referencia de movimientos huevo y recordador', 'https://pokemmo.fandom.com/wiki/Breeding'), '.')],
  };
}
