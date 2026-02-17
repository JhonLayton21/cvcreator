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
        <div className="h-full flex flex-col font-sans">
            <div className="mb-4 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Editor CV</h2>
                    <p className="text-sm text-gray-500">Edita tu información en Markdown.</p>
                </div>
                <Button
                    onClick={handleResetTemplate}
                    variant="outline"
                    size="xs"
                    title="Reestablecer a la plantilla por defecto"
                    className="cursor-pointer"
                >
                    <RotateCcw className="h-4 w-4 text-neutral-700" />
                    <span className="text-neutral-700">Reestablecer</span>
                </Button>
            </div>
            <textarea
                className="flex-1 w-full p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 font-mono text-sm leading-relaxed"
                value={content}
                onChange={handleChange}
                placeholder="# Tu Nombre..."
                spellCheck="false"
            />
        </div>
    );
}
