import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, PencilLine } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { Button } from './ui/button';
import { DEFAULT_CONTENT } from '../utils/resumeStore';
import { getCurrentUser, getCvById, updateCvRecord } from '../utils/cvCloudStore';

export default function CvWorkspace({ cvId }) {
  const [user, setUser] = useState(null);
  const [cv, setCv] = useState(null);
  const [status, setStatus] = useState('Cargando...');
  const [htmlContent, setHtmlContent] = useState('');
  const [loadError, setLoadError] = useState('');
  const [dirty, setDirty] = useState(false);
  const latestCv = useRef(null);
  const dirtyRef = useRef(false);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;

    const loadCv = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!active) return;
        if (!currentUser) {
          window.location.assign('/login');
          return;
        }

        setUser(currentUser);
        const currentCv = await getCvById(cvId);
        if (!active) return;

        if (!currentCv) {
          setCv(null);
          setStatus('CV no encontrado');
          return;
        }

        setCv(currentCv);
        setStatus('Guardado');
      } catch (caughtError) {
        if (active) {
          setLoadError(caughtError.message || 'No se pudo cargar el CV.');
          setStatus('Error al cargar');
        }
      }
    };

    loadCv();
    return () => {
      active = false;
    };
  }, [cvId]);

  useEffect(() => {
    latestCv.current = cv;
  }, [cv]);

  const saveSnapshot = useCallback((snapshot) => {
    if (!snapshot) {
      return Promise.resolve(null);
    }

    setStatus('Guardando...');
    const nextSave = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        const updated = await updateCvRecord(snapshot.id, {
          title: snapshot.title,
          content: snapshot.content,
        });

        if (!updated) {
          throw new Error('El CV ya no existe o no tienes permiso para modificarlo.');
        }

        const current = latestCv.current;
        if (current?.id === snapshot.id && current.title === snapshot.title && current.content === snapshot.content) {
          dirtyRef.current = false;
          setDirty(false);
          setStatus('Guardado');
        }

        return updated;
      })
      .catch((caughtError) => {
        setStatus('Error al guardar');
        throw caughtError;
      });

    saveQueue.current = nextSave;
    return nextSave;
  }, []);

  useEffect(() => {
    if (!cv || !user || !dirty) return;

    const timer = window.setTimeout(() => {
      saveSnapshot(cv).catch(() => {});
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [cv, dirty, saveSnapshot, user]);

  useEffect(() => {
    const flushPendingSave = () => {
      if (document.visibilityState === 'hidden' && dirtyRef.current) {
        saveSnapshot(latestCv.current).catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', flushPendingSave);
    window.addEventListener('pagehide', flushPendingSave);
    return () => {
      document.removeEventListener('visibilitychange', flushPendingSave);
      window.removeEventListener('pagehide', flushPendingSave);
    };
  }, [saveSnapshot]);

  useEffect(() => {
    const processMarkdown = async () => {
      const source = cv?.content ?? DEFAULT_CONTENT;
      try {
        const file = await remark().use(html).process(source);
        setHtmlContent(String(file));
      } catch (error) {
        console.error('Error al renderizar el markdown del CV', error);
      }
    };

    processMarkdown();
  }, [cv?.content]);

  if (!user && !loadError) {
    return null;
  }

  if (loadError || !cv) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 text-center dark:bg-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xl font-semibold">{loadError ? 'No se pudo cargar el CV' : 'CV no encontrado'}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {loadError || 'La ruta solicitada no existe o no pertenece a tu cuenta.'}
          </p>
          <Button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/dashboard'; }} className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="mx-auto mb-4 max-w-7xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  if (dirtyRef.current) await saveSnapshot(latestCv.current);
                  window.location.assign('/dashboard');
                } catch {
                  setStatus('Error al guardar');
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 md:block" />
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <PencilLine className="h-4 w-4" />
              <span className="text-sm font-medium">Editor de CV</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
            {status === 'Guardando...' && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
            {status === 'Guardado' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
            {status === 'Error al guardar' && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
            <span>{status}</span>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Título del CV
          </label>
          <input
            value={cv.title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              dirtyRef.current = true;
              setDirty(true);
              setCv((current) => current && ({ ...current, title: nextTitle }));
            }}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Título del CV"
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="min-h-[70vh] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3">
            <h2 className="text-lg font-bold">Editor</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Escribe tu currículum en Markdown.</p>
          </div>
          <textarea
            value={cv.content}
            onChange={(event) => {
              const nextContent = event.target.value;
              dirtyRef.current = true;
              setDirty(true);
              setCv((current) => current && ({ ...current, content: nextContent }));
            }}
            spellCheck={false}
            className="h-[calc(70vh-72px)] w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Contenido del CV"
          />
        </section>

        <section className="min-h-[70vh] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3">
            <h2 className="text-lg font-bold">Vista previa</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Documento final.</p>
          </div>
          <div
            className="prose h-[calc(70vh-72px)] max-w-none overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </section>
      </main>
    </div>
  );
}
