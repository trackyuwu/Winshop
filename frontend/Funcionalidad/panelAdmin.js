// Protección de acceso: solo admin puede ver este panel
const usuarioTexto = localStorage.getItem("usuarios");
const usuarioObjeto = usuarioTexto ? JSON.parse(usuarioTexto) : null;

if (!usuarioObjeto || usuarioObjeto.rol !== "admin") {
    window.location.href = "../Estructura/Index.html";
}

let listaUsuariosGlobal = [];

async function usuarios() {
    const res = await fetch("http://localhost:3000/usuarios");
    const users = await res.json();

    listaUsuariosGlobal = users;

    let totalClientes = 0;
    let totalVendedores = 0;
    let totalUsuarios = 0;

    console.log(users);

    // PASO 1: Capturas el contenedor vacío de tu HTML
    let tabla = document.getElementById("tabla-usuarios-body");

    // PASO 2: Arrancas el ciclo con tu contador 'i'
    for (let i = 0; i < users.length; i++) {
    
        // Guardas el usuario de la vuelta actual en una variable cortita
        let usuarioActual = users[i];

        if(usuarioActual.rol === "cliente"){
            totalClientes++;
        }else if(usuarioActual.rol === "vendedor"){
            totalVendedores++
        }else{
            totalUsuarios++
        }

        document.getElementById("stat-total-clientes").textContent = totalClientes;
        document.getElementById("stat-total-vendedores").textContent = totalVendedores;
        document.getElementById("stat-total-usuarios").textContent = users.length;
    
        // PASO 3: Se Crea el molde HTML usando los datos reales
        // Aquí se usan las comillas invertidas `` y las etiquetas para tablas del html
        // Este es el molde que se repetirá por cada usuario en la base de datos
        // 
        let filaHTML = `
        <tr>
            <td><code>${usuarioActual._id}</code></td>
            <td>${usuarioActual.nombre}</td>
            <td>${usuarioActual.correo}</td>
            <td><span class="badge-rol ${usuarioActual.rol}">${usuarioActual.rol}</span></td>
            <td>
                <div class="acciones-botones">
                    <button class="btn-action btn-cambiar" onclick="abrirModalCambiarRol('${usuarioActual._id}', '${usuarioActual.rol}')">🔄 Cambiar Rol</button>
                    <button class="btn-action btn-eliminar" onclick="abrirModalEliminarUsuario('${usuarioActual._id}')">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
        `;

    // Aquí abajo es donde sumas este molde al contenido de tu tabla en cada vuelta
    tabla.innerHTML += filaHTML;
    // y reemplazas con ${usuarioActual.nombre}, ${usuarioActual._id}, etc.
    
    // Al final de la vuelta, le sumas este molde al contenido de la tabla
    }

    // 👈 buscador por filtro
let inputBuscar = document.getElementById("input-buscar-usuario");

inputBuscar.addEventListener("input", () => {
    let texto = inputBuscar.value.toLowerCase();
    let tabla = document.getElementById("tabla-usuarios-body");
    
    // 1. Limpiamos la tabla por completo
    tabla.innerHTML = ""; 

    // 2. Filtramos los usuarios de la lista global
    let usuariosFiltrados = listaUsuariosGlobal.filter(usuario => {
        return usuario.nombre.toLowerCase().includes(texto) || 
               usuario.correo.toLowerCase().includes(texto);
    });

    // 3. Volvemos a recorrer los usuarios filtrados para dibujarlos
    for (let i = 0; i < usuariosFiltrados.length; i++) {
        let usuarioActual = usuariosFiltrados[i];

        let filaHTML = `
        <tr>
            <td><code>${usuarioActual._id}</code></td>
            <td>${usuarioActual.nombre}</td>
            <td>${usuarioActual.correo}</td>
            <td><span class="badge-rol ${usuarioActual.rol}">${usuarioActual.rol}</span></td>
            <td>
                <div class="acciones-botones">
                    <button class="btn-action btn-cambiar" onclick="abrirModalCambiarRol('${usuarioActual._id}', '${usuarioActual.rol}')">🔄 Cambiar Rol</button>
                    <button class="btn-action btn-eliminar" onclick="abrirModalEliminarUsuario('${usuarioActual._id}')">🗑️ Eliminar</button>
                </div>
            </td>
        </tr>
        `;
        tabla.innerHTML += filaHTML;
    }
});
}


let guardarRol = document.getElementById("btn-guardar-rol");
let usuarioId = document.getElementById("modal-usuario-id")
let seleccionarNuevoRol  = document.getElementById("select-nuevo-rol")

guardarRol.addEventListener("click", actualizarUsuarios)

async function actualizarUsuarios() {
    let id = usuarioId.value;
    let nuevoRol = seleccionarNuevoRol.value
    let tabla = document.getElementById("tabla-usuarios-body");

    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({rol: nuevoRol}),
    })
    // Convertimos la respuesta del backend a JSON para leer el mensaje
    const datosServidor = await res.json(); 

    if (res.ok) {
        // SI SE ELIMINÓ (Estado 200 OK):
        tabla.innerHTML = "";
        usuarios(); // Recargamos la tabla limpia
        
        // Pasamos el mensaje del backend ("Usuario eliminado correctamente...")
        // Usamos 'success' para que salga verde o el color de éxito que prefieras
        mostrarToast(datosServidor.mensaje, "success"); 
    } else {
        // SI EL BACKEND LO BLOQUEÓ (Estado 403 o 404):
        // Pasamos el mensaje del escudo del backend ("Seguridad crítica: No está permitido...")
        // Usamos 'error' para que salga en rojo
        mostrarToast(datosServidor.mensaje, "error");
    }
}

let eliminacionUsuario = document.querySelector("#modal-eliminar-usuario .btn-modal-danger");
eliminacionUsuario.addEventListener("click", eliminarUsuario)

async function eliminarUsuario() {
    let usuarioEliminado = document.getElementById("modal-eliminar-id").value;
    let tabla = document.getElementById("tabla-usuarios-body");

    const res = await fetch(`http://localhost:3000/usuarios/${usuarioEliminado}`, {
        method: "DELETE",
    });

    // Convertimos la respuesta del backend a JSON para leer el mensaje
    const datosServidor = await res.json(); 

    if (res.ok) {
        // SI SE ELIMINÓ (Estado 200 OK):
        tabla.innerHTML = "";
        usuarios(); // Recargamos la tabla limpia
        
        // Pasamos el mensaje del backend ("Usuario eliminado correctamente...")
        // Usamos 'success' para que salga verde como color de éxito
        mostrarToast(datosServidor.mensaje, "success"); 
    } else {
        // SI EL BACKEND LO BLOQUEÓ (Estado 403 o 404):
        // Pasamos el mensaje del escudo del backend ("Seguridad crítica: No está permitido...")
        // Usamos 'error' para que salga en rojo
        mostrarToast(datosServidor.mensaje, "error");
    }
}

usuarios()