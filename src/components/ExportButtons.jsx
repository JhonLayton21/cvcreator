import React, { useState, useEffect } from "react";
import { resumeStore } from "../utils/resumeStore";
import { exportToDocx } from "../utils/exportToDocx";
import { exportToPdf } from "../utils/exportToPdf";
import { Button } from "./ui/button";
import { FileDown, FileText, FileType, Download, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function ExportButtons() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("curriculum");
  const [isExporting, setIsExporting] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = resumeStore.subscribe((newContent) => {
      setContent(newContent);
    });

    return unsubscribe;
  }, []);

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportDocx = async () => {
    if (!content.trim()) {
      alert("Por favor, escribe contenido antes de exportar.");
      return;
    }

    setIsExporting(true);
    try {
      await exportToDocx(content, fileName);
    } catch (error) {
      alert("Error al exportar a Word. Por favor, intenta nuevamente.");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!content.trim()) {
      alert("Por favor, escribe contenido antes de exportar.");
      return;
    }

    setIsExporting(true);
    try {
      await exportToPdf(content, fileName);
    } catch (error) {
      alert("Error al exportar a PDF. Por favor, intenta nuevamente.");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  // 👇 contenido del panel reutilizable
  const ExportPanelContent = () => (
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

      <div className="flex gap-3 flex-wrap justify-end mt-4">
        <Button
          onClick={downloadMarkdown}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Markdown (.md)
        </Button>

        <Button
          onClick={handleExportDocx}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileType className="h-4 w-4" />
          Word (.docx)
        </Button>

        <Button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
      </div>

      {isExporting && (
        <p className="text-sm text-gray-500 dark:text-muted-foreground mt-2">
          Exportando...
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop → comportamiento normal */}
      <div className="hidden lg:block">
        <ExportPanelContent />
      </div>

      {/* Mobile/Tablet → botón flotante */}
      <div className="lg:hidden">
        {/* Botón flotante */}
        <button
          type="button"
          onClick={() => setMobilePanelOpen(true)}
          className="fixed bottom-6 right-6 z-50
                     w-14 h-14 rounded-full
                     bg-black text-white
                     flex items-center justify-center
                     shadow-lg hover:scale-105 transition"
          aria-label="Exportar archivo"
        >
          <Download className="h-6 w-6" />
        </button>

        {/* Overlay + modal */}
        {mobilePanelOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setMobilePanelOpen(false)}
          >
            <div
              className="w-full bg-background rounded-t-2xl p-6 max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Exportar archivo</h3>

                <button
                  onClick={() => setMobilePanelOpen(false)}
                  className="p-2 hover:bg-muted rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ExportPanelContent />
            </div>
          </div>
        )}
      </div>
    </>
  );
}