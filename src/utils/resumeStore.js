// Simple pub/sub store for resume content
// Handles persistence to localStorage automatically

export const STORAGE_KEY = 'cv_markdown_content';

export const DEFAULT_CONTENT = `# NOMBRE COMPLETO
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

let state = '';
let saveTimeout = null;
const listeners = new Set();

// Initialize state from localStorage or default
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY);
  state = stored || DEFAULT_CONTENT;
}

export const resumeStore = {
  get() {
    return state;
  },

  set(content) {
    if (state === content) return;
    state = content;

    // Persist
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, state);
    }

    // Notify
    listeners.forEach(listener => listener(state));
  },

  subscribe(listener) {
    listeners.add(listener);
    // Return current state immediately to new subscriber
    listener(state);

    return () => {
      listeners.delete(listener);
    };
  }
};
