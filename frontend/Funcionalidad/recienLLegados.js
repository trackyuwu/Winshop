// ==========================
// Recién llegados (Index.html)
// Muestra los últimos productos publicados, sin filtros ni buscador
// ==========================

let listaVitrinaGlobal = [];

async function cargarRecienLlegados() {
    try {
        const res = await fetch("https://winshop-y543.onrender.com/productos");
        const productosData = await res.json();

        // Tomamos los últimos 10 productos (los más recientes según orden de inserción en Mongo)
        listaVitrinaGlobal = productosData.slice(-10).reverse();

        renderVitrina(listaVitrinaGlobal);
    } catch (error) {
        console.error("Error al cargar recién llegados:", error);
    }
}

function crearCardVitrinaHTML(producto) {
    return `
    <div class="card premium-card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="card-info">
            <h3>${producto.nombre}</h3>
            <div class="precio-container">
                <p class="precio-oferta">$${Number(producto.precio).toFixed(2)}</p>
            </div>
            <button class="btn-agregar-premium" data-id="${producto._id}">Añadir al Carrito</button>
        </div>
    </div>
    `;
}

function renderVitrina(listaProductos) {
    const contenedor = document.getElementById("vitrina-productos");
    if (!contenedor) return;

    contenedor.innerHTML = listaProductos.length
        ? listaProductos.map(producto => crearCardVitrinaHTML(producto)).join("")
        : "<p>No hay productos recientes para mostrar.</p>";
}

// ==========================
// Agregar al carrito (delegado, porque las cards se generan dinámicamente)
// Usa la función agregarAlCarrito() compartida que viene de carrito.js
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("vitrina-productos");
    if (!contenedor) return;

    contenedor.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-agregar-premium")) return;

        const id = e.target.dataset.id;
        const producto = listaVitrinaGlobal.find(p => p._id === id);
        if (!producto) return;

        agregarAlCarrito(producto);
    });

    cargarRecienLlegados();
});