import { useEffect, useMemo, useState } from 'react';
import {
  AtSign,
  Copy,
  FileText,
  Grid3X3,
  Heart,
  Link2,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from './ui/button';
import HeaderAuthControls from './HeaderAuthControls';
import { DEFAULT_CONTENT } from '../utils/resumeStore';
import {
  createCv,
  deleteCv,
  duplicateCv,
  getCurrentUser,
  getDashboardView,
  getUserCvs,
  setDashboardView,
  updateCvRecord,
} from '../utils/cvCloudStore';

function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';

  return new Date(dateString).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getPreviewContent(content) {
  const lines = (content || DEFAULT_CONTENT)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line !== '---');
  const nameIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const name = nameIndex >= 0 ? lines[nameIndex].replace(/^#\s+/, '') : 'NOMBRE COMPLETO';
  const contact = lines
    .slice(nameIndex + 1)
    .filter((line) => !/^#{1,6}\s/.test(line))
    .slice(0, 2)
    .join(' · ');
  const profileIndex = lines.findIndex((line) => /^##\s+perfil profesional/i.test(line));
  const sectionIndex = profileIndex >= 0
    ? profileIndex
    : lines.findIndex((line) => /^##\s+/.test(line));
  const sectionTitle = sectionIndex >= 0
    ? lines[sectionIndex].replace(/^##\s+/, '')
    : 'PERFIL PROFESIONAL';

  return { name, contact, sectionTitle };
}

export default function DashboardPanel() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [view, setViewState] = useState('grid');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const refresh = async () => {
    setError('');
    try {
      setItems(await getUserCvs());
    } catch (caughtError) {
      setError(caughtError.message || 'No se pudieron cargar tus CVs.');
    }
  };

  useEffect(() => {
    let active = true;

    const initializeDashboard = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!active) return;
        if (!currentUser) {
          window.location.assign('/login');
          return;
        }

        setUser(currentUser);
        setViewState(getDashboardView());
        setItems(await getUserCvs());

        if (new URLSearchParams(window.location.search).get('new') === '1') {
          const created = await createCv({
            title: 'CV sin título',
            content: DEFAULT_CONTENT,
            template: 'default',
          });
          window.location.replace(`/editor/${created.id}`);
          return;
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError.message || 'No se pudieron cargar tus CVs.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    initializeDashboard();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((cv) => cv.title.toLowerCase().includes(query));
  }, [items, search]);

  const handleCreateNew = async () => {
    if (!user) return;

    setError('');
    try {
      const created = await createCv({
        title: 'CV sin título',
        content: DEFAULT_CONTENT,
        template: 'default',
      });
      window.location.assign(`/editor/${created.id}`);
    } catch (caughtError) {
      setError(caughtError.message || 'No se pudo crear el CV.');
    }
  };

  const handleRename = async (cv) => {
    if (!user) return;

    const nextTitle = window.prompt('Nuevo nombre para el CV', cv.title);
    if (nextTitle && nextTitle.trim()) {
      setError('');
      try {
        await updateCvRecord(cv.id, { title: nextTitle.trim() });
        await refresh();
      } catch (caughtError) {
        setError(caughtError.message || 'No se pudo renombrar el CV.');
      }
    }
  };

  const handleDuplicate = async (cv) => {
    if (!user) return;

    setError('');
    try {
      await duplicateCv(cv.id);
      await refresh();
    } catch (caughtError) {
      setError(caughtError.message || 'No se pudo duplicar el CV.');
    }
  };

  const handleDelete = async (cv) => {
    if (!user) return;

    const confirmed = window.confirm(`¿Eliminar “${cv.title}”? Esta acción no se puede deshacer.`);
    if (confirmed) {
      setError('');
      try {
        await deleteCv(cv.id);
        await refresh();
      } catch (caughtError) {
        setError(caughtError.message || 'No se pudo eliminar el CV.');
      }
    }
  };

  const toggleView = (nextView) => {
    setViewState(nextView);
    setDashboardView(nextView);
  };

  if (!user && !loading && !error) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid min-h-16 max-w-[1440px] grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-3 md:grid-cols-[1fr_auto_1fr]">
          <a href="/" className="flex w-fit items-center gap-3" aria-label="CV Creator, inicio">
            <span className="flex h-9 w-9 items-center justify-center border border-slate-900 text-sm font-semibold tracking-tight dark:border-slate-100">
              CV
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">CV Creator</span>
          </a>

          <div className="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:flex">
            <span>Hecho con</span>
            <Heart className="h-3.5 w-3.5" aria-label="amor" />
            <span>por</span>
            <a
              href="/HdV_actual_JBLR.pdf"
              download="Jhon-Brandon-Layton-Rodriguez-CV-Software-Engineer.pdf"
              className="font-medium text-slate-900 hover:underline dark:text-slate-100"
            >
              Jhon Brandon Layton Rodriguez
            </a>
            <a
              href="https://www.linkedin.com/in/jhon-layton/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="ml-1 hover:text-slate-900 dark:hover:text-white"
            >
              <AtSign className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/JhonLayton21/cvcreator"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-slate-900 dark:hover:text-white"
            >
              <Link2 className="h-4 w-4" />
            </a>
          </div>

          <div className="flex justify-self-end">
            <HeaderAuthControls />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1110px] px-5 pb-12 pt-10 sm:px-6 lg:pt-[54px]">
        <section className="flex flex-col justify-between gap-6 border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:min-h-[133px] lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Mis CVs
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight">
              Panel de documentos
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Organiza y continúa trabajando en tus currículums.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título"
                className="h-10 w-full border border-slate-200 bg-[#fafafa] pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-[234px]"
                aria-label="Buscar CV por título"
              />
            </label>

            <div className="flex h-10 items-center border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => toggleView('grid')}
                aria-label="Ver cuadrícula"
                aria-pressed={view === 'grid'}
                className={`flex h-full w-9 items-center justify-center transition ${view === 'grid' ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleView('list')}
                aria-label="Ver lista"
                aria-pressed={view === 'list'}
                className={`flex h-full w-9 items-center justify-center border-l border-slate-200 transition dark:border-slate-700 ${view === 'list' ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={handleCreateNew} className="h-10 rounded-sm bg-slate-950 px-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              <Plus className="h-4 w-4" />
              Nuevo CV
            </Button>
          </div>
        </section>

        {error && (
          <div role="alert" className="mt-4 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        <p className="mb-4 mt-5 text-xs text-slate-600 dark:text-slate-400">
          {items.length} {items.length === 1 ? 'documento' : 'documentos'} en esta sesión
        </p>

        {loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,524px))]' : 'space-y-3'}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[390px] animate-pulse border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-semibold">Todavía no tienes CVs guardados</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Crea tu primer documento para empezar a guardar tu historial profesional en la nube.
            </p>
            <Button onClick={handleCreateNew} className="mt-6 rounded-sm bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              <Plus className="h-4 w-4" />
              Crear mi primer CV
            </Button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,524px))]">
            {filteredItems.map((cv) => {
              const preview = getPreviewContent(cv.content);

              return (
                <article key={cv.id} className="relative bg-white dark:bg-slate-900">
                  <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="border border-slate-200 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        {cv.template || 'default'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Actualizado {formatDate(cv.updatedAt)}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)}
                        aria-label={`Acciones para ${cv.title}`}
                        aria-expanded={openMenuId === cv.id}
                        className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === cv.id && (
                        <div className="absolute right-0 z-10 mt-1 w-40 border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                          <button type="button" onClick={() => { setOpenMenuId(null); handleRename(cv); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Pencil className="h-3.5 w-3.5" /> Renombrar
                          </button>
                          <button type="button" onClick={() => { setOpenMenuId(null); handleDuplicate(cv); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Copy className="h-3.5 w-3.5" /> Duplicar
                          </button>
                          <button type="button" onClick={() => { setOpenMenuId(null); handleDelete(cv); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                            <Trash2 className="h-3.5 w-3.5" /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { window.location.href = `/editor/${cv.id}`; }}
                    aria-label={`Abrir ${cv.title}`}
                    className="mx-4 mt-6 block w-[calc(100%-2rem)] border border-slate-200 bg-[#fafafa] p-4 text-left transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600"
                  >
                    <div className="min-h-[128px] border border-slate-200 bg-white px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em]">
                        {preview.name}
                      </p>
                      {preview.contact && (
                        <p className="mt-1 truncate text-[8px] text-slate-500 dark:text-slate-400">
                          {preview.contact}
                        </p>
                      )}
                      <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
                      <p className="truncate text-[9px] font-medium uppercase tracking-[0.04em]">
                        {preview.sectionTitle}
                      </p>
                      <div className="mt-2 space-y-1.5" aria-hidden="true">
                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800" />
                        <div className="h-1 w-[92%] bg-slate-100 dark:bg-slate-800" />
                        <div className="h-1 w-[78%] bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </div>
                  </button>

                  <div className="px-4 pb-4 pt-4">
                    <h2 className="truncate text-base font-medium">{cv.title}</h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Última edición: {formatDate(cv.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Plantilla {cv.template || 'default'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { window.location.href = `/editor/${cv.id}`; }}
                      className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                    >
                      Abrir CV <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="hidden min-w-[760px] grid-cols-[2fr_1.2fr_1fr_1.2fr_1.6fr] gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:text-slate-400 md:grid">
              <span>Título</span>
              <span>Plantilla</span>
              <span>Creación</span>
              <span>Actualización</span>
              <span>Acciones</span>
            </div>

            {filteredItems.map((cv) => (
              <div key={cv.id} className="grid min-w-[760px] gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-slate-800 md:grid-cols-[2fr_1.2fr_1fr_1.2fr_1.6fr] md:items-center">
                <button
                  type="button"
                  onClick={() => { window.location.href = `/editor/${cv.id}`; }}
                  className="text-left font-medium hover:underline"
                >
                  {cv.title}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">{cv.template || 'default'}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{formatDate(cv.createdAt)}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{formatDate(cv.updatedAt)}</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => { window.location.href = `/editor/${cv.id}`; }}>
                    Abrir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRename(cv)}>Renombrar</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicate(cv)}>Duplicar</Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400" onClick={() => handleDelete(cv)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
