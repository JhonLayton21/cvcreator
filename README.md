# CV Creator – Generador de Currículums en Markdown

Una aplicación web moderna y simplificada para crear currículums profesionales directamente en Markdown, con exportación a múltiples formatos compatibles con sistemas ATS.

## 🎯 Objetivo

CV Creator facilita la creación de currículums profesionales enfocados en:
- ✅ **Compatibilidad ATS** – Optimizado para sistemas de seguimiento de candidatos
- ✅ **Simplicidad** – Interfaz clara y directa sin distracciones
- ✅ **Velocidad** – De la edición a la exportación en segundos
- ✅ **Contenido sobre diseño** – Prioriza el texto profesional sobre estilos visuales

## ✨ Características principales

### 📝 Editor Markdown
- Editor de texto plano con soporte completo para Markdown
- Plantilla preconfigurada con secciones estándar
- Botón para reestablecer la plantilla en cualquier momento
- Autoguardado local para visitantes sin cuenta

### 👁️ Vista previa en tiempo real
- Renderización instantánea de cambios
- Visualización fiel de cómo se verá el currículum final
- Una sola columna para máxima compatibilidad ATS

### 📊 Validaciones inteligentes
- Detección de resumen profesional demasiado largo
- Sugerencias de secciones clave faltantes
- Recomendaciones para incluir métricas en experiencia
- Estadísticas del currículum (palabras, secciones, puntos clave)
- **No bloqueantes** – Sugerencias informativas solamente

### 💾 Exportación a múltiples formatos

#### Markdown (.md)
- Descarga directa del contenido escrito
- Sin modificaciones

#### Word (.docx)
- Fuente ATS-safe (Calibri)
- Márgenes estándar (0.5 pulgadas)
- Encabezados y listas bien formateados
- Sin estilos decorativos

#### PDF
- Texto completamente seleccionable
- Fuente ATS-safe (Arial)
- Una sola página continua
- Márgenes estándar
- Compatible con sistemas ATS

### ⚙️ Características técnicas
- Nombre de archivo personalizable para todas las exportaciones
- Modo invitado para crear y exportar sin registro
- Inicio de sesión por correo/contraseña y Google con Supabase Auth
- Panel de CVs con vistas de cuadrícula/lista y operaciones CRUD
- Guardado en Supabase Postgres con Row Level Security (RLS)

## 🚀 Quick Start

### Requisitos previos
- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JhonLayton21/cvcreator.git
cd cvcreator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

### Configurar Supabase

Para activar autenticación y almacenamiento en la nube, sigue los pasos de [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md). El proyecto requiere `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` en un archivo `.env` local y en el entorno de Vercel. Sin esa configuración, el modo invitado sigue disponible, pero las funciones de cuenta no se conectan.

### Build para producción

```bash
npm run build
npm run preview
```

## 📁 Estructura del proyecto

```
cvcreator/
├── src/
│   ├── components/
│   │   ├── EditorCV.jsx          # Editor Markdown con plantilla
│   │   ├── PreviewCV.jsx         # Vista previa en tiempo real
│   │   ├── ExportButtons.jsx     # Controles de exportación
│   │   └── ValidationHints.jsx   # Validaciones informativas
│   ├── pages/
│   │   └── index.astro           # Página principal
│   ├── styles/
│   │   └── global.css            # Estilos globales
│   └── utils/
│       ├── resumeStore.js        # Store pub/sub con persistencia
│       ├── exportToDocx.js       # Exportación a Word
│       ├── exportToPdf.js        # Exportación a PDF
│       ├── markdownParser.js     # Parser de Markdown
│       └── resumeValidator.js    # Validaciones inteligentes
├── public/
├── cv-template.md                # Plantilla de referencia
├── MVP.md                        # Especificaciones del proyecto
└── package.json
```

## 🛠️ Stack Tecnológico

- **Frontend Framework**: Astro 5.x
- **Hosting**: Vercel adapter para Astro y rutas dinámicas
- **UI Components**: React 19.x
- **Styling**: Tailwind CSS 4.x
- **Auth y base de datos**: Supabase Auth, Postgres y RLS
- **Markdown**: Remark + remark-gfm
- **Exportación**:
  - `docx` – Generación de Word
  - `jspdf` – Generación de PDF
  - `file-saver` – Descarga de archivos
- **Persistencia invitado**: localStorage
- **Persistencia de cuentas**: Supabase Postgres

## 📋 Estructura del Currículum

La plantilla incluye las siguientes secciones:

1. **Nombre y contacto** – Información de identificación
2. **Perfil profesional** – Resumen enfocado (3-5 líneas)
3. **Experiencia laboral** – Con énfasis en logros y métricas
4. **Educación** – Formación académica
5. **Habilidades técnicas** – Lenguajes, frameworks, herramientas
6. **Proyectos destacados** *(opcional)* – Trabajos relevantes
7. **Certificaciones** *(opcional)* – Credenciales profesionales
8. **Idiomas** – Competencias lingüísticas

El orden se mantiene para optimizar compatibilidad ATS.

## 📋 Principios de diseño

- **Una sola columna** – Fácil lectura y procesamiento ATS
- **Texto plano** – Máxima compatibilidad
- **Sin decoraciones** – Solo lo funcional necesario
- **Sin gráficos, íconos o tablas complejas** – Optimización ATS
- **Contenido sobre forma** – Prioridad absoluta

## 🎨 Validaciones y sugerencias

La aplicación proporciona feedback inteligente:

- ⚠️ **Resumen demasiado largo** – Más de 150 palabras
- ⚠️ **Secciones faltantes** – Experiencia, educación, habilidades
- 💡 **Sin métricas** – Sugerencia para incluir números en experiencia
- 📊 **Estadísticas** – Palabras, secciones, puntos clave

Todas las validaciones son **informativas, nunca bloqueantes**.

## 🚫 Fuera del alcance

- Diseño visual avanzado
- Múltiples plantillas prediseñadas
- Temas o colores personalizados

## 📝 Cómo usar

1. **Abre la aplicación** – Sin registro necesario
2. **Edita el Markdown** – Modifica la plantilla con tu información
3. **Revisa la vista previa** – Ve cómo se verá tu currículum
4. **Revisa las validaciones** – Mejora según las sugerencias
5. **Exporta tu currículum** – Elige el formato que necesites
6. **Envía** – ¡Listo para aplicar a ofertas!

## 🔄 Características de persistencia

- En **modo invitado**, el currículum se guarda automáticamente en localStorage de ese navegador.
- En una **cuenta**, los CVs se guardan en Supabase y están disponibles después de iniciar sesión desde otro dispositivo.
- Si inicias sesión mientras trabajas como invitado, se te ofrece guardar el CV actual en tu cuenta.
- Los datos de cuenta se aíslan por usuario mediante políticas RLS; consulta [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) antes de habilitar el despliegue.

## 📦 Dependencias principales

```json
{
  "astro": "^5.17.1",
  "react": "^19.2.4",
  "tailwindcss": "^4.1.18",
  "docx": "^9.5.1",
  "jspdf": "^2.5.x",
  "file-saver": "^2.0.5",
  "remark": "^15.0.1"
}
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

**JhonLayton21** – GitHub: [@JhonLayton21](https://github.com/JhonLayton21)

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio.

---

**Construido con ❤️ para simplificar la creación de currículums profesionales.**
