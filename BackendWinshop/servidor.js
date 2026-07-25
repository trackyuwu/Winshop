const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;
let coleccion;
let coleccion_productos;

async function conectar(){
    await client.connect();
    db = client.db("winshop");
    console.log("MongoDB conectado");
    coleccion = db.collection("usuarios");
    coleccion_productos = db.collection("productos");
}

conectar();

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});

// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
    const usuarios = await coleccion.find().toArray();
    res.json(usuarios);
});

// Obtener todos los productos
app.get("/productos", async (req, res) => {
    try {
        const { vendedorId } = req.query;
        const filtro = vendedorId ? { vendedorId } : {};

        const productos = await coleccion_productos.find(filtro).toArray();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

/* Registro y login de usuarios */

app.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const datos = req.body;

        // Normalizamos los datos a minúsculas para evitar duplicados por mayúsculas
        datos.correo = datos.correo.toLowerCase();
        datos.rol = datos.rol.toLowerCase();

        const UsuariosRegistrados = await coleccion.findOne({ correo: datos.correo });

        if (UsuariosRegistrados === null) {
            // 1. Insertamos el usuario en MongoDB
            const resultado = await coleccion.insertOne(datos);
            
            // 2. IMPORTANTE: Le agregamos al objeto 'datos' el _id que le asignó MongoDB nativamente
            datos._id = resultado.insertedId;

            // 3. Enviamos el objeto 'datos' completo. Para que se loguee directo luego del registro
            res.json(datos); 
            
        } else {
            // Si el usuario ya existe, devolvemos un 400 (Bad Request)
            res.status(400).json({ mensaje: "El usuario ya existe" });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

// Login de usuario
app.post("/login", async (req, res) => {
    try {
        const usuarios = req.body;
        const correoMinuscula = usuarios.correo.toLowerCase(); // Corregido el uso aquí
        
        const UsuariosRegistrados = await coleccion.findOne({ correo: correoMinuscula });

        if (UsuariosRegistrados === null) {
            return res.status(404).json({ mensaje: "El usuario no existe" });
        } else if (UsuariosRegistrados.password === usuarios.password) {
            // Enviamos el usuario completo. El frontend se encargará de remover la password si lo requiere
            res.json(UsuariosRegistrados);
        } else {
            return res.status(401).json({ mensaje: "El correo o la contraseña no coinciden" });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

// RUTA PARA ELIMINAR UN USUARIO
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id; 
        
        // 1. Buscamos primero al usuario usando ObjectId nativo
        const usuarioAEliminar = await coleccion.findOne({ _id: new ObjectId(idUsuario) });

        if (!usuarioAEliminar) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // 2. ESCUDO DE SEGURIDAD
        if (usuarioAEliminar.rol === 'admin') {
            return res.status(403).json({ 
                mensaje: "Seguridad crítica: No está permitido eliminar cuentas de Administrador" 
            });
        }

        // 3. Borrado definitivo
        await coleccion.deleteOne({ _id: new ObjectId(idUsuario) });
        res.json({ mensaje: "Usuario eliminado correctamente de la base de datos" });

    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

// RUTA PARA ACTUALIZAR ROL
app.put('/usuarios/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id; 
        const nuevoRol = req.body.rol;
        
        // 1. Buscamos primero al usuario real para verificar su rol actual
        const usuarioAActualizar = await coleccion.findOne({ _id: new ObjectId(idUsuario) });

        if (!usuarioAActualizar) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // 2. ESCUDO DE SEGURIDAD
        if (usuarioAActualizar.rol === 'admin') {
            return res.status(403).json({ 
                mensaje: "Seguridad crítica: No está permitido cambiar cuentas de Administrador" 
            });
        }

        // 3. Actualización de rol
        await coleccion.updateOne(
            { _id: new ObjectId(idUsuario) }, 
            { $set: { rol: nuevoRol } }        
        );

        res.json({ mensaje: "Usuario actualizado correctamente en la base de datos" });

    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

app.post("/productos", async (req, res) => {
    try {
        console.log(req.body);
        const campos = req.body;

        // Normalizamos los datos a minúsculas para evitar duplicados por mayúsculas
        campos.nombre = campos.nombre.toLowerCase();
        campos.precio = campos.precio.toLowerCase();

        const productosRegistrados = await coleccion_productos.findOne({ nombre: campos.nombre });

        if (productosRegistrados === null) {
            // 1. Insertamos el producto en MongoDB
            const resultado_productos = await coleccion_productos.insertOne(campos);
            
            // 2. IMPORTANTE: Le agregamos al objeto 'datos' el _id que le asignó MongoDB nativamente
            campos._id = resultado_productos.insertedId;

            // 3. Enviamos el objeto 'datos' completo. Para que se loguee directo luego del registro
            campos.mensaje = "Producto agregado correctamente";
            res.json(campos); 
            
        } else {
            // Si el usuario ya existe, devolvemos un 400 (Bad Request)
            res.status(400).json({ mensaje: "El producto ya existe" });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const idProducto = req.params.id; 

        const { nombre, precio, stock, imagen, descripcion } = req.body;
        
        // 1. Buscamos primero al usuario real para verificar su rol actual
        const productoActualizar = await coleccion_productos.findOne({ _id: new ObjectId(idProducto) });

        if (!productoActualizar) {
            return res.status(404).json({ mensaje: "producto no encontrado" });
        }

        // 2. ESCUDO DE SEGURIDAD
        /*if (usuarioAActualizar.rol === 'admin') {
            return res.status(403).json({ 
                mensaje: "Seguridad crítica: No está permitido cambiar cuentas de Administrador" 
            });
        }*/

        // 3. Actualización de campos
        await coleccion_productos.updateOne(
            { _id: new ObjectId(idProducto) },
            {
                $set: {
                    nombre,
                    precio,
                    stock,
                    imagen,
                    descripcion
                }
            }
        );


        res.json({ mensaje: "Producto actualizado correctamente en la base de datos" });

    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});
app.delete('/productos/:id', async (req, res) => {
    try {
        const idProducto = req.params.id; 
        
        // 1. Buscamos primero al usuario usando ObjectId nativo
        const productoEliminar = await coleccion_productos.findOne({ _id: new ObjectId(idProducto) });

        if (!productoEliminar) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // 2. ESCUDO DE SEGURIDAD
        /*if (usuarioAEliminar.rol === 'admin') {
            return res.status(403).json({ 
                mensaje: "Seguridad crítica: No está permitido eliminar cuentas de Administrador" 
            });
        }*/

        // 3. Borrado definitivo
        await coleccion_productos.deleteOne({ _id: new ObjectId(idProducto) });
        res.json({ mensaje: "Producto eliminado correctamente de la base de datos" });

    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
});