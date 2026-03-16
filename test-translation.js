/**
 * Test file to verify translation functionality
 * This file can be run with Node.js to test without browser
 */

// Test markdown content (Spanish)
const testContent = `# JHON BRANDON LAYTON RODRIGUEZ
Desarrollador de software junior Fullstack
 
Bogotá, Colombia

laytonjhon0@gmail.com | (+57) 3337369902 | LinkedIn: jhon-layton | GitHub: JhonLayton21

---

## PERFIL PROFESIONAL
Soy un desarrollador de software apasionado por crear soluciones eficientes. Me
especializo en el diseño de interfaces intuitivas y en la implementación de sistemas
robustos de gestión de datos. Disfruto trabajar en proyectos colaborativos y resolver
problemas complejos a través de la programación. Mi objetivo es continuar
creciendo como profesional, aportando valor a través de mi conocimiento técnico y mi
compromiso con la excelencia en el desarrollo de software

---

## EXPERIENCIA PROFESIONAL

### Desarrollador Freelance Landing Page – RODRIGUEZ SAS
Bogotá | Febrero 2024 – Febrero 2025

- Creación, desarrollo, implementación, actualizaciones y mantenimiento página web tipo
Landing Page para empresa dedicada a obra civil y mantenimientos usando tecnologías
como Astro, React, Tailwind, Git, Vercel
`;

// Minimal translation dictionary for testing
const testDict = {
  es: {
    "PERFIL PROFESIONAL": "PROFESSIONAL PROFILE",
    "EXPERIENCIA PROFESIONAL": "PROFESSIONAL EXPERIENCE",
    "Desarrollador de software junior": "Junior Software Developer",
    "Desarrollador de software": "Software Developer",
    "Desarrollador": "Developer",
    "Fullstack": "Fullstack",
    "apasionado": "passionate",
    "crear": "create",
    "soluciones": "solutions",
    "eficientes": "efficient",
    "especializo": "specialize",
    "diseño": "design",
    "interfaces": "interfaces",
    "intuitivas": "intuitive",
    "implementación": "implementation",
    "sistemas": "systems",
    "robustos": "robust",
    "gestión": "management",
    "datos": "data",
    "Disfruto": "I enjoy",
    "trabajar": "work",
    "proyectos": "projects",
    "colaborativos": "collaborative",
    "resolver": "solve",
    "problemas": "problems",
    "complejos": "complex",
    "programación": "programming",
    "objetivo": "goal",
    "continuar": "continue",
    "creciendo": "growing",
    "profesional": "professional",
    "aportando": "contributing",
    "valor": "value",
    "conocimiento": "knowledge",
    "técnico": "technical",
    "compromiso": "commitment",
    "excelencia": "excellence",
    "Freelance": "Freelance",
    "Creación": "Creation",
    "desarrollo": "development",
    "implementación": "implementation",
    "actualizaciones": "updates",
    "mantenimiento": "maintenance",
    "página web": "website",
    "Landing Page": "Landing Page",
    "empresa": "company",
    "dedicada": "dedicated",
    "obra": "construction",
    "civil": "civil",
    "mantenimientos": "maintenance",
    "usando": "using",
    "tecnologías": "technologies",
    "Bogotá": "Bogotá",
    "Febrero": "February",
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translateFromSpanish(markdownContent, dictionary) {
  if (!markdownContent) return markdownContent;

  let translatedContent = markdownContent;
  const entries = Object.entries(dictionary);
  const multiWordEntries = entries.filter(([key]) => key.includes(' ')).sort((a, b) => b[0].length - a[0].length);
  const singleWordEntries = entries.filter(([key]) => !key.includes(' ')).sort((a, b) => b[0].length - a[0].length);
  const sortedEntries = [...multiWordEntries, ...singleWordEntries];

  let replacementCount = 0;

  sortedEntries.forEach(([spanishTerm, englishTerm]) => {
    if (!spanishTerm || !englishTerm) return;

    // Pattern 1: Heading context
    const headingPattern = new RegExp(
      `(^#{1,6}\\s+)${escapeRegex(spanishTerm)}(\\s*$)`,
      'gmi'
    );
    const headingMatches = translatedContent.match(headingPattern);
    if (headingMatches) {
      console.log(`  ✓ Heading match: "${spanishTerm}" → "${englishTerm}" (${headingMatches.length}x)`);
      replacementCount += headingMatches.length;
      translatedContent = translatedContent.replace(headingPattern, (match, prefix, suffix) => {
        return `${prefix}${englishTerm}${suffix}`;
      });
    }

    // Pattern 2: Word boundaries
    const wordBoundaryPattern = new RegExp(
      `\\b${escapeRegex(spanishTerm)}\\b`,
      'gi'
    );
    const wordMatches = translatedContent.match(wordBoundaryPattern);
    if (wordMatches) {
      console.log(`  ✓ Word match: "${spanishTerm}" → "${englishTerm}" (${wordMatches.length}x)`);
      replacementCount += wordMatches.length;
      translatedContent = translatedContent.replace(wordBoundaryPattern, (match) => {
        if (match === match.toUpperCase() && match.length > 1) {
          return englishTerm.toUpperCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return englishTerm.charAt(0).toUpperCase() + englishTerm.slice(1).toLowerCase();
        } else {
          return englishTerm.toLowerCase();
        }
      });
    }
  });

  return { translatedContent, replacementCount };
}

console.log('🧪 Testing Translation Engine\n');
console.log('='.repeat(50));
console.log('Input (Spanish CV):');
console.log('='.repeat(50));
console.log(testContent.substring(0, 300) + '...\n');

console.log('='.repeat(50));
console.log('Translation Process:');
console.log('='.repeat(50));
const { translatedContent, replacementCount } = translateFromSpanish(testContent, testDict.es);

console.log(`\n📊 Total replacements made: ${replacementCount}`);
console.log('\n' + '='.repeat(50));
console.log('Output (English CV):');
console.log('='.repeat(50));
console.log(translatedContent.substring(0, 400) + '...\n');

// Verify key translations
const checks = [
  { spanish: 'PERFIL PROFESIONAL', english: 'PROFESSIONAL PROFILE' },
  { spanish: 'EXPERIENCIA PROFESIONAL', english: 'PROFESSIONAL EXPERIENCE' },
  { spanish: 'Desarrollador de software junior', english: 'Junior Software Developer' },
];

console.log('='.repeat(50));
console.log('Translation Verification:');
console.log('='.repeat(50));
let successCount = 0;
checks.forEach(({ spanish, english }) => {
  if (translatedContent.includes(english)) {
    console.log(`✓ "${spanish}" → "${english}"`);
    successCount++;
  } else {
    console.log(`✗ "${spanish}" NOT translated to "${english}"`);
  }
});

console.log(`\n${successCount}/${checks.length} key translations verified`);
