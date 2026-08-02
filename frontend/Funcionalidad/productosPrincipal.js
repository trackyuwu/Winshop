let listaProductosGlobal = [];

// ==========================
// Obtener productos (todos, sin filtrar por vendedor)
// ==========================
async function productos() {
    try {
        const res = await fetch("http://localhost:3000/productos");
        const productosData = await res.json();

        listaProductosGlobal = productosData;
        renderProductos(productosData);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        mostrarToast("No se pudieron cargar los productos", "error");
    }
}

// ==========================
// Molde de una card
// ==========================
function crearCardHTML(producto) {
    return `
    <div class="card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${Number(producto.precio).toFixed(2)}</p>
        <span class="stock-badge">Stock: ${producto.stock ?? 0}</span>

        <p class="descripcion" id="descripcion-${producto._id}">
            ${producto.descripcion || "Sin descripción"}
        </p>
        <button class="ver-mas" data-id="${producto._id}" onclick="verDescripcionCompleta(this)">Ver más</button>

        <button class="btn-agregar" data-id="${producto._id}">Agregar</button>
    </div>
    `;
}

// ==========================
// Render
// ==========================
function renderProductos(listaProductos) {
    const contenedor = document.getElementById("contenedor-productos");

    contenedor.innerHTML = listaProductos.length
        ? listaProductos.map(producto => crearCardHTML(producto)).join("")
        : "<p>No se encontraron productos.</p>";
}

// ==========================
// Ver más (modal con la descripción completa)
// ==========================
const modalDescripcion = document.getElementById("modal-descripcion");
const modalDescripcionTitulo = document.getElementById("modal-descripcion-titulo");
const modalDescripcionTexto = document.getElementById("modal-descripcion-texto");

function verDescripcionCompleta(boton) {
    const id = boton.dataset.id;
    const producto = listaProductosGlobal.find(p => p._id === id);
    if (!producto) return;

    modalDescripcionTitulo.textContent = producto.nombre;
    modalDescripcionTexto.textContent = producto.descripcion || "Sin descripción";

    modalDescripcion.style.display = "flex";
}

// ==========================
// Buscador (input en vivo + botón)
// ==========================
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function filtrarProductos() {
    const texto = searchInput.value.toLowerCase().trim();

    const productosFiltrados = listaProductosGlobal.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
    );

    renderProductos(productosFiltrados);
}

searchInput.addEventListener("input", filtrarProductos);
searchButton.addEventListener("click", filtrarProductos);

// ==========================
// Agregar al carrito
// ==========================
const contenedor = document.getElementById("contenedor-productos");

contenedor.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-agregar")) return;

    const id = e.target.dataset.id;
    const producto = listaProductosGlobal.find(p => p._id === id);
    if (!producto) return;

    agregarAlCarrito(producto);
});

function agregarAlCarrito(producto) {
    // Conecta aquí tu lógica real de carrito (localStorage, contexto global, etc.)
    console.log("Agregado al carrito:", producto);

    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = Number(cartCount.textContent) + 1;
}

// ==========================
// Inicio
// ==========================
productos();