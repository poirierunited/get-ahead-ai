# 👀 Opciones para Ver la Documentación

Resumen rápido de las formas de visualizar esta documentación.

## 🚀 Opción Rápida (Recomendada)

### GitHub Pages + MkDocs Material

**URL**: `https://tu-usuario.github.io/get-ahead-ai/`

**Características**:

- ✨ UI moderna con Material Design
- 🔍 Búsqueda integrada
- 🌓 Dark mode automático
- 📱 Responsive
- 🚀 Deploy automático con GitHub Actions

**Setup**:

```bash
# 1. Habilitar GitHub Pages en tu repo
#    Settings → Pages → Source: gh-pages

# 2. Push tu código
git push

# 3. Espera 1-2 minutos
#    El GitHub Action desplegará automáticamente
```

📖 **[Ver guía completa de deployment](./DEPLOYMENT.md)**

---

## 🌐 Otras Opciones

### 1. GitHub Nativo (Ya funciona)

**URL**: `https://github.com/tu-usuario/get-ahead-ai/tree/main/docs`

- ✅ Sin configuración
- ✅ Funciona inmediatamente
- ❌ UI básica

### 2. Preview Local con MkDocs

```bash
# Instalar
pip install mkdocs-material

# Ejecutar
mkdocs serve

# Abrir http://127.0.0.1:8000
```

### 3. Docusaurus (Para proyectos grandes)

Framework de Meta para documentación avanzada.

```bash
npx create-docusaurus@latest docs-site classic --typescript
```

### 4. VitePress (Para máxima velocidad)

```bash
npm install -D vitepress
npx vitepress init
```

---

## 📊 Comparación Rápida

| Opción        | Setup  | UI         | Búsqueda | Deploy |
| ------------- | ------ | ---------- | -------- | ------ |
| **MkDocs** ⭐ | 5 min  | ⭐⭐⭐⭐   | ✅       | Auto   |
| GitHub Native | 0 min  | ⭐⭐       | ❌       | Auto   |
| Docusaurus    | 20 min | ⭐⭐⭐⭐⭐ | ✅       | Manual |
| VitePress     | 15 min | ⭐⭐⭐⭐   | ✅       | Manual |

---

## 🎯 Recomendación

Para Get Ahead AI, usa **MkDocs + GitHub Pages** (ya configurado):

1. Ya está todo configurado
2. Deploy automático
3. UI profesional
4. Gratis
5. Sin mantenimiento

---

## 📚 Recursos

- [Guía Completa de Deployment](./DEPLOYMENT.md)
- [Guía de Contribución](./CONTRIBUTING.md)
- [Template de Documentación](./TEMPLATE.md)

---

[← Volver a Documentación](./README.md)
