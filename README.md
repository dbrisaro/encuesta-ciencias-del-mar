# Encuesta de ciencias del mar: visor del cuestionario

Herramienta interna para revisar el cuestionario sobre barreras en el desarrollo de carreras tempranas en ciencias del mar en Argentina.

Importante: esta es una vista de solo lectura del instrumento. No es la encuesta que completan las personas ni recolecta respuestas. Sirve para que el equipo lea y acuerde la versión final del cuestionario.

## Qué hay en el repositorio

- `survey.json`: el contenido del cuestionario. Es la única fuente de verdad. Todo cambio acordado se aplica acá.
- `index.html`, `styles.css`, `app.js`: el visor que muestra `survey.json`. Normalmente no hace falta tocarlos.

## Cómo verla

El visor lee `survey.json`, así que necesita un servidor local (no funciona abriendo `index.html` con doble clic).

Opción 1, local. Desde la carpeta del proyecto:

    python3 -m http.server 8000

y abrir http://localhost:8000 en el navegador.

Opción 2, en línea. La versión publicada está en [INSERTAR URL de GitHub Pages o Cloudflare Pages]. Ese enlace siempre muestra la versión más reciente acordada.

El botón "Descargar Markdown" genera una versión legible del instrumento en un archivo de texto, para compartir o imprimir.

## Flujo de trabajo: proponer y luego aplicar

El visor no permite editar: se lee desde el navegador y los cambios se aplican sobre `survey.json`. Circuito:

1. Todes pueden abrir el enlace y revisar el cuestionario cuando quieran.
2. Si alguien quiere un cambio, lo propone: por un issue en este repositorio, por mensaje, o por mail. Conviene indicar la sección y la pregunta.
3. Las propuestas se discuten y se consensúan en el equipo.
4. Una sola persona (la responsable del repositorio) aplica los cambios acordados sobre `survey.json`, hace el commit y sube los cambios. El enlace publicado se actualiza para todes.

Así siempre hay una única versión vigente (la que está en el repositorio), los cambios quedan registrados con su autoría y se pueden revertir, y nadie pisa el trabajo de otra persona.

Responsable del repositorio: [INSERTAR nombre].

## Cómo se aplican los cambios (para la persona responsable)

Editar `survey.json` con un editor de texto y hacer commit. Es un archivo JSON: conviene validarlo antes de subirlo, por ejemplo con

    python3 -m json.tool survey.json > /dev/null

Si no devuelve nada, el archivo está bien formado.

## Estructura de `survey.json`

- `title`: título del cuestionario.
- `scales`: las escalas compartidas (`agreement`, `frequency`, `access`). Cambiar una etiqueta acá la cambia en todas las preguntas que usan esa escala.
- `sections`: lista de secciones. Cada sección tiene `id` (la etiqueta corta de la barra lateral), `title`, y `kind` que puede ser `text` (con `content`) o `questions` (con `note` y una lista `items`).
- Cada item tiene un `type`:
  - `agreement`, `frequency`, `access`: usan las escalas compartidas.
  - `choice`: opción única, con su propia lista `options`.
  - `multi`: selección múltiple, con `options` y `max` (cantidad máxima de opciones elegibles).
  - `scale`: escala propia de la pregunta, con su propia lista `options`.
  - `open`: respuesta abierta.
  - `placeholder`: escala validada que hay que insertar textualmente.
  - `note`: texto que no es pregunta. Con `team: true` es una nota interna del equipo, no para quien responde; en el visor aparece en un bloque amarillo.
- Un item puede tener `extra` con opciones adicionales (por ejemplo "No aplica").

## Las escalas validadas

La sección I incluye un `placeholder` para el WHO-5: hay que insertar la versión oficial en español sin reescribir sus ítems, para no perder la validez de la escala. La nota del equipo en esa sección explica por qué se eligió el WHO-5 y se descartaron PSS-10 y CBI.
