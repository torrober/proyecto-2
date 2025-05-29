# API de Gestión de Materias

API REST para la gestión de materias académicas, incluyendo sus evaluaciones y profesores asignados.

## Características

- Gestión de materias académicas
- Sistema de evaluaciones integrado
- Control de acceso basado en roles (Admin/Profesor)
- Validación de porcentajes de evaluaciones
- Soft delete para materias

## Tecnologías

- Node.js
- TypeScript
- Express
- MongoDB con Mongoose
- Sistema de autenticación por roles

## Estructura del Proyecto

```
src/
├── app.ts                # Punto de entrada de la aplicación
├── config/              
│   └── db.ts            # Configuración de MongoDB
├── evaluacion/
│   └── evaluacion.model.ts  # Modelo de evaluaciones
├── materia/
│   ├── materia.actions.ts   # Lógica de negocio
│   ├── materia.controller.ts # Controladores
│   ├── materia.model.ts     # Modelo de materias
│   └── materia.routes.ts    # Rutas de la API
└── middleware/
    └── auth.middleware.ts   # Middleware de autenticación
```

## Instalación

```bash
# Clonar el repositorio
git clone <repositorio>

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

## Variables de Entorno

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/materias
```

## Endpoints de la API

### Materias

```plaintext
GET /api/materias/health     # Health check
GET /api/materias           # Obtener todas las materias
GET /api/materias/:id       # Obtener una materia específica
POST /api/materias         # Crear nueva materia (Admin)
PUT /api/materias/:id      # Actualizar materia (Admin/Profesor)
DELETE /api/materias/:id   # Desactivar materia (Admin)
```

### Ejemplos de Uso

1. Crear una Materia (Admin):
```bash
curl -X POST http://localhost:3000/api/materias \
-H "Content-Type: application/json" \
-d '{
  "user": {
    "id": "admin123",
    "role": "admin"
  },
  "nombre": "Cálculo Diferencial",
  "codigo": "MAT101",
  "descripcion": "Introducción al cálculo diferencial",
  "creditos": 4,
  "departamento": "Matemáticas",
  "semestreMalla": "Primer Semestre",
  "profesor": "PROF123",
  "evaluaciones": [
    {
      "titulo": "Primer Parcial",
      "nota": 30
    },
    {
      "titulo": "Segundo Parcial",
      "nota": 30
    },
    {
      "titulo": "Examen Final",
      "nota": 40
    }
  ]
}'
```

2. Obtener todas las materias:
```bash
curl http://localhost:3000/api/materias
```

3. Obtener una materia específica:
```bash
curl http://localhost:3000/api/materias/id_materia
```

4. Actualizar una Materia (Profesor):
```bash
curl -X PUT http://localhost:3000/api/materias/id_materia \
-H "Content-Type: application/json" \
-d '{
  "user": {
    "id": "PROF123",
    "role": "profesor"
  },
  "evaluaciones": [
    {
      "titulo": "Primer Parcial",
      "nota": 50
    },
    {
      "titulo": "Examen Final",
      "nota": 50
    }
  ]
}'
```

5. Eliminar/Desactivar Materia (Admin):
```bash
curl -X DELETE http://localhost:3000/api/materias/id_materia \
-H "Content-Type: application/json" \
-d '{
  "user": {
    "id": "admin123",
    "role": "admin"
  }
}'
```

## Validaciones

- La suma de las notas de las evaluaciones debe ser 100
- Los créditos deben ser al menos 1
- El código de la materia es único
- Solo administradores pueden crear y eliminar materias
- Solo el profesor asignado o administradores pueden modificar una materia

## Scripts Disponibles

```bash
npm run dev    # Inicia el servidor en modo desarrollo
npm run build  # Compila el proyecto
npm start      # Inicia el servidor en modo producción
```

## Control de Acceso

### Roles y Permisos

- **Admin**
  - Crear materias
  - Modificar cualquier materia
  - Desactivar materias
  - Ver todas las materias

- **Profesor**
  - Modificar sus materias asignadas
  - Ver todas las materias

## Estado de las Materias

Las materias tienen un campo `activo` que permite realizar un soft delete. Las materias desactivadas no aparecen en las consultas regulares.
