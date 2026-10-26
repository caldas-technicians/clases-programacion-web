# Formularios paso a paso — la inscripción al festival

Guía de la práctica guiada sobre formularios. Se construye la inscripción al Festival de la Ciudad: un formulario que **le dice al usuario qué está mal, dónde y cómo arreglarlo**, en el momento justo y de una forma que también entiende quien usa un lector de pantalla. Primero se ve lo que el HTML valida solo; después, JavaScript se encarga de lo que el HTML no puede expresar.

- **Cómo se sigue:** en cada paso se **copia** el código, se **guarda**, se **recarga** la página y se **compara** lo que se ve (o lo que sale en la consola) con lo que aparece aquí. Después se lee *¿Qué pasó?*. Casi todos los pasos terminan con un **Pruebe**: un cambio pequeño que rompe algo a propósito, para ver por qué el código está escrito así. **Después de cada Pruebe, se deja el código como estaba.**
- **Quién escribe:** el teclado rota entre los integrantes del equipo como lo indique el docente. Quien no escribe, lee el paso en voz alta y revisa la salida.

| Paso | Qué se aprende |
| --- | --- |
| 0 | Preparar los archivos |
| 1 | La página de partida |
| 2 | Lo que el HTML ya valida solo |
| 3 | `:invalid` y `:user-invalid` |
| 4 | `novalidate` y `validity`: qué falla |
| 5 | Mensajes propios junto al campo |
| 6 | Reglas que el HTML no expresa |
| 7 | Revisar todo al enviar y llevar el foco al error |
| 8 | Validar en el momento justo |
| 9 | Revisión con teclado y accesibilidad |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome) y el editor de código.
- **La consola:** `F12` → pestaña *Consola*. Se deja abierta toda la práctica.
- **Recargar:** `F5` después de guardar cada cambio. Si algo no cambia, `Ctrl` + `F5`.

---

## Paso 0 · Los archivos

Dentro de la carpeta del proyecto, crear tres archivos vacíos: `registro.html`, `registro.css` y `registro.js`. Van en la entrega de hoy junto con el proyecto.

---

## Paso 1 · La página de partida

**Copie** en `registro.html`:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inscripción · Festival de la Ciudad</title>
  <link rel="stylesheet" href="registro.css">
  <script src="registro.js" defer></script>
</head>
<body>
  <main>
    <h1>Inscripción al Festival de la Ciudad</h1>
    <form id="registro">
      <label for="correo">Correo</label>
      <input id="correo" name="correo" type="email" required aria-describedby="error-correo">
      <p id="error-correo" class="error"></p>

      <label for="clave">Contraseña (mínimo 8 caracteres)</label>
      <input id="clave" name="clave" type="password" required minlength="8" aria-describedby="error-clave">
      <p id="error-clave" class="error"></p>

      <label for="confirmacion">Confirmar contraseña</label>
      <input id="confirmacion" name="confirmacion" type="password" required aria-describedby="error-confirmacion">
      <p id="error-confirmacion" class="error"></p>

      <label for="nacimiento">Fecha de nacimiento</label>
      <input id="nacimiento" name="nacimiento" type="date" required aria-describedby="error-nacimiento">
      <p id="error-nacimiento" class="error"></p>

      <label class="casilla"><input id="terminos" name="terminos" type="checkbox" required aria-describedby="error-terminos"> Acepto los términos</label>
      <p id="error-terminos" class="error"></p>

      <button type="submit">Crear cuenta</button>
      <p id="resumen" role="status"></p>
    </form>
  </main>
</body>
</html>
```

**Copie** en `registro.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; }
main { max-width: 32rem; margin: 0 auto; padding: 1rem; }

form { display: grid; gap: 0.25rem; }
label { margin-top: 0.75rem; font-weight: bold; }
.casilla { font-weight: normal; }
input { padding: 0.4rem; border: 2px solid #888; border-radius: 0.3rem; font: inherit; }
button { margin-top: 1rem; padding: 0.5rem; font: inherit; }

.error { margin: 0; min-height: 1.2em; color: #b00020; font-size: 0.9rem; }
```

`registro.js` se deja vacío por ahora.

**Abra** `registro.html` en el navegador y **compare**: cinco campos con su etiqueta, un botón «Crear cuenta» y nada en rojo. Debajo de cada campo hay un `<p class="error">` vacío: es donde van a aparecer los mensajes.

**¿Qué pasó?**

- **Cada campo tiene su `<label>`**, unido por `for` e `id`. Haga clic en la palabra «Correo»: el cursor salta al campo. La casilla de los términos lleva la etiqueta alrededor, así que también se marca haciendo clic en el texto.
- **`aria-describedby="error-correo"`** une el campo con el párrafo donde irá su mensaje. Todavía no se nota; en el Paso 9 se ve para qué sirve.

---

## Paso 2 · Lo que el HTML ya valida solo

Sin escribir nada de JavaScript, haga clic en **Crear cuenta** con el formulario vacío.

- Aparece un globo del navegador sobre el correo, del estilo de *«Completa este campo»*. El formulario no se envía.

Ahora llene el formulario **en este orden**, enviando después de cada cambio:

1. Correo `ana` → el globo pide una `@`.
2. Correo `ana@correo.com`, contraseña `abc` → el globo pide al menos 8 caracteres.
3. Contraseña `festival2026`, confirmación `otra-cosa`, una fecha de nacimiento de **hace cinco años** y la casilla marcada → **se envía**.

Al enviarse, la página se recarga, el formulario queda vacío y la barra de direcciones termina en algo como:

```text
registro.html?correo=ana%40correo.com&clave=festival2026&confirmacion=otra-cosa&nacimiento=2021-10-26&terminos=on
```

**¿Qué pasó?**

- **`required`, `type="email"` y `minlength`** ya validan solos: el navegador no deja enviar y avisa con su globo.
- **Lo que el HTML no sabe revisar:** que las dos contraseñas coincidan y que la persona tenga la edad mínima, **14 años**. Pasaron con una confirmación distinta y un niño de cinco años. Eso es lo que hace JavaScript desde el Paso 6.
- **Los problemas del globo:** su texto depende del navegador y del idioma del sistema, desaparece en segundos y no se le puede dar estilo.
- La contraseña quedó **a la vista en la dirección**. Un formulario real nunca se envía así: va a un servidor por `POST` y con HTTPS. El de hoy no se va a enviar a ningún lado; lo maneja JavaScript.

**Pruebe:** recargue la página sin los datos (borre todo lo que está después del `?` en la dirección). En el *Inspector* (*Elementos* en Chrome), busque el `<input id="correo">`, haga doble clic sobre el atributo `required` y bórrelo. Ahora envíe con el correo vacío y el resto lleno: **pasa**.

- Cualquiera puede saltarse la validación del navegador desde las herramientas. La validación **ayuda al usuario**, no protege nada: el servidor siempre vuelve a validar.

Recargue la página para recuperar el `required`.

---

## Paso 3 · `:invalid` y `:user-invalid`

**Agregue** al final de `registro.css`:

```css
input:invalid { border-color: #b00020; }
```

**Recargue**, sin tocar nada: **los cuatro campos de texto ya están en rojo** (la casilla no muestra borde).

**Cambie** `:invalid` por `:user-invalid` y recargue:

- Al cargar no hay nada en rojo.
- Escriba `ana` en el correo y pase al siguiente campo con `Tab`: el correo se pone rojo.

**¿Qué pasó?**

- **`:invalid`** se cumple siempre que el campo no pasa su validación, y un campo `required` vacío ya es inválido **al cargar la página**. Pintar en rojo un formulario que nadie ha tocado es regañar antes de tiempo.
- **`:user-invalid`** se cumple solo cuando el campo es inválido **y el usuario ya lo tocó**. Es la que se usa.

Deje `:user-invalid`; en el Paso 5 se reemplaza.

---

## Paso 4 · `novalidate` y `validity`: qué falla

En `registro.html`, **agregue** `novalidate` a la etiqueta del formulario:

```html
<form id="registro" novalidate>
```

**Copie** en `registro.js`:

```javascript
const formulario = document.getElementById("registro");
const correo = document.getElementById("correo");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("valueMissing:", correo.validity.valueMissing, "· typeMismatch:", correo.validity.typeMismatch);
});
```

**Recargue** y envíe tres veces, cambiando solo el correo. En la consola:

| Correo | Consola |
| --- | --- |
| *(vacío)* | `valueMissing: true · typeMismatch: false` |
| `ana` | `valueMissing: false · typeMismatch: true` |
| `ana@correo.com` | `valueMissing: false · typeMismatch: false` |

Ya no aparece ningún globo, y la página no se recarga.

**¿Qué pasó?**

- **`novalidate`** apaga los globos del navegador: desde ahora los mensajes los pone el código. El navegador **sigue revisando** los campos; solo deja de mostrar su globo.
- **`event.preventDefault()`** evita que el formulario se envíe y recargue la página.
- **`campo.validity`** dice **qué** falla: `valueMissing` es «está vacío», `typeMismatch` es «no tiene la forma de un correo». Hay más: `tooShort`, `rangeUnderflow`, `patternMismatch`… Con eso se escribe **un mensaje distinto para cada causa**.

**Pruebe:** envíe con el correo `ana@correo`, sin `.com`. La consola dice `valueMissing: false · typeMismatch: false`.

- Para el navegador ese correo es válido: solo exige algo antes y después de la `@`. Si el formulario necesitara un punto después de la `@`, sería una regla propia, escrita en JavaScript.

---

## Paso 5 · Mensajes propios junto al campo

En `registro.css`, **reemplace** la regla de `:user-invalid` por:

```css
[aria-invalid="true"] { border-color: #b00020; }
```

En `registro.js`, **reemplace** el escuchador del Paso 4 (deje las dos primeras líneas, `formulario` y `correo`) por:

```javascript
const clave = document.getElementById("clave");

// Un mensaje por cada causa; "" significa que está bien
function mensajeCorreo() {
  if (correo.validity.valueMissing) return "Escribe tu correo.";
  if (correo.validity.typeMismatch) return "El correo debe tener la forma nombre@dominio.com.";
  return "";
}

function mensajeClave() {
  if (clave.validity.valueMissing) return "Escribe una contraseña.";
  if (clave.value.length < 8) return `Faltan ${8 - clave.value.length} caracteres.`;
  return "";
}

// Marcar o desmarcar un campo: para el navegador, para la vista y para el lector de pantalla
function marcar(campo, mensaje) {
  campo.setCustomValidity(mensaje);
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  const error = document.getElementById(campo.getAttribute("aria-describedby"));
  error.textContent = mensaje ? `⚠ ${mensaje}` : "";
  return mensaje === "";
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  marcar(correo, mensajeCorreo());
  marcar(clave, mensajeClave());
});
```

**Recargue** y **compare**:

| Correo | Contraseña | Lo que aparece al enviar |
| --- | --- | --- |
| *(vacío)* | *(vacío)* | `⚠ Escribe tu correo.` y `⚠ Escribe una contraseña.`, con los dos bordes en rojo |
| `ana` | `abc` | `⚠ El correo debe tener la forma nombre@dominio.com.` y `⚠ Faltan 5 caracteres.` |
| `ana@correo.com` | `festival2026` | Los dos mensajes desaparecen y los bordes vuelven al gris |

En el *Inspector*, el correo con error tiene `aria-invalid="true"`; corregido, `aria-invalid="false"`.

**¿Qué pasó?**

- **El mensaje va junto al campo**, en el `<p>` que nombra su `aria-describedby`: el usuario lo ve mientras corrige. `marcar` encuentra ese `<p>` leyendo el atributo, así que sirve para cualquier campo.
- **Un mensaje por causa, en español y diciendo cómo arreglarlo.** «Faltan 5 caracteres» ayuda más que «contraseña inválida».
- **`setCustomValidity(mensaje)`** le dice al navegador que el campo es inválido; con `""` lo vuelve válido. Los globos no salen por el `novalidate`, pero el navegador sigue sabiendo qué campo falla.
- **`aria-invalid`** hace dos trabajos: le avisa al lector de pantalla y es el gancho del CSS que pinta el borde. JavaScript no toca estilos, pone un atributo.
- **`marcar` devuelve `true` si el campo quedó bien.** Todavía no se usa; en el Paso 7 sí.

**Pruebe:** envíe con el correo vacío para ver el error. En Chrome: herramientas → menú ⋮ → *Más herramientas* → *Renderizado* → *Emular deficiencias de visión* → *Acromatopsia* (en Firefox: pestaña *Accesibilidad* → *Simular*). La página queda en grises.

- El borde rojo ya no se distingue del gris; lo que sigue diciendo que hay un error es el **`⚠` y el texto**. El color no basta: una parte de los usuarios no distingue bien el rojo.

Vuelva a *Sin emulación*.

---

## Paso 6 · Reglas que el HTML no expresa

**Agregue** debajo de `const clave = …`:

```javascript
const confirmacion = document.getElementById("confirmacion");
const nacimiento = document.getElementById("nacimiento");
const terminos = document.getElementById("terminos");
```

**Agregue** debajo de `mensajeClave`:

```javascript
// Regla propia 1: un campo comparado con otro
function mensajeConfirmacion() {
  if (confirmacion.value === "") return "Repite la contraseña.";
  if (confirmacion.value !== clave.value) return "Las contraseñas no coinciden.";
  return "";
}

// Regla propia 2: la edad, calculada desde la fecha
function edad(textoFecha) {
  const fecha = new Date(`${textoFecha}T00:00`);
  const hoy = new Date();
  const anios = hoy.getFullYear() - fecha.getFullYear();
  const yaCumplio = hoy.getMonth() > fecha.getMonth()
    || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() >= fecha.getDate());
  return yaCumplio ? anios : anios - 1;
}

function mensajeNacimiento() {
  if (nacimiento.validity.valueMissing) return "Escoge tu fecha de nacimiento.";
  if (edad(nacimiento.value) < 14) return "Debes tener al menos 14 años.";
  return "";
}

function mensajeTerminos() {
  return terminos.checked ? "" : "Debes aceptar los términos para continuar.";
}
```

Y en el escuchador de `submit`, **agregue** tres líneas debajo de las dos que ya marcan:

```javascript
  marcar(confirmacion, mensajeConfirmacion());
  marcar(nacimiento, mensajeNacimiento());
  marcar(terminos, mensajeTerminos());
```

**Recargue**, llene correo y contraseña bien, y envíe con:

| Confirmación | Nacimiento | Términos | Lo que aparece |
| --- | --- | --- | --- |
| *(vacía)* | *(vacío)* | sin marcar | `⚠ Repite la contraseña.`, `⚠ Escoge tu fecha de nacimiento.` y `⚠ Debes aceptar los términos para continuar.` |
| `festival2025` | hace **diez** años | sin marcar | `⚠ Las contraseñas no coinciden.`, `⚠ Debes tener al menos 14 años.` y el de los términos |
| `festival2026` | hace **veinte** años | marcada | Ningún mensaje |

**¿Qué pasó?**

- **Las dos reglas nuevas comparan un campo con otro** (la confirmación con la contraseña) **o calculan algo** (la edad desde la fecha). Ningún atributo de HTML puede decir «igual al campo de arriba» ni «al menos 14 años desde hoy»: por eso hace falta JavaScript.
- **`edad`** resta los años y quita uno si este año todavía no llegó el cumpleaños.
- **Los términos** son una casilla: se revisa `checked`, no `value`.

**Pruebe:** escriba en la consola, una por una:

```javascript
new Date("2010-05-01")
new Date("2010-05-01T00:00")
```

Con el computador en hora de Colombia, la consola muestra algo como:

```text
Fri Apr 30 2010 19:00:00 GMT-0500 (hora estándar de Colombia)
Sat May 01 2010 00:00:00 GMT-0500 (hora estándar de Colombia)
```

- **Sin `T00:00`, la fecha se lee como medianoche UTC**, que en Colombia son las 7 de la noche **del día anterior**. Con esa fecha, quien cumple 14 años hoy aparecería con 13. Con `T00:00`, la fecha se lee en la hora local y el día no se corre.

---

## Paso 7 · Revisar todo al enviar y llevar el foco al error

**Agregue** debajo de `mensajeTerminos`:

```javascript
// Cada campo, por su name, con la función que da su mensaje
const reglas = {
  correo: mensajeCorreo,
  clave: mensajeClave,
  confirmacion: mensajeConfirmacion,
  nacimiento: mensajeNacimiento,
  terminos: mensajeTerminos,
};

function validar(campo) {
  return marcar(campo, reglas[campo.name]());
}
```

**Reemplace** el escuchador de `submit` completo por:

```javascript
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const resumen = document.getElementById("resumen");
  const campos = [correo, clave, confirmacion, nacimiento, terminos];
  const errores = campos.filter((campo) => !validar(campo));

  if (errores.length > 0) {
    resumen.textContent = errores.length === 1
      ? "Hay 1 campo por corregir."
      : `Hay ${errores.length} campos por corregir.`;
    errores[0].focus();
    return;
  }

  resumen.textContent = "Cuenta creada.";
  formulario.reset();
});
```

**Recargue** y **compare**:

- Envíe vacío: aparecen los cinco mensajes, abajo dice *Hay 5 campos por corregir.* y **el cursor queda en el correo**.
- Llene solo el correo y envíe: *Hay 4 campos por corregir.* y el cursor salta a la contraseña.
- Llene todo bien y envíe: *Cuenta creada.* y el formulario queda limpio.

**¿Qué pasó?**

- **`reglas`** une el `name` de cada campo con su función. `validar(campo)` busca la regla por el nombre, la aplica y marca el campo: una sola función para los cinco.
- **`filter` deja en `errores` los campos que no pasaron**, en el orden del formulario. `errores[0]` es el primero con error, y `focus()` lleva el cursor ahí: quien usa teclado no tiene que buscarlo.
- **El resumen va en `role="status"`:** el lector de pantalla lo lee sin mover el foco.
- **`errores.length === 1`** evita el «Hay 1 campos».

**Pruebe:** recargue **sin enviar nada** y escriba en la consola:

```javascript
validar(correo) && validar(clave) && validar(confirmacion)
```

La consola dice `false`, y **solo el correo** muestra su mensaje. Recargue otra vez y escriba:

```javascript
[correo, clave, confirmacion].filter((campo) => !validar(campo)).length
```

La consola dice `3`, y los tres muestran su mensaje.

- **`&&` se detiene en el primer `false`**: no llega a validar los demás. Con `&&` en el `submit`, el usuario corrige un campo, envía y le aparece el siguiente, uno por uno. **`filter` recorre todos**, así que todos los errores se ven de una vez.

---

## Paso 8 · Validar en el momento justo

Hasta ahora solo se valida al enviar. **Agregue** al final de `registro.js`:

```javascript
// Al salir del campo: el usuario terminó de escribir, ahora sí es justo avisar
formulario.addEventListener("focusout", (event) => {
  if (reglas[event.target.name]) validar(event.target);
});

// Al corregir: solo si el campo ya estaba marcado, para quitar el error apenas se arregla
formulario.addEventListener("input", (event) => {
  const campo = event.target;
  if (campo.getAttribute("aria-invalid") === "true") validar(campo);
  if (campo === clave && confirmacion.value) validar(confirmacion);
});
```

**Recargue** y **compare**:

1. Escriba `ana` en el correo. Mientras escribe, no aparece nada. Pulse `Tab`: aparece `⚠ El correo debe tener la forma nombre@dominio.com.`
2. Vuelva al correo y siga escribiendo hasta `ana@c`: **el mensaje desaparece con esa letra**, sin salir del campo.
3. Escriba `festival2026` en la contraseña y en la confirmación, y pase con `Tab`: sin errores. Vuelva a la contraseña y agréguele un `!` al final: **la confirmación se marca** con `⚠ Las contraseñas no coinciden.` aunque nadie la tocó.

**¿Qué pasó?**

- **Tres momentos, tres eventos:** `submit` revisa todo; `focusout` avisa al salir de un campo; `input` quita el error mientras se corrige.
- **`focusout` e `input` suben por el árbol**, así que un solo escuchador en el formulario atiende los cinco campos: es **delegación**. Por eso se usa `focusout` y no `blur`: `blur` no sube.
- **`if (reglas[event.target.name])`** deja pasar solo los campos que tienen regla. Al salir del botón «Crear cuenta», que no tiene `name`, no pasa nada.
- **La última línea** revisa la confirmación cuando cambia la contraseña: si no, la confirmación seguiría marcada como correcta aunque ya no coincida.

**Pruebe 1:** en el escuchador de `input`, cambie la línea

```javascript
  if (campo.getAttribute("aria-invalid") === "true") validar(campo);
```

por solo `validar(campo);`. Recargue y escriba `a` en el correo: **el error aparece con la primera letra**, cuando el usuario apenas empieza. Vuelva a poner el `if`.

**Pruebe 2:** borre la última línea del escuchador de `input`. Repita el punto 3 de la comparación: después de agregarle el `!` a la contraseña, la confirmación **no se marca** aunque ya no coincide. Vuelva a poner la línea.

---

## Paso 9 · Revisión con teclado y accesibilidad

Deje el ratón quieto y recorra el formulario **solo con `Tab`, `Espacio` y `Enter`**:

- [ ] `Tab` pasa por los cinco campos y el botón, en orden.
- [ ] `Espacio` marca y desmarca la casilla de los términos.
- [ ] `Enter` en el correo o en una contraseña envía el formulario.
- [ ] Al enviar con errores, el cursor queda en el primer campo con error.

Ahora envíe vacío, haga clic en el correo y abra en el *Inspector* la pestaña **Accesibilidad** (en Chrome, dentro de *Elementos*, a la derecha):

- [ ] La **descripción** del campo es `⚠ Escribe tu correo.`: es el texto del `<p>` que nombra `aria-describedby`.
- [ ] El campo aparece como **inválido**, por el `aria-invalid`.

Eso es lo que oye un lector de pantalla al llegar al campo: el nombre (de la `<label>`), que es inválido y el mensaje. Sin `aria-describedby`, oiría solo «Correo».

---

## El `registro.js` completo

Así queda al final del Paso 8. Si algo no funciona, se compara contra esto.

```javascript
const formulario = document.getElementById("registro");
const correo = document.getElementById("correo");
const clave = document.getElementById("clave");
const confirmacion = document.getElementById("confirmacion");
const nacimiento = document.getElementById("nacimiento");
const terminos = document.getElementById("terminos");

// Un mensaje por cada causa; "" significa que está bien
function mensajeCorreo() {
  if (correo.validity.valueMissing) return "Escribe tu correo.";
  if (correo.validity.typeMismatch) return "El correo debe tener la forma nombre@dominio.com.";
  return "";
}

function mensajeClave() {
  if (clave.validity.valueMissing) return "Escribe una contraseña.";
  if (clave.value.length < 8) return `Faltan ${8 - clave.value.length} caracteres.`;
  return "";
}

// Regla propia 1: un campo comparado con otro
function mensajeConfirmacion() {
  if (confirmacion.value === "") return "Repite la contraseña.";
  if (confirmacion.value !== clave.value) return "Las contraseñas no coinciden.";
  return "";
}

// Regla propia 2: la edad, calculada desde la fecha
function edad(textoFecha) {
  const fecha = new Date(`${textoFecha}T00:00`);
  const hoy = new Date();
  const anios = hoy.getFullYear() - fecha.getFullYear();
  const yaCumplio = hoy.getMonth() > fecha.getMonth()
    || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() >= fecha.getDate());
  return yaCumplio ? anios : anios - 1;
}

function mensajeNacimiento() {
  if (nacimiento.validity.valueMissing) return "Escoge tu fecha de nacimiento.";
  if (edad(nacimiento.value) < 14) return "Debes tener al menos 14 años.";
  return "";
}

function mensajeTerminos() {
  return terminos.checked ? "" : "Debes aceptar los términos para continuar.";
}

// Cada campo, por su name, con la función que da su mensaje
const reglas = {
  correo: mensajeCorreo,
  clave: mensajeClave,
  confirmacion: mensajeConfirmacion,
  nacimiento: mensajeNacimiento,
  terminos: mensajeTerminos,
};

// Marcar o desmarcar un campo: para el navegador, para la vista y para el lector de pantalla
function marcar(campo, mensaje) {
  campo.setCustomValidity(mensaje);
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  const error = document.getElementById(campo.getAttribute("aria-describedby"));
  error.textContent = mensaje ? `⚠ ${mensaje}` : "";
  return mensaje === "";
}

function validar(campo) {
  return marcar(campo, reglas[campo.name]());
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const resumen = document.getElementById("resumen");
  const campos = [correo, clave, confirmacion, nacimiento, terminos];
  const errores = campos.filter((campo) => !validar(campo));

  if (errores.length > 0) {
    resumen.textContent = errores.length === 1
      ? "Hay 1 campo por corregir."
      : `Hay ${errores.length} campos por corregir.`;
    errores[0].focus();
    return;
  }

  resumen.textContent = "Cuenta creada.";
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
  if (campo === clave && confirmacion.value) validar(confirmacion);
});
```

**Tres escuchadores** (`submit`, `focusout` e `input`, los tres en el formulario) y **una función por regla**. Para agregar un campo nuevo: su HTML con `name` y `aria-describedby`, su función de mensaje y una línea en `reglas`.

## Del ejercicio al reto

Lo que se hizo aquí es lo que pide el reto de hoy sobre el proyecto, con otro formulario:

| En la inscripción | En el reto |
| --- | --- |
| `mensajeCorreo`, `mensajeClave`: un mensaje por cada causa | Un mensaje en español por cada causa, en cada campo del formulario del tema |
| La confirmación y la edad, reglas que el HTML no expresa | Al menos dos reglas propias: comparar fechas, contar casillas, no repetir un nombre… |
| `marcar`: `setCustomValidity`, `aria-invalid` y el `⚠` junto al campo | `marcar` sirve tal cual |
| `submit`, `focusout` e `input` en el formulario, foco en el primer error | Lo mismo |

**Dos diferencias:** el formulario del reto tiene que tener sentido en el tema del proyecto (sugerir, calificar, armar un equipo, planear con fechas), y si una regla revisa **un grupo de casillas**, el grupo lleva un solo mensaje para todas, no uno por casilla.
