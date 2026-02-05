import React, { useState, useEffect } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { validateResume, getValidationStats } from '../utils/resumeValidator';

export default function ValidationHints() {
  const [warnings, setWarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to content changes
    const unsubscribe = resumeStore.subscribe((content) => {
      const newWarnings = validateResume(content);
      setWarnings(newWarnings);

      const newStats = getValidationStats(content);
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  if (!warnings.length) {
    return null; // Don't show if no warnings
  }

  const infoWarnings = warnings.filter((w) => w.severity === 'info');
  const actualWarnings = warnings.filter((w) => w.severity === 'warning');

  return (
    <div className="validation-hints">
      <div
        className="validation-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <div className="validation-title">
          <span className="validation-icon">ℹ️</span>
          <span>
            {actualWarnings.length > 0
              ? `${actualWarnings.length} sugerencia${actualWarnings.length > 1 ? 's' : ''}`
              : `${infoWarnings.length} recomendación${infoWarnings.length > 1 ? 'es' : ''}`}
          </span>
        </div>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
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
      )}
    </div>
  );
}
