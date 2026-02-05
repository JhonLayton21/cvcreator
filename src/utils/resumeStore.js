// Simple pub/sub store for resume content
// Handles persistence to localStorage automatically

const STORAGE_KEY = 'cv_markdown_content';

const DEFAULT_CONTENT = `# Juan Pérez
 **Desarrollador de Software**
 [juan.perez@email.com](mailto:juan.perez@email.com) | +57 300 123 4567 | [linkedin.com/in/juanperez](https://linkedin.com) | Bogotá, Colombia

 ## Perfil Profesional
 Desarrollador de software con más de 5 años de experiencia en la creación de aplicaciones web escalables. Especializado en JavaScript, React y Node.js. Apasionado por la optimización de rendimiento y la escritura de código limpio y mantenible.

 ## Experiencia Laboral

 ### **Ingeniero de Software Senior** | Tech Solutions S.A.S.
 *Enero 2021 - Presente*
 - Lideré la migración de la plataforma principal de monolito a microservicios, reduciendo el tiempo de despliegue en un 40%.
 - Implementé pipelines de CI/CD utilizando GitHub Actions, mejorando la calidad del código y la velocidad de entrega.
 - Mentoricé a 3 desarrolladores junior, facilitando su crecimiento profesional y contribución al equipo.

 ### **Desarrollador Web** | Creative Agency
 *Junio 2018 - Diciembre 2020*
 - Desarrollé sitios web interactivos para clientes internacionales utilizando React y Gatsby.
 - Optimicé el rendimiento del frontend, logrando puntuaciones de Lighthouse superiores a 90 en todos los proyectos.
 - Colaboré estrechamente con diseñadores para asegurar la fidelidad visual y la accesibilidad de las interfaces.

 ## Educación

 ### **Ingeniería de Sistemas** | Universidad Nacional de Colombia
 *2013 - 2018*
 - Tesis: "Algoritmos de optimización para redes neuronales".
 - Promedio ponderado: 4.5/5.0.

 ## Habilidades Técnicas
 - **Lenguajes**: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3.
 - **Frameworks y Librerías**: React, Next.js, Node.js, Express, Tailwind CSS.
 - **Herramientas**: Git, Docker, AWS, Jenkins, Jira.
 - **Idiomas**: Español (Nativo), Inglés (C1 - Avanzado).

 ## Proyectos
 - **E-commerce Platform**: Plataforma de ventas en línea con pasarela de pagos integrada y gestión de inventario en tiempo real.
 - **Task Manager App**: Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real y notificaciones push.
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
