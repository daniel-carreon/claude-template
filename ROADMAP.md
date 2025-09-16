# 🚀 Daniel Flux Context - MVP Roadmap

**Objetivo:** Aplicación web para generar 10 imágenes con modelo fine-tuned, seleccionar favoritas y guardar en Supabase.

**Stack:** Next.js 15 + TypeScript + Tailwind + Supabase + Replicate API

---

## 📋 PHASE 1: SETUP & INFRASTRUCTURE

### 1.1 Documentación & Planning
- [x] Crear ROADMAP.md con tracking detallado
- [ ] Investigar compatibilidad React 19 con dependencias
- [ ] Validar configuración de Supabase MCP
- [ ] Confirmar acceso a modelo `daniel-carreon/danielcarreong`

### 1.2 Resolución de Dependencias
- [ ] Resolver conflictos npm con React 19
- [ ] Instalar dependencias core: zustand, @supabase/supabase-js
- [ ] Configurar Tailwind CSS correctamente
- [ ] Setup TypeScript strict mode

### 1.3 Estructura Base
- [ ] Crear estructura de carpetas según CLAUDE.md
- [ ] Configurar variables de entorno (.env.local)
- [ ] Setup Supabase client configuration
- [ ] Crear layout base de Next.js 15

---

## 📡 PHASE 2: API INTEGRATION

### 2.1 Replicate API Integration
- [ ] Investigar API actual de Replicate para batch generation
- [ ] Crear `/api/generate` endpoint
- [ ] Implementar llamadas múltiples (4+4+2 imágenes)
- [ ] Error handling y timeouts
- [ ] Testing con curl

### 2.2 Webhook Configuration (Optional)
- [ ] Evaluar integración directa vs N8N webhook
- [ ] Si N8N: configurar endpoint webhook
- [ ] Validar response format
- [ ] Implementar parsing de URLs

---

## 🎨 PHASE 3: FRONTEND COMPONENTS

### 3.1 Core Components
- [ ] `PromptInput` - Input de texto + botón generate
- [ ] `GenerationStatus` - Loading state + progress
- [ ] `ImageGrid` - Grid 5x2 con selección
- [ ] `ImageCard` - Imagen individual + like/discard
- [ ] `FavoritesGallery` - Imágenes guardadas

### 3.2 State Management
- [ ] Setup Zustand store
- [ ] Estados: generating, images, selected, favorites
- [ ] Acciones: generate, select, save, clear
- [ ] Persistence en localStorage (opcional)

### 3.3 UI/UX
- [ ] Responsive design mobile-first
- [ ] Loading animations
- [ ] Error states
- [ ] Success feedback
- [ ] Keyboard shortcuts

---

## 🗄️ PHASE 4: SUPABASE STORAGE

### 4.1 Storage Configuration
- [ ] Investigar Supabase Storage API con MCP
- [ ] Crear bucket 'generated-images'
- [ ] Configurar public access y MIME types
- [ ] Test upload básico

### 4.2 Integration
- [ ] Función para descargar imagen de URL
- [ ] Upload a Supabase Storage
- [ ] Generar URLs públicas
- [ ] Gestión de metadatos (prompt, timestamp)

### 4.3 Favorites Management
- [ ] Guardar URLs de favoritas
- [ ] Listado de imágenes guardadas
- [ ] Download directo
- [ ] Cleanup de archivos no utilizados

---

## 🧪 PHASE 5: TESTING & VALIDATION

### 5.1 End-to-End Testing
- [ ] Test completo: prompt → generate → select → save
- [ ] Screenshots con Playwright MCP
- [ ] Validar responsive en mobile
- [ ] Performance testing

### 5.2 Error Scenarios
- [ ] API failures
- [ ] Network timeouts
- [ ] Storage errors
- [ ] Invalid inputs

### 5.3 Production Readiness
- [ ] Code review y optimización
- [ ] SEO básico
- [ ] Security checks
- [ ] Deploy preparation

---

## 📈 METRICS & SUCCESS CRITERIA

### MVP Success Definition
- [x] **Functional:** Generate 10 images from prompt
- [ ] **Selection:** Click to like/discard images
- [ ] **Storage:** Save favorites to Supabase
- [ ] **Performance:** <30s generation time
- [ ] **Usability:** Intuitive interface
- [ ] **Reliability:** 95% success rate

### Technical Metrics
- [ ] **Bundle size:** <500KB initial load
- [ ] **LCP:** <2.5s
- [ ] **CLS:** <0.1
- [ ] **Mobile Score:** >90

---

## 🔮 FUTURE ENHANCEMENTS (V2+)

- [ ] FLUX Kontext integration (image-to-image)
- [ ] Autenticación de usuarios
- [ ] Batch processing múltiple
- [ ] Model switching (dev vs kontext)
- [ ] Advanced editing tools
- [ ] Social sharing
- [ ] Analytics dashboard
- [ ] Team collaboration

---

**Status:** 🚧 In Progress
**Started:** 2025-09-15
**Target MVP:** 2025-09-15 (same day)
**Estimated Time:** 90-120 minutes

---

*Este roadmap se actualiza en tiempo real durante el bucle agéntico.*