import { useState } from 'react';
import { Mail, Sparkles, X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              CV Creator
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              <span id="auth-modal-title">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            disabled={loading}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border px-2 pb-2 pt-3">
          <button
            type="button"
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            onClick={() => setMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-5" aria-busy={loading}>
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Nombre
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {message && <p role="status" className="text-sm text-green-700 dark:text-green-400">{message}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            {loading ? 'Conectando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-500">
              <span className="bg-white px-2 dark:bg-slate-900">o</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="w-full border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={handleGoogle}
          >
            <Sparkles className="h-4 w-4" />
            Continuar con Google
          </Button>
        </form>
      </div>
    </div>
  );
}
