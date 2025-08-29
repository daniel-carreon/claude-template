# Proyecto: [NOMBRE_DEL_PROYECTO]

## 🎯 Principios de Desarrollo (Context Engineering)

### Design Philosophy
- **KISS**: Keep It Simple, Stupid - Prefiere soluciones simples
- **YAGNI**: You Aren't Gonna Need It - Implementa solo lo necesario  
- **DRY**: Don't Repeat Yourself - Evita duplicación de código
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

### Descripción del Proyecto
[Breve descripción de qué hace tu proyecto y sus características principales]

## 🏗️ Tech Stack & Architecture

### Core Stack
- **Frontend**: [Next.js/React + TypeScript]
- **Backend**: [FastAPI/Python + SQLModel]
- **Base de Datos**: [PostgreSQL/Supabase]
- **Styling**: [Tailwind CSS/Styled Components]
- **Testing**: [Jest + pytest]

### Hybrid Strategic Architecture

**Enfoque: Arquitectura Híbrida Estratégica optimizada para desarrollo asistido por IA**

- **Frontend**: Feature-First Architecture
- **Backend**: Clean Architecture (Layered)
- **Principio**: Cada parte usa la estructura que mejor se adapta a su contexto

#### Frontend: Feature-First
```
frontend/
├── src/
│   ├── app/              # Next.js routes, layout global
│   │   ├── (auth)/       # Rutas de autenticación
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Página principal
│   ├── features/         # 🎯 Organizadas por funcionalidad
│   │   ├── [feature]/    # Ej: auth, dashboard, chat
│   │   │   ├── components/ # Componentes específicos
│   │   │   ├── hooks/      # Custom hooks
│   │   │   ├── services/   # API calls
│   │   │   └── types/      # Tipos específicos
│   │   └── ...
│   └── shared/           # Código reutilizable
│       ├── components/   # UI components genéricos
│       ├── hooks/        # Hooks genéricos
│       ├── stores/       # Estado global (Zustand)
│       ├── types/        # Tipos compartidos
│       ├── utils/        # Utilidades
│       └── lib/          # Configuraciones (Supabase, etc.)
```

#### Backend: Clean Architecture
```
backend/
├── main.py               # Punto de entrada FastAPI
├── api/                  # 🌐 Capa de Interfaz/Presentación
│   ├── auth_deps.py      # Dependencias de autenticación
│   ├── [feature]_router.py # Endpoints por feature
│   └── ...
├── application/          # 🎯 Casos de Uso/Orquestación
│   └── services/         # Servicios de aplicación
│       └── [feature]_service.py
├── domain/              # 💎 Lógica de Negocio Pura
│   ├── models/          # Entidades (SQLModel)
│   ├── services/        # Servicios de dominio
│   ├── config/          # Configuración de dominio
│   └── interfaces/      # Abstracciones/Contratos
└── infrastructure/      # 🔧 Implementaciones Externas
    ├── persistence/     # Repositorios, DB access
    ├── external_apis/   # Clientes APIs externas
    └── config/          # Configuración de infraestructura
```

### Arquitectura Completa
```
proyecto/
├── frontend/            # Feature-First Architecture
├── backend/            # Clean Architecture  
├── supabase/          # Migraciones de BD
│   └── migrations/
├── .claude/           # Configuración Claude Code
└── docs/             # Documentación técnica
```

> **🤖 ¿Por qué esta arquitectura?**
> 
> Esta estructura híbrida fue diseñada específicamente para **desarrollo asistido por IA**. La organización clara por capas y features permite que los AI assistants:
> - **Localicen rápidamente** el código relacionado con una funcionalidad específica
> - **Entiendan el contexto** sin necesidad de navegar múltiples archivos dispersos  
> - **Mantengan la separación de responsabilidades** al generar código nuevo
> - **Escalen el proyecto** añadiendo features sin afectar el código existente
> - **Generen código consistente** siguiendo los patrones establecidos en cada capa
>
> *La IA puede trabajar de forma más efectiva cuando la información está organizada siguiendo principios claros y predecibles.*

## 🛠️ Comandos Importantes

### Development
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

### Quality Assurance
- `npm run test` - Ejecutar tests
- `npm run test:watch` - Tests en modo watch
- `npm run test:coverage` - Coverage report
- `npm run lint` - ESLint
- `npm run lint:fix` - Fix automático de linting
- `npm run typecheck` - Verificación de tipos TypeScript

### Git Workflow
- `npm run commit` - Commit con Conventional Commits
- `npm run pre-commit` - Hook de pre-commit

## 📝 Convenciones de Código

### File & Function Limits
- **Archivos**: Máximo 500 líneas
- **Funciones**: Máximo 50 líneas
- **Componentes**: Una responsabilidad clara

### Naming Conventions
- **Variables/Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case.extension`
- **Folders**: `kebab-case`

### TypeScript Guidelines
- **Siempre usar type hints** para function signatures
- **Interfaces** para object shapes
- **Types** para unions y primitives
- **Evitar `any`** - usar `unknown` si es necesario

### Component Patterns
```typescript
// ✅ GOOD: Proper component structure
interface Props {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
}

export function Button({ children, variant = 'primary', onClick }: Props) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

## 🧪 Testing Strategy

### Test-Driven Development (TDD)
1. **Red**: Escribe el test que falla
2. **Green**: Implementa código mínimo para pasar
3. **Refactor**: Mejora el código manteniendo tests verdes

### Test Structure (AAA Pattern)
```typescript
// ✅ GOOD: Clear test structure
test('should calculate total with tax', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 200 }];
  const taxRate = 0.1;
  
  // Act
  const result = calculateTotal(items, taxRate);
  
  // Assert  
  expect(result).toBe(330);
});
```

### Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: Main user journeys

## 🔒 Security Best Practices

### Input Validation
- Validate all user inputs
- Sanitize data before processing
- Use schema validation (Zod, Yup, etc.)

### Authentication & Authorization
- JWT tokens con expiración
- Role-based access control
- Secure session management

### Data Protection
- Never log sensitive data
- Encrypt data at rest
- Use HTTPS everywhere

## ⚡ Performance Guidelines

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports

### State Management
- Local state first
- Global state only when needed
- Memoization for expensive computations

### Database Optimization
- Index frequently queried columns
- Use pagination for large datasets
- Cache repeated queries

## 🔄 Git Workflow & Repository Rules

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/TICKET-123-description` - Feature branches
- `hotfix/TICKET-456-description` - Hotfixes

### Commit Convention (Conventional Commits)
```
type(scope): description

feat(auth): add OAuth2 integration
fix(api): handle null user response  
docs(readme): update installation steps
```

### Pull Request Rules
- **No direct commits** a `main` o `develop`
- **Require PR review** antes de merge
- **All tests must pass** antes de merge
- **Squash and merge** para mantener historia limpia

## ❌ No Hacer (Critical)

### Code Quality
- ❌ No usar `any` en TypeScript
- ❌ No hacer commits sin tests
- ❌ No omitir manejo de errores
- ❌ No hardcodear configuraciones

### Security  
- ❌ No exponer secrets en código
- ❌ No loggear información sensible
- ❌ No saltarse validación de entrada
- ❌ No usar HTTP en producción

### Architecture
- ❌ No editar archivos en `src/legacy/`
- ❌ No crear dependencias circulares
- ❌ No mezclar concerns en un componente
- ❌ No usar global state innecesariamente

## 📚 Referencias & Context

### Project Files
- Ver @README.md para overview detallado
- Ver @package.json para scripts disponibles
- Ver @.claude/docs/ para workflows y documentación
- Ver @.mcp.json.examples para MCPs disponibles

### External Dependencies
- Documentación oficial de frameworks
- Best practices guides
- Security guidelines (OWASP)

## 🤖 AI Assistant Guidelines

### When Suggesting Code
- Siempre incluir types en TypeScript
- Seguir principles de CLAUDE.md
- Implementar error handling
- Incluir tests cuando sea relevante

### When Reviewing Code  
- Verificar adherencia a principios SOLID
- Validar security best practices
- Sugerir optimizaciones de performance
- Recomendar mejoras en testing

### Context Priority
1. **CLAUDE.md rules** (highest priority)
2. **.claude/docs/** workflows y guías
3. **Project-specific files** (package.json, etc.)
4. **General best practices**

---

*Este archivo es la fuente de verdad para desarrollo en este proyecto. Todas las decisiones de código deben alinearse con estos principios.*