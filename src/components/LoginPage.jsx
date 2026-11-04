import { ArrowLeft, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';
import { Button } from './ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-between bg-slate-950 p-8 text-white dark:bg-slate-950">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">CV Creator</p>
              <h1 className="mt-4 text-3xl font-bold">Guarda tus currículums y accede a ellos desde cualquier sitio.</h1>
              <p className="mt-4 text-sm text-slate-300">
                Accede con tu cuenta para gestionar tus CVs, duplicarlos, renombrarlos y abrirlos en el editor con autoguardado.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-blue-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Todo sincronizado</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Tu flujo de trabajo sigue siendo el mismo, pero ahora tus CVs quedan guardados en tu cuenta.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-8">
            <div className="w-full max-w-md">
              <Button
                variant="ghost"
                className="mb-4 justify-start gap-2 px-0 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al editor
              </Button>

              <AuthModal
                open
                onClose={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
                onAuth={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
