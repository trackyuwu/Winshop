# Documentación del Proyecto E-commerce WinShop

## 📌 Descripción del Proyecto

WinShop es una aplicación web tipo e-commerce desarrollada para permitir
la interacción entre clientes, vendedores y administradores dentro de una
plataforma de comercio electrónico.

El sistema permite el registro y autenticación de usuarios, manejo de
roles, visualización y gestión de productos, clasificación mediante
categorías, carrito de compras y envío de solicitudes de soporte.

La aplicación está conectada a un servidor backend desarrollado con
Node.js y Express, y utiliza MongoDB para el almacenamiento de la
información.

---

## 🎯 Objetivo

Desarrollar una plataforma web tipo e-commerce que permita a los usuarios
registrarse, iniciar sesión y acceder a las funcionalidades disponibles
según el rol asignado.

El sistema diferencia entre tres tipos de usuarios:

- Cliente
- Vendedor
- Administrador

Los clientes pueden consultar el catálogo de productos, filtrarlos por
categorías y utilizar el carrito de compras.

Los vendedores pueden gestionar sus propios productos mediante operaciones
CRUD, mientras que los administradores pueden gestionar usuarios y
productos del sistema.

El proyecto también incorpora un sistema de soporte mediante el cual los
usuarios pueden enviar solicitudes relacionadas con el funcionamiento de
la plataforma.

---

## 🛠 Tecnologías Utilizadas

### Frontend

- HTML (estructura de las páginas)
- CSS (diseño y estilos)
- JavaScript (interactividad y lógica de la aplicación)
- LocalStorage (persistencia temporal del contenido del carrito en el
  navegador)

### Backend

- Node.js
- Express (servidor y manejo de rutas HTTP)

### Base de Datos

- MongoDB
- MongoDB Compass (gestión y visualización de la base de datos)

---

## 📁 Estructura del Proyecto

El proyecto está dividido principalmente en frontend y backend.

### 🔹 Frontend

Se organiza en tres carpetas principales:

- **Estructura:** contiene los archivos HTML de las diferentes vistas.
- **Diseño:** contiene los archivos CSS utilizados para la apariencia
  visual de la aplicación.
- **Funcionalidad:** contiene los archivos JavaScript encargados de la
  interacción con el usuario y la lógica del frontend.

### 🔹 Backend

El backend está desarrollado con Node.js y Express y se encarga de:

- Procesar las solicitudes HTTP.
- Gestionar el registro e inicio de sesión.
- Validar las credenciales de los usuarios.
- Gestionar los roles y permisos.
- Gestionar los productos.
- Gestionar los carritos.
- Gestionar las solicitudes de soporte.
- Realizar operaciones sobre la base de datos MongoDB.
- Controlar el acceso a determinadas funcionalidades según el rol.

---

## ⚙️ Funcionalidades

### 👤 Gestión de usuarios

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Validación de credenciales.
- Manejo de roles.
- Gestión de usuarios por parte del administrador.
- Actualización de roles.
- Eliminación de usuarios.
- Protección de contraseñas mediante hash.

### 🔐 Roles del sistema

WinShop cuenta con tres roles principales:

#### Cliente

Puede:

- Registrarse.
- Iniciar sesión.
- Consultar el catálogo.
- Filtrar productos por categoría.
- Agregar productos al carrito.
- Consultar los productos agregados al carrito.
- Modificar la cantidad de productos del carrito.
- Quitar productos del carrito.
- Confirmar la compra.
- Enviar solicitudes de soporte.

No puede:

- Publicar productos.
- Gestionar productos.
- Acceder al panel administrativo.

#### Vendedor

Puede:

- Iniciar sesión.
- Acceder a las funcionalidades correspondientes a su rol.
- Crear productos.
- Consultar sus propios productos.
- Actualizar sus productos.
- Eliminar sus productos.
- Gestionar el carrito.
- Utilizar el sistema de soporte.

Los productos pertenecientes a otros vendedores no son mostrados dentro
de la gestión propia del vendedor.

#### Administrador

Puede:

- Gestionar usuarios.
- Consultar usuarios registrados.
- Actualizar roles.
- Eliminar usuarios.
- Crear productos.
- Consultar productos.
- Actualizar productos.
- Eliminar productos.
- Gestionar productos publicados por vendedores.
- Gestionar el contenido correspondiente al sistema administrativo.

---

## 🛍️ Gestión de Productos

El sistema cuenta con una colección `productos` en MongoDB utilizada para
almacenar los productos publicados dentro de la plataforma.

Los productos están relacionados con el usuario que los publica mediante
un identificador de usuario.

Los usuarios con rol **Vendedor** y **Administrador** tienen permisos para
publicar productos.

Los vendedores solamente gestionan los productos publicados por ellos
mismos, mientras que el administrador puede consultar y gestionar los
productos publicados por cualquier vendedor y los publicados por él mismo.

Los clientes no pueden publicar ni modificar productos.

---

## 🗂️ Categorías

WinShop utiliza una colección `categorias` en MongoDB para almacenar las
categorías disponibles para clasificar los productos.

Las categorías se encuentran previamente definidas en la base de datos y
son utilizadas principalmente para facilitar la consulta y filtrado del
catálogo.

Los usuarios pueden filtrar los productos disponibles según la categoría
seleccionada.

Actualmente el sistema utiliza las categorías:

- Electrónica
- Hogar
- moda
- celulares
- juegos/gaming
- audio

---

## 🛒 Carrito de Compras

El sistema cuenta con una colección `carritos` en MongoDB para almacenar
los productos asociados a cada usuario.

Cada elemento del carrito contiene información relacionada con:

- `usuarioId`
- `productoId`
- Nombre del producto
- Precio
- Imagen
- Cantidad

La relación con `usuarios` permite identificar a qué usuario pertenece
cada carrito, mientras que `productoId` permite identificar el producto
agregado.

El carrito permite:

- Agregar productos.
- Aumentar la cantidad de un producto.
- Disminuir la cantidad.
- Quitar productos.
- Consultar los productos agregados.
- Confirmar la compra.

Al confirmar la compra, el carrito se vacía. Actualmente esta acción
representa la finalización del proceso de compra dentro del proyecto,
debido a que no se encuentra implementado un sistema de pago real.

Además, el frontend utiliza `localStorage` para mantener información del
carrito durante la navegación en el navegador.

---

## 🆘 Sistema de Soporte

WinShop cuenta con una sección de soporte mediante la cual los usuarios
pueden enviar solicitudes relacionadas con la aplicación.

Las solicitudes se almacenan en la colección `solicitudes` de MongoDB.

Cada solicitud contiene información como:

- `id`
- `nombre`
- `correo`
- `asunto`
- `mensaje`
- `usuarioId`

La relación mediante `usuarioId` permite asociar cada solicitud con el
usuario que la realizó.

---

## 🗄️ Base de Datos

WinShop utiliza MongoDB como sistema de gestión de base de datos.

Actualmente el proyecto cuenta con las siguientes colecciones:

| Colección | Función |
| --------- | ------- |
| `usuarios` | Almacena la información de los usuarios y sus roles. |
| `productos` | Almacena los productos publicados en la plataforma. |
| `categorias` | Contiene las categorías utilizadas para clasificar productos. |
| `carritos` | Almacena los productos asociados al carrito de cada usuario. |
| `solicitudes` | Almacena las solicitudes enviadas mediante el sistema de soporte. |

### Relaciones principales

- `productos` se relaciona con `usuarios` mediante el usuario que publica
  el producto.
- `carritos` se relaciona con `usuarios` mediante `usuarioId`.
- `carritos` se relaciona con `productos` mediante `productoId`.
- `solicitudes` se relaciona con `usuarios` mediante `usuarioId`.
- `productos` utiliza las categorías almacenadas en `categorias` para su
  clasificación.

---

## 🧠 Lógica del Sistema

El funcionamiento de WinShop se basa en la comunicación entre el frontend,
el backend y la base de datos.

Los formularios y componentes del frontend capturan la información
introducida por el usuario y realizan solicitudes HTTP hacia el servidor
mediante las rutas definidas en Express.

El backend recibe estas solicitudes, valida la información y ejecuta las
operaciones correspondientes sobre MongoDB.

Durante el proceso de autenticación, el sistema verifica las credenciales
del usuario y determina el rol correspondiente.

El rol determina las funcionalidades y opciones disponibles dentro de la
interfaz.

El sistema también controla el acceso a las diferentes funcionalidades
para evitar que usuarios sin los permisos correspondientes puedan acceder
a determinadas secciones.

### Flujo general

1. El usuario accede a la aplicación.
2. Puede registrarse o iniciar sesión.
3. El sistema valida sus credenciales.
4. Se identifica el rol del usuario.
5. Se muestran las opciones correspondientes al rol.
6. El usuario puede utilizar las funcionalidades disponibles.
7. Las operaciones que requieren almacenamiento son procesadas por el
   backend.
8. El backend realiza las operaciones correspondientes en MongoDB.
9. El resultado es enviado nuevamente al frontend.

---

## 🔐 Seguridad

El sistema implementa diferentes mecanismos para proteger la información
y controlar el acceso.

Entre ellos se encuentran:

- Autenticación mediante correo y contraseña.
- Contraseñas almacenadas mediante hash.
- Control de acceso según el rol.
- Restricción de funcionalidades según permisos.
- Validación de información recibida por el servidor.
- Asociación de los carritos con el usuario correspondiente.
- Asociación de los productos con el usuario que los publicó.
- Redirección de usuarios no autorizados hacia la página principal.

El control de acceso permite evitar que un usuario pueda utilizar
funcionalidades correspondientes a otro rol.

---

## 🧾 Estándares de Codificación

Se aplicaron las siguientes buenas prácticas:

- Uso de **camelCase** para nombrar variables y funciones.
- Uso de nombres descriptivos.
- Separación del código según su función.
- Organización del frontend en HTML, CSS y JavaScript.
- Separación entre frontend y backend.
- Uso de funciones reutilizables.
- Organización de las operaciones de acceso a datos.
- Comentarios para identificar secciones importantes del código.

---

## 🔄 Control de Versiones

Se utiliza Git como herramienta de control de versiones para gestionar
los cambios realizados durante el desarrollo del proyecto.

Esto permite:

- Guardar diferentes versiones del código.
- Controlar modificaciones realizadas.
- Consultar cambios anteriores.
- Facilitar la organización del desarrollo.
- Recuperar versiones anteriores cuando sea necesario.

---

## 📊 Historial de Cambios

| Fecha | Cambio | Descripción |
| ----- | ------ | ----------- |
| 01/04 | Inicio | Creación de la estructura inicial del proyecto. |
| 02/04 | Backend | Configuración del servidor y conexión con MongoDB. |
| 03/04 | Registro | Implementación del registro de usuarios. |
| 04/04 | Login | Implementación del inicio de sesión. |
| — | Roles | Implementación de los roles de cliente, vendedor y administrador. |
| — | Productos | Implementación de la gestión de productos. |
| — | Categorías | Implementación del filtrado de productos por categorías. |
| — | Carrito | Implementación del carrito de compras. |
| — | Soporte | Implementación del sistema de solicitudes de soporte. |
| — | Seguridad | Implementación del hash de contraseñas y restricciones de acceso. |

---

## 🚧 Funcionalidades no implementadas

El proyecto cuenta con las funcionalidades principales necesarias para
demostrar el funcionamiento de la plataforma. Sin embargo, existen
características que pueden ser implementadas posteriormente.

Entre ellas:

- Integración de una plataforma de pagos real.
- Procesamiento real de órdenes de compra.
- Gestión completa del proceso posterior a la confirmación de una compra.
- Ampliación del sistema de soporte.
- Implementación de funcionalidades adicionales para la administración
  de pedidos.

Estas características no forman parte de la implementación actual del
proyecto.

---

## ✅ Conclusión

El desarrollo de WinShop permitió integrar conocimientos de frontend,
backend y bases de datos para construir una aplicación web funcional de
tipo e-commerce.

Actualmente el sistema cuenta con autenticación de usuarios, manejo de
roles, gestión de productos, clasificación por categorías, carrito de
compras y un sistema de solicitudes de soporte.

La aplicación utiliza HTML, CSS y JavaScript en el frontend, Node.js y
Express en el backend y MongoDB para el almacenamiento de la información.

La implementación de diferentes roles permite controlar las
funcionalidades disponibles para clientes, vendedores y administradores,
mientras que las relaciones entre las colecciones permiten organizar la
información almacenada en la base de datos.

El proyecto mantiene una estructura modular que permite continuar
incorporando nuevas funcionalidades en el futuro, como un sistema de
pagos y una gestión más completa de las órdenes de compra.