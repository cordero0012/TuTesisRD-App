# TuTesisRD - Plataforma Integral de Gestión de Tesis

<div align="center">

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-black)](https://www.tutesisrd.online)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/cordero0012/TuTesisRD-App)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Asesoría experta en tesis de grado, tesis doctoral y anteproyectos en República Dominicana.**

[Website](https://www.tutesisrd.online) • [Blog Académico](https://www.tutesisrd.online/blog) • [Recursos](https://www.tutesisrd.online/recursos/que-es-tesis)

</div>

---

## 📚 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### Contenido Educativo
- **Blog Académico**: 9 artículos completos con citas APA 7, abarcando metodología, redacción y defensa de tesis
- **Recursos Educativos**: Guías detalladas sobre qué es una tesis, cómo hacerla y ejemplos prácticos
- **Enlaces a Repositorios**: Acceso directo a bibliotecas digitales de universidades dominicanas (UASD, PUCMM, INTEC, UNIBE, UNAPEC, UNPHU)

### Herramientas de IA
- **Auditor de Tesis**: Análisis automatizado de coherencia, estructura y cumplimiento de normas APA
- **Matriz de Consistencia**: Validación de alineación entre problema, objetivos y metodología
- **Asistente de Consulta**: Chat integrado para responder preguntas académicas

### Rendimiento y Accesibilidad
- **Core Web Vitals Optimizados**: Imágenes WebP, lazy loading, skeleton loaders
- **SEO Avanzado**: Structured data, sitemap dinámico, meta tags optimizados
- **Responsive Design**: Interfaz adaptable a móvil, tablet y desktop
- **Dark Mode**: Tema oscuro con persistencia de preferencias

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Biblioteca UI con Suspense y lazy loading
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool ultra-rápido con HMR
- **React Router 7** - Enrutamiento client-side
- **TailwindCSS 3** - Framework CSS utility-first

### Backend & Services
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Google Gemini AI** - Modelos de lenguaje para análisis académico
- **Vercel** - Plataforma de despliegue con CDN global

### Herramientas de Desarrollo
- **Vitest** - Framework de testing con UI
- **Testing Library** - Testing de componentes React
- **Jest Axe** - Auditorías de accesibilidad automatizadas
- **ESLint & Prettier** - Linting y formateo de código

---

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **pnpm** >= 8.0.0
- Cuenta de **Supabase** (para desarrollo local)
- **Google Gemini API Key** (para funciones de IA)

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/cordero0012/TuTesisRD-App.git
cd TuTesisRD-App

# Instalar dependencias
npm install

# O usando pnpm
pnpm install
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Gemini AI
VITE_GEMINI_API_KEY=tu_gemini_api_key

# Groq (opcional, para AI alternativo)
VITE_GROQ_API_KEY=tu_groq_api_key
```

> **Nota**: Todas las variables deben tener el prefijo `VITE_` para ser accesibles en el cliente.

### 2. Base de Datos Supabase

Ejecuta las migraciones necesarias en tu proyecto Supabase:

```bash
# Verifica la estructura de la BD en supabase/schema.sql
# O importa las tablas directamente desde el dashboard de Supabase
```

Las tablas principales son:
- `projects` - Proyectos de tesis registrados
- `users` - Usuarios de la plataforma
- `audit_history` - Historial de auditorías de documentos

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Modo de Desarrollo con Hot Module Replacement (HMR)

Vite proporciona HMR instantáneo. Los cambios en código se reflejan automáticamente sin necesidad de refrescar la página.

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con HMR

# Build
npm run build            # Compilar para producción
npm run preview          # Previsualizar build de producción

# Testing
npm run test             # Ejecutar tests en modo watch
npm run test:ui          # Ejecutar tests con interfaz visual
npm run test:coverage    # Generar reporte de cobertura

# Deployment
npm run deploy           # Desplegar en GitHub Pages
```

---

## 📁 Estructura del Proyecto

```
TuTesisRD-App/
├── public/                  # Assets estáticos
│   ├── blog/               # Imágenes de blog posts (WebP)
│   ├── favicon.png
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── components/         # Componentes React reutilizables
│   │   ├── common/        # Botones, inputs, modales
│   │   ├── layout/        # Navbar, Footer, Sidebar
│   │   └── SEO.tsx        # Componente de meta tags dinámicos
│   ├── pages/             # Páginas principales
│   │   ├── Blog.tsx
│   │   ├── LandingPage.tsx
│   │   └── Recursos/      # Páginas educativas
│   ├── services/          # Lógica de negocio
│   │   ├── geminiService.ts
│   │   └── supabaseClient.ts
│   ├── data/              # JSON estáticos
│   │   └── blogPosts.json
│   ├── types/             # Definiciones TypeScript
│   ├── utils/             # Funciones auxiliares
│   ├── App.tsx            # Componente raíz con rutas
│   └── index.tsx          # Punto de entrada
├── scripts/               # Scripts de automatización
│   └── convert_to_webp.py
├── .env.local            # Variables de entorno (no en git)
├── vite.config.ts        # Configuración Vite
├── tailwind.config.js    # Configuración TailwindCSS
└── package.json
```

---

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
# Conecta tu repositorio a Vercel desde el dashboard
# Configura las variables de entorno en Settings > Environment Variables
# El deploy se activará automáticamente en cada push a main
```

### GitHub Pages

```bash
npm run deploy
```

Esto compilará el proyecto y lo desplegará en la rama `gh-pages`.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer nuestras pautas.

### Flujo de Trabajo

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💼 Contacto

**Miguel Ángel Cordero Trinidad**
- Email: contacto@tutesisrd.online
- WhatsApp: [+1 829 443 5985](https://wa.me/message/YESJDSE3MZ3IM1)
- LinkedIn: [Miguel Cordero](https://linkedin.com/in/miguelcordero)

---

<div align="center">

**Hecho con ❤️ en República Dominicana**

</div>
