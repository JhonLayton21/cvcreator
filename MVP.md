# CV Markdown Builder – MVP

## 1. Objetivo del proyecto

Construir una aplicación web single page que permita a un usuario:

- Escribir su currículum en formato Markdown
- Ver una vista previa en tiempo real
- Exportar el currículum en formato:
  - Markdown (.md)
  - Word (.docx)
  - PDF (.pdf)

El foco principal del proyecto es:
- Compatibilidad con sistemas ATS
- Velocidad de uso
- Simplicidad
- Contenido sobre diseño

Esta aplicación NO busca crear currículums visualmente llamativos,
sino documentos profesionales, legibles y procesables por ATS.

---

## 2. Principios clave (NO negociables)

- Una sola columna
- Texto plano
- Encabezados y listas
- Sin diseños complejos
- Sin íconos
- Sin gráficos
- Sin columnas
- Sin tablas avanzadas
- Sin colores decorativos

Si una decisión técnica o visual puede afectar la lectura por ATS,
debe descartarse.

---

## 3. Stack tecnológico definido

Frontend:
- Astro (estructura y routing)
- React (solo donde sea necesario)
- Tailwind CSS (uso mínimo)

Markdown:
- remark / markdown-it
- Renderizado limpio a HTML

Persistencia:
- localStorage (no backend)

Exportación:
- Markdown → .md (directo)
- Markdown → .docx
- Markdown → .pdf (texto seleccionable)

---

## 4. Alcance del MVP

### Incluido en el MVP

- Editor Markdown funcional
- Vista previa en tiempo real
- Autosave automático
- Plantilla base ATS-friendly
- Exportar a Markdown
- Exportar a Word
- Exportar a PDF
- Validaciones informativas (no bloqueantes)

### Fuera del alcance del MVP

- Autenticación de usuarios
- Backend o base de datos
- Guardado en la nube
- Diseño visual avanzado
- Múltiples columnas
- Plantillas gráficas
- Animaciones
- Temas o colores personalizados

---

## 5. Estructura del currículum

El currículum debe seguir una estructura clara y estándar:

- Nombre completo
- Información de contacto
- Perfil profesional
- Experiencia laboral
- Educación
- Habilidades técnicas
- Proyectos (opcional)
- Certificaciones (opcional)
- Idiomas

El orden debe mantenerse para maximizar compatibilidad ATS.

---

## 6. Editor Markdown

Requisitos:
- Editor simple (textarea o editor ligero)
- No WYSIWYG
- El usuario escribe Markdown directamente
- Soporte básico para:
  - Encabezados
  - Listas
  - Texto en negrita

El editor debe ser rápido y sin distracciones.

---

## 7. Vista previa

- Renderizado en tiempo real
- Representación fiel del contenido final
- Sin estilos decorativos
- Tipografía legible
- Una sola columna

La vista previa representa cómo se exportará el documento.

---

## 8. Autosave

- Guardado automático en localStorage
- Recuperación automática al recargar
- No requiere interacción del usuario
- No debe afectar performance

---

## 9. Exportación de archivos

### Exportar Markdown
- Descarga directa del contenido escrito
- Sin modificaciones

### Exportar Word (.docx)
- Fuente ATS-safe (Arial o Calibri)
- Márgenes estándar
- Encabezados y listas bien definidos
- Sin estilos decorativos

### Exportar PDF
- Texto seleccionable
- Fuente ATS-safe
- Una sola página continua
- Márgenes estándar
- Compatible con ATS

---

## 10. Validaciones inteligentes

La aplicación puede sugerir mejoras como:
- Resumen profesional demasiado largo
- Falta de métricas en experiencia
- Secciones clave ausentes

Estas validaciones:
- No bloquean exportes
- Son solo informativas
- No modifican el contenido del usuario

---

## 11. Experiencia de usuario

- Uso inmediato sin registro
- Tiempo mínimo desde escribir hasta exportar
- Sin pasos innecesarios
- Interfaz clara y directa

El usuario debe poder:
> Abrir la app → escribir → exportar → enviar su CV

---

## 12. Filosofía del proyecto

Este proyecto prioriza:
- Funcionalidad real
- Compatibilidad ATS
- Claridad
- Mantenibilidad del código

Si algo “se ve bonito” pero no aporta valor real,
no debe implementarse.
