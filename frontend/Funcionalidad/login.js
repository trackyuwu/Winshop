let formLogin = document.getElementById("formLogin");
let errorBox = document.getElementById("errorLogin"); // Capturamos tu caja del HTML

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // 1. Limpiamos las clases anteriores para que la caja se oculte antes de validar de nuevo
    errorBox.className = "error-msg"; 
    
    let correo = document.querySelector("input[name='correo']").value;
    let password = document.querySelector("input[name='password']").value;
    
    let usuarios = {
        correo,
        password,
    }

    // hacemos un try/catch para controlar si se cae el servidor de Node
    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarios),
        });

        // Como el servidor ahora siempre responde con res.json(), lo leemos aquí arriba para ambos casos
        const data = await res.json();

        if(res.ok){
            // Borramos el campo password antes de guardarlo por seguridad
            delete data.password; 
            localStorage.setItem("usuarios", JSON.stringify(data));
            
            // 2. Agregamos la clase 'success' (activa el color verde en login.css)
            errorBox.classList.add("success");
            errorBox.innerHTML = `✅ ¡Bienvenido de vuelta, ${data.nombre}! Redirigiendo...`;

            // Esperamos segundo y medio para que el usuario disfrute la interfaz antes de redirigir
            setTimeout(() => {
                window.location.href = "../Estructura/Index.html";
            }, 1500);

        } else {
            // 3. Agregamos la clase 'error' (activa el color rojo en login.css)
            errorBox.classList.add("error");
            errorBox.innerHTML = `⚠️ ${data.mensaje}`; // Lee el mensaje exacto enviado por MongoDB
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        errorBox.classList.add("error");
        errorBox.innerHTML = "❌ No se pudo conectar con el servidor. Verifica que Node esté corriendo.";
    }
});