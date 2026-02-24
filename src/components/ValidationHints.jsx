import React, { useState, useEffect } from "react";
import { resumeStore } from "../utils/resumeStore";
import { validateResume, getValidationStats } from "../utils/resumeValidator";
import { Info, X } from "lucide-react";

function ValidationPanelContent({ actualWarnings, infoWarnings, stats }) {
  return (
    <div className="space-y-6">
      {actualWarnings.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Secciones sugeridas:</h4>
          <ul className="space-y-2">
            {actualWarnings.map((warning) => (
              <li key={warning.code} className="text-sm">
                <strong>{warning.title}:</strong> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {infoWarnings.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Recomendaciones:</h4>
          <ul className="space-y-2">
            {infoWarnings.map((warning) => (
              <li key={warning.code} className="text-sm">
                <strong>{warning.title}:</strong> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats && (
        <div>
          <h4 className="font-semibold mb-2">
            Estadísticas del currículum:
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li><strong>Palabras:</strong> {stats.words}</li>
            <li><strong>Secciones:</strong> {stats.headings}</li>
            <li><strong>Puntos clave:</strong> {stats.listItems}</li>
            <li><strong>Líneas:</strong> {stats.lines}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ValidationHints() {
  const [warnings, setWarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = resumeStore.subscribe((content) => {
      const newWarnings = validateResume(content);
      setWarnings(newWarnings);

      const newStats = getValidationStats(content);
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  if (!warnings.length) return null;

  const infoWarnings = warnings.filter((w) => w.severity === "info");
  const actualWarnings = warnings.filter((w) => w.severity === "warning");

  const hintLabel =
    actualWarnings.length > 0
      ? `${actualWarnings.length} sugerencia${
          actualWarnings.length > 1 ? "s" : ""
        }`
      : `${infoWarnings.length} recomendación${
          infoWarnings.length > 1 ? "es" : ""
        }`;

  return (
    <>
      {/* Botón flotante SIEMPRE visible */}
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-6 left-6 z-50
                   w-14 h-14 rounded-full
                   bg-blue-600 text-white
                   flex items-center justify-center
                   shadow-lg hover:scale-105 transition"
        aria-label={hintLabel}
      >
        <Info className="h-6 w-6" />
      </button>

      {/* Overlay + Modal */}
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
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <h3 className="font-semibold text-lg">
                  {hintLabel}
                </h3>
              </div>

              <button
                onClick={() => setPanelOpen(false)}
                className="p-2 hover:bg-muted rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ValidationPanelContent
              actualWarnings={actualWarnings}
              infoWarnings={infoWarnings}
              stats={stats}
            />
          </div>
        </div>
      )}
    </>
  );
}