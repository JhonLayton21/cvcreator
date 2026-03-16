/**
 * Markdown Translation Module
 * Handles CV content translation between languages
 * Designed to support multiple languages in future versions
 * 
 * Constraints:
 * - Structure is preserved
 * - Only text content is translated
 * - Markdown formatting (headings, lists, bold, etc.) is maintained
 * - Original content is never modified
 */

/**
 * Translation dictionary for CV sections and common terms
 * Supports: Spanish -> English (MVP)
 * New languages can be added following the same pattern
 */
const translationDictionaries = {
  es: {
    // Section headers (Priority: translate these first)
    "PERFIL PROFESIONAL": "PROFESSIONAL PROFILE",
    "EXPERIENCIA PROFESIONAL": "PROFESSIONAL EXPERIENCE",
    "EXPERIENCIA LABORAL": "WORK EXPERIENCE",
    "EDUCACIÓN": "EDUCATION",
    "HABILIDADES TÉCNICAS": "TECHNICAL SKILLS",
    "HABILIDADES": "SKILLS",
    "CERTIFICACIONES": "CERTIFICATIONS",
    "IDIOMAS": "LANGUAGES",
    "PROYECTOS": "PROJECTS",
    "REFERENCIAS": "REFERENCES",

    // Job titles and roles
    "Desarrollador de software junior": "Junior Software Developer",
    "Desarrollador de software": "Software Developer",
    "Desarrollador": "Developer",
    "Fullstack": "Fullstack",
    "Frontend": "Frontend",
    "Backend": "Backend",
    "Ingeniero de software": "Software Engineer",
    "Especialista": "Specialist",
    "Senior": "Senior",
    "Junior": "Junior",

    // Company types
    "Freelance": "Freelance",
    "Empresa": "Company",

    // Positions and roles (common verbs)
    "Creación": "Creation",
    "Desarrollo": "Development",
    "Implementación": "Implementation",
    "Actualizaciones": "Updates",
    "Mantenimiento": "Maintenance",
    "Página web": "Website",
    "Landing Page": "Landing Page",

    // Descriptions
    "Responsable de": "Responsible for",
    "Participé en": "Participated in",
    "Colaboré en": "Collaborated in",
    "Colaboré con": "Collaborated with",
    "Desarrollé": "Developed",
    "Desarrollar": "Develop",
    "Lideré": "Led",
    "Implementé": "Implemented",
    "Diseñé": "Designed",
    "Mejoré": "Improved",
    "Optimicé": "Optimized",
    "Creé": "Created",
    "Contribuí": "Contributed",
    "Trabajé": "Worked",
    "Directamente": "Directly",

    // Time periods
    "años": "years",
    "año": "year",
    "mes": "month",
    "meses": "months",
    "desde": "from",
    "hasta": "to",
    "presente": "present",
    "Presente": "Present",
    "Actualmente": "Currently",
    "Enero": "January",
    "Febrero": "February",
    "Marzo": "March",
    "Abril": "April",
    "Mayo": "May",
    "Junio": "June",
    "Julio": "July",
    "Agosto": "August",
    "Septiembre": "September",
    "Octubre": "October",
    "Noviembre": "November",
    "Diciembre": "December",

    // Contact and location
    "Contacto": "Contact",
    "Email": "Email",
    "Teléfono": "Phone",
    "Ubicación": "Location",
    "LinkedIn": "LinkedIn",
    "GitHub": "GitHub",
    "Portafolio": "Portfolio",
    "Sitio web": "Website",
    "Correo": "Email",
    "Celular": "Mobile",

    // Language levels
    "Nativo": "Native",
    "Fluido": "Fluent",
    "Intermedio": "Intermediate",
    "Básico": "Basic",
    "Avanzado": "Advanced",
    "Español": "Spanish",
    "Inglés": "English",
    "Portugués": "Portuguese",
    "Francés": "French",
    "Alemán": "German",

    // Education related
    "Ingeniería de software": "Software Engineering",
    "Tecnología en desarrollo de software": "Technology in Software Development",
    "Formación": "Training",
    "Cursando": "Ongoing",
    "Cursando actualmente": "Currently pursuing",
    "Licenciatura": "Bachelor's",
    "Maestría": "Master's",
    "Diplomado": "Diploma",
    "Grado": "Grade",
    "Técnico": "Technical",
    "Universitario": "University",

    // Technologies and frameworks (keep as-is usually, but include common Spanish versions)
    "Tecnologías": "Technologies",
    "Herramientas": "Tools",
    "Lenguajes": "Languages",
    "Frameworks": "Frameworks",
    "Librerías": "Libraries",
    "Bases de datos": "Databases",

    // Soft skills and attributes
    "Apasionado": "Passionate",
    "Eficientes": "Efficient",
    "Intuitivas": "Intuitive",
    "Robustos": "Robust",
    "Colaborativos": "Collaborative",
    "Complejos": "Complex",
    "Creciendo": "Growing",
    "Excelencia": "Excellence",
    "Compromiso": "Commitment",

    // Misc common terms
    "y": "and",
    "o": "or",
    "en": "in",
    "de": "of",
    "para": "for",
    "con": "with",
    "por": "by",
    "en línea": "online",
    "Opcional": "Optional",

    // Organizations/Companies (examples from user's CV)
    "Politécnico Grancolombiano": "Politécnico Grancolombiano",
    "Uniagustiniana": "Uniagustiniana",
    "Anthropic": "Anthropic",
    "Amazon Web Services": "Amazon Web Services",
    "AWS": "AWS",
    "IBM": "IBM",
    "SoloLearn": "SoloLearn",
    "Cisco": "Cisco",

    // Tech tools and platforms
    "Git": "Git",
    "Github": "Github",
    "AWS": "AWS",
    "Docker": "Docker",
    "Firebase": "Firebase",
    "Supabase": "Supabase",
    "MySql": "MySql",
    "PostgreSQL": "PostgreSQL",
    "MongoDB": "MongoDB",
    "PrismaORM": "PrismaORM",
    "TypeORM": "TypeORM",
    "React": "React",
    "Next": "Next",
    "Angular": "Angular",
    "Node": "Node",
    "Express": "Express",
    "Astro": "Astro",
    "Tailwind": "Tailwind",
    "Bootstrap": "Bootstrap",
    "Javascript": "Javascript",
    "Typescript": "Typescript",
    "PHP": "PHP",
    "Python": "Python",
  },
};

/**
 * Detects the language of the provided markdown content
 * Simple heuristic-based detection
 * Returns: 'es', 'en', or null if undetermined
 */
export function detectContentLanguage(markdownContent) {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return null;
  }

  const text = markdownContent.toLowerCase();

  // Strong Spanish indicators
  const esIndicators = [
    { pattern: /perfil profesional|experiencia laboral|habilidades técnicas|idiomas|educación/i, weight: 3 },
    { pattern: /correo|teléfono|ubicación|contacto/i, weight: 2 },
    { pattern: /desarrollador|desarrollé|creé|implementé|diseñé/i, weight: 2 },
    { pattern: /desde.*hasta|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i, weight: 2 },
    { pattern: /bogotá|colombiano|latino/i, weight: 1 },
  ];

  // Strong English indicators
  const enIndicators = [
    { pattern: /professional profile|work experience|technical skills|languages|education/i, weight: 3 },
    { pattern: /email|phone|location|contact/i, weight: 2 },
    { pattern: /developer|developed|created|implemented|designed/i, weight: 2 },
    { pattern: /from.*to|january|february|march|april|may|june|july|august|september|october|november|december/i, weight: 2 },
  ];

  let esScore = 0;
  let enScore = 0;

  esIndicators.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) esScore += weight;
  });

  enIndicators.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) enScore += weight;
  });

  // Return language with highest score, default to Spanish as it's more likely in this context
  if (esScore > enScore) return 'es';
  if (enScore > esScore) return 'en';
  return 'es'; // Default to Spanish
}

/**
 * Translates markdown content to a target language
 * Preserves structure and formatting
 * 
 * @param {string} markdownContent - The markdown content to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en')
 * @returns {string} Translated markdown content
 */
export function translateMarkdown(markdownContent, targetLanguage = 'en') {
  console.log(`[translateMarkdown] Starting translation to: ${targetLanguage}`);
  
  if (targetLanguage === 'en') {
    // Detect source language
    const sourceLanguage = detectContentLanguage(markdownContent);
    console.log(`[translateMarkdown] Detected source language: ${sourceLanguage}`);

    // If already in English, return as-is
    if (sourceLanguage === 'en') {
      console.log(`[translateMarkdown] Content already in English, returning as-is`);
      return markdownContent;
    }

    // Translate from Spanish (default)
    console.log(`[translateMarkdown] Translating from Spanish to English...`);
    return translateFromSpanish(markdownContent);
  }

  // For future languages - return as-is for now
  console.log(`[translateMarkdown] Language ${targetLanguage} not supported yet, returning original`);
  return markdownContent;
}

/**
 * Translates markdown content from Spanish to English
 * Uses the translation dictionary via smart matching
 * Preserves markdown formatting and structure
 * 
 * Strategy:
 * 1. Replace longer phrases first (more specific)
 * 2. Handle markdown headers specially
 * 3. Apply word boundary matching for single words
 * 4. Protect tech terms and brand names
 * 
 * @param {string} markdownContent - Spanish markdown content
 * @returns {string} English markdown content
 */
function translateFromSpanish(markdownContent) {
  if (!markdownContent) return markdownContent;

  console.log(`[translateFromSpanish] Starting translation process...`);
  const dictionary = translationDictionaries.es;
  let translatedContent = markdownContent;
  let totalReplacements = 0;

  // Sort keys by:
  // 1. Multi-word phrases first (longest first)
  // 2. Then single words
  const entries = Object.entries(dictionary);
  const multiWordEntries = entries.filter(([key]) => key.includes(' ')).sort((a, b) => b[0].length - a[0].length);
  const singleWordEntries = entries.filter(([key]) => !key.includes(' ')).sort((a, b) => b[0].length - a[0].length);
  const sortedEntries = [...multiWordEntries, ...singleWordEntries];

  console.log(`[translateFromSpanish] Dictionary has ${entries.length} entries (${multiWordEntries.length} multi-word, ${singleWordEntries.length} single-word)`);

  // Apply translations
  sortedEntries.forEach(([spanishTerm, englishTerm]) => {
    if (!spanishTerm || !englishTerm) return;

    // Skip if it's a tech term that should remain unchanged
    if (isTechTermToKeep(spanishTerm)) return;

    let termReplacements = 0;

    // Pattern 1: Heading context (# Term, ## Term, ### Term, etc.)
    // Handles: "# PERFIL PROFESIONAL" → "# PROFESSIONAL PROFILE"
    const headingPattern = new RegExp(
      `(^#{1,6}\\s+)${escapeRegex(spanishTerm)}(\\s*$)`,
      'gmi'
    );
    const headingMatches = translatedContent.match(headingPattern);
    if (headingMatches) {
      termReplacements += headingMatches.length;
      translatedContent = translatedContent.replace(headingPattern, (match, prefix, suffix) => {
        return `${prefix}${englishTerm}${suffix}`;
      });
    }

    // Pattern 2: Bold text
    // Handles: "**Desarrollé**" → "**Developed**"
    const boldPattern = new RegExp(
      `\\*\\*${escapeRegex(spanishTerm)}\\*\\*`,
      'gi'
    );
    const boldMatches = translatedContent.match(boldPattern);
    if (boldMatches) {
      termReplacements += boldMatches.length;
      translatedContent = translatedContent.replace(boldPattern, (match) => {
        const isAllCaps = spanishTerm === spanishTerm.toUpperCase();
        const translated = isAllCaps ? englishTerm.toUpperCase() : englishTerm;
        return `**${translated}**`;
      });
    }

    // Pattern 3: Italic text
    // Handles: "_Desarrollé_" → "_Developed_"
    const italicPattern = new RegExp(
      `_${escapeRegex(spanishTerm)}_`,
      'gi'
    );
    const italicMatches = translatedContent.match(italicPattern);
    if (italicMatches) {
      termReplacements += italicMatches.length;
      translatedContent = translatedContent.replace(italicPattern, (match) => {
        const isAllCaps = spanishTerm === spanishTerm.toUpperCase();
        const translated = isAllCaps ? englishTerm.toUpperCase() : englishTerm;
        return `_${translated}_`;
      });
    }

    // Pattern 4: Word boundaries (most general)
    // Handles standalone words: "Desarrollé" → "Developed"
    // But NOT partial matches: "Softwarediseño" stays as-is
    const wordBoundaryPattern = new RegExp(
      `\\b${escapeRegex(spanishTerm)}\\b`,
      'gi'
    );
    const wordMatches = translatedContent.match(wordBoundaryPattern);
    if (wordMatches) {
      termReplacements += wordMatches.length;
      translatedContent = translatedContent.replace(wordBoundaryPattern, (match) => {
        // Special handling for multi-word phrases
        if (spanishTerm.includes(' ')) {
          // For multi-word phrases, preserve the original case format
          // If all words start with caps, keep all caps; otherwise use provided term
          const allCapitalized = spanishTerm
            .split(' ')
            .every(word => word[0] === word[0].toUpperCase());
          
          if (allCapitalized && match === match.toUpperCase()) {
            // Convert each word to uppercase
            return englishTerm
              .split(' ')
              .map(word => word.toUpperCase())
              .join(' ');
          } else if (match === match.charAt(0).toUpperCase() + match.slice(1)) {
            // If first letter is capitalized, capitalize first word of translation
            const words = englishTerm.split(' ');
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
            return words.join(' ');
          } else {
            // Return in lowercase
            return englishTerm.toLowerCase();
          }
        } else {
          // Single word handling
          if (match === match.toUpperCase() && match.length > 1) {
            return englishTerm.toUpperCase();
          } else if (match[0] === match[0].toUpperCase()) {
            return englishTerm.charAt(0).toUpperCase() + englishTerm.slice(1).toLowerCase();
          } else {
            return englishTerm.toLowerCase();
          }
        }
      });
    }

    if (termReplacements > 0) {
      totalReplacements += termReplacements;
      console.log(`  ✓ "${spanishTerm}" → "${englishTerm}" (${termReplacements}x)`);
    }
  });

  console.log(`[translateFromSpanish] Translation complete! Total replacements: ${totalReplacements}`);
  return translatedContent;
}

/**
 * Checks if a term is a tech brand/tool that should not be translated
 * @param {string} term - The term to check
 * @returns {boolean}
 */
function isTechTermToKeep(term) {
  const techTerms = [
    'React', 'Angular', 'Node', 'Express', 'Astro',
    'Tailwind', 'Bootstrap', 'Git', 'GitHub', 'AWS',
    'Docker', 'Firebase', 'Supabase', 'MySQL', 'PostgreSQL',
    'MongoDB', 'PrismaORM', 'TypeORM', 'Python', 'PHP',
    'Javascript', 'Typescript', 'Vercel', 'HTML', 'CSS'
  ];
  
  return techTerms.some(tech => tech.toLowerCase() === term.toLowerCase());
}

/**
 * Escapes special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for regex
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gets available translation languages
 * Used to configure UI and validate language parameters
 * 
 * @returns {Array} List of available language codes
 */
export function getAvailableLanguages() {
  return Object.keys(translationDictionaries);
}

/**
 * Checks if a language is supported
 * @param {string} language - Language code to check
 * @returns {boolean}
 */
export function isLanguageSupported(language) {
  return language === 'en' || Object.keys(translationDictionaries).includes(language);
}
