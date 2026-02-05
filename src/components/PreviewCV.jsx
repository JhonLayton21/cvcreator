import React, { useEffect, useState } from 'react';
import { resumeStore } from '../utils/resumeStore';
import { remark } from 'remark';
import html from 'remark-html';

export default function PreviewCV() {
    const [markdown, setMarkdown] = useState('');
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const unsubscribe = resumeStore.subscribe(setMarkdown);
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Process markdown to HTML
        remark()
            .use(html)
            .process(markdown)
            .then((file) => {
                setHtmlContent(String(file));
            })
            .catch((err) => {
                console.error('Markdown processing error:', err);
            });
    }, [markdown]);

    return (
        <div className="h-full flex flex-col font-sans">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Vista Previa</h2>
                <p className="text-sm text-gray-500">Así se verá tu documento.</p>
            </div>

            <div
                className="flex-1 w-full bg-white p-8 border border-gray-300 shadow-sm rounded-md overflow-y-auto prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
}
