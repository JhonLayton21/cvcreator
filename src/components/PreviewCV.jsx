import React, { useEffect, useState } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { remark } from 'remark';
import html from 'remark-html';
import ExportButtons from './ExportButtons';

export default function PreviewCV() {
    const [markdown, setMarkdown] = useState('');
    const [htmlContent, setHtmlContent] = useState('');

    // Suscripción al store para obtener el contenido
    useEffect(() => {
        const unsubscribe = resumeStore.subscribe((newContent) => {
            setMarkdown(newContent);
        });
        return unsubscribe;
    }, []);

    // Transformación de Markdown a HTML usando remark
    useEffect(() => {
        const processMarkdown = async () => {
            try {
                const file = await remark()
                    .use(html)
                    .process(markdown);
                setHtmlContent(String(file));
            } catch (error) {
                console.error('Error al procesar Markdown:', error);
            }
        };

        processMarkdown();
    }, [markdown]);

    return (
        <div className="h-full min-h-0 flex flex-col font-sans">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-foreground">Vista previa</h2>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground">Documento final · plantilla default</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:inline">A4 · ATS friendly</span>
                    <ExportButtons compact content={markdown} />
                </div>
            </div>

            <div
                className="prose flex-1 min-h-[50vh] w-full max-w-none overflow-y-auto border border-slate-200 bg-white p-7 shadow-none transition-colors duration-300 dark:border-slate-700 dark:bg-slate-950 sm:p-8 lg:min-h-0"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
