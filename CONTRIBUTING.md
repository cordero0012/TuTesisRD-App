# Contributing to TuTesisRD

¡Gracias por tu interés en contribuir a TuTesisRD! Este documento proporciona pautas para colaborar en el proyecto.

## 📋 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a proporcionar un entorno acogedor y libre de acoso para todos, independientemente de:
- Edad, raza, etnia, nacionalidad
- Identidad y expresión de género
- Nivel de experiencia
- Educación, estatus socioeconómico
- Discapacidad, apariencia física

### Comportamiento Esperado

- Usar lenguaje inclusivo y respetuoso
- Respetar puntos de vista y experiencias diferentes
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad

### Comportamiento Inaceptable

- Comentarios despectivos, insultos o ataques personales
- Acoso público o privado
- Publicar información privada de otros sin permiso

## 🚀 ¿Cómo Contribuir?

### 1. Reportar Bugs

Si encuentras un error:
1. Verifica que no esté ya reportado en [Issues](https://github.com/cordero0012/TuTesisRD-App/issues)
2. Crea un nuevo issue con:
   - **Título descriptivo**
   - **Pasos para reproducir** el error
   - **Comportamiento esperado** vs. **comportamiento actual**
   - **Capturas de pantalla** (si aplica)
   - **Información del entorno** (navegador, SO, versión de Node)

### 2. Sugerir Mejoras

Para proponer nuevas funcionalidades:
1. Abre un issue con la etiqueta `enhancement`
2. Describe el problema que resuelve
3. Propón una solución técnica (opcional)
4. Indica si estás dispuesto a implementarla

### 3. Contribuir con Código

#### Fork y Clone

```bash
# Fork el repositorio desde GitHub
git clone https://github.com/TU_USUARIO/TuTesisRD-App.git
cd TuTesisRD-App

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/cordero0012/TuTesisRD-App.git
```

#### Crear una Rama

```bash
# Crea una rama descriptiva
git checkout -b tipo/descripcion-breve

# Ejemplos:
# git checkout -b feat/blog-search
# git checkout -b fix/navbar-mobile
# git checkout -b docs/api-documentation
```

**Prefijos de rama:**
- `feat/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Documentación
- `style/` - Formato, sin cambios de lógica
- `refactor/` - Refactorización de código
- `test/` - Agregar o corregir tests
- `chore/` - Tareas de mantenimiento

#### Hacer Cambios

1. **Escribe código limpio** siguiendo las guías de estilo
2. **Agrega tests** para nuevas funcionalidades
3. **Actualiza documentación** si es necesario
4. **Verifica que los tests pasen**: `npm run test`
5. **Verifica el build**: `npm run build`

#### Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "tipo: descripción breve"

# Ejemplos:
git commit -m "feat: add blog search functionality"
git commit -m "fix: resolve navbar overflow on mobile"
git commit -m "docs: update README installation steps"
```

**Tipos de commit:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento
- `perf:` Mejora de rendimiento

#### Pull Request

```bash
# Push a tu fork
git push origin tipo/descripcion-breve

# Abre un Pull Request desde GitHub
```

**Checklist de PR:**
- [ ] El código sigue las guías de estilo del proyecto
- [ ] He agregado tests que prueban mi solución
- [ ] Todos los tests nuevos y existentes pasan
- [ ] He actualizado la documentación correspondiente
- [ ] Mi commit sigue el formato Conventional Commits
- [ ] He probado la funcionalidad en desarrollo local

## 🎨 Guías de Estilo

### TypeScript

- Usa tipos explícitos en parámetros de funciones
- Evita `any`, usa `unknown` si es necesario
- Define interfaces para objetos complejos
- Usa `const` para valores inmutables

```typescript
// ✅ Bueno
interface BlogPost {
  id: string;
  title: string;
  content: string;
}

const createPost = (data: BlogPost): Promise<void> => {
  // ...
};

// ❌ Malo
const createPost = (data: any) => {
  // ...
};
```

### React

- Usa componentes funcionales con hooks
- Extrae lógica compleja en custom hooks
- Memoriza callbacks con `useCallback` si son pasados como props
- Usa `React.memo` para componentes que re-renderizan frecuentemente

```tsx
// ✅ Bueno
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const navigate = useNavigate();
  
  const handleClick = useCallback(() => {
    navigate(`/blog/${post.id}`);
  }, [post.id, navigate]);

  return <div onClick={handleClick}>{post.title}</div>;
};

// ❌ Malo
function BlogCard({ post }) {
  return <div onClick={() => navigate(`/blog/${post.id}`)}>{post.title}</div>;
}
```

### CSS / TailwindCSS

- Usa clases de Tailwind en lugar de CSS personalizado
- Agrupa clases relacionadas (layout, colores, tipografía)
- Usa variantes responsive (`md:`, `lg:`) de forma consistente
- Prefiere `dark:` para temas oscuros

```tsx
// ✅ Bueno
<div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm">

// ❌ Malo
<div className="p-6 bg-white flex rounded-xl items-center gap-4 dark:bg-slate-900 shadow-sm">
```

## 🧪 Testing

### Escribir Tests

- Cada funcionalidad nueva debe tener tests
- Usa `describe` para agrupar tests relacionados
- Nombra tests con descripciones claras
- Cubre casos edge y errores

```typescript
import { render, screen } from '@testing-library/react';
import { BlogCard } from './BlogCard';

describe('BlogCard', () => {
  it('should render blog title correctly', () => {
    const post = { id: '1', title: 'Test Post', content: '...' };
    render(<BlogCard post={post} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('should navigate to post detail on click', () => {
    // ...
  });
});
```

### Ejecutar Tests

```bash
npm run test              # Modo watch
npm run test:coverage     # Con reporte de cobertura
```

## 🔍 Proceso de Revisión

1. **Asignación automática**: Un maintainer será asignado
2. **Revisión de código**: Puede haber solicitudes de cambios
3. **CI/CD**: Los tests deben pasar automáticamente
4. **Aprobación**: Requiere al menos 1 aprobación
5. **Merge**: El maintainer hará merge a `main`

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir:
- Abre un issue con la etiqueta `question`
- Contacta a los maintainers directamente
- Revisa la [documentación](https://github.com/cordero0012/TuTesisRD-App/wiki)

---

¡Gracias por ayudar a mejorar TuTesisRD! 🎓
