import React, { useEffect, useState } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { Button } from './ui/button';
import { RotateCcw} from "lucide-react";

const DEFAULT_TEMPLATE = `# NOMBRE COMPLETO
Ciudad, País
Correo | Teléfono | LinkedIn | Portafolio | GitHub

---

## PERFIL PROFESIONAL
Resumen breve (3–5 líneas) enfocado en el rol al que aplicas.
Usa verbos de acción, evita frases genéricas y menciona impacto o especialidad.

Ejemplo:
Desarrollador Frontend con 3+ años de experiencia construyendo aplicaciones web escalables usando React y TypeScript. Enfocado en performance, accesibilidad y productos orientados al usuario final.

---

## EXPERIENCIA PROFESIONAL

### Cargo – Empresa
Ciudad | Mes Año – Mes Año

- Logro o responsabilidad clave usando verbos de acción.
- Incluye métricas cuando sea posible (%, tiempo, impacto).
- Tecnologías relevantes usadas en el rol.

Ejemplo:
- Mejoré el tiempo de carga de la aplicación en un 35% optimizando renderizado en React.
- Implementé integración con APIs REST usando Axios y manejo de estado global.

---

### Cargo – Empresa
Ciudad | Mes Año – Mes Año

- Logro o responsabilidad
- Logro o responsabilidad

---

## EDUCACIÓN

Título – Institución
Ciudad | Año de finalización

---

## HABILIDADES TÉCNICAS

- Lenguajes:
- Frameworks / Librerías:
- Herramientas:
- Bases de datos:

---

## PROYECTOS DESTACADOS (Opcional)

### Nombre del proyecto
- Descripción breve del problema y solución.
- Tecnologías usadas.
- Enlace (si aplica).

---

## CERTIFICACIONES (Opcional)

- Nombre de la certificación – Institución (Año)

---

## IDIOMAS

- Idioma – Nivel
`;

export default function EditorCV() {
    const [content, setContent] = useState('');

    // Sincronizar con el store al montar
    useEffect(() => {
        const unsubscribe = resumeStore.subscribe(newContent => {
            setContent(newContent);
        });
        return unsubscribe;
    }, []);

    // Manejar cambios y notificar al store
    const handleChange = (e) => {
        const newVal = e.target.value;
        setContent(newVal);
        resumeStore.set(newVal);
    };

    // Reestablecer plantilla
    const handleResetTemplate = () => {
        const confirmReset = window.confirm(
            '¿Estás seguro? Se reemplazará todo tu contenido actual con la plantilla por defecto.'
        );
        if (confirmReset) {
            setContent(DEFAULT_TEMPLATE);
            resumeStore.set(DEFAULT_TEMPLATE);
        }
    };

    return (
        <div className="h-full min-h-0 flex flex-col font-sans">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-foreground">Editor CV</h2>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground">Edita tu información en Markdown.</p>
                </div>
                <Button
                    onClick={handleResetTemplate}
                    variant="outline"
                    size="xs"
                    title="Reestablecer a la plantilla por defecto"
                    className="h-7 cursor-pointer rounded-sm border-slate-200 px-2 text-[10px] dark:border-slate-700"
                >
                    <RotateCcw className="h-3 w-3 text-neutral-700 dark:text-foreground" />
                    <span className="text-neutral-700 dark:text-foreground">Restablecer</span>
                </Button>
            </div>
            <div className="flex h-7 items-center justify-between border border-b-0 border-slate-200 bg-white px-2.5 text-[8px] uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                <span>Markdown</span>
                <span>Autoguardado en esta sesión</span>
            </div>
            <textarea
                className="min-h-[50vh] flex-1 w-full resize-none border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:p-4 lg:min-h-0"
                value={content}
                onChange={handleChange}
                placeholder="# Tu Nombre..."
                spellCheck="false"
                aria-label="Contenido del CV en Markdown"
            />
        </div>
    );
}
