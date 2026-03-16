/**
 * Language-Aware Export Module
 * Handles CV export with translation support
 * 
 * Architecture:
 * - Language-agnostic pipeline
 * - Preserves existing export functions
 * - Supports configurable languages
 * - Original content never modified
 * 
 * Usage:
 * exportCVByLanguage(markdownContent, language, fileName)
 * 
 * Example:
 * exportCVByLanguage(cvContent, 'en', 'my-cv')
 */

import { exportToPdf } from './exportToPdf';
import { translateMarkdown } from './translateMarkdown';

/**
 * Export CV in a specified language
 * Pipeline: Markdown (original) → Translate → Export PDF → Download
 * 
 * @param {string} markdownContent - The CV content in original language
 * @param {string} language - Target language code ('en', 'es', etc.)
 * @param {string} fileName - Base filename without extension
 * @returns {Promise<void>}
 */
export async function exportCVByLanguage(markdownContent, language = 'en', fileName = 'curriculum') {
  if (!markdownContent || !markdownContent.trim()) {
    throw new Error('CV content is empty');
  }

  if (!fileName || fileName.trim() === '') {
    fileName = 'curriculum';
  }

  try {
    console.log(`[exportCVByLanguage] Starting export for language: ${language}`);
    console.log(`[exportCVByLanguage] Content length: ${markdownContent.length}`);

    // Step 1: Translate markdown content to target language
    console.log(`[exportCVByLanguage] Calling translateMarkdown...`);
    const translatedContent = translateMarkdown(markdownContent, language);
    console.log(`[exportCVByLanguage] Translation complete. Result length: ${translatedContent.length}`);
    console.log(`[exportCVByLanguage] Translation changed: ${translatedContent !== markdownContent}`);

    // Step 2: Generate filename with language suffix
    const languageFilename = getLanguageAwareFilename(fileName, language);
    console.log(`[exportCVByLanguage] Generated filename: ${languageFilename}`);

    // Step 3: Export translated content to PDF
    // This reuses the existing exportToPdf function
    console.log(`[exportCVByLanguage] Calling exportToPdf with translated content...`);
    await exportToPdf(translatedContent, languageFilename);
    console.log(`[exportCVByLanguage] PDF export complete!`);

    return {
      success: true,
      language,
      filename: languageFilename,
    };
  } catch (error) {
    console.error(`[exportCVByLanguage] Error exporting CV in ${language}:`, error);
    throw error;
  }
}

/**
 * Generates a language-aware filename
 * Example: 'curriculum' + 'en' → 'curriculum-en'
 * Example: 'my-cv' + 'es' → 'my-cv-es'
 * 
 * @param {string} baseFileName - Base filename without extension or language suffix
 * @param {string} language - Language code
 * @returns {string} Filename with language suffix
 */
function getLanguageAwareFilename(baseFileName, language) {
  // Default to base name if language is null or 'en'
  if (!language || language === 'en') {
    return baseFileName;
  }

  // Add language suffix for non-default languages
  return `${baseFileName}-${language}`;
}

/**
 * Export CV in English
 * Convenient helper function for the MVP feature
 * 
 * @param {string} markdownContent - The CV content
 * @param {string} fileName - Base filename without extension
 * @returns {Promise<void>}
 */
export async function exportCVInEnglish(markdownContent, fileName = 'curriculum') {
  return exportCVByLanguage(markdownContent, 'en', fileName);
}
