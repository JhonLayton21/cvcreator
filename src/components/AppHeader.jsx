import { Heart } from 'lucide-react';
import HeaderAuthControls from './HeaderAuthControls';

export default function AppHeader() {
  return (
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
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.119 20.452H2.56V9h3.559v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/JhonLayton21/cvcreator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.493.997.108-.776.419-1.305.762-1.605-2.665-.304-5.467-1.333-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6.004 0c2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.234 1.91 1.234 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.814 1.103.814 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297" />
            </svg>
          </a>
        </div>

        <div className="flex justify-self-end">
          <HeaderAuthControls />
        </div>
      </div>
    </header>
  );
}
