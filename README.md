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
  - `agreement`, `frequency`, `access`, `who5`: usan las escalas compartidas definidas en `scales`. Para agregar una escala nueva basta con sumarla a `scales` y usar su nombre como `type`.
  - `choice`: opción única, con su propia lista `options`.
  - `multi`: selección múltiple, con `options` y `max` (cantidad máxima de opciones elegibles).
  - `scale`: escala propia de la pregunta, con su propia lista `options`.
  - `open`: respuesta abierta.
  - `placeholder`: escala validada pendiente de insertar textualmente. Hoy no hay ninguna.
  - `note`: texto que no es pregunta. Con `team: true` es una nota interna del equipo, no para quien responde; en el visor aparece en un bloque amarillo.
- Un item puede tener `extra` con opciones adicionales (por ejemplo "No aplica").

## La escala validada (WHO-5)

La sección I incluye el WHO-5 (OMS cinco, Índice de Bienestar, versión 1998) en su traducción oficial al español publicada por la OMS. Desde 2024 es un producto de acceso abierto de la OMS.

Los 5 ítems y las 6 categorías de respuesta están transcriptos textualmente y no deben reescribirse ni reordenarse: si se cambian, se pierde la comparabilidad con la literatura publicada. Puntaje: 5 (Todo el tiempo) a 0 (Nunca), sumar los 5 ítems y multiplicar por 4 para obtener un índice de 0 a 100. Ningún ítem se invierte. Hay que incluir la atribución a la OMS donde se publique el instrumento y los resultados; el detalle está en la nota del equipo de la sección I.

Se descartaron la PSS-10 y el Copenhagen Burnout Inventory para no extender la sección: los tres instrumentos juntos sumaban 28 ítems de redacción fija.
