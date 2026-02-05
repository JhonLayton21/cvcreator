import jsPDF from 'jspdf';
import fileSaver from 'file-saver';
const { saveAs } = fileSaver;

/**
 * Convert Markdown to PDF with selectable text
 * Uses jsPDF for better ATS compatibility and text preservation
 * Font: Arial (ATS-safe)
 * Layout: Single column with standard margins
 */
export async function exportToPdf(markdownContent, fileName = 'curriculum') {
  try {
    // Create PDF with standard letter size (8.5" x 11")
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    // Set standard margins: 12.7mm ≈ 0.5 inches
    const marginLeft = 12.7;
    const marginRight = 12.7;
    const marginTop = 12.7;
    const marginBottom = 12.7;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const textWidth = pageWidth - marginLeft - marginRight;

    // Font: Arial (ATS-safe)
    pdf.setFont('Arial', 'normal');

    // Parse and render markdown content
    const lines = markdownContent.split('\n');
    let yPosition = marginTop;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        yPosition += 3; // Small spacing for empty lines
        continue;
      }

      const result = renderMarkdownLine(pdf, line, marginLeft, textWidth, yPosition);
      yPosition = result.yPosition;

      // Check if we need a new page
      if (yPosition > pageHeight - marginBottom) {
        pdf.addPage();
        yPosition = marginTop;
      }
    }

    // Save the PDF
    const pdfBlob = pdf.output('blob');
    saveAs(pdfBlob, `${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}

/**
 * Render a single markdown line to PDF
 */
function renderMarkdownLine(pdf, line, marginLeft, textWidth, yPosition) {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginBottom = 12.7;
  let currentY = yPosition;

  // Heading 1 (# )
  if (line.match(/^# /)) {
    const text = line.replace(/^# /, '').trim();
    pdf.setFont('Arial', 'bold');
    pdf.setFontSize(16);

    const lines = pdf.splitTextToSize(text, textWidth);
    const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

    for (const textLine of lines) {
      if (currentY > pageHeight - marginBottom) {
        // This would require page handling at caller level
        break;
      }
      pdf.text(textLine, marginLeft, currentY);
      currentY += lineHeight;
    }

    currentY += 4; // Extra space after heading
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(11);
    return { yPosition: currentY };
  }

  // Heading 2 (## )
  if (line.match(/^## /)) {
    const text = line.replace(/^## /, '').trim();
    pdf.setFont('Arial', 'bold');
    pdf.setFontSize(13);

    const lines = pdf.splitTextToSize(text, textWidth);
    const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

    for (const textLine of lines) {
      if (currentY > pageHeight - marginBottom) {
        break;
      }
      pdf.text(textLine, marginLeft, currentY);
      currentY += lineHeight;
    }

    currentY += 2;
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(11);
    return { yPosition: currentY };
  }

  // Heading 3 (### )
  if (line.match(/^### /)) {
    const text = line.replace(/^### /, '').trim();
    pdf.setFont('Arial', 'bold');
    pdf.setFontSize(12);

    const lines = pdf.splitTextToSize(text, textWidth);
    const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

    for (const textLine of lines) {
      if (currentY > pageHeight - marginBottom) {
        break;
      }
      pdf.text(textLine, marginLeft, currentY);
      currentY += lineHeight;
    }

    currentY += 1.5;
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(11);
    return { yPosition: currentY };
  }

  // Unordered list (- or * )
  if (line.match(/^[-*] /)) {
    const text = line.replace(/^[-*] /, '').trim();
    pdf.setFont('Arial', 'normal');
    pdf.setFontSize(11);

    // Draw bullet point
    const bulletSize = 2;
    const bulletX = marginLeft + 2;
    const bulletY = currentY - 1;
    pdf.circle(bulletX, bulletY, bulletSize / 2, 'F');

    // Wrap text considering bullet indentation
    const indentedWidth = textWidth - 6;
    const lines = pdf.splitTextToSize(text, indentedWidth);
    const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

    for (let j = 0; j < lines.length; j++) {
      if (currentY > pageHeight - marginBottom) {
        break;
      }
      pdf.text(lines[j], marginLeft + 6, currentY);
      currentY += lineHeight;
    }

    return { yPosition: currentY };
  }

  // Ordered list (1. 2. etc)
  if (line.match(/^\d+\.\s/)) {
    const match = line.match(/^(\d+)\.\s+(.*)/);
    if (match) {
      const number = match[1];
      const text = match[2].trim();
      pdf.setFont('Arial', 'normal');
      pdf.setFontSize(11);

      // Wrap text considering number indentation
      const indentedWidth = textWidth - 6;
      const lines = pdf.splitTextToSize(text, indentedWidth);
      const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

      // Draw number
      pdf.text(number + '.', marginLeft + 1, currentY);

      for (let j = 0; j < lines.length; j++) {
        if (currentY > pageHeight - marginBottom) {
          break;
        }
        pdf.text(lines[j], marginLeft + 6, currentY);
        currentY += lineHeight;
      }
    }

    return { yPosition: currentY };
  }

  // Regular paragraph with inline formatting
  pdf.setFont('Arial', 'normal');
  pdf.setFontSize(11);

  const formattedLines = parseInlineFormattingPDF(pdf, line, textWidth);
  const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;

  for (const formattedLine of formattedLines) {
    if (currentY > pageHeight - marginBottom) {
      break;
    }

    let currentX = marginLeft;
    for (const run of formattedLine) {
      if (run.bold) {
        pdf.setFont('Arial', 'bold');
      } else {
        pdf.setFont('Arial', 'normal');
      }

      // Simple text rendering (URLs as plain text in ATS context)
      pdf.text(run.text, currentX, currentY);
      currentX += pdf.getStringUnitWidth(run.text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    }

    currentY += lineHeight;
  }

  return { yPosition: currentY };
}

/**
 * Parse inline formatting for PDF: **bold**, links, etc.
 */
function parseInlineFormattingPDF(pdf, text, maxWidth) {
  // Split by word boundaries while preserving formatting
  const runs = [];
  let currentRun = { text: '', bold: false };

  let i = 0;
  while (i < text.length) {
    // Check for bold **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      // Flush current run
      if (currentRun.text) {
        runs.push({ ...currentRun });
        currentRun = { text: '', bold: false };
      }

      // Find closing **
      i += 2;
      let boldText = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i];
        i++;
      }

      if (boldText) {
        runs.push({ text: boldText, bold: true });
      }
      i += 2; // Skip closing **
      continue;
    }

    // Check for link [text](url)
    if (text[i] === '[') {
      if (currentRun.text) {
        runs.push({ ...currentRun });
        currentRun = { text: '', bold: false };
      }

      let j = i + 1;
      while (j < text.length && text[j] !== ']') {
        j++;
      }

      if (j < text.length && text[j + 1] === '(') {
        const linkText = text.substring(i + 1, j);
        let k = j + 2;
        while (k < text.length && text[k] !== ')') {
          k++;
        }

        if (k < text.length) {
          runs.push({ text: linkText, bold: false }); // Keep link text as regular text
          i = k + 1;
          continue;
        }
      }
    }

    // Regular character
    currentRun.text += text[i];
    i++;
  }

  // Flush last run
  if (currentRun.text) {
    runs.push(currentRun);
  }

  // Word wrap the runs
  const wrappedLines = [];
  let currentLine = [];
  let currentLineWidth = 0;

  for (const run of runs) {
    const words = run.text.split(/(\s+)/);

    for (const word of words) {
      if (!word) continue;

      pdf.setFont('Arial', run.bold ? 'bold' : 'normal');
      const wordWidth = pdf.getStringUnitWidth(word) * pdf.getFontSize() / pdf.internal.scaleFactor;

      if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0) {
        wrappedLines.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
      }

      currentLine.push({ text: word, bold: run.bold });
      currentLineWidth += wordWidth;
    }
  }

  if (currentLine.length > 0) {
    wrappedLines.push(currentLine);
  }

  return wrappedLines.length > 0 ? wrappedLines : [[{ text: '', bold: false }]];
}
