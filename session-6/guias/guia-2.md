# Módulos paso a paso — los pendientes del festival en partes

Segunda guía de la práctica sobre almacenamiento. Se parte de la lista de pendientes que quedó armada en la guía anterior, en la misma carpeta `tareas/` y con los mismos archivos. Su `app.js` ya pasa de cien líneas y mezcla cuatro trabajos: leer y guardar, dibujar, el borrador y los eventos. Aquí se parte en **módulos**, archivos con una sola responsabilidad que **exportan** lo que ofrecen e **importan** lo que necesitan. La página no cambia en nada para el usuario; lo que cambia es dónde está cada cosa.

- **Cómo se sigue:** en cada paso se **copia** el código, se **guarda**, se **recarga** la página y se **compara** lo que se ve (o lo que sale en la consola) con lo que aparece aquí. Después se lee *¿Qué pasó?*. Casi todos los pasos terminan con un **Pruebe**: un cambio pequeño que rompe algo a propósito, para ver por qué el código está escrito así. **Después de cada Pruebe, se deja el código como estaba.**
- **Quién escribe:** el teclado rota entre los integrantes del equipo como lo indique el docente. Quien no escribe, lee el paso en voz alta y revisa la salida.
- **Probar después de cada paso:** la lista tiene que seguir funcionando igual. Si algo se rompe, se arregla antes de seguir.

| Paso | Qué se aprende |
| --- | --- |
| 0 | El punto de partida |
| 1 | `type="module"`: `app.js` entra a `js/` |
| 2 | Por qué no se abre con doble clic |
| 3 | El primer módulo: `almacenamiento.js` |
| 4 | `interfaz.js`: dibujar sin conocer el estado |
| 5 | Un módulo por componente: `borrador.js` |
| 6 | Lo que queda en `app.js` |
| 7 | Revisión: prueba de daño y teclado |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome) y el editor de código.
- **La consola:** `F12` → pestaña *Consola*. Se deja abierta toda la práctica.
- **Recargar:** `F5` después de guardar cada cambio. Si algo no cambia, `Ctrl` + `F5`.
- **El servidor local**, el mismo de la guía anterior: Live Server, o `python -m http.server` en la carpeta del proyecto. En esta guía ya no es opcional.

---

## Paso 0 · El punto de partida

Abra la lista de la guía anterior con el servidor local y revise que funciona: agregar, «Hecha», «Quitar», el tema y el borrador. Deje dos o tres tareas guardadas y una marcada como hecha: así se ve en cada paso que nada se perdió.

Dentro de `tareas/`, **cree** la carpeta `js/`. Al final de la guía la carpeta queda así:

```text
tareas/
├── index.html
├── styles.css
└── js/
    ├── app.js             el estado y los eventos: arranca todo
    ├── almacenamiento.js  leer y guardar en el navegador
    ├── interfaz.js        crear nodos y pintar
    └── borrador.js        el texto a medio escribir
```

---

## Paso 1 · `type="module"`: `app.js` entra a `js/`

**Mueva** `app.js` dentro de la carpeta `js/`, sin cambiarle nada. En `index.html`, **reemplace** la línea del `<script>` por:

```html
  <script type="module" src="js/app.js"></script>
```

**Recargue** y **compare**: la página es la misma, con las tareas y el tema que tenía. Agregar, «Hecha», «Quitar» y el tema funcionan igual.

**¿Qué pasó?**

- **`type="module"`** carga `app.js` como **módulo**. Por ahora es el único y no importa nada, pero desde el Paso 3 va a poder usar `import`. Sin ese atributo, `import` es un error de sintaxis.
- **Se quitó `defer`:** un módulo ya espera a que el HTML termine de cargar, como si tuviera `defer`.
- **La ruta `js/app.js` sale desde `index.html`**, que está en `tareas/`.
- **Las tareas siguen ahí** porque la dirección de la página es la misma, y el almacenamiento va con la dirección, no con el archivo.

**Pruebe:** escriba en la consola `estado`. Con la guía anterior mostraba el objeto; ahora:

```text
Uncaught ReferenceError: estado is not defined
```

- **Cada módulo tiene su propio alcance.** Lo que se declara en un módulo no queda suelto en la página: ni la consola ni otro archivo lo ven, a menos que se exporte. Así dos módulos pueden usar el mismo nombre sin pisarse, y ningún script ajeno toca el estado por accidente. No hay nada que deshacer.

---

## Paso 2 · Por qué no se abre con doble clic

Sin cerrar la pestaña del servidor, abra la carpeta `tareas/` en el explorador de archivos y haga **doble clic** sobre `index.html`. Se abre otra pestaña con una dirección que empieza por `file://`.

**Compare:** la página aparece con *No hay tareas pendientes.*, sin las tareas guardadas, y ningún botón hace nada. En la consola de Chrome:

```text
Access to script at 'file:///…/tareas/js/app.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, https, …
```

En Firefox el texto es otro, pero también dice que el módulo se bloqueó.

Cierre esa pestaña y vuelva a la del servidor.

**¿Qué pasó?**

- **Con doble clic la página no tiene un sitio de origen** (`origin 'null'`), y el navegador solo carga módulos que vengan de un sitio, por `http://` o `https://`. Por eso los módulos **se sirven** con un servidor local.
- **El HTML y el CSS sí cargan**, porque no son módulos: por eso la página se ve, pero no funciona.
- **Desde hoy, la lista y el proyecto se abren siempre con el servidor local**, también cuando se revisa la entrega.

---

## Paso 3 · El primer módulo: `almacenamiento.js`

**Cree** `js/almacenamiento.js` y **copie**:

```javascript
// Leer y guardar en el navegador
export function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
```

En `js/app.js`, **borre** las funciones `leer` y `guardar`, con su comentario `// Leer y guardar en el navegador`. En su lugar, como **primera línea** del archivo, **agregue**:

```javascript
import { leer, guardar } from "./almacenamiento.js";
```

**Recargue** y **compare**: las tareas y el tema siguen ahí. Agregue una tarea y recargue: se guardó.

**¿Qué pasó?**

- **`export`** delante de una función la ofrece a otros módulos. **`import { leer, guardar }`** pide exactamente esas dos, por su nombre.
- **El `import` va arriba del archivo:** antes de que corra una sola línea de `app.js`, el navegador ya cargó `almacenamiento.js`.
- **`"./almacenamiento.js"`** es una ruta **desde el archivo que importa**: `./` es la carpeta de `app.js`, es decir `js/`. No es la ruta desde `index.html`.
- **`almacenamiento.js` no sabe nada de tareas:** lee y guarda cualquier clave. Se puede copiar tal cual a otro proyecto.

**Pruebe 1:** en el `import`, borre el `./` para que quede `from "almacenamiento.js"`. Recargue:

```text
Uncaught TypeError: Failed to resolve module specifier "almacenamiento.js". Relative references must start with either "/", "./", or "../".
```

En Firefox: `Uncaught TypeError: The specifier “almacenamiento.js” was a bare specifier, but was not remapped to anything. Relative module specifiers must start with “./”, “../” or “/”.`

- Sin `./`, el navegador no lo toma como un archivo de la carpeta. Vuelva a poner el `./`.

**Pruebe 2:** ahora borre la extensión, para que quede `from "./almacenamiento"`. Recargue: la consola muestra un error de carga con un **404** sobre `…/tareas/js/almacenamiento`, y la página no funciona.

- **El navegador no adivina extensiones:** pide exactamente el archivo que se le nombra, y `almacenamiento` sin `.js` no existe. Vuelva a poner el `.js`.

---

## Paso 4 · `interfaz.js`: dibujar sin conocer el estado

**Cree** `js/interfaz.js` y **copie**:

```javascript
// Crear nodos y pintar: no conoce el estado, recibe lo que tiene que mostrar
const lista = document.getElementById("tareas");
const vacia = document.getElementById("vacia");
const botonTema = document.getElementById("tema");

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  return boton;
}

function crearTarea(tarea) {
  const item = document.createElement("li");
  item.dataset.id = tarea.id;
  item.classList.toggle("hecha", tarea.hecha);

  const texto = document.createElement("span");
  texto.textContent = tarea.texto;

  item.append(texto, crearBoton(tarea.hecha ? "Deshacer" : "Hecha", "hecha"), crearBoton("Quitar", "quitar"));
  return item;
}

export function pintarTareas(tareas) {
  lista.replaceChildren(...tareas.map(crearTarea));
  vacia.hidden = tareas.length > 0;
}

export function pintarTema(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  botonTema.setAttribute("aria-pressed", String(oscuro));
}

export function buscarBoton(id, accion) {
  return lista.querySelector(`li[data-id="${id}"] [data-accion="${accion}"]`);
}
```

En `js/app.js`:

1. **Agregue** debajo del primer `import`:

```javascript
import { pintarTareas, pintarTema, buscarBoton } from "./interfaz.js";
```

2. **Borre** la línea `const vacia = document.getElementById("vacia");` y las funciones `crearBoton` y `crearTarea`: ya están en `interfaz.js`.
3. **Reemplace** la función `pintar` (deje su comentario) por:

```javascript
function pintar() {
  pintarTareas(estado.tareas);
  pintarTema(estado.oscuro);
}
```

4. En el escuchador de la lista, **reemplace** las dos líneas del final (`const nuevo = …` y `(nuevo ?? campo).focus();`), dejando su comentario, por:

```javascript
  (buscarBoton(id, accion) ?? campo).focus();
```

**Recargue** y **compare**: todo igual. «Hecha» con el teclado deja el foco en el botón; «Quitar» lo lleva al campo.

**¿Qué pasó?**

- **`interfaz.js` no conoce el `estado`:** `pintarTareas` recibe **las tareas que tiene que mostrar** como parámetro, y `pintarTema`, si el tema es oscuro. Quien manda sigue siendo `app.js`; la interfaz solo dibuja lo que le pasan.
- **`crearBoton` y `crearTarea` no tienen `export`:** son piezas internas de la interfaz. Desde `app.js` no se pueden usar, y no hace falta.
- **Cada módulo busca sus propios elementos.** `interfaz.js` y `app.js` tienen cada uno su `const lista`: se llaman igual y no chocan, porque cada módulo tiene su alcance. `app.js` la necesita para el escuchador de clics; `interfaz.js`, para pintar.
- **`buscarBoton`** devuelve el botón o `null`, y `??` elige el campo cuando la tarea ya no está, igual que antes.

**Pruebe:** en `interfaz.js`, borre la palabra `export` de `function pintarTema`. Recargue:

```text
Uncaught SyntaxError: The requested module './interfaz.js' does not provide an export named 'pintarTema'
```

En Firefox el texto cambia según la versión, pero también es un `SyntaxError` que nombra `pintarTema`.

- **La página queda en blanco, sin las tareas guardadas**, aunque el error es solo del tema. Antes de correr una sola línea, el navegador revisa que todo lo que se importa exista; si falta algo, no corre ningún módulo. Vuelva a poner el `export`.

---

## Paso 5 · Un módulo por componente: `borrador.js`

**Cree** `js/borrador.js` y **copie**:

```javascript
// El texto a medio escribir: sobrevive a recargar, pero no a cerrar la pestaña
const clave = "tareas-borrador";

export function iniciarBorrador(campo) {
  campo.value = sessionStorage.getItem(clave) ?? "";
  campo.addEventListener("input", () => sessionStorage.setItem(clave, campo.value));
}

export function borrarBorrador() {
  sessionStorage.removeItem(clave);
}
```

En `js/app.js`:

1. **Agregue** debajo de los otros dos `import`:

```javascript
import { iniciarBorrador, borrarBorrador } from "./borrador.js";
```

2. En el escuchador de `submit`, **reemplace** `sessionStorage.removeItem("tareas-borrador");` por:

```javascript
  borrarBorrador();
```

3. **Reemplace** las tres líneas del borrador que están antes de `pintar();` (el comentario, `campo.value = …` y `campo.addEventListener("input", …)`) por:

```javascript
iniciarBorrador(campo);
```

**Recargue** y **compare**: escriba algo sin agregarlo y recargue, el texto sigue en el campo. Agréguelo y recargue: el campo queda vacío.

**¿Qué pasó?**

- **Un componente, un módulo:** todo lo del borrador está en un archivo. `app.js` solo dice **cuándo** empieza (`iniciarBorrador`) y **cuándo** se borra (`borrarBorrador`).
- **`clave` no se exporta:** el nombre `"tareas-borrador"` solo lo conoce `borrador.js`. Si mañana cambia, se cambia en un solo lugar.
- **El campo llega como parámetro**, igual que las tareas a la interfaz: el módulo no tiene que saber cómo se llama el campo en el HTML.

**Pruebe:** en `app.js`, borre la línea `iniciarBorrador(campo);`. Recargue, escriba algo y recargue otra vez: **el borrador ya no funciona**, y la consola no muestra ningún error.

- **Importar no es ejecutar la función.** El `import` carga `borrador.js` y corre lo que tiene suelto, pero ese archivo solo **define** funciones: no pasa nada hasta que alguien las llama. Vuelva a poner la línea.

---

## Paso 6 · Lo que queda en `app.js`

Abra `js/app.js` y léalo de arriba abajo. Quedan:

- **Tres `import`**, uno por módulo.
- **El `estado`**, leído con `leer` y revisado con `Array.isArray` y `=== true`.
- **Los elementos que usan los escuchadores:** el formulario, el campo, la lista y el botón del tema.
- **`pintar` y `actualizar`:** estado → guardar → pintar, como siempre.
- **Los escuchadores** y el arranque: `iniciarBorrador(campo);` y `pintar();`.

En las herramientas, abra la pestaña **Red** y filtre por **JS**. **Recargue**: aparecen cuatro archivos, primero `app.js` y después los tres que importa.

| Módulo | Responsabilidad | Exporta |
| --- | --- | --- |
| `almacenamiento.js` | Leer y guardar en el navegador | `leer`, `guardar` |
| `interfaz.js` | Crear nodos y pintar | `pintarTareas`, `pintarTema`, `buscarBoton` |
| `borrador.js` | El texto a medio escribir | `iniciarBorrador`, `borrarBorrador` |
| `app.js` | El estado y los eventos: arranca todo | Nada: es el que importa |

**¿Qué pasó?**

- **Cada pregunta tiene un solo archivo donde buscar.** ¿Dónde se guarda? `almacenamiento.js`. ¿Cómo se ve una tarea? `interfaz.js`. ¿Qué pasa al hacer clic? `app.js`.
- **El estado vive solo en `app.js`.** Los demás módulos reciben lo que necesitan como parámetro y no pueden cambiarlo por su cuenta.

**Pruebe:** en `interfaz.js`, dentro de `pintarTareas`, cambie `tareas.map(crearTarea)` por `estado.tareas.map(crearTarea)`. Recargue:

```text
Uncaught ReferenceError: estado is not defined
```

- `estado` existe en `app.js`, pero cada módulo tiene su alcance: la interfaz no lo ve. Si un módulo necesita un dato, se lo pasan. Vuelva a poner `tareas.map(crearTarea)`.

---

## Paso 7 · Revisión: prueba de daño y teclado

Con el servidor local:

- [ ] La consola no muestra errores al cargar.
- [ ] Las tareas, el tema y el borrador se comportan exactamente como al final de la guía anterior.
- [ ] **Prueba de daño:** en **Aplicación** (en Firefox, **Almacenamiento**), escriba un valor roto en `tareas-lista` y en `tareas-oscuro` (`[1,7`, `5`) y recargue. La página abre sin errores.

Deje el ratón quieto:

- [ ] `Tab` pasa por «Tema oscuro», el campo, «Agregar» y los botones de cada tarea, en orden.
- [ ] `Enter` sobre «Hecha» la tacha y el foco sigue en el botón; sobre «Quitar», el foco vuelve al campo.

---

## Los módulos completos

Así quedan al final del Paso 5. Si algo no funciona, se compara contra esto. `index.html` y `styles.css` son los de la guía anterior; en `index.html` solo cambió la línea del `<script>`.

`js/app.js`:

```javascript
import { leer, guardar } from "./almacenamiento.js";
import { pintarTareas, pintarTema, buscarBoton } from "./interfaz.js";
import { iniciarBorrador, borrarBorrador } from "./borrador.js";

// El estado manda: la página se pinta desde aquí
const tareasGuardadas = leer("tareas-lista", []);
const estado = {
  tareas: Array.isArray(tareasGuardadas) ? tareasGuardadas : [],
  oscuro: leer("tareas-oscuro", false) === true,
};

const formulario = document.getElementById("nueva");
const campo = document.getElementById("texto");
const lista = document.getElementById("tareas");
const botonTema = document.getElementById("tema");

// Pintar desde el estado, nunca al revés
function pintar() {
  pintarTareas(estado.tareas);
  pintarTema(estado.oscuro);
}

// Cada cambio: estado → guardar → pintar
function actualizar(cambio) {
  cambio();
  guardar("tareas-lista", estado.tareas);
  guardar("tareas-oscuro", estado.oscuro);
  pintar();
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const texto = campo.value.trim();
  if (!texto) return;
  actualizar(() => estado.tareas.push({ id: Date.now(), texto, hecha: false }));
  formulario.reset();
  borrarBorrador();
});

lista.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.closest("li").dataset.id);
  const accion = boton.dataset.accion;

  actualizar(() => {
    if (accion === "hecha") {
      const tarea = estado.tareas.find((t) => t.id === id);
      tarea.hecha = !tarea.hecha;
    }
    if (accion === "quitar") {
      estado.tareas = estado.tareas.filter((t) => t.id !== id);
    }
  });

  // Repintar crea botones nuevos: el foco vuelve al mismo botón, o al campo si la tarea ya no está
  (buscarBoton(id, accion) ?? campo).focus();
});

botonTema.addEventListener("click", () => actualizar(() => { estado.oscuro = !estado.oscuro; }));

iniciarBorrador(campo);
pintar();
```

`js/almacenamiento.js`:

```javascript
// Leer y guardar en el navegador
export function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
```

`js/interfaz.js`:

```javascript
// Crear nodos y pintar: no conoce el estado, recibe lo que tiene que mostrar
const lista = document.getElementById("tareas");
const vacia = document.getElementById("vacia");
const botonTema = document.getElementById("tema");

function crearBoton(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  boton.dataset.accion = accion;
  return boton;
}

function crearTarea(tarea) {
  const item = document.createElement("li");
  item.dataset.id = tarea.id;
  item.classList.toggle("hecha", tarea.hecha);

  const texto = document.createElement("span");
  texto.textContent = tarea.texto;

  item.append(texto, crearBoton(tarea.hecha ? "Deshacer" : "Hecha", "hecha"), crearBoton("Quitar", "quitar"));
  return item;
}

export function pintarTareas(tareas) {
  lista.replaceChildren(...tareas.map(crearTarea));
  vacia.hidden = tareas.length > 0;
}

export function pintarTema(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  botonTema.setAttribute("aria-pressed", String(oscuro));
}

export function buscarBoton(id, accion) {
  return lista.querySelector(`li[data-id="${id}"] [data-accion="${accion}"]`);
}
```

`js/borrador.js`:

```javascript
// El texto a medio escribir: sobrevive a recargar, pero no a cerrar la pestaña
const clave = "tareas-borrador";

export function iniciarBorrador(campo) {
  campo.value = sessionStorage.getItem(clave) ?? "";
  campo.addEventListener("input", () => sessionStorage.setItem(clave, campo.value));
}

export function borrarBorrador() {
  sessionStorage.removeItem(clave);
}
```

**Cuatro módulos**, **un solo `estado`** que vive en `app.js`, y los mismos cuatro escuchadores de la guía anterior. Para agregar algo nuevo, primero se decide **a qué módulo pertenece**.

## Del ejercicio al reto

Lo que se hizo aquí es el corte que pide el reto de hoy sobre el proyecto:

| En la lista | En el proyecto |
| --- | --- |
| `<script type="module" src="js/app.js">` y la carpeta `js/` | Lo mismo: el `<script>` del proyecto pasa a módulo y el código entra a `js/` |
| `almacenamiento.js` con `leer` y `guardar` | El mismo archivo, copiado tal cual |
| `interfaz.js`: `pintarTareas` recibe las tareas | `interfaz.js`: crear las tarjetas y pintar la galería, recibiendo la lista y los favoritos |
| `borrador.js`: un componente con `iniciar…` | Un módulo por cada componente que ya tiene el proyecto, con su función `iniciar…` |
| `app.js`: el estado y los eventos | Lo mismo; también se puede llamar `main.js` |
| Probar después de cada paso | Lo mismo: si la consola dice `… is not defined`, a ese módulo le falta un `import` o un parámetro |

**Dos diferencias:** el proyecto tiene además **datos fijos** (el arreglo de la galería), que van en su propio `datos.js` con `export const`; y en el proyecto el corte se hace **moviendo código que ya existe**, un módulo a la vez y probando entre uno y otro, no copiando archivos nuevos. El entregable pide **al menos tres módulos** con responsabilidades claras.
