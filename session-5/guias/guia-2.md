# Formularios paso a paso 2 — la reserva de talleres

Segunda guía de la práctica sobre formularios. Con la cuenta creada en la inscripción, ahora se **reserva cupo en los talleres del Festival de la Ciudad**: un celular, cuántas personas van, los días de llegada y salida, de uno a tres talleres y un comentario. Se parte de la máquina que quedó armada en la guía anterior (`marcar`, `validar`, las reglas y los tres escuchadores) y se le agrega, paso a paso, lo que esa guía no vio: `pattern`, `min` y `max`, fechas con límites, un **grupo de casillas** con un solo mensaje, un contador de caracteres y la retroalimentación de lo que está bien.

- **Cómo se sigue:** en cada paso se **copia** el código, se **guarda**, se **recarga** la página y se **compara** lo que se ve (o lo que sale en la consola) con lo que aparece aquí. Después se lee *¿Qué pasó?*. Casi todos los pasos terminan con un **Pruebe**: un cambio pequeño que rompe algo a propósito, para ver por qué el código está escrito así. **Después de cada Pruebe, se deja el código como estaba.**
- **Quién escribe:** el teclado rota entre los integrantes del equipo como lo indique el docente. Quien no escribe, lee el paso en voz alta y revisa la salida.

| Paso | Qué se aprende |
| --- | --- |
| 0 | Preparar los archivos |
| 1 | La página de partida y la base de la guía anterior |
| 2 | `pattern`: el celular |
| 3 | `min` y `max` en un número: cuántas personas |
| 4 | Fechas con límites y comparadas: llegada y salida |
| 5 | Un grupo de casillas con un solo mensaje |
| 6 | Validar el grupo cuando el foco sale de él |
| 7 | Contador de caracteres |
| 8 | Decir también lo que está bien |
| 9 | Revisión con teclado y accesibilidad |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome) y el editor de código.
- **La consola:** `F12` → pestaña *Consola*. Se deja abierta toda la práctica.
- **Recargar:** `F5` después de guardar cada cambio. Si algo no cambia, `Ctrl` + `F5`.
- El festival es el **viernes 13, el sábado 14 y el domingo 15 de noviembre de 2026**. Las fechas de la reserva tienen que caer en esos tres días.

---

## Paso 0 · Los archivos

Dentro de la carpeta del proyecto, crear tres archivos vacíos: `talleres.html`, `talleres.css` y `talleres.js`. Van en la entrega de hoy junto con los de la inscripción.

---

## Paso 1 · La página de partida y la base

**Copie** en `talleres.html`:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talleres · Festival de la Ciudad</title>
  <link rel="stylesheet" href="talleres.css">
  <script src="talleres.js" defer></script>
</head>
<body>
  <main>
    <h1>Reserva de talleres</h1>
    <form id="reserva" novalidate>
      <label for="celular">Celular</label>
      <input id="celular" name="celular" type="tel" inputmode="numeric" autocomplete="tel"
             required pattern="3[0-9]{9}" aria-describedby="error-celular">
      <p id="error-celular" class="error"></p>

      <label for="personas">Personas (de 1 a 6)</label>
      <input id="personas" name="personas" type="number" required min="1" max="6" aria-describedby="error-personas">
      <p id="error-personas" class="error"></p>

      <label for="llegada">Llegada</label>
      <input id="llegada" name="llegada" type="date" required min="2026-11-13" max="2026-11-15" aria-describedby="error-llegada">
      <p id="error-llegada" class="error"></p>

      <label for="salida">Salida</label>
      <input id="salida" name="salida" type="date" required min="2026-11-13" max="2026-11-15" aria-describedby="error-salida">
      <p id="error-salida" class="error"></p>

      <fieldset>
        <legend>Talleres: escoge de 1 a 3</legend>
        <label class="casilla"><input type="checkbox" name="taller" value="muralismo" aria-describedby="error-talleres"> Muralismo</label>
        <label class="casilla"><input type="checkbox" name="taller" value="fotografia" aria-describedby="error-talleres"> Fotografía nocturna</label>
        <label class="casilla"><input type="checkbox" name="taller" value="cocina" aria-describedby="error-talleres"> Cocina de la región</label>
        <label class="casilla"><input type="checkbox" name="taller" value="danza" aria-describedby="error-talleres"> Danza folclórica</label>
      </fieldset>
      <p id="error-talleres" class="error"></p>

      <label for="comentario">Comentario (opcional)</label>
      <textarea id="comentario" name="comentario" rows="3" maxlength="200" aria-describedby="cuenta-comentario"></textarea>
      <p id="cuenta-comentario" class="cuenta"></p>

      <button type="submit">Reservar</button>
      <p id="resumen" role="status"></p>
    </form>
  </main>
</body>
</html>
```

**Copie** en `talleres.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; }
main { max-width: 32rem; margin: 0 auto; padding: 1rem; }

form { display: grid; gap: 0.25rem; }
label { margin-top: 0.75rem; font-weight: bold; }
.casilla { display: block; margin-top: 0.25rem; font-weight: normal; }
fieldset { margin-top: 0.75rem; border: 2px solid #888; border-radius: 0.3rem; }
legend { font-weight: bold; }
input, textarea { padding: 0.4rem; border: 2px solid #888; border-radius: 0.3rem; font: inherit; }
button { margin-top: 1rem; padding: 0.5rem; font: inherit; }

.error, .cuenta { margin: 0; min-height: 1.2em; font-size: 0.9rem; }
.error { color: #b00020; }
[aria-invalid="true"] { border-color: #b00020; }
```

**Copie** en `talleres.js` la base que quedó armada en la guía anterior, con dos cambios que se explican abajo:

```javascript
const formulario = document.getElementById("reserva");
const resumen = document.getElementById("resumen");

// Cada campo, por su name, con la función que da su mensaje. Se llena paso a paso
const reglas = {};

// Marcar o desmarcar un campo: para el navegador, para la vista y para el lector de pantalla
function marcar(campo, mensaje) {
  campo.setCustomValidity(mensaje);
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  const error = document.getElementById(campo.getAttribute("aria-describedby"));
  error.textContent = mensaje ? `⚠ ${mensaje}` : "";
  return mensaje === "";
}

// Cambio 1: todos los campos con ese name se marcan con el mismo mensaje
function validar(campo) {
  const mensaje = reglas[campo.name]();
  formulario.querySelectorAll(`[name="${campo.name}"]`).forEach((elemento) => marcar(elemento, mensaje));
  return mensaje === "";
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  // Cambio 2: los campos salen de reglas, uno por name, en el orden en que se agregaron
  const campos = Object.keys(reglas).map((nombre) => formulario.querySelector(`[name="${nombre}"]`));
  const errores = campos.filter((campo) => !validar(campo));

  if (errores.length > 0) {
    resumen.textContent = errores.length === 1
      ? "Hay 1 dato por corregir."
      : `Hay ${errores.length} datos por corregir.`;
    errores[0].focus();
    return;
  }

  resumen.textContent = "Reserva lista.";
  formulario.reset();
});

// Al salir del campo: el usuario terminó de escribir, ahora sí es justo avisar
formulario.addEventListener("focusout", (event) => {
  if (reglas[event.target.name]) validar(event.target);
});

// Al corregir: solo si el campo ya estaba marcado, para quitar el error apenas se arregla
formulario.addEventListener("input", (event) => {
  const campo = event.target;
  if (campo.getAttribute("aria-invalid") === "true") validar(campo);
});
```

**Abra** `talleres.html` y **compare**: seis campos, un recuadro con cuatro talleres y el botón «Reservar». Haga clic en **Reservar** con todo vacío: abajo dice *Reserva lista.*

**¿Qué pasó?**

- **`reglas` está vacío, así que no hay nada que revisar** y cualquier cosa pasa. Desde el Paso 2, cada regla nueva es una función y una línea `reglas.… = …` al final del archivo. Los escuchadores no se vuelven a tocar para agregar un campo.
- **Cambio 1, `validar` marca todos los campos con el mismo `name`.** Para un campo solo es uno; para los cuatro talleres, que comparten `name="taller"`, son los cuatro con el mismo mensaje. Se aprovecha en el Paso 5.
- **Cambio 2, la lista de campos del `submit` sale de `reglas`.** Por cada `name` toma el primer elemento del formulario con ese nombre. Así el grupo de talleres cuenta como **un dato**, no como cuatro.
- El formulario ya trae `novalidate`: los globos del navegador no salen, los mensajes los pone el código.

---

## Paso 2 · `pattern`: el celular

**Agregue** al final de `talleres.js`:

```javascript
const celular = document.getElementById("celular");

function mensajeCelular() {
  if (celular.validity.valueMissing) return "Escribe tu celular.";
  if (celular.validity.patternMismatch) return "El celular tiene 10 dígitos, empieza por 3 y va sin espacios.";
  return "";
}

reglas.celular = mensajeCelular;
```

**Recargue** y envíe con estos valores en el celular:

| Celular | Lo que aparece |
| --- | --- |
| *(vacío)* | `⚠ Escribe tu celular.` |
| `310 555 1234` | `⚠ El celular tiene 10 dígitos, empieza por 3 y va sin espacios.` |
| `6015551234` | El mismo mensaje: no empieza por 3 |
| `3105551234` | Sin mensaje para el celular; *Reserva lista.* |

**¿Qué pasó?**

- **`pattern="3[0-9]{9}"`** es una expresión regular: un `3` y después nueve dígitos del `0` al `9`. El navegador la compara con **todo** el texto, de principio a fin, aunque el patrón no lo diga.
- Cuando no se cumple, **`validity.patternMismatch`** es `true`, y el mensaje lo pone el código: dice **cómo** tiene que ser el número, no solo que está mal.
- **`type="tel"`** no valida nada por sí solo: los teléfonos tienen formatos distintos en cada país. Con **`inputmode="numeric"`** el celular muestra el teclado de números, y **`autocomplete="tel"`** deja que el navegador ofrezca el número guardado.

**Pruebe:** en `talleres.html`, borre `required` del celular. Recargue y envíe con el celular vacío: **no sale ningún error**.

- **`pattern` solo revisa lo que se escribió.** Un campo vacío no tiene nada que comparar, así que lo da por bueno. Si el dato es obligatorio, hace falta `required` además del `pattern`.

Vuelva a poner `required`.

---

## Paso 3 · `min` y `max` en un número: cuántas personas

**Agregue** al final de `talleres.js`:

```javascript
const personas = document.getElementById("personas");

function mensajePersonas() {
  if (personas.validity.badInput) return "Escribe solo números.";
  if (personas.validity.valueMissing) return "Escribe cuántas personas van.";
  if (personas.validity.rangeUnderflow) return "Tiene que ir al menos 1 persona.";
  if (personas.validity.rangeOverflow) return "Máximo 6 personas por reserva.";
  if (personas.validity.stepMismatch) return "Escribe un número entero.";
  return "";
}

reglas.personas = mensajePersonas;
```

**Recargue**, llene un celular bueno y envíe con:

| Personas | Lo que aparece |
| --- | --- |
| *(vacío)* | `⚠ Escribe cuántas personas van.` |
| `0` | `⚠ Tiene que ir al menos 1 persona.` |
| `9` | `⚠ Máximo 6 personas por reserva.` |
| `2` | Sin mensaje; *Reserva lista.* |

**¿Qué pasó?**

- **`min="1"` y `max="6"`** ponen el rango; `validity.rangeUnderflow` dice «se quedó corto» y `rangeOverflow` «se pasó». Un mensaje distinto para cada uno.
- **`badInput`** es `true` cuando el navegador no logra leer un número en lo que se escribió. En ese caso el valor que llega a JavaScript es `""`, por eso se revisa **antes** que `valueMissing`: si no, el mensaje diría «escribe cuántas personas van» a alguien que sí escribió algo.
- Las flechas del campo y las del teclado no dejan salir del rango: el error aparece cuando se escribe a mano.

**Pruebe:** escriba `2.5` y envíe: `⚠ Escribe un número entero.`

- Un `type="number"` acepta solo **pasos de 1** si no se dice otra cosa (`step="1"` es el valor por defecto). `2.5` no cae en un paso y `validity.stepMismatch` lo marca. Con `step="0.5"` en el HTML, `2.5` pasaría.

---

## Paso 4 · Fechas con límites y comparadas: llegada y salida

**Agregue** al final de `talleres.js`:

```javascript
const llegada = document.getElementById("llegada");
const salida = document.getElementById("salida");

// Los límites del festival los ponen min y max en el HTML
function mensajeFecha(campo, cual) {
  if (campo.validity.valueMissing) return `Escoge el día de ${cual}.`;
  if (campo.validity.rangeUnderflow) return "El festival empieza el viernes 13 de noviembre.";
  if (campo.validity.rangeOverflow) return "El festival termina el domingo 15 de noviembre.";
  return "";
}

function mensajeLlegada() {
  return mensajeFecha(llegada, "llegada");
}

// Regla propia 1: una fecha comparada con otra
function mensajeSalida() {
  const mensaje = mensajeFecha(salida, "salida");
  if (mensaje) return mensaje;
  if (llegada.value && salida.value < llegada.value) return "La salida tiene que ser el día de la llegada o después.";
  return "";
}

reglas.llegada = mensajeLlegada;
reglas.salida = mensajeSalida;

// Si cambia la llegada, la salida se revisa otra vez
llegada.addEventListener("input", () => {
  if (salida.value) validar(salida);
});
```

**Recargue**, llene celular y personas bien, y envíe con:

| Llegada | Salida | Lo que aparece |
| --- | --- | --- |
| *(vacía)* | *(vacía)* | `⚠ Escoge el día de llegada.` y `⚠ Escoge el día de salida.` |
| 10 de noviembre | 15 de noviembre | `⚠ El festival empieza el viernes 13 de noviembre.` en la llegada |
| 15 de noviembre | 14 de noviembre | `⚠ La salida tiene que ser el día de la llegada o después.` |
| 14 de noviembre | 14 de noviembre | Sin mensajes; *Reserva lista.* |

Después, con la llegada el 13 y la salida el 14 sin errores, cambie la llegada al 15: **la salida se marca sola**.

**¿Qué pasó?**

- **`min` y `max` también sirven en las fechas:** el calendario del navegador ni siquiera ofrece los días de fuera, y si se escriben a mano, `rangeUnderflow` y `rangeOverflow` lo dicen. `mensajeFecha` sirve para las dos fechas porque recibe el campo.
- **Que la salida no sea antes de la llegada** es una regla que compara dos campos: el HTML no la puede expresar.
- **Las fechas se comparan como texto.** Un `type="date"` entrega `"2026-11-14"`: año, mes y día, siempre con dos cifras. En ese formato el orden alfabético es el orden de las fechas, y `<` funciona sin convertir nada.
- **El escuchador de `llegada`** hace lo que la línea de la contraseña hacía con la confirmación en la guía anterior: si cambia una fecha, la otra se revisa otra vez.

**Pruebe:** escriba en la consola, una por una:

```javascript
"2026-11-14" < "2026-11-15"
"9/11/2026" < "13/11/2026"
```

La primera da `true`; la segunda, `false`, aunque el 9 de noviembre es antes que el 13.

- Con el día primero, la comparación de texto mira el primer carácter: `"9"` va después de `"1"`. Comparar fechas como texto **solo sirve en el formato año-mes-día**, que es justo el que entrega `type="date"`.

---

## Paso 5 · Un grupo de casillas con un solo mensaje

**Agregue** al final de `talleres.js`:

```javascript
// Regla propia 2: contar casillas marcadas
function mensajeTalleres() {
  const cantidad = formulario.querySelectorAll('[name="taller"]:checked').length;
  if (cantidad < 1 || cantidad > 3) return `Escoge de 1 a 3 talleres; llevas ${cantidad}.`;
  return "";
}

reglas.taller = mensajeTalleres;
```

**Recargue**, llene todo lo anterior bien y envíe con:

| Talleres marcados | Lo que aparece |
| --- | --- |
| Ninguno | `⚠ Escoge de 1 a 3 talleres; llevas 0.`, una sola vez, y el foco en *Muralismo* |
| Los cuatro | `⚠ Escoge de 1 a 3 talleres; llevas 4.` |
| Quite uno | El mensaje desaparece al quitar la marca, sin enviar |
| Dos | Sin mensaje; *Reserva lista.* |

En el *Inspector*, con el error a la vista, **las cuatro casillas** tienen `aria-invalid="true"`.

Ahora recargue, haga clic en el celular y recorra el formulario con `Tab` **sin escribir nada**. Al pasar de *Muralismo* a *Fotografía nocturna* ya aparece `⚠ Escoge de 1 a 3 talleres; llevas 0.`, cuando apenas se está mirando el grupo. Se arregla en el Paso 6.

**¿Qué pasó?**

- **`:checked`** en el selector deja solo las casillas marcadas; `.length` las cuenta. Ningún atributo de HTML dice «de 1 a 3 de estas», por eso es una regla propia.
- **El grupo tiene un solo mensaje**, en el `<p id="error-talleres">` que nombran las cuatro casillas con `aria-describedby`. `validar` (Cambio 1 del Paso 1) marca las cuatro con ese mensaje, y el resumen cuenta el grupo como un dato (Cambio 2).
- **`<fieldset>` y `<legend>`** agrupan las casillas y les dan un nombre: el lector de pantalla dice «Talleres: escoge de 1 a 3» al entrar al grupo.
- Quitar una marca dispara `input` en la casilla, y como estaba marcada con error, `validar` vuelve a contar.

**Pruebe:** en `validar`, cambie

```javascript
  formulario.querySelectorAll(`[name="${campo.name}"]`).forEach((elemento) => marcar(elemento, mensaje));
```

por `marcar(campo, mensaje);`. Recargue y envíe con ningún taller: solo *Muralismo* queda con `aria-invalid="true"`. Marque *Danza folclórica*: el error **no se quita**, porque esa casilla no estaba marcada como inválida y el escuchador de `input` no la revisa.

- En un grupo, **todas** las casillas tienen que saber que el grupo falla, para que cualquiera de ellas vuelva a validar al cambiar.

Vuelva a poner la línea con `querySelectorAll`.

---

## Paso 6 · Validar el grupo cuando el foco sale de él

**Reemplace** el escuchador de `focusout` por:

```javascript
// Al salir del campo: el usuario terminó de escribir, ahora sí es justo avisar
formulario.addEventListener("focusout", (event) => {
  const campo = event.target;
  if (!reglas[campo.name]) return;
  // Pasar de una casilla a otra del mismo grupo no es salir del grupo
  if (event.relatedTarget?.name === campo.name) return;
  validar(campo);
});
```

**Recargue** y repita el recorrido con `Tab` sin escribir nada:

- De *Muralismo* a *Fotografía nocturna*, *Cocina de la región* y *Danza folclórica*: **ningún mensaje**.
- De *Danza folclórica* al comentario: aparece `⚠ Escoge de 1 a 3 talleres; llevas 0.`
- Con `Shift` + `Tab` desde *Muralismo* hacia la salida, también aparece: el foco salió del grupo.

**¿Qué pasó?**

- **`event.relatedTarget`** es el elemento **hacia el que va** el foco. Si tiene el mismo `name` que el que lo pierde, el foco sigue dentro del grupo, y todavía no es momento de avisar.
- **`?.`** evita el error cuando no hay hacia dónde ir, por ejemplo al hacer clic fuera de la página: `relatedTarget` es `null` y `null?.name` da `undefined` en lugar de romper.
- Los campos sueltos no cambian: su `relatedTarget` es otro campo, con otro `name`, y se validan al salir como antes.

**Pruebe:** quite el `?` de `event.relatedTarget?.name`. Recargue, haga clic en el celular, escriba un número bueno y después haga clic en un espacio vacío de la página. En la consola: `TypeError: Cannot read properties of null (reading 'name')` (en Firefox, *event.relatedTarget is null*).

- Al hacer clic en un espacio vacío el foco no va a ningún elemento: `relatedTarget` es `null`. Vuelva a poner el `?`.

---

## Paso 7 · Contador de caracteres

**Agregue** al final de `talleres.js`:

```javascript
const comentario = document.getElementById("comentario");
const cuenta = document.getElementById("cuenta-comentario");

function actualizarCuenta() {
  const quedan = comentario.maxLength - comentario.value.length;
  cuenta.textContent = quedan === 1 ? "Queda 1 carácter." : `Quedan ${quedan} caracteres.`;
  cuenta.classList.toggle("poco", quedan <= 20);
}

comentario.addEventListener("input", actualizarCuenta);
actualizarCuenta();
```

**Agregue** al final de `talleres.css`:

```css
.cuenta { color: #555; }
.cuenta.poco { color: #8a4b00; font-weight: bold; }
```

Y en el escuchador de `submit`, **agregue** `actualizarCuenta();` debajo de `formulario.reset();`.

**Recargue** y **compare**:

- Debajo del comentario dice *Quedan 200 caracteres.*
- Escriba `Llevo silla de ruedas`: *Quedan 179 caracteres.* La cuenta baja con cada tecla.
- Pegue un texto largo: se corta en 200, y cuando quedan 20 o menos, la cuenta se pone en negrilla.
- Haga una reserva completa: después de *Reserva lista.* el comentario queda vacío y la cuenta vuelve a *Quedan 200 caracteres.*

**¿Qué pasó?**

- **`maxlength="200"`** en el HTML ya impide escribir más; el contador solo **avisa cuánto queda**, para que nadie se entere al chocar con el límite.
- **`comentario.maxLength`** lee el límite del HTML: si mañana es 300, el JavaScript no cambia.
- **El comentario no tiene regla:** es opcional y el límite lo pone el HTML. No está en `reglas`, así que `validar` no lo toca.
- **La cuenta está en el `aria-describedby` del comentario:** el lector de pantalla la lee al llegar al campo. No va en una región `aria-live`, que anunciaría cada tecla.
- **`formulario.reset()` no dispara `input`:** borra el texto, pero nadie le avisa al contador. Por eso se llama `actualizarCuenta()` a mano después.

**Pruebe:** en `talleres.html`, borre `maxlength="200"` del comentario. Recargue: la cuenta dice *Quedan -1 caracteres.*

- Sin el atributo, `maxLength` vale `-1`: «sin límite». El contador depende de que el HTML ponga el límite. Vuelva a ponerlo.

---

## Paso 8 · Decir también lo que está bien

**Agregue** al final de `talleres.css`:

```css
input[aria-invalid="false"] { border-color: #1b7f3b; }
input[aria-invalid="false"] + .error::before { content: "✓ Listo"; color: #1b7f3b; }
```

Y en el escuchador de `submit`, **agregue** debajo de `actualizarCuenta();`:

```javascript
  formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
```

**Recargue** y **compare**:

- Al cargar, ningún campo tiene ✓.
- Escriba un celular bueno y pase al siguiente con `Tab`: borde verde y *✓ Listo* debajo.
- Escriba un celular malo, salga, y corríjalo: el ⚠ se cambia por *✓ Listo* con el último dígito.
- Haga una reserva completa: después de *Reserva lista.* el formulario queda limpio, sin ✓ ni ⚠.

**¿Qué pasó?**

- **`aria-invalid="false"`** solo lo pone `marcar` en un campo **que ya se revisó y pasó**. Un campo sin tocar no tiene el atributo, así que no sale el ✓ antes de tiempo, igual que no sale el ⚠.
- **`+ .error`** es el selector de **hermano siguiente**: el `<p class="error">` que va justo después del campo. Cuando el campo está bien, ese párrafo está vacío, y `::before` pone el *✓ Listo* desde el CSS. El JavaScript no cambió.
- **El ✓ no depende solo del color:** dice *Listo* con palabras, igual que el ⚠ dice qué falla.
- **Las casillas no muestran el ✓:** su `<p>` va después del `<fieldset>`, no después de cada casilla, y el selector `input + .error` no lo encuentra.

**Pruebe:** quite la línea de `removeAttribute` del `submit`. Recargue y haga una reserva completa: el formulario queda vacío y **lleno de ✓**.

- `reset()` borra los valores, pero no los atributos que puso el código: los campos vacíos se quedan con `aria-invalid="false"`. Vuelva a poner la línea.

---

## Paso 9 · Revisión con teclado y accesibilidad

Deje el ratón quieto y recorra el formulario **solo con el teclado**:

- [ ] `Tab` pasa por el celular, las personas, las dos fechas, los cuatro talleres, el comentario y el botón, en orden.
- [ ] Las flechas `↑` y `↓` cambian el número de personas sin salir de 1 a 6.
- [ ] `Espacio` marca y desmarca cada taller, y el mensaje del grupo sale solo al salir del grupo.
- [ ] Al enviar con errores, el cursor queda en el primer dato con error, y el resumen dice cuántos datos faltan.

En el *Inspector*, pestaña **Accesibilidad**:

- [ ] Una casilla con error tiene como **descripción** el mensaje del grupo, y aparece como inválida.
- [ ] El comentario tiene como descripción la cuenta: *Quedan 200 caracteres.*
- [ ] El grupo de casillas tiene el nombre de su `<legend>`.

---

## El `talleres.js` completo

Así queda al final del Paso 8. Si algo no funciona, se compara contra esto.

```javascript
const formulario = document.getElementById("reserva");
const resumen = document.getElementById("resumen");

// Cada campo, por su name, con la función que da su mensaje. Se llena paso a paso
const reglas = {};

// Marcar o desmarcar un campo: para el navegador, para la vista y para el lector de pantalla
function marcar(campo, mensaje) {
  campo.setCustomValidity(mensaje);
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  const error = document.getElementById(campo.getAttribute("aria-describedby"));
  error.textContent = mensaje ? `⚠ ${mensaje}` : "";
  return mensaje === "";
}

// Cambio 1: todos los campos con ese name se marcan con el mismo mensaje
function validar(campo) {
  const mensaje = reglas[campo.name]();
  formulario.querySelectorAll(`[name="${campo.name}"]`).forEach((elemento) => marcar(elemento, mensaje));
  return mensaje === "";
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  // Cambio 2: los campos salen de reglas, uno por name, en el orden en que se agregaron
  const campos = Object.keys(reglas).map((nombre) => formulario.querySelector(`[name="${nombre}"]`));
  const errores = campos.filter((campo) => !validar(campo));

  if (errores.length > 0) {
    resumen.textContent = errores.length === 1
      ? "Hay 1 dato por corregir."
      : `Hay ${errores.length} datos por corregir.`;
    errores[0].focus();
    return;
  }

  resumen.textContent = "Reserva lista.";
  formulario.reset();
  actualizarCuenta();
  formulario.querySelectorAll("[aria-invalid]").forEach((campo) => campo.removeAttribute("aria-invalid"));
});

// Al salir del campo: el usuario terminó de escribir, ahora sí es justo avisar
formulario.addEventListener("focusout", (event) => {
  const campo = event.target;
  if (!reglas[campo.name]) return;
  // Pasar de una casilla a otra del mismo grupo no es salir del grupo
  if (event.relatedTarget?.name === campo.name) return;
  validar(campo);
});

// Al corregir: solo si el campo ya estaba marcado, para quitar el error apenas se arregla
formulario.addEventListener("input", (event) => {
  const campo = event.target;
  if (campo.getAttribute("aria-invalid") === "true") validar(campo);
});

const celular = document.getElementById("celular");

function mensajeCelular() {
  if (celular.validity.valueMissing) return "Escribe tu celular.";
  if (celular.validity.patternMismatch) return "El celular tiene 10 dígitos, empieza por 3 y va sin espacios.";
  return "";
}

reglas.celular = mensajeCelular;

const personas = document.getElementById("personas");

function mensajePersonas() {
  if (personas.validity.badInput) return "Escribe solo números.";
  if (personas.validity.valueMissing) return "Escribe cuántas personas van.";
  if (personas.validity.rangeUnderflow) return "Tiene que ir al menos 1 persona.";
  if (personas.validity.rangeOverflow) return "Máximo 6 personas por reserva.";
  if (personas.validity.stepMismatch) return "Escribe un número entero.";
  return "";
}

reglas.personas = mensajePersonas;

const llegada = document.getElementById("llegada");
const salida = document.getElementById("salida");

// Los límites del festival los ponen min y max en el HTML
function mensajeFecha(campo, cual) {
  if (campo.validity.valueMissing) return `Escoge el día de ${cual}.`;
  if (campo.validity.rangeUnderflow) return "El festival empieza el viernes 13 de noviembre.";
  if (campo.validity.rangeOverflow) return "El festival termina el domingo 15 de noviembre.";
  return "";
}

function mensajeLlegada() {
  return mensajeFecha(llegada, "llegada");
}

// Regla propia 1: una fecha comparada con otra
function mensajeSalida() {
  const mensaje = mensajeFecha(salida, "salida");
  if (mensaje) return mensaje;
  if (llegada.value && salida.value < llegada.value) return "La salida tiene que ser el día de la llegada o después.";
  return "";
}

reglas.llegada = mensajeLlegada;
reglas.salida = mensajeSalida;

// Si cambia la llegada, la salida se revisa otra vez
llegada.addEventListener("input", () => {
  if (salida.value) validar(salida);
});

// Regla propia 2: contar casillas marcadas
function mensajeTalleres() {
  const cantidad = formulario.querySelectorAll('[name="taller"]:checked').length;
  if (cantidad < 1 || cantidad > 3) return `Escoge de 1 a 3 talleres; llevas ${cantidad}.`;
  return "";
}

reglas.taller = mensajeTalleres;

const comentario = document.getElementById("comentario");
const cuenta = document.getElementById("cuenta-comentario");

function actualizarCuenta() {
  const quedan = comentario.maxLength - comentario.value.length;
  cuenta.textContent = quedan === 1 ? "Queda 1 carácter." : `Quedan ${quedan} caracteres.`;
  cuenta.classList.toggle("poco", quedan <= 20);
}

comentario.addEventListener("input", actualizarCuenta);
actualizarCuenta();
```

**Cuatro escuchadores** (`submit`, `focusout` e `input` en el formulario, e `input` en la llegada) y **una función por regla**. La base de arriba no cambió desde el Paso 1, salvo el `focusout` del Paso 6 y las dos líneas finales del `submit`.

## Del ejercicio al reto

Lo que se hizo aquí es lo que pide el reto de hoy sobre el proyecto, con otro formulario:

| En la reserva | En el reto |
| --- | --- |
| `pattern`, `min`, `max` y `step` con un mensaje por causa | Los atributos nativos donde sirvan, cada uno con su mensaje en español |
| La salida comparada con la llegada | Regla propia: una fecha después de otra, un mínimo menor que un máximo |
| De 1 a 3 talleres, con un solo mensaje para el grupo | Regla propia: entre 2 y 4 elementos marcados, sin pasar un límite |
| `reglas` como tabla y una línea por campo nuevo | Agregar los campos del tema sin tocar los escuchadores |
| El contador y el *✓ Listo* | Retroalimentación que no depende solo del color |

**Dos diferencias:** en el reto las opciones del grupo salen **de los datos del proyecto** (no se escriben en el HTML), y el reto pide al menos **dos reglas propias**; `pattern`, `min` y `max` no cuentan como propias, porque las expresa el HTML.
