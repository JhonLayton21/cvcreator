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
  const [panelOpen, setPanelOpen] = useState(false);

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

  const ExportPanelContent = () => (
    <div>
      <Field>
        <FieldLabel>Nombre del archivo:</FieldLabel>
        <FieldContent>
          <Input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Nombre del archivo"
          />
        </FieldContent>
      </Field>

      <div className="flex gap-3 flex-wrap justify-end mt-6">
        <Button onClick={downloadMarkdown} disabled={isExporting}>
          <FileText className="h-4 w-4" />
          Markdown (.md)
        </Button>

        <Button onClick={handleExportDocx} disabled={isExporting}>
          <FileType className="h-4 w-4" />
          Word (.docx)
        </Button>

        <Button onClick={handleExportPdf} disabled={isExporting}>
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
      </div>

      {isExporting && (
        <p className="text-sm text-muted-foreground mt-4">
          Exportando...
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Botón flotante SIEMPRE visible */}
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
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
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center"
          onClick={() => setPanelOpen(false)}
        >
          <div
            className="w-full lg:w-[500px]
                       bg-background
                       rounded-t-2xl lg:rounded-2xl
                       p-6
                       max-h-[85vh]
                       overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">
                Exportar archivo
              </h3>

              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 hover:bg-muted rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ExportPanelContent />
          </div>
        </div>
      )}
    </>
  );
}