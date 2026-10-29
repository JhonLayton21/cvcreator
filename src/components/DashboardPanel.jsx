import { useEffect, useMemo, useState } from 'react';
import {
  Copy,
  Grid3X3,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from './ui/button';
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

function getPreviewText(content) {
  return (content || DEFAULT_CONTENT)
    .replace(/[#>*_~`]/g, '')
    .split('\n')
    .filter(Boolean)
    .slice(0, 4)
    .join(' ')
    .slice(0, 140);
}

export default function DashboardPanel() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [view, setViewState] = useState('grid');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Mis CVs
            </p>
            <h1 className="mt-1 text-2xl font-bold">Panel de documentos</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título"
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-64"
                aria-label="Buscar CV por título"
              />
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => toggleView('grid')}
                aria-label="Ver cuadrícula"
                className={`rounded-full p-2 transition ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleView('list')}
                aria-label="Ver lista"
                className={`rounded-full p-2 transition ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={handleCreateNew} className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Nuevo CV
            </Button>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-semibold">Todavía no tienes CVs guardados</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Crea tu primer documento para empezar a guardar tu historial profesional en la nube.
            </p>
            <Button onClick={handleCreateNew} className="mt-6 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Crear mi primer CV
            </Button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((cv) => (
              <article key={cv.id} className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/editor/${cv.id}`;
                    }
                  }}
                  className="block w-full text-left"
                >
                  <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      <span>{cv.template || 'default'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                    <p className="line-clamp-4 min-h-[92px]">{getPreviewText(cv.content)}</p>
                  </div>
                </button>

                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold leading-tight">{cv.title}</h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Última edición: {formatDate(cv.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => { if (typeof window !== 'undefined') window.location.href = `/editor/${cv.id}`; }}>
                      Abrir
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRename(cv)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Renombrar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicate(cv)}>
                      <Copy className="h-3.5 w-3.5" />
                      Duplicar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400" onClick={() => handleDelete(cv)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="hidden grid-cols-[2fr_1.2fr_1fr_1.2fr_1.6fr] gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:text-slate-400 md:grid">
              <span>Título</span>
              <span>Plantilla</span>
              <span>Creación</span>
              <span>Actualización</span>
              <span>Acciones</span>
            </div>

            {filteredItems.map((cv) => (
              <div key={cv.id} className="grid gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-slate-800 md:grid-cols-[2fr_1.2fr_1fr_1.2fr_1.6fr] md:items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/editor/${cv.id}`;
                    }
                  }}
                  className="text-left font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                >
                  {cv.title}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">{cv.template || 'default'}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{formatDate(cv.createdAt)}</span>
                <span className="text-sm text-slate-600 dark:text-slate-300">{formatDate(cv.updatedAt)}</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => { if (typeof window !== 'undefined') window.location.href = `/editor/${cv.id}`; }}>
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
      </div>
    </div>
  );
}
