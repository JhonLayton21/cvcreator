import { useEffect, useState } from 'react';
import { getCurrentUser, maybeMigrateGuestResume } from '../utils/cvCloudStore';

export default function AuthCallback() {
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let active = true;

    const finishAuthentication = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('No se pudo confirmar la sesión. Intenta iniciar sesión de nuevo.');
        }

        setSessionReady(true);
        try {
          await maybeMigrateGuestResume();
        } catch (migrationError) {
          if (active) {
            setError(`Tu sesión está activa, pero no se pudo migrar el CV invitado: ${migrationError.message}`);
          }
          return;
        }

        if (active) {
          setMessage('Sesión iniciada. Redirigiendo al panel...');
          window.location.replace('/dashboard');
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError.message || 'No se pudo completar la autenticación.');
        }
      }
    };

    finishAuthentication();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Autenticación de CV Creator</h1>
        <p role={error ? 'alert' : 'status'} className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {error || message}
        </p>
        {error && (
          <a href={sessionReady ? '/dashboard' : '/login'} className="mt-5 inline-block font-medium text-blue-600 hover:underline dark:text-blue-400">
            {sessionReady ? 'Ir al panel sin migrar el CV' : 'Volver a iniciar sesión'}
          </a>
        )}
      </section>
    </main>
  );
}
