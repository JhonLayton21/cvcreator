/**
 * Resume validation utility
 * Provides informative suggestions without blocking exports
 * Follows MVP principle: non-blocking validations only
 */

/**
 * Validate resume content and return suggestions
 * @param {string} markdownContent - The Markdown content to validate
 * @returns {Array} Array of validation warnings (non-blocking)
 */
export function validateResume(markdownContent) {
  const warnings = [];

  // Check for summary/profile section
  const summaryWarning = checkSummaryLength(markdownContent);
  if (summaryWarning) warnings.push(summaryWarning);

  // Check for missing key sections
  const missingWarnings = checkMissingSections(markdownContent);
  warnings.push(...missingWarnings);

  // Check for metrics in experience
  const metricsWarning = checkMetricsInExperience(markdownContent);
  if (metricsWarning) warnings.push(metricsWarning);

  return warnings;
}

/**
 * Check if summary/profile section is too long
 * Recommendation: Keep professional summary under 150 words
 */
function checkSummaryLength(content) {
  const profileMatch = content.match(
    /##\s+(?:Perfil\s+Profesional|Resumen\s+Profesional|Perfil|Resumen)([\s\S]*?)(?=##|$)/i
  );

  if (!profileMatch) {
    return null;
  }

  const profileText = profileMatch[1].trim();
  const wordCount = profileText.split(/\s+/).length;

  if (wordCount > 150) {
    return {
      type: 'warning',
      code: 'SUMMARY_TOO_LONG',
      title: 'Resumen profesional muy largo',
      message: `Tu resumen tiene ${wordCount} palabras. Se recomienda mantenerlo bajo 150 palabras para mejor compatibilidad ATS.`,
      severity: 'info',
    };
  }

  return null;
}

/**
 * Check for missing key sections
 * Key sections per MVP: Contact info, Profile, Experience, Education, Skills
 */
function checkMissingSections(content) {
  const warnings = [];
  const lowerContent = content.toLowerCase();

  const keySections = [
    {
      name: 'Información de contacto',
      patterns: [/email|correo|phone|teléfono|linkedin|contacto/],
      required: true,
    },
    {
      name: 'Experiencia laboral',
      patterns: [/experiencia|trabajo|employment|career/],
      required: true,
    },
    {
      name: 'Educación',
      patterns: [/educación|education|universidad|school/],
      required: true,
    },
    {
      name: 'Habilidades técnicas',
      patterns: [/habilidades|skills|técnica|technical/],
      required: true,
    },
  ];

  for (const section of keySections) {
    const hasSection = section.patterns.some((pattern) => pattern.test(lowerContent));

    if (!hasSection && section.required) {
      warnings.push({
        type: 'warning',
        code: `MISSING_${section.name.toUpperCase().replace(/\s+/g, '_')}`,
        title: `Sección faltante: ${section.name}`,
        message: `No se detectó la sección "${section.name}". Los ATS esperan esta información en currículums estándar.`,
        severity: 'warning',
      });
    }
  }

  return warnings;
}

/**
 * Check for metrics/numbers in experience section
 * Good practices: Include quantifiable results, percentages, numbers
 */
function checkMetricsInExperience(content) {
  const experienceMatch = content.match(
    /##\s+(?:Experiencia|Experience)([\s\S]*?)(?=##|$)/i
  );

  if (!experienceMatch) {
    return null;
  }

  const experienceText = experienceMatch[1];

  // Look for common metric patterns
  const hasMetrics = /(\d+%|\d+\s*[KMk]|times|veces|increased|decreased|improved|reducción|mejora|optimización)/i.test(
    experienceText
  );

  if (!hasMetrics) {
    return {
      type: 'suggestion',
      code: 'NO_METRICS_IN_EXPERIENCE',
      title: 'Considera agregar métricas a tu experiencia',
      message: 'Incluir números, porcentajes o resultados cuantificables (ej: "Redujo tiempo de carga en 40%") hace tu currículum más impactante y compatible con ATS.',
      severity: 'info',
    };
  }

  return null;
}

/**
 * Get validation summary statistics
 */
export function getValidationStats(content) {
  const lines = content.split('\n').filter((line) => line.trim());
  const headings = content.match(/^#+\s/gm) || [];
  const listItems = content.match(/^[-*]\s/gm) || [];
  const words = content.split(/\s+/).length;

  return {
    lines: lines.length,
    headings: headings.length,
    listItems: listItems.length,
    words: words,
  };
}
