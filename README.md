# Black Talon [URSS]

Página de presentación del clan latinoamericano de PokeMMO. La aplicación Angular pregenera HTML estático y se hidrata en el navegador; no requiere servidor de aplicación en producción ni gestor de contenidos.

## Desarrollo local

Se utilizó Node.js 22.23.4 y npm 10.9.9. En la raíz del proyecto:

```sh
npm ci
npm start
```

La CLI mostrará la dirección local. Para ejecutar las pruebas y generar una compilación de producción:

```sh
npm test -- --watch=false
npm run build
```

La compilación estática se genera en `dist/black-talon/browser/`: contiene `index.html`, un `index.html` por cada ruta y sus recursos. Sirve ese directorio con un servidor estático que resuelva índices de directorio; no necesita fallback SPA. La compilación local predeterminada usa la raíz (`/`) como base. El contenido y el emblema son locales; no se necesitan servicios externos para mostrarlos.

En las cinco presentaciones, el HTML inicial contiene la primera escena. Tras la hidratación, una visita anterior o un fragmento de guía puede mostrar la guía o el álbum: podría verse brevemente la primera escena antes de ese cambio. La preferencia de tema se aplica antes del arranque cuando el almacenamiento está disponible; si está bloqueado, se sigue la preferencia del sistema. El HTML inicial de las presentaciones no contiene la guía completa.

## El Compendio

El libro está disponible en `/compendio`. La presentación guarda su estado en `black-talon.compendio.presentation.v1`; no se migra el estado anterior, por lo que puede mostrarse de nuevo una vez. El libro usa `@openpageflip/core` 0.7.0 (MIT), fijado en el lock. Su código se carga en el navegador al abrir el libro; el HTML de respaldo conserva las categorías si el motor no inicia. La primera guía disponible es Introducción al competitivo Singles; las demás y el diccionario inglés están pendientes. El catálogo tipado y su orden de aprendizaje viven en `src/app/pvp-catalog.ts`; la vista alfabética se deriva de esos mismos datos. Para añadir una guía, verificar su contenido y fuentes, añadir sus hojas y fragmento en el libro y solo entonces marcar su entrada como disponible con ese destino. Las hojas mantienen proporción 440:650, con desplazamiento interior para contenido largo: el motor no repagina textos automáticamente. Las flechas, los iconos y los gestos iniciados en los márgenes permiten navegar; los fragmentos identifican las categorías. La presentación se muestra en la primera visita y puede repetirse desde el libro.

El motor modifica únicamente copias de las hojas dentro de un contenedor propio y se destruye al abandonar el libro; los originales Angular quedan como respaldo. El CSS del motor es global y su JavaScript se importa bajo demanda. La comparación exploratoria anterior permanece en la historia Git, no en la aplicación.

## Imágenes del equipo

Los retratos provisionales son un personaje pixel art original y genérico, no oficial de PokeMMO. Para sustituirlos individualmente, reemplaza los PNG transparentes en `public/admins/` conservando los nombres `maykelsito.png`, `HuronVNLZ.png`, `Socamaru.png`, `GhostyFly.png` y `Weonaso.png`. La fuente del marcador original está en `public/admins/source/trainer-placeholder.svg`.

## Ilustraciones de actividades

Las escenas pixel art son ilustraciones originales del proyecto, no imágenes oficiales del juego. Se pueden sustituir individualmente los PNG de `public/activities/`; sus fuentes SVG editables están en `public/activities/source/`.

### Recuerdos de eventos

Los registros del álbum están en `src/app/events-data.ts`. Para añadir uno, incorpora fecha ISO, fecha legible, hora de Perú, organizador, relato, resultados verificados y dimensiones reales de ambas imágenes. Guarda el cartel y la foto completa en `public/eventos/` con el mismo nombre base y el sufijo `_recuerdo` para la foto. El álbum ordena automáticamente por fecha descendente.

## Publicación manual en GitHub Pages

El workflow de `.github/workflows/pages.yml` comprueba pruebas y compilación en los pull requests, sin publicar ni consultar Pages; usa `/mmoclanpage/` como base de comprobación. No se ejecuta al hacer push. Para publicar, desde Actions ejecuta manualmente **Comprobar y publicar Pages** seleccionando `main`. El entorno `github-pages` debe permitir esa rama y Pages debe estar configurado para GitHub Actions. Solo la ejecución manual en `main` genera y publica el artefacto `dist/black-talon/browser/`.

La ejecución manual obtiene `base_path` de la configuración de Pages: actualmente corresponde a `/mmoclanpage` y el build añade la barra final. Si en el futuro se configura un dominio propio, Pages puede devolver una base vacía, que produce `/`. Esto no configura ni conecta ningún dominio ni DNS. Un cambio de dominio requiere una nueva compilación y publicación y su propia verificación.

Para comprobar localmente la base temporal, ejecuta `npm run build -- --base-href /mmoclanpage/` y sirve el contenido de `dist/black-talon/browser/` montado en `/mmoclanpage/` con índices de directorio, sin fallback SPA. Para raíz, `npm run build` utiliza `/`.
