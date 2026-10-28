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
