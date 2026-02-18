import React, { useState, useEffect } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { validateResume, getValidationStats } from '../utils/resumeValidator';
import { Info, ChevronDown, ChevronUp, X } from "lucide-react";

function ValidationPanelContent({ actualWarnings, infoWarnings, stats }) {
  return (
    <div className="validation-content">
      {actualWarnings.length > 0 && (
        <div className="warnings-section">
          <h4>Secciones sugeridas:</h4>
          <ul>
            {actualWarnings.map((warning) => (
              <li key={warning.code} className="warning-item warning">
                <strong>{warning.title}:</strong> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {infoWarnings.length > 0 && (
        <div className="suggestions-section">
          <h4>Recomendaciones:</h4>
          <ul>
            {infoWarnings.map((warning) => (
              <li key={warning.code} className="warning-item info">
                <strong>{warning.title}:</strong> {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats && (
        <div className="stats-section">
          <h4>Estadísticas del currículum:</h4>
          <ul className="stats-list">
            <li>
              <span className="stat-label">Palabras:</span>
              <span className="stat-value">{stats.words}</span>
            </li>
            <li>
              <span className="stat-label">Secciones:</span>
              <span className="stat-value">{stats.headings}</span>
            </li>
            <li>
              <span className="stat-label">Puntos clave:</span>
              <span className="stat-value">{stats.listItems}</span>
            </li>
            <li>
              <span className="stat-label">Líneas:</span>
              <span className="stat-value">{stats.lines}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ValidationHints() {
  const [warnings, setWarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = resumeStore.subscribe((content) => {
      const newWarnings = validateResume(content);
      setWarnings(newWarnings);

      const newStats = getValidationStats(content);
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  if (!warnings.length) {
    return null;
  }

  const infoWarnings = warnings.filter((w) => w.severity === 'info');
  const actualWarnings = warnings.filter((w) => w.severity === 'warning');
  const hintLabel = actualWarnings.length > 0
    ? `${actualWarnings.length} sugerencia${actualWarnings.length > 1 ? 's' : ''}`
    : `${infoWarnings.length} recomendación${infoWarnings.length > 1 ? 'es' : ''}`;

  return (
    <>
      {/* Desktop: comportamiento actual */}
      <div className="hidden lg:block validation-hints">
        <div
          className="validation-header"
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        >
          <div className="validation-title">
            <span className="validation-icon"><Info className="h-6 w-6" /></span>
            <span>{hintLabel}</span>
          </div>
          <span className="toggle-icon">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
        </div>

        {isExpanded && (
          <ValidationPanelContent
            actualWarnings={actualWarnings}
            infoWarnings={infoWarnings}
            stats={stats}
          />
        )}
      </div>

      {/* Mobile/Tablet: botón flotante + panel al interactuar */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
          className="validation-floating-btn"
          title={hintLabel}
          aria-label={hintLabel}
        >
          <Info className="h-6 w-6" />
        </button>

        {mobilePanelOpen && (
          <div
            className="validation-overlay"
            onClick={() => setMobilePanelOpen(false)}
            role="presentation"
          >
            <div
              className="validation-panel-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Panel de validación"
            >
              <div className="validation-panel-header">
                <div className="validation-title">
                  <span className="validation-icon"><Info className="h-6 w-6" /></span>
                  <span>{hintLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobilePanelOpen(false)}
                  className="validation-close-btn"
                  aria-label="Cerrar panel"
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
      </div>
    </>
  );
}
