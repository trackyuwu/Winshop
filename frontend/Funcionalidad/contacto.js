// ==========================================================================
// Soporte — envío del formulario de contacto
// Colección esperada en el backend: solicitudes_soporte
// ==========================================================================

function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuarios");
    return usuario ? JSON.parse(usuario) : null;
}

// ==========================================================================
// Si hay un usuario logueado, le precargamos su correo en el formulario
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const usuario = obtenerUsuarioActual();
    const inputCorreo = document.getElementById("correo");

    if (usuario && inputCorreo) {
        inputCorreo.value = usuario.correo ?? "";
    }
});

// ==========================================================================
// Enviar solicitud de soporte
// ==========================================================================
const btnEnviarMensaje = document.getElementById("btn-enviar-mensaje");
btnEnviarMensaje.addEventListener("click", enviarSolicitudSoporte);

async function enviarSolicitudSoporte() {
    const campos = ["nombre", "correo", "asunto", "mensaje"];
    const [nombre, correo, asunto, mensaje] = campos.map(
        id => document.getElementById(id).value.trim()
    );

    if (!nombre || !correo || !asunto || !mensaje) {
        mostrarToast("Por favor completa todos los campos", "error");
        return;
    }

    const usuario = obtenerUsuarioActual();
    const usuarioId = usuario?._id ?? null;

    try {
        const res = await fetch("http://localhost:3000/solicitudes-soporte", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, asunto, mensaje, usuarioId }),
        });

        const datosServidor = await res.json();

        if (res.ok) {
            document.getElementById("nombre").value = "";
            document.getElementById("asunto").value = "";
            document.getElementById("mensaje").value = "";
            // El correo se deja, por si el usuario quiere enviar otra solicitud

            mostrarToast(datosServidor.mensaje ?? "Mensaje enviado correctamente", "success");
        } else {
            mostrarToast(datosServidor.mensaje ?? "No se pudo enviar el mensaje", "error");
        }
    } catch (error) {
        console.error("Error al enviar solicitud de soporte:", error);
        mostrarToast("No se pudo enviar el mensaje", "error");
    }
}

// ==========================================================================
// Toast (notificación flotante) — igual al que se usa en el resto del sitio
// ==========================================================================
function mostrarToast(mensaje, tipo = "success") {
    const contenedor = document.getElementById("toast-container") || crearContenedorToast();

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("toast-visible");
    });

    setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function crearContenedorToast() {
    const contenedor = document.createElement("div");
    contenedor.id = "toast-container";
    document.body.appendChild(contenedor);
    return contenedor;
}