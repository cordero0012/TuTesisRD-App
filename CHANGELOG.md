# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Expand test coverage to >80%
- Add staging environment for preview deployments
- API documentation for internal services
- Advanced blog search and filtering
- User authentication and personalized dashboards

---

## [1.0.0] - 2026-02-10

### Added
- **Blog Sistema Completo**: 9 artículos académicos con citas APA 7ma edición
  - 3 posts iniciales (estructura de anteproyecto, errores APA, gestión de tiempo)
  - 6 nuevos posts generados desde NotebookLM (metodología, problemas de investigación, marco teórico, recolección de datos, análisis de resultados, defensa de tesis)
- **Recursos Educativos**: Tres páginas completas
  - `/recursos/que-es-tesis` - Definición, características y tipos de tesis
  - `/recursos/como-hacer-tesis` - Guía paso a paso con structured data HowTo
  - `/recursos/ejemplos-tesis` - Enlaces a repositorios de universidades dominicanas
- **Optimizaciones de Rendimiento**:
  - Conversión de imágenes a formato WebP (reducción de ~70% en tamaño)
  - Lazy loading en todas las imágenes secundarias
  - Skeleton loaders para prevenir CLS (Cumulative Layout Shift)
  - Preloading de recursos críticos (fuentes e imagen hero)
  - Code splitting con React.lazy en todas las rutas
  - Vite chunk optimization para vendors (React, PDF, AI)
- **SEO y Accesibilidad**:
  - Sitemap.xml actualizado con todas las rutas nuevas
  - Meta tags dinámicos con componente SEO
  - JSON-LD structured data (Organization, Service, HowTo)
  - Open Graph y Twitter Cards en todas las páginas
- **Herramientas de IA**:
  - Auditor de Tesis con análisis de coherencia y formato APA
  - Matriz de Consistencia para validación metodológica
  - Chat de consultas académicas
- **Documentación Completa**:
  - README.md extensivo con instrucciones de instalación y desarrollo
  - CONTRIBUTING.md con guías de código y proceso de PR
  - CHANGELOG.md (este archivo)
  - AUDIT_REPORT.md actualizado

### Changed
- Reestructuración completa de arquitectura (todos los archivos fuente en `src/`)
- Migración de configuración a variables de entorno (`import.meta.env`)
- Refactorización de `RegisterWizard` en componentes modulares
- Actualización de modelos Gemini AI a `gemini-1.5-flash`

### Fixed
- Hardcoded API keys movidos a `.env.local`
- Errores de accesibilidad en navegación móvil
- Overflow de contenido en componentes modales
- Errores de tipado en TypeScript (eliminación de `any`)
- Vulnerabilidades de seguridad (0 vulnerabilidades según `npm audit`)

### Security
- Implementación de Row Level Security (RLS) en Supabase
- Variables de entorno correctamente configuradas con prefijos `VITE_`
- Validación de entrada con Zod en formularios
- Sanitización de contenido generado por IA

---

## [0.2.0] - 2026-01-30

### Added
- Despliegue en Vercel con configuración de SPA routing
- Tests de accesibilidad con jest-axe
- Configuración de GitHub Actions para CI

### Changed
- Migración de base de datos a Supabase
- Actualización de dependencias a versiones estables

### Fixed
- Problemas de autenticación con Google OAuth
- Persistencia de sesión en navegador

---

## [0.1.0] - 2026-01-15

### Added
- Estructura inicial del proyecto con Vite + React + TypeScript
- Componentes base (Navbar, Footer, LandingPage)
- Integración con Gemini AI para procesamiento de textos
- Sistema de registro de proyectos
- Panel de administración básico
- Dark mode con persistencia

### Security
- Configuración inicial de Supabase

---

## Tipos de Cambios

- `Added` para nuevas funcionalidades.
- `Changed` para cambios en funcionalidades existentes.
- `Deprecated` para funcionalidades que serán eliminadas.
- `Removed` para funcionalidades eliminadas.
- `Fixed` para correcciones de bugs.
- `Security` para vulnerabilidades de seguridad.

---

[Unreleased]: https://github.com/cordero0012/TuTesisRD-App/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/cordero0012/TuTesisRD-App/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/cordero0012/TuTesisRD-App/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/cordero0012/TuTesisRD-App/releases/tag/v0.1.0
