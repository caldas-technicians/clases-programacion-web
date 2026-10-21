# Eventos paso a paso — la página del festival

Guía de la práctica guiada sobre eventos. Se construye, desde una página que no hace nada, la página de un festival que responde al usuario: un menú que abre y cierra, pestañas, y una agenda a la que se le agregan y quitan actividades. **Toda la página funciona con seis escuchadores**, sin importar cuántas actividades tenga.

- **Cómo se sigue:** en cada paso se **copia** el código, se **guarda**, se **recarga** la página y se **compara** lo que se ve (o lo que sale en la consola) con lo que aparece aquí. Después se lee *¿Qué pasó?*. Casi todos los pasos terminan con un **Pruebe**: un cambio pequeño que rompe algo a propósito, para ver por qué el código está escrito así. **Después de cada Pruebe, se deja el código como estaba.**
- **Quién escribe:** el teclado rota entre los integrantes del equipo en cada paso. Quien no escribe, lee el paso en voz alta y revisa la salida.

| Paso | Qué se aprende |
| --- | --- |
| 0 | Preparar la carpeta |
| 1 | La página de partida |
| 2 | El objeto `event`: `type`, `target`, `currentTarget` |
| 3 | Abrir y cerrar el menú |
| 4 | Cerrar con `Escape` |
| 5 | El clic sube: propagación |
| 6 | Pestañas con un solo escuchador y `closest` |
| 7 | Formulario y `preventDefault` |
| 8 | Delegación en una lista que cambia |
| 9 | Revisión con teclado |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome) y el editor de codigo.
- **La consola:** `F12` → pestaña *Consola*. Se deja abierta toda la práctica.
- **Recargar:** `F5` después de guardar cada cambio. Si algo no cambia, `Ctrl` + `F5`.

---

## Paso 0 · La carpeta

Crear una carpeta vacía, `practica-eventos/`, con tres archivos vacíos: `index.html`, `styles.css` y `app.js`.  Antes de continuar abra un navegador y vaya analizando como se va construyendo la página web.

---

## Paso 1 · La página de partida

**Copie** en `index.html`:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Festival de la Ciudad</title>
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <header id="cabecera">
    <strong>Festival de la Ciudad</strong>
    <button type="button" id="boton-menu" aria-expanded="false" aria-controls="menu">
      <span class="icono" aria-hidden="true">☰</span> Menú
    </button>
    <ul id="menu" class="menu">
      <li><a href="#programa">Programa</a></li>
      <li><a href="#agenda">Mi agenda</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  </header>

  <main>
    <section id="programa">
      <h2>Programa</h2>
      <div role="tablist" id="pestanas">
        <button type="button" role="tab" data-panel="viernes" aria-selected="true">Viernes</button>
        <button type="button" role="tab" data-panel="sabado" aria-selected="false">Sábado <span class="nuevo">nuevo</span></button>
        <button type="button" role="tab" data-panel="domingo" aria-selected="false">Domingo</button>
      </div>
      <div id="viernes" role="tabpanel">
        <p>18:00 · Concierto de apertura · Plaza principal</p>
      </div>
      <div id="sabado" role="tabpanel" hidden>
        <p>10:00 · Taller de muralismo · Parque central</p>
        <p>15:00 · Feria gastronómica · Calle del comercio</p>
      </div>
      <div id="domingo" role="tabpanel" hidden>
        <p>09:00 · Caminata ecológica · Salida desde la plaza</p>
      </div>
    </section>

    <section id="agenda">
      <h2>Mi agenda</h2>
      <form id="form-actividad">
        <label for="campo-actividad">Actividad</label>
        <input id="campo-actividad" autocomplete="off">
        <button type="submit">Agregar</button>
      </form>
      <p id="contador"></p>
      <ul id="lista-agenda"></ul>
    </section>
  </main>

  <footer id="contacto">
    <p>Festival de la Ciudad · Oficina de cultura</p>
  </footer>
</body>
</html>
```

**Copie** en `styles.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; }

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem;
  background: #20304a;
  color: white;
}
header a { color: white; }

.menu { display: none; width: 100%; margin: 0; padding: 0; list-style: none; }
.menu.abierto { display: block; }

main { padding: 1rem; }

[role="tab"][aria-selected="true"] { font-weight: bold; border-bottom: 3px solid #20304a; }
.nuevo { padding: 0 0.3rem; border-radius: 0.3rem; background: #f5c542; font-size: 0.7rem; }

li.interesa { background: #fff3c4; }
button[aria-pressed="true"] { font-weight: bold; }

@media (min-width: 700px) {
  .menu, .menu.abierto { display: flex; gap: 1rem; width: auto; }
  #boton-menu { display: none; }
}
```

`app.js` se deja vacío por ahora.

**Abra** `index.html` en el navegador y **compare**:

- Con la ventana **angosta** *(menos de 700 px; achíquela o use el modo responsive con `Ctrl` + `Shift` + `M`)*: se ve el botón «☰ Menú», pero el menú no aparece.
- Con la ventana **ancha**: el botón desaparece y el menú queda fijo en la cabecera.
- Las pestañas muestran solo el viernes. La agenda está vacía.

**¿Qué pasó?**

- **El CSS ya decide qué se ve:** el menú se muestra cuando tiene la clase `abierto`, y en pantalla ancha siempre. A JavaScript solo le va a tocar **poner y quitar clases y atributos**.
- Los botones no hacen nada: ningún elemento tiene escuchador todavía.

---

## Paso 2 · El objeto `event`

**Copie** en `app.js`:

```javascript
const botonMenu = document.getElementById("boton-menu");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", (event) => {
  console.log("type:", event.type);
  console.log("target:", event.target.tagName);
  console.log("currentTarget:", event.currentTarget.tagName);
});
```

**Recargue** con la ventana angosta y haga clic sobre la palabra **Menú**. En la consola:

```text
type: click
target: BUTTON
currentTarget: BUTTON
```

**Pruebe:** haga clic ahora sobre el **ícono ☰**:

```text
type: click
target: SPAN
currentTarget: BUTTON
```

**¿Qué pasó?**

- **`target` es lo que se tocó; `currentTarget` es quien escucha.** El escuchador está en el botón, pero el ícono es un `<span>` dentro del botón, y el clic cayó ahí.
- El escuchador se ejecutó igual: **un clic en el ícono también es un clic en el botón** que lo contiene. Esa idea vuelve en los pasos 5 y 6.

---

## Paso 3 · Abrir y cerrar el menú

**Reemplace** el escuchador del Paso 2 (deje las dos primeras líneas, `botonMenu` y `menu`) por:

```javascript
function cerrarMenu() {
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
}

botonMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});
```

**Recargue** y haga clic en «Menú» dos veces. **Compare** en la pestaña *Inspector* (*Elementos* en Chrome):

- Primer clic: el menú aparece, `<ul id="menu" class="menu abierto">` y el botón dice `aria-expanded="true"`.
- Segundo clic: el menú se oculta, `class="menu"` y `aria-expanded="false"`.

**¿Qué pasó?**

- **`classList.toggle` pone la clase si no está y la quita si está**, y devuelve `true` si quedó puesta. Con ese valor se actualiza `aria-expanded`, que le dice al lector de pantalla si el menú está abierto.
- `cerrarMenu` todavía no se usa: es para los dos pasos siguientes.

**Pruebe:** abra el menú y **ensanche** la ventana. El menú pasa a la cabecera y el botón desaparece; vuelva a achicarla y el menú sigue abierto. Ninguna línea de JavaScript se ocupa del tamaño de la pantalla: eso es del CSS.

---

## Paso 4 · Cerrar con `Escape`

**Agregue** al final de `app.js`:

```javascript
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarMenu();
});
```

**Recargue**, abra el menú con un clic y pulse `Escape`: el menú se cierra.

**¿Qué pasó?**

- **`event.key`** dice qué tecla se pulsó: `"Escape"`, `"Enter"`, `"a"`.
- El escuchador está en `document`, no en el menú. Todo lo que se abre se tiene que poder cerrar con teclado, sin importar dónde esté el foco.

**Pruebe:** cambie `document.addEventListener` por `menu.addEventListener`. Abra el menú con un clic y pulse `Escape`: **no se cierra.**

- La tecla ocurre en el elemento **que tiene el foco**, y ese es el botón «Menú», al que se le acaba de hacer clic.
- Desde el botón, el evento sube por sus ancestros: `header` → `body` → `html` → `document`. **El menú no es ancestro del botón**, así que nunca se entera. Por eso el escuchador va en `document`, que es ancestro de todo.

Deje `document` otra vez.

---

## Paso 5 · El clic sube: propagación

Al escoger una opción del menú, el menú debería cerrarse. En lugar de poner un escuchador en cada enlace, se pone uno solo en el menú.

**Agregue** al final de `app.js`:

```javascript
menu.addEventListener("click", (event) => {
  console.log("menu escuchó un clic en:", event.target.tagName);
  if (event.target.closest("a")) cerrarMenu();
});

document.getElementById("cabecera").addEventListener("click", (event) => {
  console.log("cabecera escuchó un clic en:", event.target.tagName);
});
```

**Recargue**, limpie la consola (ícono de la papelera), abra el menú y haga clic en **Programa**:

```text
cabecera escuchó un clic en: BUTTON
menu escuchó un clic en: A
cabecera escuchó un clic en: A
```

El menú se cierra y la página baja hasta el programa.

**¿Qué pasó?**

- **Primera línea:** el clic en el botón «Menú» también le llegó a la cabecera, porque el botón está dentro de ella.
- **Segunda y tercera:** el clic en el enlace lo oyó primero el menú y después la cabecera. **El evento sube** desde lo que se tocó hasta `document`: es la fase de **burbuja**.
- **`target` no cambia mientras sube:** quien escucha es otro, lo que se tocó sigue siendo el `<a>`.
- **`closest("a")`** sube desde lo tocado hasta el primer elemento (él mismo incluido) que sea un `<a>`. Si se hizo clic en el espacio entre dos opciones del menú, devuelve `null` y el menú no se cierra.

**Pruebe:** agregue `event.stopPropagation();` como primera línea del escuchador del menú. Limpie la consola, abra el menú y haga clic en **Programa**:

```text
cabecera escuchó un clic en: BUTTON
menu escuchó un clic en: A
```

- **La cabecera ya no se entera:** `stopPropagation` corta la subida. Cualquier otro código que escuchara más arriba deja de funcionar sin aviso, por eso casi nunca se usa.

Quite el `stopPropagation`. **Borre también el escuchador de la cabecera** y el `console.log` del menú: ya mostraron lo que tenían que mostrar.

---

## Paso 6 · Pestañas con un solo escuchador

**Agregue** al final de `app.js`:

```javascript
const pestanas = document.getElementById("pestanas");

pestanas.addEventListener("click", (event) => {
  const elegida = event.target.closest('[role="tab"]');
  if (!elegida) return;

  pestanas.querySelectorAll('[role="tab"]').forEach((pestana) => {
    const activa = pestana === elegida;
    pestana.setAttribute("aria-selected", String(activa));
    document.getElementById(pestana.dataset.panel).hidden = !activa;
  });
});
```

**Recargue** y haga clic en **Sábado** y luego en **Domingo**. **Compare:**

- Se ve solo el panel del día escogido, y esa pestaña queda en negrilla.
- En el Inspector, la pestaña escogida tiene `aria-selected="true"` y los otros dos paneles tienen el atributo `hidden`.

**¿Qué pasó?**

- **Un escuchador en el contenedor `#pestanas` maneja las tres pestañas.** Eso es la **delegación**: el clic sube desde la pestaña hasta el contenedor, y el contenedor averigua con `event.target` cuál se tocó.
- **`data-panel="sabado"`** en el HTML se lee en JavaScript como `pestana.dataset.panel`. Cada pestaña dice cuál es su panel, y el código no necesita conocer los nombres.
- **`hidden`** es un atributo de HTML: oculta el elemento sin CSS.

**Pruebe 1:** cambie `event.target.closest('[role="tab"]')` por solo `event.target`. Recargue y haga clic sobre la etiqueta amarilla **nuevo** de la pestaña Sábado: **desaparecen los tres paneles.**

- Lo tocado fue el `<span class="nuevo">`, no la pestaña. Ninguna pestaña es igual a ese `<span>`, así que el `forEach` ocultó todas.
- `closest` sube desde el `<span>` hasta el `<button role="tab">` que lo contiene. **Sin `closest`, la delegación se rompe** apenas un botón tenga algo adentro: un ícono, una etiqueta, una imagen.

Vuelva a poner `closest`.

**Pruebe 2:** en `index.html`, agregue una cuarta pestaña y su panel, **sin tocar `app.js`**:

```html
<button type="button" role="tab" data-panel="lunes" aria-selected="false">Lunes festivo</button>
```

```html
<div id="lunes" role="tabpanel" hidden>
  <p>11:00 · Desfile de cierre · Avenida principal</p>
</div>
```

La pestaña va dentro de `#pestanas`, después de Domingo; el panel, después del panel del domingo. Recargue: **la pestaña nueva funciona.** El escuchador está en el contenedor, así que cubre a cualquier pestaña que se agregue.

---

## Paso 7 · El formulario y `preventDefault`

La agenda arranca con tres actividades que vienen de un arreglo y el formulario agrega más.

**Agregue** al final de `app.js`:

```javascript
const formulario = document.getElementById("form-actividad");
const campo = document.getElementById("campo-actividad");
const lista = document.getElementById("lista-agenda");
const contador = document.getElementById("contador");

const actividades = ["Concierto de apertura", "Taller de muralismo", "Feria gastronómica"];

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  return boton;
}

function crearItem(nombre) {
  const item = document.createElement("li");
  const texto = document.createElement("span");
  texto.textContent = nombre;
  item.append(texto, crearBoton("Me interesa", "interesa"), crearBoton("Quitar", "quitar"));
  return item;
}

function actualizarContador() {
  contador.textContent = `Actividades en la agenda: ${lista.children.length}`;
}

lista.replaceChildren(...actividades.map(crearItem));
actualizarContador();

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = campo.value.trim();
  if (!nombre) return;
  lista.append(crearItem(nombre));
  actualizarContador();
  formulario.reset();
  campo.focus();
});
```

**Recargue.** La agenda muestra tres actividades y *Actividades en la agenda: 3*. Escriba `Cine al parque` y pulse **`Enter`** (no el botón):

- Aparece una cuarta actividad, el contador dice *4*, el campo queda vacío y con el cursor listo para escribir otra.
- Si el campo está vacío o solo tiene espacios, no pasa nada.

**¿Qué pasó?**

- **Se escucha `submit` en el formulario, no `click` en el botón.** Así `Enter` y el botón «Agregar» hacen lo mismo, sin código extra.
- **`event.preventDefault()`** cancela lo que el navegador haría por su cuenta al enviar un formulario: mandarlo a una dirección y **recargar la página**.
- Los botones «Me interesa» y «Quitar» todavía no hacen nada: `crearItem` solo pinta. El Paso 8 les da vida.

**Pruebe:** borre la línea `event.preventDefault();`, recargue y agregue una actividad.

- La actividad aparece un instante y **la página se recarga**: la agenda vuelve a sus tres actividades y en la barra de direcciones aparece un `?` al final.
- Ese `?` es el formulario enviándose a la misma página. Todo lo que JavaScript había agregado se perdió con la recarga.

Vuelva a poner `event.preventDefault();`.

---

## Paso 8 · Delegación en una lista que cambia

**Agregue** al final de `app.js`:

```javascript
lista.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;
  const item = boton.closest("li");

  if (boton.dataset.accion === "interesa") {
    const marcada = item.classList.toggle("interesa");
    boton.setAttribute("aria-pressed", String(marcada));
  }
  if (boton.dataset.accion === "quitar") {
    item.remove();
    actualizarContador();
  }
});
```

**Recargue** y **compare:**

- «Me interesa» pinta la actividad de amarillo y pone el botón en negrilla; otro clic la desmarca.
- «Quitar» borra la actividad y el contador baja.
- Agregue `Cine al parque` con el formulario y pulse su «Me interesa»: **funciona**, aunque esa actividad no existía cuando se registró el escuchador.

**¿Qué pasó?**

- **Un solo escuchador en `#lista-agenda` maneja los botones de todas las actividades**, las de ahora y las que se agreguen después. Con escuchadores en cada botón, cada actividad nueva necesitaría registrar los suyos, y con 500 actividades serían 1000.
- **`data-accion`** dice qué hace cada botón; el escuchador solo pregunta cuál se tocó. Para agregar una acción nueva no se toca `crearItem`, se agrega un `if`.
- **Dos veces `closest`:** la primera, de lo tocado al botón; la segunda, del botón a su actividad (`li`).
- **`aria-pressed`** le dice al lector de pantalla que «Me interesa» es un botón que queda marcado o desmarcado.

**Pruebe:** haga clic en el **texto** de una actividad, no en sus botones. No pasa nada: `closest("button[data-accion]")` devuelve `null` y la línea `if (!boton) return;` termina el escuchador. Sin esa línea, la siguiente (`boton.closest`) fallaría con un error en la consola. Quítela y compruébelo; después vuelva a ponerla.

---

## Paso 9 · Revisión con teclado

Ponga la ventana angosta, deje el ratón quieto y recorra la página **solo con `Tab`, `Enter` y `Escape`**:

- [ ] `Tab` llega al botón «Menú»; `Enter` lo abre y `Escape` lo cierra.
- [ ] `Tab` llega a las pestañas y `Enter` cambia de día.
- [ ] El campo de la agenda acepta una actividad con `Enter`.
- [ ] `Tab` llega a «Me interesa» y «Quitar» de cada actividad, y `Enter` los activa.

Todo se alcanza porque **todo lo interactivo es un `<button>`, un `<a>` o un campo de formulario.** Si se hubiera usado un `<div>` con escuchador, `Tab` lo saltaría.

---

## El `app.js` completo

Así queda al final del Paso 8. Si algo no funciona, se compara contra esto.

```javascript
const botonMenu = document.getElementById("boton-menu");
const menu = document.getElementById("menu");

function cerrarMenu() {
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
}

botonMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarMenu();
});

menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) cerrarMenu();
});

const pestanas = document.getElementById("pestanas");

pestanas.addEventListener("click", (event) => {
  const elegida = event.target.closest('[role="tab"]');
  if (!elegida) return;

  pestanas.querySelectorAll('[role="tab"]').forEach((pestana) => {
    const activa = pestana === elegida;
    pestana.setAttribute("aria-selected", String(activa));
    document.getElementById(pestana.dataset.panel).hidden = !activa;
  });
});

const formulario = document.getElementById("form-actividad");
const campo = document.getElementById("campo-actividad");
const lista = document.getElementById("lista-agenda");
const contador = document.getElementById("contador");

const actividades = ["Concierto de apertura", "Taller de muralismo", "Feria gastronómica"];

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  return boton;
}

function crearItem(nombre) {
  const item = document.createElement("li");
  const texto = document.createElement("span");
  texto.textContent = nombre;
  item.append(texto, crearBoton("Me interesa", "interesa"), crearBoton("Quitar", "quitar"));
  return item;
}

function actualizarContador() {
  contador.textContent = `Actividades en la agenda: ${lista.children.length}`;
}

lista.replaceChildren(...actividades.map(crearItem));
actualizarContador();

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = campo.value.trim();
  if (!nombre) return;
  lista.append(crearItem(nombre));
  actualizarContador();
  formulario.reset();
  campo.focus();
});

lista.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;
  const item = boton.closest("li");

  if (boton.dataset.accion === "interesa") {
    const marcada = item.classList.toggle("interesa");
    boton.setAttribute("aria-pressed", String(marcada));
  }
  if (boton.dataset.accion === "quitar") {
    item.remove();
    actualizarContador();
  }
});
```

**Seis escuchadores** (botón del menú, `document`, menú, pestañas, formulario y lista), y ninguno dentro de `crearItem`. La página puede tener tres actividades o trescientas.

## Del ejercicio al reto

Lo que se hizo aquí es lo que pide el reto de hoy sobre el proyecto, con otros datos:

| En el festival | En el reto |
| --- | --- |
| Un escuchador en `#lista-agenda` y `data-accion` en los botones | Un escuchador en `#galeria` para «Ver detalle» y «Quitar» |
| Un escuchador en `#pestanas` que lee `data-panel` | Un escuchador en `#categorias` que lee la categoría escogida |
| `aria-pressed` en «Me interesa» | `aria-pressed` en el botón de la categoría activa |
| `Escape` en `document` y la revisión del Paso 9 | El detalle abre con `Enter` y cierra con `Escape` |

**Dos diferencias:** en el reto los botones de categoría se **generan desde los datos** (no se escriben en el HTML), y el detalle se muestra en un `<dialog>` que se vio en la explicación.
