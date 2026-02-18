import React, { useState, useEffect } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { exportToDocx } from '../utils/exportToDocx';
import { exportToPdf } from '../utils/exportToPdf';
import { Button } from './ui/button';
import { FileDown, FileText, FileType } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"

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
        <Field>
          <FieldLabel>Nombre del archivo:</FieldLabel>

          <FieldContent>
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nombre del archivo"
              className="file-name-input"
            />
          </FieldContent>
        </Field>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={downloadMarkdown}
          variant="default"
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Markdown (.md)
        </Button>
        <Button
          onClick={handleExportDocx}
          variant="default"
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileType className="h-4 w-4" />
          Word (.docx)
        </Button>
        <Button
          onClick={handleExportPdf}
          variant="default"
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
      </div>
      {isExporting && <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">Exportando...</p>}
    </div>
  );
}
