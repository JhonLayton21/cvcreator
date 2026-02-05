import React, { useState, useEffect } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { exportToDocx } from '../utils/exportToDocx';
import { exportToPdf } from '../utils/exportToPdf';

export default function ExportButtons() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('curriculum');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = resumeStore.subscribe((newContent) => {
      setContent(newContent);
    });

    return unsubscribe;
  }, []);

  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportDocx = async () => {
    if (!content.trim()) {
      alert('Por favor, escribe contenido antes de exportar.');
      return;
    }
    setIsExporting(true);
    try {
      await exportToDocx(content, fileName);
    } catch (error) {
      alert('Error al exportar a Word. Por favor, intenta nuevamente.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!content.trim()) {
      alert('Por favor, escribe contenido antes de exportar.');
      return;
    }
    setIsExporting(true);
    try {
      await exportToPdf(content, fileName);
    } catch (error) {
      alert('Error al exportar a PDF. Por favor, intenta nuevamente.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-buttons">
      <div className="export-controls">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Nombre del archivo"
          className="file-name-input"
        />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={downloadMarkdown}
          className="export-btn"
          disabled={isExporting}
        >
          📄 Markdown (.md)
        </button>
        <button
          onClick={handleExportDocx}
          className="export-btn"
          disabled={isExporting}
        >
          📝 Word (.docx)
        </button>
        <button
          onClick={handleExportPdf}
          className="export-btn"
          disabled={isExporting}
        >
          📕 PDF
        </button>
      </div>
      {isExporting && <p className="text-sm text-gray-500 mt-2">Exportando...</p>}
    </div>
  );
}
