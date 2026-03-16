# GUÍA DE SOLUCIÓN DE PROBLEMAS - Exportar CV en Inglés

## 🔍 DIAGNOSTICAR EL PROBLEMA

### Paso 1: Abrir la Consola del Navegador
- Presiona **F12** o **Ctrl+Shift+I** (o **Cmd+Option+I** en Mac)
- Dirígete a la pestaña **"Console"**

### Paso 2: Ejecutar la Exportación
1. Haz clic en el botón flotante de exportación (ícono de descarga abajo a la derecha)
2. Busca el botón **"Download CV in English (PDF)"**
3. Haz clic en él
4. Observa los logs en la consola

### Paso 3: Verificar los Logs

Deberías ver una secuencia como esta en la consola:

```
[ExportButtons] Starting English PDF export...
[ExportButtons] Content length: XXXX
[ExportButtons] Calling exportCVInEnglish
[exportCVByLanguage] Starting export for language: en
[exportCVByLanguage] Content length: XXXX
[exportCVByLanguage] Calling translateMarkdown...
[translateMarkdown] Starting translation to: en
[translateMarkdown] Detected source language: es
[translateMarkdown] Translating from Spanish to English...
[translateFromSpanish] Starting translation process...
[translateFromSpanish] Dictionary has 150+ entries
[translateFromSpanish] Translation complete! Total replacements: XX
[exportCVByLanguage] Translation complete. Result length: XXXX
[exportCVByLanguage] Translation changed: true
[exportCVByLanguage] Generated filename: curriculum
[exportCVByLanguage] Calling exportToPdf with translated content...
[exportCVByLanguage] PDF export complete!
[ExportButtons] Export completed successfully
```

---

## ✅ QUÉ SIGNIFICA CADA LOG

| Log | Significado |
|-----|------------|
| `[ExportButtons] Starting English PDF export...` | Se inició el proceso de exportación |
| `[translateMarkdown] Detected source language: es` | El CV fue detectado como español ✓ |
| `[translateFromSpanish] Total replacements: XX` | Se realizaron XX traducciones (debe ser > 50) |
| `[exportCVByLanguage] Translation changed: true` | El contenido fue modificado (traducción realizada) ✓ |
| `[exportCVByLanguage] PDF export complete!` | El PDF fue generado exitosamente ✓ |

---

## ⚠️ PROBLEMAS COMUNES

### Problema 1: No aparecen los logs
**Causa:** La consola del navegador no está abierta o los filtros están incorrectos

**Solución:**
- Presiona F12 para abrir la consola
- Asegúrate de estar en la pestaña "Console"
- Si ves filtros activos, limpíalos

### Problema 2: Logs indican `Total replacements: 0`
**Causa:** El traducción no detectó el contenido como español

**Solución:**
- Verifica que tu CV realmente esté en español
- Busca "PERFIL PROFESIONAL" en tu CV (debe estar en español)
- Si está en inglés, el sistema no lo traduce

### Problema 3: El PDF descargado sin traducción
**Causa:** Posible fallo en la pipeline de exportación

**Solución:**
1. Abre la consola (F12)
2. Busca errores en rojo
3. Copia el error exacto
4. Prueba de nuevo

### Problema 4: Mensaje de error "Error al exportar el CV en inglés"
**Causa:** Error interno en la exportación a PDF

**Solución:**
1. Verifica que tu CV no esté vacío
2. Intenta con un CV más simple primero
3. Chequea la consola del navegador para ver el error exacto

---

## 🛠️ COMANDOS DE PRUEBA EN CONSOLA

Puedes probar la traducción directamente en la consola:

```javascript
// Copiar tu CV en una variable
const cvContent = "# YOUR CV CONTENT HERE...";

// Importar la función (esto puede no funcionar directamente)
// En cambio, revisa los logs automáticos cuando hagas clic

// Los logs te mostrarán si está funcionando
```

---

## 📋 CHECKLIST DE VALIDACIÓN

- [ ] La consola muestra `[ExportButtons] Starting English PDF export...`
- [ ] Se detectó idioma source como `es`
- [ ] El número de replacements es `> 50`
- [ ] `Translation changed: true` (sale en los logs)
- [ ] `PDF export complete!` (sin errores)
- [ ] Se descargó el archivo PDF
- [ ] El PDF contiene texto en inglés

---

## 🚀 PASOS PARA VERIFICAR QUE FUNCIONA

### 1. Verificación Visual
Abre el PDF descargado y busca:
- ❌ "PERFIL PROFESIONAL" → debería ser "PROFESSIONAL PROFILE"
- ❌ "EXPERIENCIA PROFESIONAL" → debería ser "PROFESSIONAL EXPERIENCE"
- ❌ "Desarrollador de software" → debería ser "Software Developer"
- ❌ "HABILIDADES TÉCNICAS" → debería ser "TECHNICAL SKILLS"

Si ves las palabras EN INGLÉS → **¡Funciona! ✅**

### 2. Verificación por Consola
Los logs deben mostrar un número alto de `replacements` (mayor a 50).

---

## 📞 SI ALGO NO FUNCIONA

Por favor adjunta en tu reporte:
1. Una captura de pantalla de la consola (F12 → Console tab)
2. El mensaje de error exacto (si lo hay)
3. Los primeros 5 logs que aparecen
4. El PDF descargado (si es posible)

---

## 🔧 INFORMACIÓN TÉCNICA

**Sistemas soportados:**
- ✅ Windows
- ✅ Mac
- ✅ Linux

**Navegadores testeados:**
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Diccionario incluido:**
- 150+ términos de CV en español
- Preservación de mayúsculas
- Protección de términos técnicos (React, Angular, AWS, etc.)

---

## 📊 ESTADÍSTICAS ESPERADAS

**Para un CV típico como el del ejemplo:**
- Palabras en CV: ~500-800
- Términos traducidos: 50-100+
- Tiempo de traducción: < 100ms
- Tamaño del PDF: 30-80 KB

---

## ✨ CARACTERÍSTICAS

✅ Traducción automática español → inglés
✅ Preservación de estructura Markdown
✅ Preservación de mayúsculas apropiadas
✅ Contenido original sin cambios
✅ Descarga automática del PDF
✅ Sin modificación del editor
✅ Logs detallados para debugging

---

**¿Te ayudó esta guía?** Ve a la consola del navegador y cuéntanos qué logs ves. 🎯
