# IDRD Backend

API REST del portal ciudadano del Instituto Distrital de Recreación y Deporte (IDRD) de Bogotá.

## Tecnologías

| Paquete | Versión |
|---|---|
| Node.js | 18+ |
| Express | 5 |
| Sequelize | 6 |
| PostgreSQL | — |
| JSON Web Token | 9 |
| Resend | 6 |
| Nodemon | 3 |

## Funcionalidades

- **Autenticación** — Registro con verificación de correo, login con código 2FA, recuperación de contraseña, refresh de sesión y logout.
- **Perfil** — Consulta y actualización de datos personales (nombre, documento, fecha de nacimiento, teléfono).
- **Correo** — Cambio de correo electrónico con validación por código.
- **Contraseña** — Cambio de contraseña con validación por código.
- **Direcciones** — CRUD de direcciones en formato colombiano con ciudad, departamento y soporte para dirección principal.
- **Reservas** — CRUD de reservas de gimnasios distritales. Al crear una reserva se envía un correo de confirmación al usuario.
- **Catálogos públicos** — Endpoints abiertos para tipos de documento, tipos de vía y gimnasios.

## Endpoints

### Auth — `/api/v1/auth`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/register` | Registro de cuenta |
| `POST` | `/register/validation` | Verificación de correo |
| `POST` | `/login` | Inicio de sesión (envía código 2FA) |
| `POST` | `/logout` | Cierre de sesión |
| `POST` | `/refresh` | Renovar token de sesión |
| `POST` | `/validate` | Validar sesión activa |
| `POST` | `/recovery` | Solicitar recuperación de contraseña |
| `POST` | `/recovery/validation` | Confirmar nueva contraseña |
| `POST` | `/code` | Reenviar código de verificación |
| `GET` | `/doc-types` | Catálogo de tipos de documento |
| `GET` | `/via-types` | Catálogo de tipos de vía |
| `GET` | `/gimnasios` | Catálogo de gimnasios distritales |
| `PATCH` | `/update/email` | Solicitar cambio de correo |
| `PATCH` | `/update/email/validation` | Confirmar cambio de correo |
| `PATCH` | `/update/password` | Solicitar cambio de contraseña |
| `PATCH` | `/update/password/validation` | Confirmar cambio de contraseña |

### Usuario — `/api/v1/me` *(requiere autenticación)*

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/account` | Obtener datos del perfil |
| `PATCH` | `/account` | Actualizar datos del perfil |
| `GET` | `/addresses` | Listar direcciones |
| `POST` | `/addresses` | Crear dirección |
| `PATCH` | `/addresses/:id` | Actualizar dirección |
| `PATCH` | `/addresses/:id/default` | Establecer dirección principal |
| `DELETE` | `/addresses/:id` | Eliminar dirección |
| `GET` | `/reservas` | Listar reservas |
| `POST` | `/reservas` | Crear reserva |
| `PATCH` | `/reservas/:id` | Actualizar reserva |
| `DELETE` | `/reservas/:id` | Eliminar reserva |

## Esquemas de base de datos

- **`accounts`** — `accounts`, `doc_types`, `via_types`, `addresses`
- **`app`** — `gimnasios`, `reservas`
- **`auth`** — Códigos de verificación y sesiones

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DB_DIALECT=postgres
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=
DB_DATABASE=
DB_PORT=5432

FRONTEND_DOMAIN=http://localhost:5173

NODE_ENV=development
PORT=3005

JWT_SECRET_SEED=
JWT_EXPIRE_IN=10m

MAIL_CODE_EXPIRE=15000
MAIL_SEND_LIMIT=40
MAIL_SEND_ADDR=onboarding@resend.dev
RESEND_API_KEY=
```

## Scripts

```bash
# Iniciar servidor con hot-reload
npm start

# Crear / migrar tablas en la base de datos
npm run migrate
```

El servidor corre por defecto en `http://localhost:3005`.
