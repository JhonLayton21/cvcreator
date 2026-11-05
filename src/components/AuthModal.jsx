import { useEffect, useRef, useState } from 'react';
import { Info, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  maybeMigrateGuestResume,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../utils/cvCloudStore';

function getAuthErrorMessage(error, fallback) {
  const knownMessages = {
    'Invalid login credentials': 'El correo o la contraseña no son correctos.',
    'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
    'User already registered': 'Ya existe una cuenta con ese correo. Inicia sesión.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  };

  return knownMessages[error.message] || `${fallback}: ${error.message || 'error desconocido'}`;
}

export default function AuthModal({ open, onClose, onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const loadingRef = useRef(loading);
  onCloseRef.current = onClose;
  loadingRef.current = loading;

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.querySelector('input')?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loadingRef.current) {
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let authenticatedUser;
      if (mode === 'register') {
        const result = await signUpWithEmail({ name, email, password });
        if (!result.session) {
          setMessage('Te enviamos un correo para confirmar tu cuenta. Confírmalo y luego inicia sesión.');
          return;
        }
        authenticatedUser = result.user;
      } else {
        authenticatedUser = await signInWithEmail({ email, password });
      }

      onAuth?.(authenticatedUser);
      try {
        await maybeMigrateGuestResume();
      } catch (migrationError) {
        setError(`Iniciaste sesión, pero no se pudo guardar el CV invitado: ${migrationError.message}`);
        return;
      }

      window.location.assign('/dashboard');
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, 'No se pudo completar la autenticación'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError, 'No se pudo iniciar sesión con Google'));
      setLoading(false);
    }
  };

  const setAuthMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/45 p-3 backdrop-blur-sm sm:p-5" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto border border-border bg-background text-foreground shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]"
      >
        <header className="flex h-[62px] items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-foreground text-[10px] font-medium tracking-tight">
              CV
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              CV Creator
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={loading}
            className="rounded-sm p-1.5 text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Tu espacio de trabajo
          </p>
          <h2 id="auth-modal-title" className="mt-2 text-[23px] font-semibold leading-tight tracking-tight">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p id="auth-modal-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {mode === 'login'
              ? 'Accede para continuar editando tus currículums.'
              : 'Crea tu cuenta para empezar con tus currículums.'}
          </p>

          <div className="mt-5 grid grid-cols-2 border-b border-border" role="group" aria-label="Tipo de autenticación">
            <button
              type="button"
              aria-pressed={mode === 'login'}
              onClick={() => setAuthMode('login')}
              className={`border-b-2 px-3 py-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === 'login'
                  ? 'border-foreground font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              aria-pressed={mode === 'register'}
              onClick={() => setAuthMode('register')}
              className={`border-b-2 px-3 py-3 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === 'register'
                  ? 'border-foreground font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3.5 pt-4" aria-busy={loading}>
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="mb-1.5 block text-xs font-medium">
                  Nombre completo
                </label>
                <input
                  id="auth-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  className="h-9 w-full border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-xs font-medium">
                Correo electrónico
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="h-9 w-full border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="nombre@correo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-xs font-medium">
                Contraseña
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="h-9 w-full border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            {error && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            {message && <p role="status" className="text-xs text-foreground">{message}</p>}

            <Button type="submit" disabled={loading} className="h-[34px] w-full rounded-none text-xs">
              {loading ? 'Conectando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>

            <div className="flex items-center gap-3 py-1.5" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px]">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="h-9 w-full rounded-none border-input bg-background text-xs text-foreground hover:bg-muted"
              onClick={handleGoogle}
            >
              <Sparkles className="h-4 w-4" />
              Continuar con Google
            </Button>
          </form>

          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-start gap-2.5 text-[10px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
              <p>Inicia sesión para guardar tus currículums y acceder a ellos desde cualquier sitio.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 text-xs text-muted-foreground underline underline-offset-4 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Seguir como invitado
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
