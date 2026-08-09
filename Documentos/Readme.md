# Documentación de WinShop

Esta carpeta contiene la documentación técnica del proyecto WinShop.

## Contenido

- `documento.md` — Documentación general del proyecto, incluyendo su
  descripción, tecnologías utilizadas, estructura, funcionalidades,
  roles, lógica del sistema y base de datos.

## Proyecto

**Nombre:** WinShop

**Tipo:** Aplicación web de comercio electrónico.

**Tecnologías principales:**
- HTML
- CSS
- JavaScript
- Node.js
- Express
- MongoDB

## Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Gestión de roles: cliente, vendedor y administrador.
- Gestión de usuarios.
- Gestión de productos.
- Clasificación y filtrado por categorías.
- Carrito de compras.
- Solicitudes de soporte.
- Control de acceso según el rol del usuario.

## Base de datos

WinShop utiliza MongoDB y cuenta con las siguientes colecciones:

- `usuarios`
- `productos`
- `categorias`
- `carritos`
- `solicitudes`

Las colecciones mantienen las relaciones necesarias mediante identificadores
como `usuarioId` y `productoId`.

## Estado del proyecto

WinShop se encuentra en desarrollo y cuenta con las funcionalidades
principales implementadas para su funcionamiento como aplicación web
e-commerce.