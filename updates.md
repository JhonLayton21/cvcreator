# CV Creator — Implementation Guide (Iterative Updates)

## Objetivo
Este documento define las actualizaciones que deben implementarse en la aplicación **CV Creator**.  
Las implementaciones deben realizarse **una por una**, de forma ordenada, limpia y funcional.

### Reglas generales
- Implementar **solo lo solicitado**.
- No agregar nuevas funcionalidades no especificadas.
- No introducir arquitecturas complejas.
- Mantener consistencia con el código existente.
- Usar estilos y patrones actuales del proyecto.
- Cada cambio debe ser modular y fácil de revertir.
- Después de cada implementación se debe validar antes de continuar con la siguiente.

---

# ORDEN DE IMPLEMENTACIÓN

## ✅ 1. Modo Oscuro (Dark Mode)

### Objetivo
Agregar modo oscuro con toggle manual.

### Requisitos
- Crear soporte de **tema claro / oscuro** en la aplicación.
- Agregar un botón toggle en la **esquina superior derecha**.
- El botón debe usar **lucide icons**.
- Iconos sugeridos:
  - Sun → modo claro
  - Moon → modo oscuro
- El cambio debe afectar toda la UI.
- El estado del tema debe persistir (ej: localStorage).
- Transición visual suave entre temas.

### Restricciones
- No usar librerías adicionales.
- No reestructurar el sistema de estilos existente.
- Mantener implementación simple.

### Criterio de éxito
- Usuario puede cambiar entre light/dark.
- Preferencia se mantiene al recargar.

---

## ✅ 2. Responsive Validation Hints (Mobile & Tablet)

### Componente
`ValidationHints.jsx`

### Objetivo
Optimizar experiencia en pantallas pequeñas.

### Comportamiento requerido
En pantallas:
- Mobile
- Tablet

Debe ocurrir lo siguiente:

### Estado inicial
- El panel completo de validation hints **no debe mostrarse**.
- Solo se muestra un **botón flotante**.

### Botón flotante
- Posición: fija en pantalla.
- Usar el icono actual del componente.
- Color: azul.
- Animación suave de subida y bajada continua.
- Animación sutil (no agresiva).

### Interacción
- Al hacer click → mostrar panel completo.
- Debe poder cerrarse nuevamente.

### Desktop
- No modificar comportamiento actual.

### Restricciones
- No cambiar lógica de validación.
- Solo cambiar presentación responsive.

### Criterio de éxito
- En mobile/tablet aparece botón flotante.
- Panel solo aparece al interactuar.

---

## ✅ 3. Ajuste de altura del Editor y Preview (Mobile)

### Objetivo
Reducir scroll innecesario en celulares.

### Comportamiento requerido
En pantallas mobile:

- Ajustar altura de:
  - Markdown Editor
  - Preview Panel
- Ambos deben ocupar mejor el viewport.
- Usuario debe editar sin scroll excesivo.

### Requisitos técnicos
- Usar unidades responsive (vh, flex, etc).
- Mantener layout existente.
- No modificar comportamiento desktop/tablet.

### Restricciones
- No rediseñar layout.
- Solo ajustar altura y distribución.

### Criterio de éxito
- Menos scroll en mobile.
- Edición más rápida.

---

## ✅ 4. Export Buttons Responsive Alignment

### Componente
`ExportButtons.jsx`

### Objetivo
Ajustar alineación en pantallas móviles.

### Comportamiento requerido
En mobile:
- Botones deben estar justificados a la derecha del contenedor.

### Desktop
- Mantener comportamiento actual.

### Restricciones
- Solo cambios de layout.
- No modificar funcionalidad de exportación.

### Criterio de éxito
- Botones alineados correctamente en mobile.

---

# Flujo de trabajo esperado

Para cada feature:

1. Implementar solo esa feature.
2. Verificar funcionamiento.
3. Confirmar cumplimiento del criterio de éxito.
4. Esperar siguiente iteración antes de continuar.

No avanzar automáticamente a la siguiente tarea.

---

# Fin del documento
