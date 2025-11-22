# [Título del Documento]

> **Categoría**: [Architecture / Development / Guide / API / Frontend / Security / AI / Database / Operations]  
> **Nivel**: [Beginner / Intermediate / Advanced]  
> **Última actualización**: [Fecha]

## 📋 Introducción

[Breve descripción del tema en 2-3 oraciones. Explica qué es y por qué es importante.]

## 🎯 Objetivos

Al finalizar este documento, podrás:

- [Objetivo 1]
- [Objetivo 2]
- [Objetivo 3]

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Conceptos Principales](#conceptos-principales)
3. [Implementación](#implementación)
4. [Ejemplos](#ejemplos)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Casos de Uso](#casos-de-uso)
7. [Troubleshooting](#troubleshooting)
8. [Referencias](#referencias)

---

## 📚 Prerequisitos

Antes de continuar, asegúrate de tener:

- [ ] [Prerequisito 1]
- [ ] [Prerequisito 2]
- [ ] Conocimiento básico de [tema]

## 🧩 Conceptos Principales

### Concepto 1

[Explicación del concepto con detalles técnicos]

```typescript
// Ejemplo de código ilustrativo
interface Example {
  id: string;
  name: string;
}
```

### Concepto 2

[Explicación del segundo concepto]

### Diagrama (Opcional)

```
┌─────────────┐
│  Component  │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Service   │
└─────────────┘
```

## 🚀 Implementación

### Paso 1: [Nombre del Paso]

[Descripción detallada del paso]

```typescript
// Código de ejemplo con comentarios
import { something } from '@/lib/something';

export function example() {
  // Implementación
  const result = something();
  return result;
}
```

**Explicación**:

- Línea X: [Explicación]
- Línea Y: [Explicación]

### Paso 2: [Siguiente Paso]

[Continuar con pasos adicionales según sea necesario]

## 💡 Ejemplos

### Ejemplo 1: [Nombre del Ejemplo]

**Contexto**: [Cuándo usar este ejemplo]

```typescript
// Ejemplo completo y funcional
import { logger, LogCategory } from '@/lib/logger';

export async function exampleFunction() {
  try {
    logger.info('Starting operation', {
      category: LogCategory.SYSTEM_INFO,
    });

    // Tu código aquí

    logger.info('Operation completed successfully', {
      category: LogCategory.SYSTEM_INFO,
    });
  } catch (error) {
    logger.error('Operation failed', {
      category: LogCategory.SYSTEM_ERROR,
      error: error.message,
    });
    throw error;
  }
}
```

**Resultado esperado**:

```json
{
  "level": "info",
  "message": "Operation completed successfully",
  "timestamp": "2025-11-22T10:30:00.000Z",
  "category": "system:info"
}
```

### Ejemplo 2: [Otro Ejemplo]

[Otro ejemplo relevante]

## ✅ Mejores Prácticas

### ✅ DO (Hacer)

#### 1. [Práctica recomendada 1]

**Por qué**: [Explicación]

```typescript
// ✅ Ejemplo correcto
const goodExample = () => {
  // Código que sigue la mejor práctica
};
```

#### 2. [Práctica recomendada 2]

**Por qué**: [Explicación]

```typescript
// ✅ Otro ejemplo correcto
```

### ❌ DON'T (No Hacer)

#### 1. [Anti-patrón 1]

**Por qué evitarlo**: [Explicación]

```typescript
// ❌ Ejemplo incorrecto
const badExample = () => {
  // Código que no debería usarse
};
```

**En su lugar, haz**:

```typescript
// ✅ Forma correcta
const goodExample = () => {
  // Código correcto
};
```

#### 2. [Anti-patrón 2]

[Continuar con más anti-patrones]

## 🔧 Casos de Uso

### Caso de Uso 1: [Nombre del Caso]

**Escenario**: [Descripción del escenario]

**Solución**:

```typescript
// Implementación específica para este caso
export function handleUseCase1() {
  // Código
}
```

**Consideraciones**:

- [Consideración 1]
- [Consideración 2]

### Caso de Uso 2: [Otro Caso]

[Descripción y código]

## 🐛 Troubleshooting

### Problema 1: [Nombre del Problema]

**Síntoma**:

```
Error: [Mensaje de error exacto]
```

**Causa**: [Explicación de por qué ocurre]

**Solución**:

1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

```typescript
// Código de la solución
```

### Problema 2: [Otro Problema]

**Síntoma**: [Descripción]

**Solución**: [Pasos para resolver]

## 📊 Métricas y Performance

[Si aplica, incluir información sobre performance]

- **Tiempo promedio**: X ms
- **Uso de memoria**: Y MB
- **Rate limits**: Z requests/min

## 🔐 Consideraciones de Seguridad

[Si aplica, mencionar aspectos de seguridad]

- ⚠️ [Advertencia de seguridad 1]
- ⚠️ [Advertencia de seguridad 2]

## 🧪 Testing

[Si aplica, incluir información sobre testing]

```typescript
// Ejemplo de test
import { exampleFunction } from './example';

describe('exampleFunction', () => {
  it('should do something', () => {
    const result = exampleFunction();
    expect(result).toBe(expected);
  });
});
```

## 📚 Referencias

### Documentación Interna

- [Documento relacionado 1](./related-doc-1.md)
- [Documento relacionado 2](./related-doc-2.md)

### Recursos Externos

- [Recurso oficial](https://example.com)
- [Tutorial relevante](https://example.com/tutorial)
- [API Reference](https://example.com/api)

### Código Relacionado

- `lib/example.ts` - [Descripción]
- `components/Example.tsx` - [Descripción]

## 💭 Notas Adicionales

[Cualquier información adicional que no encaje en las secciones anteriores]

## ✏️ Changelog

| Fecha      | Cambio           | Autor    |
| ---------- | ---------------- | -------- |
| 2025-11-22 | Documento creado | [Nombre] |

---

## 🤝 Contribuciones

¿Encontraste un error o tienes una sugerencia?

- Consulta la [guía de contribución](./CONTRIBUTING.md)
- Abre un issue o pull request

---

[← Volver a Documentación](./README.md)
