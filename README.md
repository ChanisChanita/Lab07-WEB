# Sistema de Autenticación con Express y MongoDB

Este proyecto implementa un sistema completo de autenticación y autorización con frontend web, construido con Express.js, MongoDB y Materialize CSS.

## 🚀 Características

### Backend (API REST)
- ✅ Autenticación con JWT
- ✅ Autorización basada en roles (user, admin)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Arquitectura en capas (Controllers, Services, Repositories)
- ✅ Validaciones y manejo de errores
- ✅ Seed automático de roles y usuario administrador

### Frontend (SPA)
- ✅ Diseño responsivo con Materialize CSS
- ✅ Páginas de SignIn y SignUp con validaciones
- ✅ Dashboard diferenciado por roles
- ✅ Página de perfil editable
- ✅ Protección de rutas y manejo de sesiones
- ✅ Páginas de error 403 y 404 personalizadas

## 📋 Requisitos

- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- NPM o Yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Semana07-DAWA
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/auth_db
   JWT_SECRET=tu_clave_secreta_muy_segura
   JWT_EXPIRES_IN=24h
   BCRYPT_SALT_ROUNDS=10
   ```

4. **Iniciar MongoDB**
   ```bash
   # Si tienes MongoDB local
   mongod
   
   # O usar MongoDB Atlas (actualiza MONGODB_URI en .env)
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

6. **Acceder a la aplicación**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 👤 Usuarios de Prueba

Al iniciar la aplicación por primera vez, se crean automáticamente:

### Administrador
- **Email:** sandra.anchelia@tecsup.edu.pe
- **Contraseña:** Admin@123

Este usuario tiene acceso completo al panel de administración.

## 📱 Estructura de Páginas

### Páginas Públicas
- `/` - Página de inicio (redirige según autenticación)
- `/signin.html` - Iniciar sesión
- `/signup.html` - Registrarse

### Páginas Protegidas (Requieren autenticación)
- `/user-dashboard.html` - Dashboard de usuario regular
- `/admin-dashboard.html` - Dashboard de administrador (solo admin)
- `/profile.html` - Perfil de usuario (editable)

### Páginas de Error
- `/403.html` - Acceso denegado
- `/404.html` - Página no encontrada

## 🔐 Roles y Permisos

### Usuario Regular (`user`)
- ✅ Acceso a su dashboard personal
- ✅ Ver y editar su perfil
- ✅ Funcionalidades básicas del sistema

### Administrador (`admin`)
- ✅ Todo lo del usuario regular
- ✅ Acceso al panel de administración
- ✅ Ver lista completa de usuarios
- ✅ Ver información detallada de usuarios

## 🌐 API Endpoints

### Autenticación
```
POST /api/auth/signUp    - Registro de usuario
POST /api/auth/signIn    - Inicio de sesión
```

### Usuarios
```
GET  /api/users          - Listar usuarios (solo admin)
GET  /api/users/me       - Obtener perfil actual
```

### Sistema
```
GET  /health             - Health check
```

## 🏗️ Arquitectura del Backend

```
src/
├── server.js              # Punto de entrada
├── controllers/           # Controladores de rutas
├── middlewares/           # Middleware de autenticación y autorización
├── models/               # Modelos de Mongoose
├── repositories/         # Capa de acceso a datos
├── routes/               # Definición de rutas
├── services/             # Lógica de negocio
└── utils/                # Utilidades (seeds, helpers)
```

## 🎨 Arquitectura del Frontend

```
public/
├── index.html            # Página de inicio
├── signin.html           # Inicio de sesión
├── signup.html           # Registro
├── user-dashboard.html   # Dashboard usuario
├── admin-dashboard.html  # Dashboard admin
├── profile.html          # Perfil de usuario
├── 403.html             # Error 403
├── 404.html             # Error 404
├── css/
│   └── style.css        # Estilos personalizados
└── js/
    └── app.js           # Lógica del frontend
```

## 🔒 Validaciones Implementadas

### Frontend
- ✅ Email válido
- ✅ Contraseña segura (8+ chars, mayúscula, dígito, carácter especial)
- ✅ Confirmación de contraseña
- ✅ Campos obligatorios
- ✅ Validación de edad (18+ años)

### Backend
- ✅ Validación de esquemas con Mongoose
- ✅ Emails únicos
- ✅ Encriptación de contraseñas
- ✅ Verificación de tokens JWT
- ✅ Control de acceso por roles

## 🚦 Reglas de Navegación

- Sin token válido → redirige a `/signin.html`
- Token expirado → cierra sesión automática y redirige a `/signin.html`
- Usuario regular intenta acceder admin → redirige a `/403.html`
- Ruta inexistente → muestra `/404.html`
- Usuario autenticado en páginas públicas → redirige al dashboard correspondiente

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
```

## 📦 Dependencias Principales

### Backend
- express - Framework web
- mongoose - ODM para MongoDB
- bcrypt - Encriptación de contraseñas
- jsonwebtoken - Manejo de JWT
- cors - Configuración CORS
- dotenv - Variables de entorno

### Frontend
- Materialize CSS - Framework UI
- Vanilla JavaScript - Sin frameworks adicionales

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
sudo systemctl status mongod

# O iniciar MongoDB
sudo systemctl start mongod
```

### Token JWT inválido
- El token se almacena en localStorage
- Se limpia automáticamente al hacer logout
- Expira según JWT_EXPIRES_IN configurado

### Problemas con permisos
- Verificar que el usuario tenga el rol correcto
- Los roles se asignan automáticamente (default: 'user')
- Solo usuarios con rol 'admin' pueden acceder al panel de administración

## 📝 Notas de Desarrollo

- El proyecto utiliza ES6 modules (`"type": "module"` en package.json)
- Se recomienda usar un JWT_SECRET fuerte en producción
- Las validaciones están implementadas tanto en frontend como backend
- El sistema maneja automáticamente la expiración de tokens

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado por:** Sandra  
**Curso:** Desarrollo de Aplicaciones Web Avanzadas  
**Semana:** 07