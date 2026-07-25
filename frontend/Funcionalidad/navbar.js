let login = document.getElementById("nav-login");
let registro = document.getElementById("nav-register");
let logout = document.getElementById("nav-logout");
let user = document.getElementById("nav-user");
let panelVendedor = document.getElementById("nav-panel");
let carrito = document.getElementById("nav-cart");
let panelAdmin = document.getElementById("nav-panelAdmin");

function actualizarNavbar(){
    let usuarioTexto = localStorage.getItem("usuarios");
    if(usuarioTexto != null){
        const usuarioObjeto = JSON.parse(usuarioTexto);
        login.style.display = "none";
        registro.style.display = "none";
        logout.style.display = "block";
        user.style.display = "block";
        carrito.style.display = "block";
        user.querySelector("a").textContent = usuarioObjeto.nombre
        if(usuarioObjeto.rol === "vendedor"){
            panelVendedor.style.display = "block"
        }else if(usuarioObjeto.rol === "admin"){
            panelVendedor.style.display = "block";
            panelAdmin.style.display = "block";
        }else{
            panelAdmin.style.display = "none";
            panelVendedor.style.display = "none";
        }
    }else{
        login.style.display = "block";
        registro.style.display = "block";
        logout.style.display = "none";
    }
    

    console.log(usuarioTexto)
}

actualizarNavbar()

logout.addEventListener("click", cerrarSesion);

function cerrarSesion(e){
    console.log("click detectado");
    e.preventDefault()
    localStorage.removeItem("usuarios");
    window.location.href = "../Estructura/Index.html"
}