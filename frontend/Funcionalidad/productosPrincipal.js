let listaProductosGlobal = [];
let listaCategoriasGlobal = [];
let categoriaActiva = null; // guarda el _id de la categoría seleccionada, o null = todas

// ==========================
// Obtener categorías y emparejarlas con los botones del HTML
// ==========================
async function categorias() {
    try {
        const res = await fetch("http://localhost:3000/categorias");
        const categoriasData = await res.json();

        listaCategoriasGlobal = categoriasData;

        // Por cada botón de categoría en el HTML (data-categoria="gaming", etc.)
        // le asignamos el _id real que le corresponde según el slug
        document.querySelectorAll(".categoria-item").forEach((item) => {
            const slug = item.dataset.categoria;
            const categoria = listaCategoriasGlobal.find(c => c.slug === slug);

            if (categoria) {
                item.dataset.categoriaId = categoria._id;
            }

            item.addEventListener("click", (e) => {
                e.preventDefault();
                seleccionarCategoria(item);
            });
        });
    } catch (error) {
        console.error("Error al obtener categorías:", error);
    }
}

// ==========================
// Selecciona (o deselecciona si ya estaba activa) una categoría
// ==========================
function seleccionarCategoria(item) {
    const idClickeado = item.dataset.categoriaId;

    // Si clickean la misma categoría que ya estaba activa, se quita el filtro
    if (categoriaActiva === idClickeado) {
        categoriaActiva = null;
        item.classList.remove("activa");
    } else {
        categoriaActiva = idClickeado;
        document.querySelectorAll(".categoria-item").forEach(cat => cat.classList.remove("activa"));
        item.classList.add("activa");
    }

    filtrarProductos();
}

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
    <div class="card" data-categoria-id="${producto.categoria ?? ""}">
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
// Buscador (input en vivo + botón) + filtro por categoría combinados
// ==========================
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function filtrarProductos() {
    const texto = searchInput.value.toLowerCase().trim();

    const productosFiltrados = listaProductosGlobal.filter((producto) => {
        const coincideTexto = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = !categoriaActiva || producto.categoria === categoriaActiva;

        return coincideTexto && coincideCategoria;
    });

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
categorias();
productos();