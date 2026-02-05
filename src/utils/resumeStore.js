// Simple pub/sub store for resume content
// Handles persistence to localStorage automatically

const STORAGE_KEY = 'cv_markdown_content';

const DEFAULT_CONTENT = `# Nombre Apellido
## Perfil Profesional
Escribe aquí tu perfil profesional...

## Experiencia
- **Cargo**: Empresa (2020 - Presente)
  - Logro 1
  - Logro 2
`;

let state = '';
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
