# Indicaciones de cambios para el asistente de código

## Reglas de trabajo (leer antes de empezar)

1. **Trabaja por etapas.** Cada cambio de la lista es una etapa independiente. Haz **una sola etapa a la vez**.
2. **Un commit por etapa.** Yo haré los commits manualmente. **No ejecutes `git add`, `git commit` ni `git push`.**
3. **Al terminar cada etapa, detente** y entrégame:
   - La lista de archivos modificados o creados.
   - Un resumen breve de lo que cambió.
   - Un mensaje de commit sugerido (formato Conventional Commits, en español o inglés según el historial del repo).
   - Cómo verificar el cambio (qué abrir o probar).
4. **No avances a la siguiente etapa** hasta que yo escriba "continúa" (o similar).
5. **Mantén los cambios pequeños y enfocados.** No toques archivos que no tengan relación con la etapa. No hagas refactors, renombrados ni cambios de formato ajenos al objetivo.
6. Si una etapa llegara a tocar demasiados archivos, divídela en sub-etapas y propón un commit por cada una (la idea es evitar un commit gigante con ~36 archivos).
7. Antes de empezar, revisa la estructura del proyecto y detecta el stack, el sistema de estilos y dónde se definen los colores/temas. No instales dependencias nuevas sin avisarme primero.
8. Si algo es ambiguo o falta información (por ejemplo, el diseño del modal), **pregúntame** en lugar de asumir.

---

## Etapa 1: Colores del modo oscuro

**Objetivo:** eliminar los tonos azules actuales del modo oscuro y usar la misma paleta del modo claro, simplemente invertida.

**Indicaciones:**
- Identifica la paleta actual del modo claro (fondos, superficies, textos, bordes, acentos).
- En modo oscuro, usa **únicamente esos mismos colores intercambiando sus roles**: lo que en claro es fondo pasa a ser texto, y lo que en claro es texto pasa a ser fondo, y así con las superficies y bordes.
- **No introduzcas colores nuevos.** Ningún tono azul debe quedar en modo oscuro.
- Centraliza el cambio en las variables/tokens del tema (CSS variables, configuración de Tailwind, etc.) siempre que sea posible, en lugar de editar componente por componente.
- Busca colores "hardcodeados" (hex, rgb, clases fijas) específicos del modo oscuro que aún usen azules y corrígelos.
- Verifica que el contraste de texto siga siendo legible.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `style: actualizar paleta del modo oscuro invirtiendo colores del modo claro`).

---

## Etapa 2: Modal de inicio y registro de sesión

**Objetivo:** actualizar el diseño del modal de inicio de sesión y registro para que encaje con el diseño visual del resto de la página.

**Indicaciones:**
- Te anexaré el nuevo diseño (imagen/captura). **Si no lo ves adjunto, detente y pídemelo antes de hacer cambios.**
- Replica el diseño anexado usando los componentes, estilos y tokens que ya existen en la página (tipografías, bordes, radios, espaciados, botones, inputs).
- **No cambies la lógica** de autenticación, validaciones ni el flujo entre inicio de sesión y registro; solo la parte visual y de estructura.
- Debe verse bien en modo claro y oscuro (con la paleta resultante de la Etapa 1) y en móvil y escritorio.
- Conserva accesibilidad: foco, `aria-label`, cierre con tecla Esc y etiquetas en los campos.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `feat(ui): rediseñar modal de inicio de sesión y registro`).

---

## Etapa 3: Iconos del navbar ("Hecho con amor por Jhon Brandon")

**Objetivo:** reemplazar los iconos actuales por los iconos reales (logos oficiales) de LinkedIn y GitHub, respectivamente.

**Indicaciones:**
- Localiza el bloque "Hecho con amor por Jhon Brandon" y los dos iconos de enlace.
- Usa los logos de marca reales de LinkedIn y de GitHub. Si el proyecto ya tiene una librería de iconos con esos logos, úsala; si no, usa SVG inline y **avísame antes de instalar cualquier dependencia nueva**.
- Mantén los mismos enlaces, tamaños, espaciados y comportamiento (hover, apertura en pestaña nueva con `rel="noopener noreferrer"`).
- Agrega `aria-label` descriptivo a cada enlace ("LinkedIn", "GitHub").
- Los iconos deben usar `currentColor` (o equivalente) para verse bien en modo claro y oscuro.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `fix(ui): usar logos reales de LinkedIn y GitHub en el navbar`).

---

## Etapa 4: Panel de documentos, vista de lista

**Objetivo:** en la vista de lista, reemplazar los botones de texto por iconos.

**Indicaciones:**
- Usa **los mismos iconos que ya se usan en la vista de cuadrícula** para las mismas acciones (reutiliza el componente o los iconos existentes; no crees iconos nuevos).
- Conserva exactamente la misma funcionalidad de cada botón.
- Como ya no habrá texto visible, agrega `aria-label` y `title` (tooltip) a cada botón para mantener la accesibilidad y claridad.
- Mantén tamaños y espaciados coherentes con la vista de cuadrícula y que la fila se vea bien en móvil.
- No modifiques la vista de cuadrícula.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `refactor(ui): usar iconos en los botones de la vista de lista de documentos`).

---

## Etapa 5: Sincronización del nombre de archivo al exportar

**Objetivo:** al abrir el modal de exportación siendo un usuario autenticado, garantizar que el input del nombre de archivo muestre por defecto el mismo nombre que tiene el CV en el panel de documentos.

**Indicaciones:**
- Asegúrate de que, cuando el usuario esté logueado y presione el botón "Exportar", el modal inicialice el input del nombre del archivo con el nombre actual del CV guardado en el panel de documentos.
- Garantiza la sincronía entre el título/nombre del documento y lo que se sugiere al exportar.
- Si el nombre cambia en el documento, al volver a abrir el modal de exportación debe actualizarse de forma acorde.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `fix(export): sincronizar nombre de archivo en modal con el título del CV`).

---

## Etapa 6: Corrección del foco en el input de título en modo invitado

**Objetivo:** corregir el error (bug) en modo invitado donde al hacer clic en el input de título y escribir un carácter, el campo pierde el foco inmediatamente.

**Indicaciones:**
- Identifica la causa por la cual el input pierde el foco tras la escritura de un solo carácter cuando el usuario interactúa en modo invitado (por ejemplo, recreación de componentes en cada render, falta de `key` estable o referencias desvinculadas en el estado).
- Asegúrate de que el usuario invitado pueda escribir de forma continua y fluida en el input del título sin salirse ni perder la selección.
- Verifica que el estado del título se actualice correctamente en la vista previa sin provocar re-renderizados destructivos del control de entrada.

**Al terminar:** detente y dame el resumen + commit sugerido (ej. `fix(editor): corregir pérdida de foco en input de título en modo invitado`).

---

## Resumen de commits esperados

| Etapa | Commit sugerido |
|-------|-----------------|
| 1 | `style: actualizar paleta del modo oscuro invirtiendo colores del modo claro` |
| 2 | `feat(ui): rediseñar modal de inicio de sesión y registro` |
| 3 | `fix(ui): usar logos reales de LinkedIn y GitHub en el navbar` |
| 4 | `refactor(ui): usar iconos en los botones de la vista de lista de documentos` |
| 5 | `fix(export): sincronizar nombre de archivo en modal con el título del CV` |
| 6 | `fix(editor): corregir pérdida de foco en input de título en modo invitado` |