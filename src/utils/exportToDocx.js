import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;

/**
 * Parse Markdown and convert to DOCX
 * Supports: headings, lists, bold text, and regular paragraphs
 * Uses ATS-safe fonts and standard margins
 */
export async function exportToDocx(markdownContent, fileName = 'curriculum') {
  const paragraphs = parseMarkdownToDocxParagraphs(markdownContent);

  const doc = new Document({
    margins: {
      top: 720,    // 0.5 inches in twips (1440 twips = 1 inch)
      right: 720,
      bottom: 720,
      left: 720,
    },
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw error;
  }
}

/**
 * Parse Markdown to DOCX paragraphs
 */
function parseMarkdownToDocxParagraphs(markdownContent) {
  const lines = markdownContent.split('\n');
  const paragraphs = [];
  let currentList = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      // If we were building a list, flush it
      if (inList && currentList.length > 0) {
        paragraphs.push(...currentList);
        currentList = [];
        inList = false;
      }
      // Add empty paragraph for spacing
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }

    // Heading 1 (# )
    if (line.match(/^# /)) {
      if (inList) {
        paragraphs.push(...currentList);
        currentList = [];
        inList = false;
      }
      const text = line.replace(/^# /, '').trim();
      paragraphs.push(
        new Paragraph({
          text: text,
          heading: HeadingLevel.HEADING_1,
          bold: true,
          font: 'Calibri',
          size: 28, // 14pt
          spacing: { before: 240, after: 120 },
        })
      );
      continue;
    }

    // Heading 2 (## )
    if (line.match(/^## /)) {
      if (inList) {
        paragraphs.push(...currentList);
        currentList = [];
        inList = false;
      }
      const text = line.replace(/^## /, '').trim();
      paragraphs.push(
        new Paragraph({
          text: text,
          heading: HeadingLevel.HEADING_2,
          bold: true,
          font: 'Calibri',
          size: 24, // 12pt
          spacing: { before: 200, after: 100 },
        })
      );
      continue;
    }

    // Heading 3 (### )
    if (line.match(/^### /)) {
      if (inList) {
        paragraphs.push(...currentList);
        currentList = [];
        inList = false;
      }
      const text = line.replace(/^### /, '').trim();
      paragraphs.push(
        new Paragraph({
          text: text,
          heading: HeadingLevel.HEADING_3,
          bold: true,
          font: 'Calibri',
          size: 22, // 11pt
          spacing: { before: 120, after: 60 },
        })
      );
      continue;
    }

    // Unordered list (- or * )
    if (line.match(/^[-*] /)) {
      inList = true;
      const text = line.replace(/^[-*] /, '').trim();
      currentList.push(
        new Paragraph({
          text: text,
          bullet: {
            level: 0,
          },
          font: 'Calibri',
          size: 22, // 11pt
        })
      );
      continue;
    }

    // Ordered list (1. )
    if (line.match(/^\d+\. /)) {
      inList = true;
      const text = line.replace(/^\d+\. /, '').trim();
      currentList.push(
        new Paragraph({
          text: text,
          numbering: {
            level: 0,
          },
          font: 'Calibri',
          size: 22, // 11pt
        })
      );
      continue;
    }

    // Regular paragraph with inline formatting
    if (inList) {
      paragraphs.push(...currentList);
      currentList = [];
      inList = false;
    }

    const children = parseInlineFormatting(line);
    paragraphs.push(
      new Paragraph({
        children: children,
        font: 'Calibri',
        size: 22, // 11pt
      })
    );
  }

  // Flush any remaining list items
  if (inList && currentList.length > 0) {
    paragraphs.push(...currentList);
  }

  return paragraphs;
}

/**
 * Parse inline formatting: **bold**, _italic_, links, etc.
 */
function parseInlineFormatting(text) {
  const runs = [];
  let currentPos = 0;

  // Regular expressions for inline formatting
  const boldPattern = /\*\*(.*?)\*\*/g;
  const italicPattern = /___(.*?)___/g;
  const linkPattern = /\[(.*?)\]\((.*?)\)/g;

  // Simple approach: find all patterns and their positions
  const matches = [];

  // Find all bold matches
  let match;
  while ((match = boldPattern.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'bold',
      text: match[1],
    });
  }

  // Find all link matches
  while ((match = linkPattern.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      type: 'link',
      text: match[1],
      url: match[2],
    });
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Build runs with formatting
  if (matches.length === 0) {
    // No formatting, return single text run
    if (text.trim()) {
      runs.push({
        text: text,
      });
    }
    return runs.length > 0 ? runs : [{ text: '' }];
  }

  // Process text with formatting
  currentPos = 0;
  for (const match of matches) {
    // Add text before this match
    if (match.start > currentPos) {
      const beforeText = text.substring(currentPos, match.start);
      if (beforeText.trim()) {
        runs.push({ text: beforeText });
      }
    }

    // Add formatted text
    if (match.type === 'bold') {
      runs.push({
        text: match.text,
        bold: true,
      });
    } else if (match.type === 'link') {
      runs.push({
        text: match.text,
        hyperlink: {
          link: match.url,
          type: 'external',
        },
      });
    }

    currentPos = match.end;
  }

  // Add remaining text
  if (currentPos < text.length) {
    const remainingText = text.substring(currentPos);
    if (remainingText.trim()) {
      runs.push({ text: remainingText });
    }
  }

  return runs.length > 0 ? runs : [{ text: '' }];
}
