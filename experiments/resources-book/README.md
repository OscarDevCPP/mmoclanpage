# Laboratorio local: archivo de las alas

**Actualización:** el usuario eligió OpenPageFlip por fluidez percibida para esta exploración, sin autorizar integración productiva. A es ahora inmersivo; B se conserva como comparativa histórica en `?mode=b`, con su HTML y estilos anteriores. Ya no comparten diseño idéntico y no son comparables como una prueba visual o de transferencia controlada. El contenido es ficticio: no son guías ni eventos del clan. Este directorio no está en `public`, no se enlaza desde la aplicación y no forma parte del prerender.

## Ejecutar

Desde este directorio, con Node y npm:

```sh
npm ci --ignore-scripts
npm test
npm start
```

Abrir A en <http://127.0.0.1:4179/?mode=a> o B en <http://127.0.0.1:4179/?mode=b>; `PORT=4180 npm start` cambia el puerto. El servidor escucha exclusivamente en loopback, sirve solo archivos de este directorio y no es un servidor de producción. Para detenerlo, Ctrl+C. No se requieren paquetes globales. `node_modules` se ignora localmente.

## Uso y diseño

Abrir la cubierta con el icono de siguiente; el índice interior enlaza las muestras. Los iconos sobre el libro permiten volver al índice y abrir una vista previa conceptual de la cinematográfica; esta no está conectada a la aplicación ni modifica la primera visita. El cierre del diálogo devuelve el foco. En A un gesto horizontal iniciado fuera del texto, en el margen de la cubierta, también pasa de página; el texto y el desplazamiento vertical se dejan al navegador. Anterior/Siguiente avanzan por hoja o pliego; Índice regresa. Las flechas funcionan fuera de controles interactivos. El hash identifica la hoja solicitada y permite recargarla; en escritorio puede mostrarse con su hoja vecina. El navegador mantiene historial para los enlaces. Las zonas interiores son enfocables y desplazables para leer contenido largo. Sin JavaScript el HTML muestra todas las hojas en secuencia. Ambos respetan `prefers-reduced-motion`: A mediante el motor y B omitiendo la animación. Los destinos reciben foco tras el movimiento; volver/avanzar en el historial también navega al hash.

Paleta: tinta `#30241c`, papel `#ead8ae`, oro `#c8a45f`, vino `#591f2b` y noche `#17252c`. Georgia aporta el carácter editorial; Verdana mantiene legibles controles y contexto. La cubierta y las hojas son un objeto central, con adornos contenidos, no un rediseño del sitio. Todo el arte (ornamentos CSS y SVG) es original para este experimento; no se descargaron fuentes ni imágenes externas.

## Dependencia y procedencia

`@openpageflip/core` **0.7.0**, licencia MIT, fijada exactamente en el lock local. Consultados `npm view @openpageflip/core@0.7.0`, el README y las declaraciones de tipos del paquete instalado. Registro: <https://www.npmjs.com/package/@openpageflip/core>; fuente: <https://github.com/benhonda/openpageflip/tree/main/packages/core>; licencia incluida en `node_modules/@openpageflip/core/LICENSE`. El registro indicaba última modificación 2026-09-23. El proyecto es pre-1.0; su API puede cambiar. La instalación con scripts deshabilitados añadió un paquete, sin dependencias de ejecución declaradas.

El motor usa `createBook`, `flipTo` y el evento de orientación; su declaración documenta el salto animado y la restauración mediante `destroy`. El diseño usa `size: stretch`, `cover: true` y `minWidth: 290` para explorar pliego/escritorio frente a una página estrecha; el motor dibuja pliegues geométricos. B usa una copia inerte de la hoja visible, rotada con perspectiva y oscurecida en Web Animations; no reproduce la geometría flexible de A y evita clonar contenido interactivo activo. Ambos mantienen las hojas existentes para lectura.

## Comparación y evidencia histórica

La tabla y mediciones siguientes describen el corte A/B anterior, no el A inmersivo actual. En aquel corte el revisor observó A con 321 px de ancho desplazable a 320 px y fuente raíz 200 %; la corrección actual requiere verificación visual. B todavía carga CSS inerte del motor por el enlace compartido histórico.

### Corte anterior

| | A · OpenPageFlip | B · Motor propio |
| --- | --- | --- |
| Dependencia | Core MIT pre-1.0, versión fijada | Ninguna adicional |
| Transición | Pliegue y sombras del motor; salto animado | Rotación 3D de hoja con sombra y variación de luz; no hay curvatura geométrica |
| Contenido y distribución | HTML compartido, pliegos según el motor | Mismo HTML y pliegos calculados localmente |
| Mantenimiento | API y compatibilidad de tercero por evaluar | Responsabilidad propia de animación, navegación y accesibilidad |

El padre informó estas comprobaciones MCP del corte A/B anterior al ajuste de cabecera actual:

- Escritorio 1366×900: índice → Torre visible con `#torre` y foco en el `h2`; historial atrás `#indice` y adelante `#torre`.
- Móvil emulado 390×844: recarga con destino visible y sin desbordamiento horizontal. Con movimiento reducido, Bosque permitió alcanzar el final desplazando la hoja (`scrollTop` 357, `clientHeight` 500, `scrollHeight` 857). Se informó cero errores de página.
- Ambos: selección de 166 caracteres en DOM y `ArrowRight` hasta `#torre`. Capturas temporales: `/tmp/book-{a,b}-{desktop,mobile}.png`, no son artefactos publicados.
- Con 320×640 y fuente raíz al 200 %, A presentó 326 px de ancho desplazable por la cabecera. El ajuste posterior permite envolver sus elementos sin ocultar overflow; queda por comprobar en navegador tanto A como B con ese tamaño y ampliación.

El padre informó mediciones locales de transferencia de scripts: A `app.js` 6182, `navigation.js` 1076 y Core 80010 bytes; B los dos primeros sin Core. Son datos de esa inspección, no benchmark en dispositivo ni tamaños de producción comprimidos. Un error inicial anterior no se reprodujo en los checks posteriores; su causa sigue desconocida.

Comprobaciones locales de este corte: `npm test` del laboratorio 2/2; `npm test -- --watch=false` productivo 31/31; `npm run build` y `npm run build -- --base-href /black-talon/` produjeron 8 rutas cada uno, sin `resources-book` en `dist`. `git diff --check` no señaló errores en archivos rastreados; el laboratorio todavía no estaba rastreado.

La elección humana de A no resuelve la estrategia de contenido variable ni autoriza integración Angular. Se necesita verificar en navegador real el nuevo diseño, la selección, el coste de mantenimiento y la accesibilidad. No hay medición de rendimiento que permita declarar vencedor.

## Límites y comprobación pendiente

Las hojas tienen altura fija con desplazamiento interno; **no existe repaginación automática** de textos variables. Las comprobaciones anteriores son acotadas y emuladas: falta verificar en navegador el nuevo diseño, incluido 320 px al 200 %, el desplazamiento táctil, más casos de zoom y dispositivos móviles reales. La evidencia A/B anterior no valida este corte. No hay evaluación con tecnologías de asistencia ni benchmark de rendimiento. Este HTML autónomo no demuestra hidratación Angular, prerender, rutas de Pages ni integración con la aplicación. La revisión independiente y toda decisión de integración quedan pendientes.
