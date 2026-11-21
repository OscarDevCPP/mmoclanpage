# Black Talon [URSS]

Página de presentación del clan latinoamericano de PokeMMO. La aplicación Angular pregenera HTML estático y se hidrata en el navegador; no requiere servidor de aplicación en producción, gestor de contenidos ni configuración de despliegue.

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

La compilación estática se genera en `dist/black-talon/browser/`: contiene `index.html`, un `index.html` por cada ruta y sus recursos. Sirve ese directorio con un servidor estático que resuelva índices de directorio; no necesita fallback SPA. Las URL usan la raíz (`/`) como base. El contenido y el emblema son locales; no se necesitan servicios externos para mostrarlos.

En las cinco presentaciones, el HTML inicial contiene la primera escena. Tras la hidratación, una visita anterior o un fragmento de guía puede mostrar la guía o el álbum: podría verse brevemente la primera escena antes de ese cambio. La preferencia de tema se aplica antes del arranque cuando el almacenamiento está disponible; si está bloqueado, se sigue la preferencia del sistema. El HTML inicial de las presentaciones no contiene la guía completa.

## Imágenes del equipo

Los retratos provisionales son un personaje pixel art original y genérico, no oficial de PokeMMO. Para sustituirlos individualmente, reemplaza los PNG transparentes en `public/admins/` conservando los nombres `maykelsito.png`, `HuronVNLZ.png`, `Socamaru.png`, `GhostyFly.png` y `Weonaso.png`. La fuente del marcador original está en `public/admins/source/trainer-placeholder.svg`.

## Ilustraciones de actividades

Las escenas pixel art son ilustraciones originales del proyecto, no imágenes oficiales del juego. Se pueden sustituir individualmente los PNG de `public/activities/`; sus fuentes SVG editables están en `public/activities/source/`.

### Recuerdos de eventos

Los registros del álbum están en `src/app/events-data.ts`. Para añadir uno, incorpora fecha ISO, fecha legible, hora de Perú, organizador, relato, resultados verificados y dimensiones reales de ambas imágenes. Guarda el cartel y la foto completa en `public/eventos/` con el mismo nombre base y el sufijo `_recuerdo` para la foto. El álbum ordena automáticamente por fecha descendente.
