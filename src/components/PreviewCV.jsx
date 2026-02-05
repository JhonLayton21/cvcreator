import React, { useEffect, useState } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { remark } from 'remark';
import html from 'remark-html';

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
        <div className="h-full flex flex-col font-sans">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Vista Previa</h2>
                <p className="text-sm text-gray-500">Documento final.</p>
            </div>

            {/* Contenedor de la vista previa con estilos definidos en global.css (.prose) */}
            <div
                className="flex-1 w-full bg-white p-8 border border-gray-300 shadow-sm rounded-md overflow-y-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
