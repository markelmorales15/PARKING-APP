Resumen del Proyecto:

La Aplicación Web de Alquiler de Garajes es una solución full-stack que permite a los usuarios alquilar garajes privados. Construida con React para el frontend y Express.js para el backend, incluye autenticación de usuarios, listados de garajes, gestión de reservas y un sistema de créditos. La aplicación soporta Google OAuth para un inicio de sesión fluido e integra una base de datos PostgreSQL para gestionar los datos de manera efectiva.
Descripción de los Módulos del Proyecto

Autenticación: Registro e inicio de sesión de usuarios, incluyendo Google OAuth.
Gestión de Usuarios: Gestión de perfiles y actualización de contraseñas.
Gestión de Garajes: Operaciones CRUD para los listados de garajes, incluyendo carga de imágenes y verificación de disponibilidad.
Sistema de Reservas: Los usuarios pueden crear, ver y cancelar reservas de garajes.
Sistema de Valoraciones: Los usuarios pueden calificar y reseñar los garajes que han alquilado.
Sistema de Créditos: Los usuarios pueden gestionar créditos para descuentos en reservas y ver el historial de transacciones.

Árbol de Directorios
backend/
├── README.md                # Resumen del proyecto e instrucciones de configuración
├── index.js                 # Punto de entrada de la aplicación
├── package.json             # Metadatos y dependencias del proyecto
├── .env                     # Variables de entorno
├── .gitignore               # Archivos y directorios ignorados en el control de versiones
└── src/
    ├── config/
    │   └── db.js           # Configuración de la conexión a la base de datos
    ├── controllers/
    │   ├── authController.js # Maneja la lógica de autenticación
    │   ├── userController.js # Gestiona las operaciones de los perfiles de usuario
    │   ├── garageController.js # Gestiona los listados de garajes
    │   ├── bookingController.js # Gestiona las reservas
    │   ├── ratingController.js # Gestiona las valoraciones
    │   └── creditController.js # Gestiona los créditos
    ├── middlewares/
    │   └── verifyToken.js   # Middleware para verificación de tokens
    ├── models/
    │   ├── user.js          # Modelo de usuario
    │   ├── garage.js        # Modelo de garaje
    │   ├── booking.js       # Modelo de reserva
    │   ├── rating.js        # Modelo de valoración
    │   └── credit.js        # Modelo de crédito
    ├── routes/
    │   ├── authRoutes.js    # Rutas para autenticación
    │   ├── userRoutes.js    # Rutas para gestión de usuarios
    │   ├── garageRoutes.js   # Rutas para gestión de garajes
    │   ├── bookingRoutes.js  # Rutas para gestión de reservas
    │   ├── ratingRoutes.js   # Rutas para gestión de valoraciones
    │   └── creditRoutes.js   # Rutas para gestión de créditos
    └── server.js            # Configuración principal del servidor y rutas

Inventario de Descripción de Archivos

README.md: Proporciona una visión general del proyecto, instrucciones de configuración y uso.
index.js: Punto de entrada que inicia el servidor.
package.json: Contiene las dependencias del proyecto, scripts y metadatos.
.env: Almacena las variables de entorno para la configuración de la base de datos y el servidor.
.gitignore: Especifica los archivos que deben ser ignorados por Git.
src/config/db.js: Configura la conexión con la base de datos PostgreSQL.
src/controllers/: Contiene la lógica para manejar solicitudes y respuestas de diferentes funcionalidades.
src/middlewares/verifyToken.js: Middleware para verificar tokens JWT.
src/models/: Define los modelos de la base de datos para usuarios, garajes, reservas, valoraciones y créditos.
src/routes/: Define las rutas de la API para manejar solicitudes relacionadas con autenticación, gestión de usuarios, gestión de garajes, reservas, valoraciones y créditos.
src/server.js: Configura el servidor Express y los middlewares.

Pila Tecnológica

Frontend: React, TailwindCSS
Backend: Node.js, Express.js
Base de Datos: PostgreSQL
Autenticación: JWT, Google OAuth
Bibliotecas: bcryptjs, cors, dotenv, google-auth-library, jsonwebtoken, pg, multer

Uso

Instalar dependencias: Ejecuta npm install en el directorio backend.
Configurar la base de datos: Configura la base de datos PostgreSQL como se especifica en el archivo .env.
Iniciar el servidor: Ejecuta npm start o node index.js en el directorio backend.

