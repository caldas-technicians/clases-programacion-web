# Almacenamiento paso a paso — los pendientes del festival

Guía de la práctica guiada sobre almacenamiento en el navegador. Se construye la lista de pendientes para el Festival de la Ciudad: una página que **recuerda** las tareas y el tema escogido aunque se recargue o se cierre el navegador. Para eso aparece una idea que ordena todo lo demás: **un solo objeto `estado` manda; la página se pinta desde él y se guarda cada vez que cambia.**

- **Cómo se sigue:** en cada paso se **copia** el código, se **guarda**, se **recarga** la página y se **compara** lo que se ve (o lo que sale en la consola) con lo que aparece aquí. Después se lee *¿Qué pasó?*. Casi todos los pasos terminan con un **Pruebe**: un cambio pequeño que rompe algo a propósito, para ver por qué el código está escrito así. **Después de cada Pruebe, se deja el código como estaba.**
- **Quién escribe:** el teclado rota entre los integrantes del equipo como lo indique el docente. Quien no escribe, lee el paso en voz alta y revisa la salida.

| Paso | Qué se aprende |
| --- | --- |
| 0 | Preparar los archivos |
| 1 | La página de partida |
| 2 | Las dos memorias del navegador |
| 3 | Solo guarda texto: JSON |
| 4 | Un estado que manda |
| 5 | Hecha y Quitar: delegación y foco |
| 6 | Guardar y recuperar al cargar |
| 7 | Lo que rompe la lectura: `try`/`catch` y la forma del dato |
| 8 | Una preferencia: el tema oscuro |
| 9 | `sessionStorage`: el borrador |
| 10 | Revisión con teclado y lo que no se guarda |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome) y el editor de código.
- **La consola:** `F12` → pestaña *Consola*. Se deja abierta toda la práctica.
- **Recargar:** `F5` después de guardar cada cambio. Si algo no cambia, `Ctrl` + `F5`.
- **El servidor local:** desde hoy la página se abre con un servidor, no con doble clic.
  - En VS Code, con la extensión *Live Server*: clic derecho sobre `index.html` → *Open with Live Server*.
  - Sin Live Server: en una terminal, dentro de la carpeta del proyecto, `python -m http.server`, y en el navegador `http://localhost:8000/tareas/`.
  - La dirección tiene que empezar por `http://`, no por `file://`. La guía siguiente explica por qué.

---

## Paso 0 · Los archivos

Dentro de la carpeta del proyecto, crear la carpeta `ejer-01/` y, adentro, tres archivos vacíos: `index.html`, `styles.css` y `app.js`. La carpeta va en la entrega de hoy junto con el proyecto.

---

## Paso 1 · La página de partida

**Copie** en `index.html`:

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mis tareas · Festival de la Ciudad</title>
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <main>
    <header class="cabecera">
      <h1>Mis tareas del festival</h1>
      <button type="button" id="tema" aria-pressed="false">Tema oscuro</button>
    </header>

    <form id="nueva">
      <label for="texto">Nueva tarea</label>
      <div class="fila">
        <input id="texto" name="texto" required autocomplete="off">
        <button type="submit">Agregar</button>
      </div>
    </form>

    <ul id="tareas" class="tareas"></ul>
    <p id="vacia" class="vacia">No hay tareas pendientes.</p>
  </main>
</body>
</html>
```

**Copie** en `styles.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; background: #fff; color: #1e1e1e; }
main { max-width: 32rem; margin: 0 auto; padding: 1rem; }

.cabecera { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
label { display: block; margin-top: 0.75rem; font-weight: bold; }
.fila { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
input { flex: 1; padding: 0.4rem; border: 2px solid #888; border-radius: 0.3rem; font: inherit; }
button { padding: 0.4rem 0.6rem; font: inherit; }

.tareas { list-style: none; padding: 0; }
.tareas li { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #ccc; }
.tareas span { flex: 1; }
.hecha span { text-decoration: line-through; opacity: 0.6; }
.vacia { color: #666; }
```

`app.js` se deja vacío por ahora.

**Abra** la página con el servidor local y **compare**: el título, el botón «Tema oscuro» arriba a la derecha, el campo «Nueva tarea» con su botón «Agregar» y debajo *No hay tareas pendientes.* La dirección empieza por `http://` y termina en `/tareas/`.

**¿Qué pasó?**

- **La lista `<ul id="tareas">` está vacía:** las tareas no se escriben en el HTML, las va a crear JavaScript desde los datos.
- **El botón del tema lleva `aria-pressed`:** es un botón que se queda presionado o suelto. El lector de pantalla dice «Tema oscuro, botón, no presionado».

---

## Paso 2 · Las dos memorias del navegador

Sin tocar `app.js`, escriba en la consola, una línea a la vez:

```javascript
localStorage.setItem("prueba-saludo", "hola")
localStorage.getItem("prueba-saludo")
localStorage.getItem("prueba-nada")
```

| Línea | Consola |
| --- | --- |
| `setItem(…)` | `undefined` |
| `getItem("prueba-saludo")` | `'hola'` (en Firefox, `"hola"`) |
| `getItem("prueba-nada")` | `null` |

Si Chrome no deja pegar en la consola, pide escribir una frase para permitirlo: escríbala tal como la muestra.

Ahora abra la pestaña **Aplicación** (en Firefox, **Almacenamiento**) → *Almacenamiento local* → la dirección de la página. Ahí está la clave `prueba-saludo` con el valor `hola`.

**Recargue** con `F5` y vuelva a escribir `localStorage.getItem("prueba-saludo")`: sigue diciendo `'hola'`.

Ahora con la otra memoria:

```javascript
sessionStorage.setItem("prueba-visita", "1")
```

1. **Recargue** y escriba `sessionStorage.getItem("prueba-visita")`: `'1'`.
2. **Cierre la pestaña**, abra una pestaña nueva y escriba la dirección de la página a mano.
3. En la consola de la pestaña nueva: `sessionStorage.getItem("prueba-visita")` da `null`, y `localStorage.getItem("prueba-saludo")` sigue dando `'hola'`.

**¿Qué pasó?**

- **El navegador tiene dos memorias con la misma forma de usarse:** `setItem(clave, valor)` guarda, `getItem(clave)` lee, `removeItem(clave)` borra una clave y `clear()` borra todas.

| | `localStorage` | `sessionStorage` |
| --- | --- | --- |
| Dura | Hasta que se borre | Hasta cerrar la pestaña |
| Se comparte | Entre pestañas del mismo sitio | Solo en esa pestaña |
| Uso típico | Tareas, favoritos, tema oscuro | Un texto a medio escribir, un filtro temporal |

- **`getItem` de una clave que no existe devuelve `null`**, no un error. Esa es la primera visita de cualquier usuario: todavía no hay nada guardado.
- **Cada sitio tiene su propio almacenamiento**, separado por la dirección: lo que guarda esta página no lo ve otra página de otro sitio. El proyecto del equipo, abierto con el mismo servidor, **sí comparte** este almacenamiento con la lista. Por eso todas las claves de hoy empiezan por `prueba-` o `tareas-`, y por eso en este ejercicio nunca se usa `clear()`: borraría también lo que guarda el proyecto.
- Para abrir la pestaña nueva se escribe la dirección; **`Ctrl` + `Shift` + `T`** (reabrir pestaña cerrada) puede devolver también el `sessionStorage`.

---

## Paso 3 · Solo guarda texto: JSON

En la consola, una línea a la vez:

```javascript
localStorage.setItem("prueba-numeros", [1, 7, 8])
localStorage.getItem("prueba-numeros")
typeof localStorage.getItem("prueba-numeros")
```

La consola dice `'1,7,8'` y `'string'`: se guardó **texto**, ya no es un arreglo.

Ahora con JSON:

```javascript
localStorage.setItem("prueba-numeros", JSON.stringify([1, 7, 8]))
localStorage.getItem("prueba-numeros")
JSON.parse(localStorage.getItem("prueba-numeros"))
JSON.stringify({ id: 1, texto: "Comprar la entrada", hecha: false })
```

| Línea | Consola |
| --- | --- |
| `getItem(…)` | `'[1,7,8]'` |
| `JSON.parse(…)` | `(3) [1, 7, 8]`: otra vez un arreglo |
| `JSON.stringify({ … })` | `'{"id":1,"texto":"Comprar la entrada","hecha":false}'` |

**¿Qué pasó?**

- **`localStorage` solo guarda texto.** Si recibe otra cosa, la convierte a texto a su manera: el arreglo `[1, 7, 8]` se volvió `"1,7,8"`, y de ahí no se recupera.
- **`JSON.stringify` convierte a texto JSON** un arreglo, un objeto, un número o un booleano, y **`JSON.parse` lo devuelve** a lo que era. Se guarda con `stringify` y se lee con `parse`, siempre en pareja.

**Pruebe:** escriba en la consola `JSON.parse("[1,7")`, un JSON al que le falta el cierre:

```text
Uncaught SyntaxError: Expected ',' or ']' after array element in JSON at position 4 (line 1 column 5)
```

En Firefox: `Uncaught SyntaxError: JSON.parse: expected ',' or ']' after array element at line 1 column 5 of the JSON data`.

- **`JSON.parse` no devuelve un valor vacío cuando el texto está mal: lanza un error.** Dentro de un programa, ese error detiene todo lo que viene después. En el Paso 7 se ve cómo pasa y cómo evitarlo.

Para terminar, borre las claves de prueba:

```javascript
localStorage.removeItem("prueba-saludo")
localStorage.removeItem("prueba-numeros")
```

---

## Paso 4 · Un estado que manda

**Copie** en `app.js`:

```javascript
// El estado manda: la página se pinta desde aquí
const estado = {
  tareas: [],
};

const formulario = document.getElementById("nueva");
const campo = document.getElementById("texto");
const lista = document.getElementById("tareas");
const vacia = document.getElementById("vacia");

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

// Pintar desde el estado, nunca al revés
function pintar() {
  lista.replaceChildren(...estado.tareas.map(crearTarea));
  vacia.hidden = estado.tareas.length > 0;
}

// Cada cambio: primero el estado, después la página
function actualizar(cambio) {
  cambio();
  pintar();
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const texto = campo.value.trim();
  if (!texto) return;
  actualizar(() => estado.tareas.push({ id: Date.now(), texto, hecha: false }));
  formulario.reset();
});

pintar();
```

**Recargue** y **compare**:

| Escriba y pulse «Agregar» | Lo que aparece |
| --- | --- |
| `Comprar la entrada del concierto` | La tarea, con sus botones «Hecha» y «Quitar». *No hay tareas pendientes.* desaparece |
| `Llevar impermeable` | Una segunda tarea, debajo de la primera |
| Solo espacios | Nada: el campo no se vacía y no se agrega nada |

Ahora **recargue**: las dos tareas se pierden. Todavía no se guarda nada.

**¿Qué pasó?**

- **`estado` es la única fuente de verdad.** Las tareas viven en `estado.tareas`, un arreglo de objetos `{ id, texto, hecha }`. La página **no** es la verdad: es un dibujo del estado.
- **`pintar` borra la lista y la vuelve a crear entera desde el estado.** `replaceChildren(...)` cambia todos los hijos de la lista de una vez, y `vacia.hidden` muestra el aviso solo si no hay tareas.
- **`actualizar` es el único camino para cambiar algo:** recibe una función que cambia el estado y después repinta. En el Paso 6 se le agrega una línea, y desde ahí todo lo que cambie quedará guardado.
- **`Date.now()` como `id`:** los milisegundos desde 1970, un número que no se repite entre dos clics. Basta para una lista local.
- **El texto de la tarea entra con `textContent`**, nunca con `innerHTML`: lo que escribe el usuario se muestra como texto, no se interpreta como HTML.
- **`trim()`** quita los espacios de los extremos: una tarea de puros espacios no es una tarea.

**Pruebe:** agregue una tarea y escriba en la consola:

```javascript
estado.tareas.push({ id: 1, texto: "Desde la consola", hecha: false })
```

La consola responde `2` (el arreglo ya tiene dos tareas), pero **en la página no aparece nada**. Ahora escriba `pintar()`: la tarea aparece.

- **La página no vigila el estado:** cambiarlo no la repinta. Por eso todo cambio pasa por `actualizar`, que nunca olvida llamar a `pintar`. Recargue para volver a empezar.

---

## Paso 5 · Hecha y Quitar: delegación y foco

**Agregue** en `app.js` debajo del escuchador de `submit` (antes de la última línea, `pintar();`):

```javascript
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
  const nuevo = lista.querySelector(`li[data-id="${id}"] [data-accion="${accion}"]`);
  (nuevo ?? campo).focus();
});
```

**Recargue**, agregue dos tareas y **compare**:

| Haga clic en | Lo que pasa |
| --- | --- |
| «Hecha» de la primera | Queda tachada y el botón dice «Deshacer» |
| «Deshacer» | Vuelve a la normalidad |
| «Quitar» de la primera | Desaparece |
| «Quitar» de la que queda | La lista queda vacía y vuelve *No hay tareas pendientes.* |

Ahora con el teclado: agregue una tarea, llegue con `Tab` hasta «Hecha» y pulse `Enter`. Se tacha. Pulse `Enter` otra vez: se destacha. El foco nunca se fue del botón.

**¿Qué pasó?**

- **Un solo escuchador en la lista atiende todos los botones**, incluso los que se crean después: el clic sube desde el botón hasta la `<ul>`. Es **delegación**. `closest("button[data-accion]")` encuentra el botón aunque el clic caiga en otra parte, y `data-accion` dice qué hacer.
- **`Number(…dataset.id)`:** los `data-*` siempre son texto. Los `id` del estado son números, y `"1793…" === 1793…` es `false`.
- **Quitar no es `item.remove()`:** la tarea se quita **del estado** con `filter` y se repinta. Si se quitara solo de la página, el estado la seguiría teniendo y volvería en el siguiente `pintar`.
- **El foco después de repintar:** `pintar` destruye el botón que se acaba de usar y crea uno nuevo. Las dos últimas líneas buscan el botón nuevo de la misma tarea y le dan el foco. Si la tarea se quitó, el foco va al campo, listo para escribir otra.

**Pruebe:** borre las dos últimas líneas del escuchador (`const nuevo = …` y `(nuevo ?? campo).focus();`). Recargue, agregue una tarea, llegue con `Tab` a «Hecha» y pulse `Enter` dos veces: la primera la tacha, **la segunda no hace nada**. Escriba en la consola `document.activeElement`: dice `<body>`.

- El botón que tenía el foco ya no existe, y el foco cayó al principio de la página. Quien usa teclado tendría que volver a recorrer todo con `Tab`. Vuelva a poner las dos líneas.

---

## Paso 6 · Guardar y recuperar al cargar

**Agregue** al **principio** de `app.js`, antes del comentario del estado:

```javascript
// Leer y guardar en el navegador
function leer(clave, porDefecto) {
  const texto = localStorage.getItem(clave);
  return texto === null ? porDefecto : JSON.parse(texto);
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
```

En el objeto `estado`, **reemplace** `tareas: [],` por:

```javascript
  tareas: leer("tareas-lista", []),
```

Y **reemplace** la función `actualizar` completa, con su comentario, por:

```javascript
// Cada cambio: estado → guardar → pintar
function actualizar(cambio) {
  cambio();
  guardar("tareas-lista", estado.tareas);
  pintar();
}
```

**Recargue** y **compare**:

1. Agregue `Comprar la entrada del concierto` y `Llevar impermeable`, y marque la primera como hecha.
2. **Recargue:** las dos siguen ahí, la primera tachada.
3. En **Aplicación** → *Almacenamiento local* aparece la clave `tareas-lista` con un valor como `[{"id":1793137050070,"texto":"Comprar la entrada del concierto","hecha":true},…]`.
4. Quite una tarea y recargue: **no vuelve**.
5. Cierre el navegador del todo, ábralo y vuelva a la dirección: las tareas siguen ahí.

**¿Qué pasó?**

- **`guardar`** convierte a JSON y guarda. **`leer`** hace lo contrario y, si la clave no existe todavía (`null`), devuelve **el valor por defecto**: la primera visita abre con `[]`, una lista vacía.
- **Al cargar, el estado sale del almacenamiento:** la página abre como el usuario la dejó.
- **El flujo completo es siempre el mismo: el usuario hace algo → cambia el estado → se guarda → se repinta.** Como todo cambio pasa por `actualizar`, una sola línea hizo que todo quede guardado.
- **La clave lleva el prefijo `tareas-`**: el proyecto, abierto desde el mismo servidor, comparte este almacenamiento, y un nombre como `lista` podría chocar con una clave suya.

**Pruebe:** en el objeto `estado`, cambie `tareas: leer("tareas-lista", []),` por:

```javascript
  tareas: JSON.parse(localStorage.getItem("tareas-lista")),
```

Recargue: funciona, porque hay tareas guardadas. Ahora en **Aplicación**, clic derecho sobre la clave `tareas-lista` → *Eliminar*, y recargue, como si fuera la primera visita de alguien:

```text
Uncaught TypeError: Cannot read properties of null (reading 'map')
```

En Firefox: `Uncaught TypeError: estado.tareas is null`.

- Sin nada guardado, `getItem` devuelve `null`, `JSON.parse(null)` da `null`, y `pintar` intenta hacer `null.map(…)`. **La primera visita de cada usuario rompería la página.** Vuelva a poner `tareas: leer("tareas-lista", []),`.

---

## Paso 7 · Lo que rompe la lectura: `try`/`catch` y la forma del dato

El valor guardado lo puede cambiar cualquiera desde las herramientas, o lo pudo dejar una versión vieja del código. Primero se rompe a propósito.

**Agregue** una tarea. En **Aplicación**, haga doble clic sobre el valor de `tareas-lista`, cámbielo por `[1,7` (sin cerrar) y pulse `Enter`. **Recargue**:

```text
Uncaught SyntaxError: Expected ',' or ']' after array element in JSON at position 4 (line 1 column 5)
```

En Firefox: `Uncaught SyntaxError: JSON.parse: expected ',' or ']' after array element at line 1 column 5 of the JSON data`.

La lista no aparece, y si escribe una tarea y pulsa «Agregar», **la página se recarga** y la dirección termina en `?texto=…`: el error detuvo `app.js` en la primera línea que lee, y ningún escuchador alcanzó a ponerse.

**Reemplace** la función `leer` por:

```javascript
function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}
```

**Recargue**: la página abre con *No hay tareas pendientes.* y sin errores en la consola. Agregue una tarea: en **Aplicación**, el valor roto quedó reemplazado por uno bueno.

Ahora un valor que **sí** es JSON, pero no es una lista: cambie el valor de `tareas-lista` por `5` y recargue:

```text
Uncaught TypeError: estado.tareas.map is not a function
```

**Reemplace** el objeto `estado`, con su comentario, por:

```javascript
// El estado manda: la página se pinta desde aquí
const tareasGuardadas = leer("tareas-lista", []);
const estado = {
  tareas: Array.isArray(tareasGuardadas) ? tareasGuardadas : [],
};
```

**Recargue**: abre vacía y sin errores. Repita con `{}`, `"hola"` (con las comillas) y `null`: las tres abren igual.

**¿Qué pasó?**

- **`try` intenta; si algo falla adentro, el `catch` atiende y el programa sigue.** Un JSON roto ya no detiene la página: `leer` devuelve el valor por defecto.
- **`JSON.parse` acepta cualquier JSON válido**, no solo arreglos: `5`, `{}`, `"hola"` y `null` son JSON. **`Array.isArray`** revisa la forma: si lo leído no es un arreglo, se empieza con uno vacío.
- **Leer siempre con valor por defecto, `try`/`catch` y revisando la forma.** Es lo que hace que la página sobreviva a la primera visita, a un valor dañado y a un cambio de versión.

---

## Paso 8 · Una preferencia: el tema oscuro

**Agregue** debajo de `const vacia = …`:

```javascript
const botonTema = document.getElementById("tema");
```

En el objeto `estado`, **agregue** debajo de la línea de `tareas`:

```javascript
  oscuro: leer("tareas-oscuro", false) === true,
```

**Reemplace** las funciones `pintar` y `actualizar`, con sus comentarios, por:

```javascript
// Pintar desde el estado, nunca al revés
function pintar() {
  lista.replaceChildren(...estado.tareas.map(crearTarea));
  vacia.hidden = estado.tareas.length > 0;
  document.body.classList.toggle("oscuro", estado.oscuro);
  botonTema.setAttribute("aria-pressed", String(estado.oscuro));
}

// Cada cambio: estado → guardar → pintar
function actualizar(cambio) {
  cambio();
  guardar("tareas-lista", estado.tareas);
  guardar("tareas-oscuro", estado.oscuro);
  pintar();
}
```

**Agregue** debajo del escuchador de la lista (antes de la última línea, `pintar();`):

```javascript
botonTema.addEventListener("click", () => actualizar(() => { estado.oscuro = !estado.oscuro; }));
```

**Agregue** al final de `styles.css`:

```css
body.oscuro { background: #1e1e1e; color: #eee; }
body.oscuro .vacia { color: #aaa; }
```

**Recargue** y **compare**:

- Clic en «Tema oscuro»: el fondo se oscurece. En el *Inspector*, el botón tiene `aria-pressed="true"` y el `<body>` la clase `oscuro`.
- **Recargue:** abre oscuro. En **Aplicación**, `tareas-oscuro` vale `true`.
- Clic otra vez: vuelve a claro, y así queda al recargar.

**¿Qué pasó?**

- **El tema es parte del estado**, igual que las tareas: se cambia con `actualizar`, se guarda y se pinta. El botón no cambia colores: cambia `estado.oscuro`.
- **JavaScript pone una clase; el CSS decide los colores.** `classList.toggle("oscuro", estado.oscuro)` la pone si es `true` y la quita si es `false`.
- **`aria-pressed`** sigue al estado: el lector de pantalla dice «Tema oscuro, botón, presionado».
- **`=== true`:** solo el valor `true` activa el tema. Cualquier otra cosa que haya quedado guardada lo deja claro.

**Pruebe:** en **Aplicación**, cambie el valor de `tareas-oscuro` por `"no"` (con las comillas) y recargue: abre **claro**. Ahora borre `=== true` de la línea de `oscuro` y recargue: abre **oscuro**, y en el *Inspector* el botón dice `aria-pressed="no"`.

- `"no"` es un texto con letras, y en un `if` o un `toggle` cualquier texto no vacío cuenta como verdadero. Revisar que sea exactamente `true` es revisar la forma, como `Array.isArray` con la lista. Vuelva a poner `=== true`.

---

## Paso 9 · `sessionStorage`: el borrador

**Agregue** antes de la última línea de `app.js` (`pintar();`):

```javascript
// El borrador: sobrevive a recargar, pero no a cerrar la pestaña
campo.value = sessionStorage.getItem("tareas-borrador") ?? "";
campo.addEventListener("input", () => sessionStorage.setItem("tareas-borrador", campo.value));
```

Y en el escuchador de `submit`, **agregue** debajo de `formulario.reset();`:

```javascript
  sessionStorage.removeItem("tareas-borrador");
```

**Recargue** y **compare**:

1. Escriba `Buscar el puesto de` **sin** pulsar «Agregar». Recargue: el texto sigue en el campo.
2. Termine la tarea y agréguela: el campo queda vacío. Recargue: sigue vacío.
3. Escriba algo y **cierre la pestaña**. Abra una nueva y escriba la dirección: el campo está vacío, pero las tareas siguen ahí.
4. En **Aplicación** → *Almacenamiento de sesión*, mientras escribe, aparece `tareas-borrador` con el texto.

**¿Qué pasó?**

- **El borrador es temporal:** sirve si la página se recarga por accidente, pero no tiene sentido que aparezca días después. Por eso va en `sessionStorage` y las tareas en `localStorage`.
- **Sin JSON:** el valor del campo ya es texto. `getItem` devuelve `null` la primera vez, y `?? ""` lo cambia por un texto vacío.
- **El borrador no entra al `estado` ni pasa por `actualizar`:** no se pinta en ninguna parte, solo se devuelve al campo al cargar.

**Pruebe:** borre la línea de `sessionStorage.removeItem(…)` del `submit`. Recargue, escriba `Comprar agua`, agréguela y recargue: **`Comprar agua` vuelve a aparecer en el campo**, aunque ya es una tarea.

- `formulario.reset()` vacía el campo, pero no dispara el evento `input`: el borrador se queda con el último texto escrito. Vuelva a poner la línea.

---

## Paso 10 · Revisión con teclado y lo que no se guarda

Deje el ratón quieto y recorra la página **solo con el teclado**:

- [ ] `Tab` pasa por «Tema oscuro», el campo, «Agregar» y los botones de cada tarea, en orden.
- [ ] `Enter` en el campo agrega la tarea.
- [ ] `Enter` sobre «Hecha» la tacha, y el foco sigue en el mismo botón.
- [ ] `Enter` sobre «Quitar» la quita, y el foco vuelve al campo.
- [ ] `Espacio` sobre «Tema oscuro» cambia el tema.

**Prueba de daño:** en **Aplicación**, escriba un valor roto en `tareas-lista` y en `tareas-oscuro` (`[1,7`, `5`, `hola` sin comillas…) y recargue. La página tiene que abrir sin errores en la consola.

**Lo que no se guarda en el navegador:** contraseñas, tokens de sesión, datos personales ni números de tarjeta. **Cualquier script que corra en la página puede leer el `localStorage`**: una librería de terceros, una extensión del navegador, o código que se cuele por un `innerHTML`. Es otra razón para usar `textContent`.

---

## El `app.js` completo

Así queda al final del Paso 9. Si algo no funciona, se compara contra esto.

```javascript
// Leer y guardar en el navegador
function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// El estado manda: la página se pinta desde aquí
const tareasGuardadas = leer("tareas-lista", []);
const estado = {
  tareas: Array.isArray(tareasGuardadas) ? tareasGuardadas : [],
  oscuro: leer("tareas-oscuro", false) === true,
};

const formulario = document.getElementById("nueva");
const campo = document.getElementById("texto");
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

// Pintar desde el estado, nunca al revés
function pintar() {
  lista.replaceChildren(...estado.tareas.map(crearTarea));
  vacia.hidden = estado.tareas.length > 0;
  document.body.classList.toggle("oscuro", estado.oscuro);
  botonTema.setAttribute("aria-pressed", String(estado.oscuro));
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
  sessionStorage.removeItem("tareas-borrador");
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
  const nuevo = lista.querySelector(`li[data-id="${id}"] [data-accion="${accion}"]`);
  (nuevo ?? campo).focus();
});

botonTema.addEventListener("click", () => actualizar(() => { estado.oscuro = !estado.oscuro; }));

// El borrador: sobrevive a recargar, pero no a cerrar la pestaña
campo.value = sessionStorage.getItem("tareas-borrador") ?? "";
campo.addEventListener("input", () => sessionStorage.setItem("tareas-borrador", campo.value));

pintar();
```

**Cuatro escuchadores** (`submit` en el formulario, `click` en la lista, `click` en el botón del tema e `input` en el campo), **un objeto `estado`** y **un solo camino para cambiarlo**: `actualizar`. Todo en un archivo de más de cien líneas; en la guía siguiente se parte en módulos.

## Del ejercicio al reto

Lo que se hizo aquí es lo que pide el reto de hoy sobre el proyecto, con otros datos:

| En la lista | En el reto |
| --- | --- |
| `estado` con `tareas` y `oscuro` | `estado` con `favoritos` (un arreglo de `id`) y la preferencia escogida |
| `leer` con valor por defecto, `try`/`catch` y `Array.isArray` | Lo mismo para cada clave del proyecto |
| `actualizar`: estado → guardar → pintar | Al marcar un favorito: lo mismo |
| «Hecha» con el foco de vuelta después de repintar | «Favorito» con `aria-pressed` y el foco de vuelta |
| `oscuro` revisado con `=== true` | La preferencia revisada contra los valores permitidos |
| Claves con el prefijo `tareas-` | Claves con el prefijo del proyecto |

**Dos diferencias:** en el reto se guardan **solo los `id`** de los favoritos, no las tarjetas completas, porque los datos ya están en el proyecto; y si la preferencia es un texto (un filtro, una vista), se revisa con `includes` contra la lista de valores que existen, para que un valor viejo no deje la galería vacía.
