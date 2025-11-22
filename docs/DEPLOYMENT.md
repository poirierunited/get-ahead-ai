# 🚀 Guía de Deployment de Documentación

Esta guía explica las diferentes opciones para visualizar y deployar la documentación de Get Ahead AI.

## 📖 Opciones Disponibles

### 1. GitHub Native (✅ Ya Funciona)

La opción más simple. GitHub renderiza automáticamente los archivos Markdown.

**Pasos**:

1. Push tu código a GitHub
2. Navega a `https://github.com/tu-usuario/get-ahead-ai/tree/main/docs`
3. Los enlaces funcionarán automáticamente

**Pros**:

- ✅ Sin configuración
- ✅ Sin costos
- ✅ Funciona inmediatamente

**Contras**:

- ❌ UI básica
- ❌ Sin búsqueda avanzada
- ❌ Sin personalización

---

### 2. GitHub Pages + MkDocs (⭐ Recomendado)

Sitio web estático con UI moderna usando Material for MkDocs.

#### Configuración Inicial

Ya está configurado! Solo necesitas:

1. **Instalar MkDocs localmente** (opcional, para preview):

   ```bash
   pip install mkdocs-material
   ```

2. **Preview local**:

   ```bash
   mkdocs serve
   # Abre http://127.0.0.1:8000
   ```

3. **Habilitar GitHub Pages**:

   - Ve a tu repo en GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (se creará automáticamente)
   - Guarda

4. **Push y despliega**:
   ```bash
   git add .
   git commit -m "docs: setup MkDocs"
   git push
   ```

El GitHub Action (`.github/workflows/docs.yml`) se ejecutará automáticamente y desplegará tu documentación.

#### Acceso

Tu documentación estará disponible en:

```
https://tu-usuario.github.io/get-ahead-ai/
```

#### Personalización

Edita `mkdocs.yml` para:

- Cambiar colores y tema
- Agregar/quitar secciones
- Configurar plugins
- Personalizar navegación

**Pros**:

- ✅ UI moderna y profesional
- ✅ Búsqueda integrada
- ✅ Dark mode automático
- ✅ Responsive design
- ✅ Deploy automático con GitHub Actions
- ✅ Gratis

**Contras**:

- ❌ Requiere Python localmente (solo para preview)

---

### 3. Docusaurus (Alternativa Avanzada)

Framework de documentación de Meta/Facebook, muy popular en el ecosistema React.

#### Setup

```bash
# Instalar Docusaurus
npx create-docusaurus@latest docs-site classic --typescript

# Mover documentación
cp -r docs/* docs-site/docs/

# Configurar
cd docs-site
npm install
npm start
```

**Pros**:

- ✅ Integración perfecta con React/Next.js
- ✅ Componentes interactivos
- ✅ Versionado de documentación
- ✅ Blog integrado
- ✅ Muy customizable

**Contras**:

- ❌ Más complejo de configurar
- ❌ Requiere Node.js

---

### 4. VitePress (Alternativa Moderna)

Similar a VuePress pero más rápido, basado en Vite.

#### Setup

```bash
# Instalar VitePress
npm install -D vitepress

# Inicializar
npx vitepress init

# Mover docs
cp -r docs/* docs/

# Ejecutar
npm run docs:dev
```

**Pros**:

- ✅ Muy rápido
- ✅ Vue 3 powered
- ✅ HMR instantáneo
- ✅ Markdown mejorado

**Contras**:

- ❌ Ecosistema más pequeño que Docusaurus
- ❌ Menos plugins disponibles

---

## 🎯 Recomendación por Caso de Uso

### Para Empezar Rápido

→ **GitHub Native** o **MkDocs + GitHub Pages**

### Para Proyecto Profesional

→ **MkDocs Material** (ya configurado!)

### Para Máxima Personalización

→ **Docusaurus**

### Para Performance Extremo

→ **VitePress**

---

## 🚀 Usando MkDocs (Setup Actual)

### Comandos Útiles

```bash
# Preview local
mkdocs serve

# Preview con livereload en otra dirección
mkdocs serve -a 0.0.0.0:8080

# Build manual
mkdocs build

# Deploy manual a GitHub Pages
mkdocs gh-deploy

# Ver versión
mkdocs --version
```

### Estructura de Archivos

```
get-ahead-ai/
├── mkdocs.yml                    # Configuración de MkDocs
├── docs/                         # Tu documentación
│   ├── index.md                 # Página de inicio
│   ├── logging.md               # Guías
│   └── ...
├── .github/
│   └── workflows/
│       └── docs.yml             # GitHub Action para deploy automático
└── site/                        # Generado automáticamente (ignorado)
```

### Agregando Nueva Documentación

1. **Crear el archivo** en `docs/`:

   ```bash
   # Ejemplo
   cp docs/TEMPLATE.md docs/guides/quick-start.md
   # Edita el contenido
   ```

2. **Actualizar navegación** en `mkdocs.yml`:

   ```yaml
   nav:
     - Home: index.md
     - Guías:
         - Quick Start: guides/quick-start.md # ← Agregar aquí
   ```

3. **Commit y push**:

   ```bash
   git add .
   git commit -m "docs: add quick start guide"
   git push
   ```

4. **Espera 1-2 minutos** - GitHub Action deployará automáticamente

### Personalizando el Tema

En `mkdocs.yml`, puedes cambiar:

```yaml
theme:
  palette:
    primary: indigo # Cambia el color principal
    accent: pink # Color de acento

  features:
    - navigation.tabs # Tabs en lugar de sidebar
    - toc.integrate # TOC integrada
```

Colores disponibles:

- red, pink, purple, deep purple, indigo, blue
- light blue, cyan, teal, green, light green
- lime, yellow, amber, orange, deep orange

### Plugins Útiles

Ya incluidos:

- ✅ Búsqueda (search)
- ✅ Tags

Puedes agregar:

```yaml
plugins:
  - git-revision-date-localized # Muestra última actualización
  - minify # Minifica HTML
  - redirects # Redirecciones
```

Instalar con:

```bash
pip install mkdocs-git-revision-date-localized-plugin
pip install mkdocs-minify-plugin
pip install mkdocs-redirects
```

---

## 🔧 Troubleshooting

### Error: "gh-pages branch not found"

**Solución**: El branch se crea automáticamente en el primer deploy. Espera a que corra el GitHub Action.

### Error: "403 Forbidden" en GitHub Pages

**Solución**:

1. Ve a Settings → Pages
2. Asegúrate que Source esté en `gh-pages`
3. Verifica que GitHub Actions tenga permisos de escritura

### Los cambios no se reflejan

**Solución**:

1. Verifica que el Action haya corrido: Actions tab en GitHub
2. Limpia caché del navegador (Ctrl+Shift+R)
3. Espera 1-2 minutos para propagación de CDN

### Preview local no funciona

**Solución**:

```bash
# Reinstalar dependencias
pip uninstall mkdocs mkdocs-material
pip install mkdocs-material

# Verificar instalación
mkdocs --version
```

---

## 📊 Comparación Rápida

| Feature       | GitHub Native | MkDocs    | Docusaurus   | VitePress |
| ------------- | ------------- | --------- | ------------ | --------- |
| Setup         | ⚡ Inmediato  | 🟢 Fácil  | 🟡 Medio     | 🟡 Medio  |
| UI            | ⭐⭐          | ⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐  |
| Búsqueda      | ❌            | ✅        | ✅           | ✅        |
| Velocidad     | ⚡⚡⚡        | ⚡⚡⚡    | ⚡⚡         | ⚡⚡⚡    |
| Customización | ❌            | 🟢 Buena  | 🟢 Excelente | 🟢 Buena  |
| Deploy        | ⚡ Auto       | ⚡ Auto   | 🔧 Manual    | 🔧 Manual |
| Costo         | 💚 Gratis     | 💚 Gratis | 💚 Gratis    | 💚 Gratis |

---

## ✅ Checklist de Deploy

- [ ] Código pusheado a GitHub
- [ ] GitHub Pages habilitado en Settings
- [ ] Branch `gh-pages` existe (se crea automáticamente)
- [ ] GitHub Action corrió exitosamente
- [ ] URL funciona: `https://tu-usuario.github.io/get-ahead-ai/`
- [ ] Navegación funciona correctamente
- [ ] Búsqueda funciona
- [ ] Dark mode funciona
- [ ] Links internos funcionan
- [ ] Responsive design se ve bien

---

## 🎉 ¡Listo!

Tu documentación ahora está disponible en:

🌐 **https://tu-usuario.github.io/get-ahead-ai/**

Cada vez que hagas push a `main` con cambios en `docs/`, se desplegará automáticamente.

---

[← Volver a Documentación](./README.md)
