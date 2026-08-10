// ==========================================================================
// CARRITO — ahora persistido en MongoDB (colección "carritos"), atado al
// usuario logueado. Cada documento: { usuarioId, productoId, nombre, precio, imagen, cantidad }
// ==========================================================================

function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuarios");
    return usuario ? JSON.parse(usuario) : null;
}

// ==========================================================================
// Contador del navbar (🛒 con el número al lado)
// ==========================================================================
async function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    const usuario = obtenerUsuarioActual();
    if (!usuario) {
        cartCount.textContent = "0";
        return;
    }

    try {
        const res = await fetch(`https://winshop-y543.onrender.com/carrito?usuarioId=${usuario._id}`);
        const carrito = await res.json();

        const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        cartCount.textContent = totalUnidades;
    } catch (error) {
        console.error("Error al actualizar contador del carrito:", error);
    }
}

// ==========================================================================
// Agregar un producto al carrito
// ==========================================================================
async function agregarAlCarrito(producto) {
    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        if (typeof mostrarToast === "function") {
            mostrarToast("Debes iniciar sesión para agregar al carrito", "error");
        }
        return;
    }

    try {
        const res = await fetch("https://winshop-y543.onrender.com/carrito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario._id,
                productoId: producto._id,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                imagen: producto.imagen
            })
        });

        const datosServidor = await res.json();

        if (res.ok) {
            await actualizarContadorCarrito();
            if (typeof mostrarToast === "function") {
                mostrarToast(`${producto.nombre} agregado al carrito`, "success");
            }
        } else {
            if (typeof mostrarToast === "function") {
                mostrarToast(datosServidor.mensaje ?? "No se pudo agregar al carrito", "error");
            }
        }
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
    }
}

// ==========================================================================
// Quitar un ítem del carrito (recibe el _id del documento en "carritos")
// ==========================================================================
async function quitarDelCarrito(idDocumento) {
    try {
        await fetch(`https://winshop-y543.onrender.com/carrito/${idDocumento}`, {
            method: "DELETE"
        });

        await actualizarContadorCarrito();
        await renderCarritoPanel();
    } catch (error) {
        console.error("Error al quitar del carrito:", error);
    }
}

// ==========================================================================
// Sumar / restar una unidad a un ítem del carrito
// ==========================================================================
async function cambiarCantidad(idDocumento, accion) {
    try {
        await fetch(`https://winshop-y543.onrender.com/carrito/${idDocumento}/${accion}`, {
            method: "PUT"
        });

        await actualizarContadorCarrito();
        await renderCarritoPanel();
    } catch (error) {
        console.error("Error al cambiar cantidad:", error);
    }
}

// ==========================================================================
// Renderizar el panel completo del carrito (solo en carrito.html)
// ==========================================================================
async function renderCarritoPanel() {
    const listaUl = document.querySelector("#Productos-agregados ul");
    if (!listaUl) return; // esta función solo aplica en carrito.html

    const totalSpan = document.getElementById("totalCarrito");
    const carritoVacio = document.getElementById("carrito-vacio");
    const seccionCarrito = document.getElementById("carrito");

    const usuario = obtenerUsuarioActual();

    if (!usuario) {
        listaUl.innerHTML = "";
        if (carritoVacio) carritoVacio.style.display = "block";
        if (seccionCarrito) seccionCarrito.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`https://winshop-y543.onrender.com/carrito?usuarioId=${usuario._id}`);
        const carrito = await res.json();

        if (carrito.length === 0) {
            listaUl.innerHTML = "";
            if (carritoVacio) carritoVacio.style.display = "block";
            if (seccionCarrito) seccionCarrito.style.display = "none";
            return;
        }

        if (carritoVacio) carritoVacio.style.display = "none";
        if (seccionCarrito) seccionCarrito.style.display = "block";

        listaUl.innerHTML = carrito.map((item) => {
            const subtotal = item.precio * item.cantidad;

            return `
            <li data-id="${item._id}">
                <img class="carrito-item-img" src="${item.imagen}" alt="${item.nombre}">

                <div class="carrito-item-info">
                    <span class="carrito-item-nombre">${item.nombre}</span>

                    <div class="carrito-item-controles">
                        <button class="btn-cantidad btn-restar" data-id="${item._id}" title="Restar">−</button>
                        <span class="carrito-item-cantidad">${item.cantidad}</span>
                        <button class="btn-cantidad btn-sumar" data-id="${item._id}" title="Sumar">+</button>
                    </div>
                </div>

                <div class="carrito-item-precio">
                    $${subtotal.toFixed(2)}
                    <button class="btn-quitar-item" data-id="${item._id}" title="Quitar">✕</button>
                </div>
            </li>
            `;
        }).join("");

        const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        if (totalSpan) totalSpan.textContent = total.toFixed(2);

    } catch (error) {
        console.error("Error al renderizar el carrito:", error);
    }
}

// ==========================================================================
// Vaciar el carrito completo (al confirmar la compra)
// ==========================================================================
async function vaciarCarrito() {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return;

    try {
        await fetch(`https://winshop-y543.onrender.com/carrito/usuario/${usuario._id}`, {
            method: "DELETE"
        });

        await actualizarContadorCarrito();
        await renderCarritoPanel();
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
    }
}

// ==========================================================================
// Eventos
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    renderCarritoPanel();

    // Click en "quitar" o en +/- dentro de la lista (delegado, porque los <li> se regeneran)
    const listaUl = document.querySelector("#Productos-agregados ul");
    if (listaUl) {
        listaUl.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-quitar-item")) {
                quitarDelCarrito(e.target.dataset.id);
                return;
            }

            if (e.target.classList.contains("btn-sumar")) {
                cambiarCantidad(e.target.dataset.id, "sumar");
                return;
            }

            if (e.target.classList.contains("btn-restar")) {
                cambiarCantidad(e.target.dataset.id, "restar");
                return;
            }
        });
    }

    // Botón "Confirmar compra" -> abre el modal
    const btnConfirm = document.getElementById("confirm");
    const modalConfirmar = document.getElementById("modal-confirmar-compra");

    if (btnConfirm && modalConfirmar) {
        btnConfirm.addEventListener("click", async () => {
            const usuario = obtenerUsuarioActual();
            if (!usuario) return;

            const res = await fetch(`https://winshop-y543.onrender.com/carrito?usuarioId=${usuario._id}`);
            const carrito = await res.json();
            if (carrito.length === 0) return;

            modalConfirmar.classList.add("active");
        });
    }

    // Botón "Sí, confirmar" dentro del modal -> vacía el carrito de verdad
    const btnConfirmarSi = document.getElementById("btn-confirmar-si");
    if (btnConfirmarSi && modalConfirmar) {
        btnConfirmarSi.addEventListener("click", async () => {
            await vaciarCarrito();
            modalConfirmar.classList.remove("active");

            if (typeof mostrarToast === "function") {
                mostrarToast("Compra confirmada", "success");
            }
        });
    }

    // Botón "Cancelar" dentro del modal -> solo lo cierra
    const btnCancelar = document.querySelector("#modal-confirmar-compra .btn-modal-cancelar");
    if (btnCancelar && modalConfirmar) {
        btnCancelar.addEventListener("click", () => {
            modalConfirmar.classList.remove("active");
        });
    }
});