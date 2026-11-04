import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { Button } from './ui/button';
import AppHeader from './AppHeader';
import EditorIntro from './EditorIntro';
import ExportButtons from './ExportButtons';
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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1440px] flex-col px-5 pb-6 sm:px-8">
        <EditorIntro />

        <div className="mb-3 flex flex-col gap-2 border-y border-slate-200 py-2 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit rounded-sm px-2 text-xs"
            onClick={async () => {
              try {
                if (dirtyRef.current) await saveSnapshot(latestCv.current);
                window.location.assign('/dashboard');
              } catch {
                setStatus('Error al guardar');
              }
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a mis CVs
          </Button>

          <div className="flex min-w-0 items-center gap-2 sm:justify-end">
            <label htmlFor="cv-title" className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Documento
            </label>
            <input
              id="cv-title"
              value={cv.title}
              onChange={(event) => {
                const nextTitle = event.target.value;
                dirtyRef.current = true;
                setDirty(true);
                setCv((current) => current && ({ ...current, title: nextTitle }));
              }}
              className="min-w-0 border-b border-slate-300 bg-transparent px-1 py-1 text-sm font-medium outline-none focus:border-slate-700 dark:border-slate-700 dark:focus:border-slate-300 sm:w-64"
              aria-label="Título del CV"
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:min-h-[430px] lg:grid-cols-2 lg:gap-6">
          <section className="flex min-h-[58vh] flex-col lg:min-h-0">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Editor CV</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Edita tu información en Markdown.</p>
              </div>
              <span className="text-[8px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Autoguardado
              </span>
            </div>
            <div className="flex h-7 items-center justify-between border border-b-0 border-slate-200 bg-white px-2.5 text-[8px] uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              <span>Markdown</span>
              <span>UTF-8</span>
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
              className="min-h-[50vh] flex-1 resize-none border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-900 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:p-4 lg:min-h-0"
              aria-label="Contenido del CV en Markdown"
            />
          </section>

          <section className="flex min-h-[58vh] flex-col lg:min-h-0">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Vista previa</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Documento final · plantilla {cv.template || 'default'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:inline">A4 · ATS friendly</span>
                <ExportButtons compact content={cv.content} fileName={cv.title || 'curriculum'} />
              </div>
            </div>
            <div
              className="prose min-h-[50vh] flex-1 max-w-none overflow-y-auto border border-slate-200 bg-white p-7 shadow-none dark:border-slate-700 dark:bg-slate-950 sm:p-8 lg:min-h-0"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </section>
        </div>

        <footer className="mt-5 flex flex-col gap-3 border-y border-slate-200 py-3 text-xs dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            {status === 'Guardando...' && <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />}
            {status === 'Guardado' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {status === 'Error al guardar' && <AlertCircle className="h-4 w-4 text-red-600" />}
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{status}</p>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                Los cambios se guardan automáticamente en tu cuenta.
              </p>
            </div>
          </div>
          <a href="/dashboard" className="flex items-center gap-1 self-start font-medium text-slate-800 hover:underline dark:text-slate-200 sm:self-auto">
            Mis CVs <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
