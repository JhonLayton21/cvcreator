import { AtSign, Heart, Link2 } from 'lucide-react';
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
  );
}
