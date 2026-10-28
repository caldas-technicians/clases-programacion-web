# Taller — reservas de talleres del Festival de la Ciudad

En este taller **no hay código para copiar**. Se construye, desde una página que todavía no hace nada, la reserva de talleres del festival: un formulario que valida cada dato y explica qué está mal, una lista de reservas que **sobrevive a recargar la página**, un filtro por día que se recuerda y un borrador del formulario que no se pierde con `F5`. Todo con el código partido en módulos.

Cada parte dice **qué tiene que hacer la página** y **cómo se comprueba**. El cómo ya se vio en las guías de clase: cuando no recuerden algo, búsquenlo allí (la sección **Pistas** dice en qué guía y en qué paso está).

- **Cómo se trabaja:** se lee la parte completa, se decide **en qué módulo va cada cosa**, se escribe el código, se recarga y se pasa la tabla de **Comprobación** de esa parte. No se avanza a la siguiente parte con errores en la consola.
- **Quién escribe:** el teclado rota entre los integrantes del equipo en cada parte. Quien no escribe, lee los requisitos en voz alta y revisa la tabla de comprobación.
- **Qué se entrega:** la carpeta `taller/` completa, abierta y probada con el servidor local.

## Lo que se usa

| De formularios | De almacenamiento y módulos |
| --- | --- |
| `novalidate`, `required`, `type="email"`, `min`, `max` | `localStorage` y `sessionStorage` |
| `validity`: un mensaje por cada causa | `JSON.stringify` y `JSON.parse` |
| `setCustomValidity`, `aria-invalid`, `aria-describedby` | Lectura segura: valor por defecto, `try`/`catch` y revisar la forma |
| Reglas propias que el HTML no expresa | Un objeto `estado` que manda: estado → guardar → pintar |
| `submit`, `focusout` e `input`; foco en el primer error | `type="module"`, `export` e `import` |

## Antes de empezar

- Un navegador de escritorio (Firefox o Chrome), el editor de código y **el servidor local** (Live Server o `python -m http.server`). Con doble clic los módulos no cargan.
- **La consola** abierta toda la práctica (`F12`), y la pestaña **Aplicación** (en Firefox, **Almacenamiento**) a mano para ver lo que se guarda.
- Copien la carpeta `taller/` dentro de la carpeta del proyecto del equipo. Trae:

```text
taller/
├── index.html      la página: falta escribir los campos del formulario
├── styles.css      los estilos: no hace falta tocarlos
└── js/
    └── datos.js    los talleres con su cupo y los tres días del festival
```

- Abran `taller/` con el servidor local. La consola muestra un error porque `js/app.js` todavía no existe: es el primer archivo que van a crear.

## Las claves del almacenamiento

Todas las claves llevan el prefijo `reservas-`, porque el taller comparte el almacenamiento con el proyecto cuando se abren con el mismo servidor. Nunca usen `clear()`.

| Clave | Dónde | Qué guarda |
| --- | --- | --- |
| `reservas-lista` | `localStorage` | El arreglo de reservas |
| `reservas-filtro` | `localStorage` | El día escogido en el filtro, o `"todos"` |
| `reservas-borrador` | `sessionStorage` | Lo escrito en el formulario sin enviar, como un objeto |

---

## Parte 1 · Los módulos y el arranque

**Requisitos**

1. Creen `js/app.js` como módulo de entrada. `index.html` ya lo carga con `type="module"`.
2. Creen, como mínimo, estos módulos además de `app.js` y `datos.js`. Cada uno con una sola responsabilidad:

| Módulo | Responsabilidad |
| --- | --- |
| `almacenamiento.js` | Leer y guardar en el navegador, sin romper nunca |
| `validacion.js` | Marcar un campo y dar el mensaje de cada campo |
| `interfaz.js` | Crear nodos y pintar: opciones, filtros y lista |
| `borrador.js` | Guardar y devolver lo escrito en el formulario |

3. Dibujen en `#filtros` un botón por cada opción: «Todos» y los tres días de `datos.js`, cada uno con `aria-pressed`.

**Reglas de los módulos**

- Solo `app.js` conoce el `estado`. Los demás módulos reciben como parámetro lo que necesitan.
- Lo que un módulo no exporta es privado. Exporten solo lo que otro módulo usa.

**Comprobación**

| Haga esto | Lo que se ve |
| --- | --- |
| Recargar | Los cuatro filtros: «Todos» presionado, «Viernes 13», «Sábado 14» y «Domingo 15». Debajo, *Todavía no hay reservas.* Consola sin errores |
| Escribir `estado` en la consola | `ReferenceError`: el estado no queda suelto en la página |
| Abrir **Red**, filtrar por JS y recargar | `app.js` y todos los módulos que importa, sin ningún 404 |

---

## Parte 2 · El formulario en HTML

**Requisitos**

Escriban en `index.html`, donde dice el comentario, los cinco campos. Cada uno con su `<label>`, su `name`, sus atributos de validación y un `<p class="error">` unido al campo con `aria-describedby`:

| Campo | `id` y `name` | Tipo | Lo que exige el HTML |
| --- | --- | --- | --- |
| Nombre | `nombre` | texto | Obligatorio, al menos 3 caracteres |
| Correo | `correo` | correo | Obligatorio |
| Taller | `taller` | `<select>` | Obligatorio. Una primera opción «Escoge un taller» con `value=""` |
| Día | `dia` | fecha | Obligatorio, del `2026-11-13` al `2026-11-15` |
| Personas | `personas` | número | Obligatorio, de 1 a 6 |

- Los mensajes van **junto a cada campo**, en su `<p>`: los globos del navegador se apagan con `novalidate` en el formulario.
- El orden de los campos es el de la tabla.
- Desde la interfaz, llenen el `<select>` con los talleres de `datos.js`: el `value` de cada opción es el `id` y el texto es el `nombre`. Los talleres **no se escriben a mano** en el HTML.

**Comprobación**

| Haga esto | Lo que se ve |
| --- | --- |
| Clic sobre cada etiqueta | El cursor salta a su campo |
| Abrir el `<select>` | «Escoge un taller», «Muralismo», «Fotografía nocturna», «Cocina de la región» y «Danza folclórica» |
| En el *Inspector*, pestaña **Accesibilidad**, revisar un campo | Tiene nombre (el de su etiqueta) y una descripción unida por `aria-describedby` |
| Abrir el calendario del día | Solo se pueden escoger el 13, el 14 y el 15 de noviembre |

---

## Parte 3 · Validar cada campo

**Requisitos**

1. Una función para marcar un campo: le dice al navegador si es válido (`setCustomValidity`), pone `aria-invalid` y escribe el mensaje con `⚠` en su `<p>`.
2. Un mensaje **por cada causa**, en español y diciendo cómo arreglarlo. Estos son los que se esperan:

| Campo | Causa | Mensaje |
| --- | --- | --- |
| Nombre | Vacío | `Escribe tu nombre.` |
| Nombre | Menos de 3 caracteres sin contar los espacios | `El nombre tiene al menos 3 letras.` |
| Correo | Vacío | `Escribe tu correo.` |
| Correo | Sin forma de correo | `El correo debe tener la forma nombre@dominio.com.` |
| Taller | Sin escoger | `Escoge un taller.` |
| Día | Vacío | `Escoge el día.` |
| Día | Antes del 13 o después del 15 | `El festival es del viernes 13 al domingo 15 de noviembre.` |
| Personas | Vacío | `Escribe cuántas personas van.` |
| Personas | Menos de 1 | `Tiene que ir al menos 1 persona.` |
| Personas | Más de 6 | `Máximo 6 personas por reserva.` |
| Personas | Con decimales | `Escribe un número entero.` |

3. **Tres momentos**, con tres escuchadores en el formulario:
   - **Al enviar:** se revisan todos los campos. Si hay errores, el resumen (`#resumen`) dice `Hay 1 dato por corregir.` o `Hay N datos por corregir.` y el foco va al **primer** campo con error.
   - **Al salir de un campo:** se revisa ese campo.
   - **Al corregir:** si el campo ya estaba marcado con error, se revisa otra vez para quitar el mensaje apenas se arregle.

**Comprobación**

| Haga esto | Lo que se ve |
| --- | --- |
| «Reservar» con todo vacío | Cinco mensajes, `Hay 5 datos por corregir.` y el cursor en el nombre |
| Correo `ana` y salir con `Tab` | `⚠ El correo debe tener la forma nombre@dominio.com.` |
| Seguir escribiendo hasta `ana@c` | El mensaje desaparece con esa letra, sin salir del campo |
| Personas `2.5` y enviar | `⚠ Escribe un número entero.` |
| Un campo con error, con acromatopsia emulada | El error se sigue entendiendo por el `⚠` y el texto, no solo por el color |

---

## Parte 4 · El estado, guardar y pintar

**Requisitos**

1. Un objeto `estado` en `app.js` con `reservas` (un arreglo) y `filtro` (`"todos"` o la fecha de un día), leídos del almacenamiento **al cargar**.
2. **Lectura segura:** si la clave no existe, si el JSON está roto o si lo leído no tiene la forma esperada, se usa el valor por defecto. Las `reservas` tienen que ser un arreglo, y el `filtro` uno de los cuatro valores que existen.
3. Cuando el formulario no tiene errores, se agrega al estado una reserva `{ id, nombre, correo, taller, dia, personas }`, con `personas` como **número**. Se guarda, se pinta, el resumen dice `Reserva guardada.` y el formulario queda limpio, sin mensajes ni bordes rojos.
4. **Un solo camino para cambiar algo:** cambia el estado → se guarda → se pinta.
5. La lista muestra cada reserva como `Muralismo · Sábado 14 · 2 personas · Ana Pérez` (con `1 persona` en singular), con su botón «Cancelar». Nombres de taller y de día salen de `datos.js`, y todo texto escrito por el usuario entra con `textContent`.
6. **Cancelar** quita la reserva **del estado**, guarda y repinta, con **un solo escuchador** en la lista. El foco va al primer «Cancelar» que quede o, si no queda ninguno, al campo del nombre.
7. **El filtro:** clic en un día muestra solo las reservas de ese día y marca ese botón con `aria-pressed="true"`. El filtro se guarda y la página abre con el último escogido. El foco se queda en el botón del filtro.

**Comprobación**

| Haga esto | Lo que se ve |
| --- | --- |
| Reservar con nombre `Ana Pérez`, `ana@correo.com`, Muralismo, 14 de noviembre y 2 personas | `Muralismo · Sábado 14 · 2 personas · Ana Pérez` en la lista y `Reserva guardada.` |
| Recargar | La reserva sigue ahí. En **Aplicación**, `reservas-lista` tiene un arreglo con `"personas":2` (número, sin comillas) |
| Nombre `<b>Ana</b>` | Se ve tal cual, con los signos `<` y `>`, nada en negrilla |
| Filtro «Domingo 15» y recargar | Abre filtrado por el domingo, con ese botón presionado |
| «Cancelar» con el teclado (`Tab` y `Enter`) | La reserva desaparece, no vuelve al recargar, y el foco no se pierde |
| **Prueba de daño:** `reservas-lista` y `reservas-filtro` con `[1,7`, `5`, `{}` y `"hola"` | La página abre sin errores, sin reservas y con «Todos» |
| `reservas-filtro` con `"2026-11-20"` | Abre con «Todos»: ese día no existe |

---

## Parte 5 · Reglas propias contra el estado

Dos reglas que el HTML no puede expresar, porque dependen de **lo que ya está reservado**. Las funciones de mensaje reciben las reservas como parámetro; no leen el estado por su cuenta.

**Requisitos**

1. **No repetir:** la misma persona (el mismo correo, sin importar mayúsculas ni espacios al principio o al final) no puede reservar dos veces **el mismo taller el mismo día**. El mensaje va en el taller: `Ya tienes una reserva en este taller ese día.`
2. **El cupo:** la suma de personas de todas las reservas de ese taller **ese día**, más las de la reserva nueva, no puede pasar el `cupo` de `datos.js`. El mensaje va en personas:
   - Si quedan cupos: `Solo quedan N cupos en <nombre del taller> ese día.`
   - Si no queda ninguno: `Ya no quedan cupos en <nombre del taller> ese día.`
3. **Los campos que dependen de otro se revisan otra vez** cuando ese otro cambia, si ya tenían un mensaje: si cambia el correo, el taller; si cambia el taller, las personas; si cambia el día, el taller y las personas.

**Comprobación** (desde una lista vacía, en este orden)

| Reserva | Lo que se ve |
| --- | --- |
| Ana, `ana@correo.com`, Muralismo, día 14, 2 personas | Se guarda |
| Ana otra vez, `ANA@correo.com`, Muralismo, día 14, 1 persona | `⚠ Ya tienes una reserva en este taller ese día.` y el foco en el taller |
| Cambiar el día al 15 | El mensaje del taller desaparece solo. Al enviar, se guarda |
| Luis, `luis@correo.com`, Muralismo, día 14, 6 personas | Se guarda: el sábado quedan 0 cupos (2 + 6 = 8) |
| Eva, `eva@correo.com`, Muralismo, día 14, 1 persona | `⚠ Ya no quedan cupos en Muralismo ese día.` |
| Cambiar el taller a Fotografía nocturna | El mensaje de personas desaparece solo |
| Leo, `leo@correo.com`, Cocina de la región, día 13, 6 personas, y después Mia, `mia@correo.com`, Cocina de la región, día 13, 5 personas | A Mia: `⚠ Solo quedan 4 cupos en Cocina de la región ese día.` |

---

## Parte 6 · El borrador en `sessionStorage`

**Requisitos**

1. Mientras se escribe en el formulario, lo escrito en los cinco campos se guarda en `sessionStorage` como **un solo objeto** en JSON.
2. Al cargar, los campos se llenan con el borrador. La lectura es tan segura como la de la Parte 4: un borrador dañado no rompe la página.
3. Al guardar una reserva, el borrador se borra.

**Comprobación**

| Haga esto | Lo que se ve |
| --- | --- |
| Escribir nombre, escoger Danza folclórica y 3 personas, **sin** reservar, y recargar | Los tres datos siguen en el formulario, **también el taller** del `<select>` |
| Reservar y recargar | El formulario queda vacío |
| Escribir algo, cerrar la pestaña y abrir la dirección en una nueva | El formulario está vacío, pero las reservas siguen ahí |
| `reservas-borrador` con `[1,7` en *Almacenamiento de sesión* | La página abre sin errores |

---

## Revisión final

- [ ] La consola no muestra errores al cargar ni al usar la página.
- [ ] `app.js` y al menos cuatro módulos más, cada uno con una responsabilidad. Solo `app.js` conoce el `estado`.
- [ ] Todas las tablas de **Comprobación** pasan.
- [ ] **Con el teclado:** `Tab` recorre los campos, «Reservar», los filtros y los «Cancelar» en orden. `Enter` envía y `Espacio` presiona un filtro.
- [ ] Nada sensible en el almacenamiento: ni contraseñas ni documentos de identidad.
- [ ] Ningún `innerHTML` con datos del usuario.

## Pistas

| Si no recuerdan… | Búsquenlo en |
| --- | --- |
| `novalidate`, `validity` y un mensaje por causa | `session-5/guias/guia-1.md`, Pasos 4 y 5 |
| `marcar`: `setCustomValidity`, `aria-invalid` y el `<p>` del error | `session-5/guias/guia-1.md`, Paso 5 |
| La tabla `reglas` y validar todo al enviar con `filter` | `session-5/guias/guia-1.md`, Paso 7 |
| `focusout` e `input`, y revisar otra vez un campo que depende de otro | `session-5/guias/guia-1.md`, Paso 8, y `session-5/guias/guia-2.md`, Paso 4 |
| `min`, `max` y `step` en números y fechas | `session-5/guias/guia-2.md`, Pasos 3 y 4 |
| Limpiar los `aria-invalid` después de `reset()` | `session-5/guias/guia-2.md`, Paso 8 |
| `setItem`, `getItem`, JSON | `session-6/guias/guia-1.md`, Pasos 2 y 3 |
| `estado`, `pintar` y `actualizar` | `session-6/guias/guia-1.md`, Paso 4 |
| Un escuchador para todos los botones y el foco después de repintar | `session-6/guias/guia-1.md`, Paso 5 |
| `leer` con valor por defecto, `try`/`catch` y la forma del dato | `session-6/guias/guia-1.md`, Pasos 6 y 7 |
| Una preferencia revisada contra los valores permitidos | `session-6/guias/guia-1.md`, Paso 8 |
| `sessionStorage` y el borrador | `session-6/guias/guia-1.md`, Paso 9 |
| `export`, `import`, `./` y `.js` | `session-6/guias/guia-2.md`, Pasos 3 y 4 |
| Pasar datos como parámetro en lugar de leer el estado | `session-6/guias/guia-2.md`, Pasos 4 y 6 |

**Tres trampas conocidas:**

- **El nombre corto:** `validity.tooShort` solo se activa cuando la persona escribe, no cuando el valor se pone desde el código. Revisen la longitud del texto sin espacios, como se hizo con la contraseña.
- **El `<select>` del borrador:** un `<select>` solo acepta un `value` que exista entre sus opciones. Si el borrador se devuelve **antes** de llenar los talleres, el taller se pierde.
- **Los números del almacenamiento:** lo que sale de un campo siempre es texto. Si `personas` se guarda como `"2"`, la suma del cupo deja de sumar y pega textos: `0 + "2" + "6"` da `"026"`, no `8`.

## Si terminan antes

- Que cada opción del `<select>` diga cuántos cupos quedan para el día escogido, por ejemplo `Muralismo (quedan 6)`, y se actualice al cambiar el día.
- Un contador encima de la lista: `Mostrando 2 de 5 reservas`.
- El tema oscuro de la guía, como segunda preferencia guardada.
