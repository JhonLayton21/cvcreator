/**
 * DEBUGGING GUIDE FOR ENGLISH EXPORT FEATURE
 * 
 * If the English translation is not appearing in the PDF:
 * 1. Open Developer Console: Press F12 or Ctrl+Shift+I
 * 2. Go to "Console" tab
 * 3. Click "Download CV in English (PDF)" button
 * 4. Look for logs starting with "[ExportButtons]", "[exportCVByLanguage]", "[translateMarkdown]"
 * 
 * Expected log sequence:
 * [ExportButtons] Starting English PDF export...
 * [ExportButtons] Calling exportCVInEnglish
 * [exportCVByLanguage] Starting export for language: en
 * [translateMarkdown] Starting translation to: en
 * [translateMarkdown] Detected source language: es
 * [translateMarkdown] Translating from Spanish to English...
 * [translateFromSpanish] Starting translation process...
 * [translateFromSpanish] Translation complete! Total replacements: XX
 * [exportCVByLanguage] PDF export complete!
 * [ExportButtons] Export completed successfully
 */

// Test content from user's actual CV
const userCVContent = `# JHON BRANDON LAYTON RODRIGUEZ
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

---

### Desarrollador Freelance Landing Page – LA NANA LILI PETS
Bogotá | Julio 2024 – Diciembre 2024

- Creación, desarrollo, implementación, actualizaciones y mantenimiento página web tipo
Landing Page para una guardería de mascotas usando como marco de desarrollo Astro,
Tailwind, Vercel, Git

---

## EDUCACIÓN

Ingeniería de software – Politécnico Grancolombiano
Bogotá | (Cursando actualmente)

Tecnologia en desarrollo de software – Uniagustiniana
Bogotá | 2024

---

## HABILIDADES TÉCNICAS

- Lenguajes: Javascript/Typescript, PHP, Python
- Frameworks / Librerías: React, Next, Angular, Node, Express, Astro, Tailwind, Bootstrap
- Herramientas: Git, Github. AWS, Docker, Firebase, Supabase 
- Bases de datos: MySql, PostgreSQL, MongoDB, PrismaORM, TypeORM

---

## CERTIFICACIONES (Opcional)

- Claude Code in Action – Anthropic (2026)
- Compute – Amazon Web Services (2025)
- Storage – Amazon Web Services (2025)
- Cybersecurity fundamentals – Amazon Web Services (2025)
- IT fundamentals – IBM (2025)
- Angular – SoloLearn (2024)
- Introduction to networks – Cisco (2024)
- Introduction to Cybersecurity – Amazon Web Services (2024)
- Web development fundamentals – SoloLearn (2023)

---

## IDIOMAS

- Español – Nativo
- Inglés – B1`;

// Full translation dictionary
const fullDictionary = {
  es: {
    "PERFIL PROFESIONAL": "PROFESSIONAL PROFILE",
    "EXPERIENCIA PROFESIONAL": "PROFESSIONAL EXPERIENCE",
    "EDUCACIÓN": "EDUCATION",
    "HABILIDADES TÉCNICAS": "TECHNICAL SKILLS",
    "CERTIFICACIONES": "CERTIFICATIONS",
    "IDIOMAS": "LANGUAGES",
    
    "Desarrollador de software junior": "Junior Software Developer",
    "Desarrollador Freelance": "Freelance Developer",
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
    
    "guardería": "daycare",
    "mascotas": "pets",
    "marco": "framework",
    
    "Ingeniería de software": "Software Engineering",
    "Tecnología en desarrollo de software": "Technology in Software Development",
    "Cursando": "Currently pursuing",
    "actualmente": "currently",
    
    "Lenguajes": "Languages",
    "Frameworks": "Frameworks",
    "Librerías": "Libraries",
    "Herramientas": "Tools",
    "Bases de datos": "Databases",
    
    "Opcional": "Optional",
    
    "Inglés": "English",
    "Español": "Spanish",
    "Nativo": "Native",
    "Antropic": "Anthropic",
    "Febrero": "February",
    "Julio": "July",
    "Diciembre": "December",
  }
};

// Translation logic
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function performTranslation(content, dictionary) {
  let result = content;
  const entries = Object.entries(dictionary);
  const multiWordEntries = entries
    .filter(([key]) => key.includes(' '))
    .sort((a, b) => b[0].length - a[0].length);
  const singleWordEntries = entries
    .filter(([key]) => !key.includes(' '))
    .sort((a, b) => b[0].length - a[0].length);
  const sortedEntries = [...multiWordEntries, ...singleWordEntries];

  let totalReplacements = 0;

  sortedEntries.forEach(([spanishTerm, englishTerm]) => {
    if (!spanishTerm || !englishTerm) return;

    // Heading pattern
    const headingPattern = new RegExp(
      `(^#{1,6}\\s+)${escapeRegex(spanishTerm)}(\\s*$)`,
      'gmi'
    );
    const headingMatches = result.match(headingPattern);
    if (headingMatches) {
      totalReplacements += headingMatches.length;
      result = result.replace(headingPattern, (match, prefix, suffix) => {
        return `${prefix}${englishTerm}${suffix}`;
      });
    }

    // Word boundary pattern
    const wordBoundaryPattern = new RegExp(
      `\\b${escapeRegex(spanishTerm)}\\b`,
      'gi'
    );
    const wordMatches = result.match(wordBoundaryPattern);
    if (wordMatches) {
      totalReplacements += wordMatches.length;
      result = result.replace(wordBoundaryPattern, (match) => {
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

  return { result, totalReplacements };
}

// Run test
console.log('\n' + '='.repeat(70));
console.log('TESTING TRANSLATION WITH ACTUAL USER CV');
console.log('='.repeat(70) + '\n');

console.log('📄 Original CV (first 300 chars):');
console.log(userCVContent.substring(0, 300) + '...\n');

const { result: translatedCV, totalReplacements } = performTranslation(
  userCVContent,
  fullDictionary.es
);

console.log(`✅ Translation complete!`);
console.log(`📊 Total replacements: ${totalReplacements}\n`);

console.log('📄 Translated CV (first 300 chars):');
console.log(translatedCV.substring(0, 300) + '...\n');

// Verification checks
const verificationChecks = [
  { original: 'PERFIL PROFESIONAL', translated: 'PROFESSIONAL PROFILE' },
  { original: 'EXPERIENCIA PROFESIONAL', translated: 'PROFESSIONAL EXPERIENCE' },
  { original: 'Desarrollador de software junior', translated: 'Junior Software Developer' },
  { original: 'HABILIDADES TÉCNICAS', translated: 'TECHNICAL SKILLS' },
  { original: 'CERTIFICACIONES', translated: 'CERTIFICATIONS' },
  { original: 'IDIOMAS', translated: 'LANGUAGES' },
  { original: 'apasionado', translated: 'passionate' },
  { original: 'especializo', translated: 'specialize' },
  { original: 'Landing Page', translated: 'Landing Page' },
  { original: 'Febrero', translated: 'February' },
];

console.log('='.repeat(70));
console.log('VERIFICATION CHECKS');
console.log('='.repeat(70));
let passedChecks = 0;
verificationChecks.forEach(({ original, translated }) => {
  if (translatedCV.includes(translated)) {
    console.log(`✓ "${original}" → "${translated}"`);
    passedChecks++;
  } else {
    console.log(`✗ FAILED: "${original}" NOT found as "${translated}"`);
    console.log(`  Searching for original... ${userCVContent.includes(original) ? 'Found in original' : 'NOT in original'}`);
  }
});

console.log(`\n✨ Result: ${passedChecks}/${verificationChecks.length} checks passed\n`);

// Show key sections
console.log('='.repeat(70));
console.log('SAMPLE TRANSLATIONS');
console.log('='.repeat(70) + '\n');

const sections = [
  'PROFESSIONAL PROFILE',
  'PROFESSIONAL EXPERIENCE',
  'TECHNICAL SKILLS',
  'LANGUAGES'
];

sections.forEach(section => {
  const startIdx = translatedCV.indexOf(`## ${section}`);
  if (startIdx !== -1) {
    const endIdx = translatedCV.indexOf('\n\n---', startIdx);
    const sectionContent = translatedCV.substring(startIdx, endIdx);
    console.log(`📌 ${section}:`);
    console.log(sectionContent.substring(0, 200) + '...\n');
  }
});
