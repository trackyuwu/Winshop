// Protección de acceso: solo admin o vendedor pueden ver este panel
const usuarioTexto = localStorage.getItem("usuarios");
const usuarioObjeto = usuarioTexto ? JSON.parse(usuarioTexto) : null;

if (!usuarioObjeto || (usuarioObjeto.rol !== "admin" && usuarioObjeto.rol !== "vendedor")) {
    window.location.href = "../Estructura/Index.html";
}

function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuarios");
    return usuario ? JSON.parse(usuario) : null;
}

let listaProductosGlobal = [];

// ==========================
// Obtener productos
// ==========================
async function productos() {
    try {
        const usuario = obtenerUsuarioActual();
        const vendedorId = usuario?._id;

        const res = await fetch(`http://localhost:3000/productos?vendedorId=${vendedorId}`);
        const productosData = await res.json();

        listaProductosGlobal = productosData;
        renderProductos(productosData);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        mostrarToast("No se pudieron cargar los productos", "error");
    }
}

// ==========================
// Molde de una card (una sola vez, se reutiliza en render y en el buscador)
// ==========================
function crearCardHTML(producto) {
    return `
    <div class="card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h4>${producto.nombre}</h4>
        <p class="precio">$${Number(producto.precio).toFixed(2)}</p>
        <span class="stock-badge">Stock: ${producto.stock ?? 0}</span>
        <p class="descripcion">${producto.descripcion || "Sin descripción"}</p>
        <button class="ver-mas" data-id="${producto._id}" onclick="verDescripcionCompleta(this)">Ver más</button>

        <div class="acciones">
            <button class="btn-action btn-editar" onclick="abrirModalEditarProducto('${producto._id}')">✏️ Editar</button>
            <button class="btn-action btn-eliminar" onclick="abrirModalEliminarProducto('${producto._id}')">🗑️ Eliminar</button>
        </div>
    </div>
    `;
}

// ==========================
// Ver descripción completa
// ==========================
function verDescripcionCompleta(boton) {
    const id = boton.dataset.id;
    const producto = listaProductosGlobal.find(p => p._id === id);
    if (!producto) return;

    document.getElementById("modal-desc-titulo").textContent = producto.nombre;
    document.getElementById("modal-desc-texto").textContent = producto.descripcion || "Sin descripción";

    document.getElementById("modal-ver-descripcion").style.display = "flex";
}
// ==========================
// Render (arma todo el HTML de una vez con map + join, en lugar de += en cada vuelta)
// ==========================
function renderProductos(listaProductos) {
    const contenedor = document.getElementById("contenedor-productos");

    contenedor.innerHTML = listaProductos.length
        ? listaProductos.map(producto => crearCardHTML(producto)).join("")
        : "<p>No hay productos para mostrar.</p>";
}

// ==========================
// Buscador por filtro
// ==========================
const inputBuscar = document.getElementById("input-buscar-producto");

inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.toLowerCase();

    const productosFiltrados = listaProductosGlobal.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
    );

    renderProductos(productosFiltrados);
});

// ==========================
// Agregar producto
// ==========================
const btnAgregarProducto = document.getElementById("btn-agregar-producto");
btnAgregarProducto.addEventListener("click", agregarProducto);

async function agregarProducto() {
    const campos = ["nombre", "precio", "cantidad", "imagen", "descripcion"];
    const [nombre, precio, cantidad, imagen, descripcion] = campos.map(
        id => document.getElementById(id).value
    );

    const usuario = obtenerUsuarioActual();
    const vendedorId = usuario?._id;

    try {
        const res = await fetch("http://localhost:3000/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, precio, stock: cantidad, imagen, descripcion, vendedorId }),
        });

        const datosServidor = await res.json();

        if (res.ok) {
            for (const id of campos) {
                document.getElementById(id).value = "";
            }

            await productos();
            mostrarToast(datosServidor.mensaje, "success");
        } else {
            mostrarToast(datosServidor.mensaje, "error");
        }
    } catch (error) {
        console.error("Error al agregar producto:", error);
        mostrarToast("No se pudo agregar el producto", "error");
    }
}

// ==========================
// Abrir modal editar
// ==========================
function abrirModalEditarProducto(id) {
    const producto = listaProductosGlobal.find(p => p._id === id);
    if (!producto) return;

    document.getElementById("modal-producto-id").value = producto._id;
    document.getElementById("modal-nombre-producto").value = producto.nombre;
    document.getElementById("modal-precio-producto").value = producto.precio;
    document.getElementById("modal-cantidad-producto").value = producto.stock ?? 1;
    document.getElementById("modal-imagen-producto").value = producto.imagen;
    document.getElementById("modal-descripcion-producto").value = producto.descripcion ?? "";

    document.getElementById("modal-editar-producto").style.display = "flex";
}

// ==========================
// Mostrar toast (notificación flotante)
// ==========================
function mostrarToast(mensaje, tipo = "success") {
    const contenedor = document.getElementById("toast-container") || crearContenedorToast();

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    // forzamos el reflow para que la transición de entrada se vea
    requestAnimationFrame(() => {
        toast.classList.add("toast-visible");
    });

    setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300); // espera a que termine la transición de salida
    }, 3000);
}

function crearContenedorToast() {
    const contenedor = document.createElement("div");
    contenedor.id = "toast-container";
    document.body.appendChild(contenedor);
    return contenedor;
}

// ==========================
// Guardar cambios (PUT)
// ==========================
const btnGuardarProducto = document.getElementById("btn-guardar-producto");
btnGuardarProducto.addEventListener("click", actualizarProducto);

async function actualizarProducto() {
    const id = document.getElementById("modal-producto-id").value;
    const campos = ["nombre-producto", "precio-producto", "cantidad-producto", "imagen-producto", "descripcion-producto"];
    const [nombre, precio, cantidad, imagen, descripcion] = campos.map(
        campo => document.getElementById(`modal-${campo}`).value
    );

    try {
        const res = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, precio, stock: cantidad, imagen, descripcion }),
        });

        const datosServidor = await res.json();

        if (res.ok) {
            document.getElementById("modal-editar-producto").style.display = "none";
            await productos();
            mostrarToast(datosServidor.mensaje, "success");
        } else {
            mostrarToast(datosServidor.mensaje, "error");
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        mostrarToast("No se pudo actualizar el producto", "error");
    }
}

// ==========================
// Eliminar producto
// ==========================
function abrirModalEliminarProducto(id) {
    document.getElementById("modal-eliminar-producto-id").value = id;
    document.getElementById("modal-eliminar-producto").style.display = "flex";
}

const eliminacionProducto = document.querySelector("#modal-eliminar-producto .btn-modal-danger");
eliminacionProducto.addEventListener("click", eliminarProducto);

async function eliminarProducto() {
    const id = document.getElementById("modal-eliminar-producto-id").value;

    try {
        const res = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE",
        });

        const datosServidor = await res.json();

        if (res.ok) {
            document.getElementById("modal-eliminar-producto").style.display = "none";
            await productos();
            mostrarToast(datosServidor.mensaje, "success");
        } else {
            mostrarToast(datosServidor.mensaje, "error");
        }
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        mostrarToast("No se pudo eliminar el producto", "error");
    }
}

productos();