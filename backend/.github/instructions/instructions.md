 Descripción del Caso

Se requiere desarrollar un sistema de gestión de inventarios para una tienda en línea.
El sistema debe contemplar autenticación, gestión de productos, notificaciones, reportes, un frontend responsivo y una API RESTful.

 1. Módulo de Autenticación

Implementar inicio de sesión y registro de usuarios.

Roles de usuario:

Administrador → acceso completo al sistema.

Empleado → acceso limitado (solo ver productos y reportar inventarios bajos).

Autenticación basada en tokens (JWT o similar).

 2. Módulo de Productos

Implementar CRUD completo (Crear, Leer, Actualizar, Eliminar).

Atributos de cada producto:

Nombre

Descripción

Precio

Cantidad en inventario

Categoría

Validación: no permitir cantidades negativas.

 3. Notificaciones de Inventario Bajo

Cuando la cantidad de un producto < 5, enviar notificación al administrador.

 4. Módulo de Reportes

Los administradores pueden generar un reporte en PDF con productos de inventario bajo.

💻 5. Frontend Responsivo (Angular)

Interfaz simple y funcional con:

Autenticación

Gestión de productos

Visualización de productos con búsqueda y filtros (por nombre y categoría)

 6. API RESTful (Spring Boot)

Seguir principios REST:

Métodos HTTP correctos

Códigos de estado adecuados

Exponer endpoints para:

Autenticación (JWT)

CRUD de productos

Notificaciones y reportes

 Entregables

Código fuente completo en repositorio Git.

Commits que reflejen el proceso de desarrollo.

Instrucciones de despliegue en entorno local.

Opción de usar Docker.

Demo funcional en un ambiente de prueba (DEV) desplegado en:

AWS, Azure, GCP o un servicio gratuito.

🛠️ Tecnologías Requeridas

Frontend: Angular

Backend: Java 8+ con Spring Boot

Base de Datos: SQL Server, PostgreSQL o MongoDB

Documentación:

Documento funcional breve (ERS)

Documento técnico breve (DET)