# Editor de la encuesta de ciencias del mar

Herramienta interna para diseñar y revisar el cuestionario sobre barreras en el desarrollo de carreras tempranas en ciencias del mar en Argentina.

Importante: esta es la herramienta de edición y vista previa del cuestionario. No es la encuesta que completan las personas ni recolecta respuestas. Sirve para que el equipo acuerde la versión final del instrumento.

## Qué hay en el repositorio

- `survey.json`: el contenido del cuestionario. Es la única fuente de verdad. Todo cambio acordado se aplica acá.
- `index.html`, `styles.css`, `app.js`: la herramienta que muestra y edita `survey.json`. Normalmente no hace falta tocarlos.

## Cómo verla

La herramienta lee `survey.json`, así que necesita un servidor local (no funciona abriendo `index.html` con doble clic).

Opción 1, local. Desde la carpeta del proyecto:

    python3 -m http.server 8000

y abrir http://localhost:8000 en el navegador.

Opción 2, en línea. La versión publicada está en [INSERTAR URL de GitHub Pages o Cloudflare Pages]. Ese enlace siempre muestra la versión más reciente acordada.

## Flujo de trabajo: proponer y luego aplicar

Por ahora la idea es que el equipo revise el cuestionario, no que lo edite en paralelo. Para no terminar con versiones distintas, seguimos este circuito:

1. Todes pueden abrir el enlace y revisar el cuestionario cuando quieran.
2. Si alguien quiere un cambio, lo propone: por un issue en este repositorio, por mensaje, o por mail. Conviene indicar la sección y la pregunta.
3. Las propuestas se discuten y se consensúan en el equipo.
4. Una sola persona (la responsable del repositorio) aplica los cambios acordados sobre `survey.json`, hace el commit y sube los cambios. El enlace publicado se actualiza para todes.

Así siempre hay una única versión vigente (la que está en el repositorio), los cambios quedan registrados con su autoría y se pueden revertir, y nadie pisa el trabajo de otra persona.

Responsable del repositorio: [INSERTAR nombre].

## Cómo se aplican los cambios (para la persona responsable)

Hay dos maneras, equivalentes:

- Editar `survey.json` directamente con un editor de texto y hacer commit.
- Abrir la herramienta, hacer los cambios tocando el texto y los controles, usar el botón "Descargar JSON", reemplazar `survey.json` del repositorio con el archivo descargado y hacer commit.

El botón "Descargar Markdown" genera una versión legible del instrumento para compartir o revisar. Esa versión es solo de lectura: la herramienta no la vuelve a importar, solo importa JSON.

Recordatorio: los cambios hechos en el navegador no se guardan solos. Si no descargás el JSON y reemplazás el archivo, se pierden al cerrar.

## Estructura de `survey.json`

- `title`: título del cuestionario.
- `scales`: las escalas compartidas (`agreement`, `frequency`, `access`). Editar una etiqueta acá cambia la vista previa en todas las preguntas que usan esa escala.
- `sections`: lista de secciones. Cada sección tiene `id` (la etiqueta corta de la barra lateral), `title`, y `kind` que puede ser `text` (con `content`) o `questions` (con `note` y una lista `items`).
- Cada item tiene un `type`: `agreement`, `frequency`, `access` (usan las escalas compartidas), `choice` y `scale` (llevan su propia lista `options`), `open` (respuesta abierta), `placeholder` (escala validada a insertar) y `note` (texto que no es pregunta). Un item puede tener `extra` para opciones adicionales (por ejemplo "No aplica"). Una `note` con `team: true` es una nota para el equipo, no para quien responde.

## Las escalas validadas

I.1, I.2 e I.3 aparecen como marcadores a propósito. Hay que insertar las versiones oficiales en español de PSS-10, WHO-5 y CBI, sin reescribir sus ítems, para no perder la validez de las escalas.
