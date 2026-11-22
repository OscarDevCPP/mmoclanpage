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

En las cinco presentaciones, el HTML inicial contiene la primera escena. Tras la hidratación, una visita anterior o un fragmento de guía puede mostrar la guía o el álbum: podría verse brevemente la primera escena antes de ese cambio. La preferencia de tema se aplica antes del arranque cuando el almacenamiento está disponible; si está bloqueado, se sigue la preferencia del sistema. En el Compendio, la escena prerenderizada se oculta antes de hidratar si la presentación ya fue vista; el índice también está en el HTML inicial.

## El Compendio

El índice central está disponible en `/compendio`. Agrupa los temas PvP en cinco grandes páginas previstas: Fundamentos del competitivo, Preparación de Pokémon, Construcción de equipos, Decisiones en combate y Análisis y mejora. Los niveles son orientativos. PvE, eventos y el diccionario inglés siguen pendientes, al igual que los apartados no publicados; no tienen enlaces ficticios.

La única página temática publicada es `/compendio/pvp/fundamentos`, con la introducción a Singles, sus dos diagramas originales y fuentes conceptuales. Las páginas usan lectura y desplazamiento convencionales. La presentación se muestra en la primera visita al índice, guarda su estado en `black-talon.compendio.presentation.v1` y puede repetirse desde el índice. La ruta directa de la guía no la intercepta.

El contenido existente está en `src/app/pvp-guide.ts` y el catálogo y agrupaciones en `src/app/pvp-catalog.ts`. Antes de publicar un apartado, verificar contenido y fuentes y crear un destino real; solo entonces enlazarlo desde el índice. No hay gestor de contenidos ni publicación automática de guías.

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
