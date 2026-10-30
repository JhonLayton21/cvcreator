import { useEffect, useState } from 'react';
import { ChevronDown, LayoutGrid, LogOut, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import { Button } from './ui/button';
import { getCurrentUser, logoutCurrentUser } from '../utils/cvCloudStore';
import { getSupabaseClient } from '../lib/supabase/client';

export default function HeaderAuthControls() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let subscription;

    const initializeAuth = async () => {
      try {
        const client = getSupabaseClient();
        const { data } = client.auth.onAuthStateChange((_event, session) => {
          if (active) {
            setUser(session?.user ? {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            } : null);
            setAuthLoaded(true);
          }
        });
        subscription = data.subscription;
        const currentUser = await getCurrentUser();
        if (active) {
          setUser(currentUser);
          setAuthLoaded(true);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError.message || 'No se pudo conectar con Supabase.');
          setAuthLoaded(true);
        }
      }
    };

    initializeAuth();
    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  const refreshUser = (nextUser) => setUser(nextUser);

  const handleLogout = async () => {
    setError('');
    try {
      await logoutCurrentUser();
      setMenuOpen(false);
      setUser(null);
      window.location.assign('/');
    } catch (caughtError) {
      setError(caughtError.message || 'No se pudo cerrar sesión.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {!user ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Iniciar sesión para guardar CVs en la nube"
            disabled={!authLoaded}
            title={!authLoaded ? 'Comprobando sesión...' : undefined}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-950">
              I
            </span>
            Invitado
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex max-w-[190px] items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label={`Abrir menú del usuario ${user.name}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-950">
                {user.name?.slice(0, 1)?.toUpperCase() || 'U'}
              </span>
              <span className="truncate">{user.name || user.email}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="px-2 pb-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      window.location.href = '/dashboard';
                    }
                  }}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Mis CVs
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      window.location.href = '/dashboard?new=1';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Crear nuevo CV
                </Button>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            )}
          </div>
        )}
        {error && <span role="alert" className="max-w-56 truncate text-xs text-red-600 dark:text-red-400">{error}</span>}
      </div>

      <AuthModal open={open} onClose={() => setOpen(false)} onAuth={refreshUser} />
    </>
  );
}
