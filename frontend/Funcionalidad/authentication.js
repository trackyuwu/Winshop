let form = document.getElementById("formRegistro");
let errorBox = document.getElementById("errorRegistro");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiamos los estados visuales anteriores en cada intento
    errorBox.className = "error-msg";

    let nombre = document.querySelector("input[name='nombre']").value;
    let usuario = document.querySelector("input[name='usuario']").value;
    let password = document.querySelector("input[name='password']").value;
    let confirmPassword = document.querySelector("input[name='confirmPassword']").value;
    let correo = document.querySelector("input[name='correo']").value;
    let rol = document.querySelector("select").value;
    
    // 💡 VALIDACIÓN FRONTEND: Verificar que las contraseñas coincidan antes de ir al servidor
    if (password !== confirmPassword) {
        errorBox.classList.add("error");
        errorBox.innerHTML = "⚠️ Las contraseñas no coinciden. Inténtalo de nuevo.";
        return; // Frenamos el envío
    }

    let datos = {
        nombre,
        correo,
        usuario,
        password,
        rol,
    };

    try {
        const res = await fetch("https://winshop-y543.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos),
        });

        const datosServidor = await res.json();

        if (res.ok) {
            // 💡 LOGUEO AUTOMÁTICO: Removemos el password y guardamos los datos en localStorage
            delete datosServidor.password; 
            localStorage.setItem("usuarios", JSON.stringify(datosServidor));

            // Activamos la clase verde de éxito del CSS
            errorBox.classList.add("success");
            errorBox.innerHTML = `✅ ¡Registro exitoso! Iniciando sesión como ${datosServidor.nombre}...`;

            // Esperamos 1.5 segundos para que se aprecie la animación antes de redirigir
            setTimeout(() => {
                window.location.href = "../Estructura/Index.html";
            }, 1500);

        } else {
            // Si el correo ya existe, activa el color rojo del CSS usando el mensaje del backend
            errorBox.classList.add("error");
            errorBox.innerHTML = `⚠️ ${datosServidor.mensaje}`;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        errorBox.classList.add("error");
        errorBox.innerHTML = "❌ Error de conexión. No se pudo conectar con el servidor.";
    }
});