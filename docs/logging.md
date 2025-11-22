# Guía de Logging - Get Ahead AI

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema de Logging](#arquitectura)
3. [Categorías de Logs](#categorías)
4. [Niveles de Log](#niveles)
5. [Esquema Estándar](#esquema-estándar)
6. [Ejemplos por Capa](#ejemplos-por-capa)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

---

## Introducción

Este proyecto utiliza un sistema de logging estructurado basado en JSON que permite:

- **Trazabilidad completa**: Seguir requests a través de toda la aplicación
- **Contexto rico**: Cada log incluye metadata relevante
- **Categorización**: Filtrado y búsqueda eficiente de logs
- **Debugging efectivo**: Identificar errores rápidamente

## Arquitectura

### Componentes Principales

```
┌─────────────────────────────────────────────────────┐
│                   Logger Service                     │
│  - Categorías estándar                              │
│  - Request ID tracking                              │
│  - Niveles de log (info, warn, error, debug)       │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                 │
   ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
   │   API    │    │ Services │    │   Repo   │
   │  Routes  │    │  Layer   │    │  Layer   │
   └──────────┘    └──────────┘    └──────────┘
```

## Categorías

### LogCategory Enum

El sistema utiliza categorías predefinidas para clasificar logs:

#### Operaciones de API
- `API_REQUEST`: Solicitudes entrantes a endpoints
- `API_RESPONSE`: Respuestas exitosas de endpoints
- `API_ERROR`: Errores en endpoints

#### Autenticación
- `AUTH_SUCCESS`: Login/registro exitoso
- `AUTH_FAILURE`: Errores de autenticación
- `AUTH_SESSION`: Validación de sesiones

#### Lógica de Negocio
- `INTERVIEW_GENERATE`: Generación de entrevistas
- `INTERVIEW_FETCH`: Consulta de entrevistas
- `FEEDBACK_GENERATE`: Generación de feedback
- `FEEDBACK_FETCH`: Consulta de feedback

#### Operaciones de AI
- `AI_REQUEST`: Llamadas al modelo de IA
- `AI_RESPONSE`: Respuestas del modelo
- `AI_ERROR`: Errores en operaciones de IA

#### Base de Datos
- `DB_QUERY`: Consultas a la base de datos
- `DB_INSERT`: Inserciones en la base de datos
- `DB_ERROR`: Errores de base de datos

#### Seguridad
- `RATE_LIMIT`: Rate limiting aplicado
- `VALIDATION_ERROR`: Errores de validación

#### Cliente
- `CLIENT_ERROR`: Errores en el cliente
- `CLIENT_ACTION`: Acciones del usuario

#### Sistema
- `SYSTEM_ERROR`: Errores del sistema
- `SYSTEM_INFO`: Información del sistema

## Niveles

### info
Para eventos normales del sistema que indican progreso:
```typescript
logger.info('Interview generated successfully', {
  category: LogCategory.API_RESPONSE,
  requestId,
  userId,
  interviewId,
  duration: 1250,
});
```

### warn
Para situaciones potencialmente problemáticas:
```typescript
logger.warn('Rate limit exceeded', {
  category: LogCategory.RATE_LIMIT,
  requestId,
  ip: '192.168.1.1',
});
```

### error
Para errores que requieren atención:
```typescript
logger.error('Failed to generate feedback', {
  category: LogCategory.AI_ERROR,
  requestId,
  error: error.message,
  stack: error.stack,
});
```

### debug
Para información detallada útil en desarrollo:
```typescript
logger.debug('Fetching user interviews', {
  category: LogCategory.DB_QUERY,
  userId,
  limit: 20,
});
```

## Esquema Estándar

### Estructura Base de un Log

```json
{
  "level": "info",
  "message": "Human-readable message",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "category": "api:response",
  "requestId": "req_1732272600000_abc123xyz",
  "userId": "user_123",
  // ... metadata adicional específica al contexto
}
```

### Campos Obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `level` | string | Nivel del log (info, warn, error, debug) |
| `message` | string | Descripción clara del evento |
| `timestamp` | string | ISO 8601 timestamp |

### Campos Recomendados

| Campo | Tipo | Uso |
|-------|------|-----|
| `category` | LogCategory | Categoría del evento |
| `requestId` | string | ID único del request |
| `userId` | string | ID del usuario involucrado |
| `duration` | number | Duración en ms (para operaciones) |
| `statusCode` | number | HTTP status code (para APIs) |

### Campos para Errores

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `error` | string | Mensaje de error |
| `errorName` | string | Nombre del tipo de error |
| `stack` | string | Stack trace completo |

## Ejemplos por Capa

### API Routes

#### Request Entrante
```typescript
const requestId = generateRequestId();

logger.info('Interview generation request received', {
  category: LogCategory.API_REQUEST,
  requestId,
  locale,
  method: 'POST',
  path: pathname,
});
```

#### Respuesta Exitosa
```typescript
const duration = Date.now() - startTime;

logger.info('Interview generated successfully', {
  category: LogCategory.API_RESPONSE,
  requestId,
  userId,
  interviewId: documentId,
  questionsCount: questions.length,
  duration,
  statusCode: 200,
});
```

#### Error en API
```typescript
logger.error('Interview generation failed', {
  category: LogCategory.API_ERROR,
  requestId,
  error: error.message,
  errorName: error.name,
  stack: error.stack,
  duration,
});
```

#### Rate Limiting
```typescript
logger.warn('Rate limit exceeded', {
  category: LogCategory.RATE_LIMIT,
  requestId,
  ip: request.ip || 'unknown',
});
```

### Services Layer

#### Inicio de Operación
```typescript
logger.info('Starting feedback generation', {
  category: LogCategory.FEEDBACK_GENERATE,
  requestId,
  userId,
  interviewId,
  transcriptLength: transcript.length,
  language,
});
```

#### Llamada a AI
```typescript
// Antes de la llamada
logger.info('Calling AI model for feedback generation', {
  category: LogCategory.AI_REQUEST,
  requestId,
  userId,
  interviewId,
  model: 'gemini-2.0-flash-001',
});

// Después de la respuesta
logger.info('AI feedback generated successfully', {
  category: LogCategory.AI_RESPONSE,
  requestId,
  userId,
  interviewId,
  totalScore: object.totalScore,
  aiDuration,
});
```

#### Error en Service
```typescript
logger.error('Feedback service failed', {
  category: LogCategory.SYSTEM_ERROR,
  requestId,
  userId,
  interviewId,
  error: error.message,
  errorName: error.name,
  stack: error.stack,
  duration,
});
```

### Repository Layer

#### Query Exitoso
```typescript
logger.debug('Querying interview by ID from Firestore', {
  category: LogCategory.DB_QUERY,
  interviewId: id,
});

// Después de la query
logger.debug('Interview retrieved successfully', {
  category: LogCategory.DB_QUERY,
  interviewId: id,
});
```

#### Insert Exitoso
```typescript
logger.info('Interview created successfully in Firestore', {
  category: LogCategory.DB_INSERT,
  userId: interview.userId,
  interviewId: docRef.id,
});
```

#### Error de Base de Datos
```typescript
logger.error('Failed to query interview by ID', {
  category: LogCategory.DB_ERROR,
  interviewId: id,
  error: error.message,
  errorName: error.name,
  stack: error.stack,
});
```

### Client/Frontend

#### Acciones del Usuario
```typescript
logger.info('Call started - setting status to ACTIVE', {
  category: LogCategory.CLIENT_ACTION,
  interviewId,
  userId,
});
```

#### Errores del Cliente
```typescript
logger.error('Failed to fetch feedback for interview card', {
  category: LogCategory.CLIENT_ERROR,
  error: error.message,
  errorName: error.name,
  interviewId,
  userId,
  locale,
});
```

#### Autenticación
```typescript
// Error de autenticación
logger.error('Authentication error', {
  category: LogCategory.AUTH_FAILURE,
  error: error.message,
  errorCode: error.code,
  type: 'sign-in',
  email: form.getValues('email'),
});
```

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Siempre incluir categoría**
```typescript
logger.info('Message', {
  category: LogCategory.API_RESPONSE,
  // ...
});
```

2. **Incluir requestId en operaciones relacionadas**
```typescript
const requestId = generateRequestId();
// Pasar requestId a través de las capas
```

3. **Medir duración de operaciones críticas**
```typescript
const startTime = Date.now();
// ... operación ...
const duration = Date.now() - startTime;
logger.info('Operation completed', { duration });
```

4. **Serializar errores correctamente**
```typescript
logger.error('Operation failed', {
  error: error.message,        // ✅ String serializable
  errorName: error.name,
  stack: error.stack,
});
```

5. **Usar nivel apropiado**
- `debug`: Detalles de desarrollo
- `info`: Flujo normal
- `warn`: Situaciones inusuales pero manejables
- `error`: Errores que requieren atención

6. **Incluir contexto del negocio**
```typescript
logger.info('Feedback generated', {
  category: LogCategory.FEEDBACK_GENERATE,
  userId,
  interviewId,
  attemptNumber,
  totalScore: object.totalScore,
});
```

### ❌ DON'T (No Hacer)

1. **No pasar objetos complejos directamente**
```typescript
// ❌ NO
logger.error('Error', { error }); // Error object no serializable

// ✅ SÍ
logger.error('Error', {
  error: error.message,
  errorName: error.name,
});
```

2. **No logear información sensible**
```typescript
// ❌ NO
logger.info('User login', { password: '...' });

// ✅ SÍ
logger.info('User login', { email: 'user@example.com' });
```

3. **No usar console.log directamente**
```typescript
// ❌ NO
console.log('Something happened');

// ✅ SÍ
logger.info('Something happened', {
  category: LogCategory.SYSTEM_INFO,
});
```

4. **No logear en loops sin control**
```typescript
// ❌ NO
items.forEach(item => {
  logger.info('Processing item', { item });
});

// ✅ SÍ
logger.info('Processing items', { count: items.length });
// Solo logear si hay error
```

5. **No omitir stack traces en errores**
```typescript
// ❌ NO
logger.error('Error', { error: error.message });

// ✅ SÍ
logger.error('Error', {
  error: error.message,
  stack: error.stack,
});
```

## Troubleshooting

### Seguir un Request

Para seguir un request a través de todas las capas:

1. Encontrar el `requestId` en el log inicial
2. Filtrar logs por ese `requestId`

```bash
# Ejemplo con grep
cat logs.json | grep "req_1732272600000_abc123xyz"
```

### Encontrar Errores de un Usuario

```bash
# Filtrar por userId y level error
cat logs.json | grep "user_123" | grep '"level":"error"'
```

### Analizar Performance

```bash
# Buscar operaciones lentas (>5000ms)
cat logs.json | grep '"duration"' | awk '$duration > 5000'
```

### Monitorear Rate Limits

```bash
# Ver todos los rate limits
cat logs.json | grep '"category":"security:rate_limit"'
```

### Errores de AI

```bash
# Ver errores específicos de AI
cat logs.json | grep '"category":"ai:error"'
```

---

## Integración con Herramientas de Monitoreo

### DataDog
```typescript
// Los logs en formato JSON son compatibles con DataDog
// Usar category para crear dashboards y alertas
```

### CloudWatch
```typescript
// AWS CloudWatch Insights puede consultar logs estructurados
// fields @timestamp, requestId, userId, category
// | filter category = "api:error"
```

### Grafana + Loki
```typescript
// Loki puede indexar por labels
{category="api:error"}
```

---

## Checklist de Implementación

Al agregar logging a nueva funcionalidad:

- [ ] Importar `logger` y `LogCategory`
- [ ] Generar `requestId` si es punto de entrada
- [ ] Log de inicio de operación (info/debug)
- [ ] Log de llamadas externas (AI, DB)
- [ ] Log de resultado exitoso con métricas
- [ ] Try-catch con log de error detallado
- [ ] Incluir userId cuando esté disponible
- [ ] Medir y logear duración
- [ ] Usar categoría apropiada
- [ ] Serializar errores correctamente

---

## Contacto y Soporte

Para preguntas sobre el sistema de logging, contactar al equipo de desarrollo.

