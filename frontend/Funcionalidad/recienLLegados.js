const LIMITE_VITRINA = 12;

async function cargarVitrina() {
    try {
        const res = await fetch("http://localhost:3000/productos");
        const productosData = await res.json();

        // Ordena por más reciente usando el _id de Mongo (trae la fecha embebida)
        // y se queda solo con los primeros N para no saturar el inicio.
        const recientes = [...productosData]
            .sort((a, b) => (a._id < b._id ? 1 : -1))
            .slice(0, LIMITE_VITRINA);

        renderVitrina(recientes);
    } catch (error) {
        console.error("Error al cargar la vitrina:", error);
        document.getElementById("vitrina-productos").innerHTML =
            "<p>No se pudieron cargar los productos.</p>";
    }
}

function crearVitrinaCardHTML(producto) {
    return `
    <div class="vitrina-card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="vitrina-info">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${Number(producto.precio).toFixed(2)}</p>
            <button class="btn-agregar" data-id="${producto._id}">Agregar</button>
        </div>
    </div>
    `;
}

function renderVitrina(productosData) {
    const contenedor = document.getElementById("vitrina-productos");

    contenedor.innerHTML = productosData.length
        ? productosData.map(producto => crearVitrinaCardHTML(producto)).join("")
        : "<p>Todavía no hay productos publicados.</p>";
}

// Reutiliza la misma lógica de "agregar al carrito" del resto del sitio
const vitrina = document.getElementById("vitrina-productos");

vitrina.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-agregar")) return;

    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = Number(cartCount.textContent) + 1;
});

cargarVitrina();