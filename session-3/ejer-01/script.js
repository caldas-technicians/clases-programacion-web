
const botonMenu = document.getElementById("boton-menu");
const menu = document.getElementById("menu");

// Abre o cierra el menú
function alternarMenu() {
    const abierto = menu.classList.toggle("abierto");

    botonMenu.setAttribute("aria-expanded", String(abierto));
}

// Cierra el menú
function cerrarMenu() {
    menu.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
}

// Evento del botón
botonMenu.addEventListener("click", alternarMenu);

// Cerrar al pulsar Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        cerrarMenu();
        botonMenu.focus();
    }
});

// Cerrar al seleccionar una opción
menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        cerrarMenu();
    }
});

// Sincronizar el estado al cambiar a escritorio
const escritorio = window.matchMedia("(min-width: 700px)");

escritorio.addEventListener("change", () => {
    cerrarMenu();
});
