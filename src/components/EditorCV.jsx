import React, { useEffect, useState } from 'react';
import { resumeStore } from '../utils/resumeStore';

export default function EditorCV() {
    const [content, setContent] = useState('');

    // Sincronizar con el store al montar
    useEffect(() => {
        const unsubscribe = resumeStore.subscribe(newContent => {
            setContent(newContent);
        });
        return unsubscribe;
    }, []);

    // Manejar cambios y notificar al store
    const handleChange = (e) => {
        const newVal = e.target.value;
        setContent(newVal);
        resumeStore.set(newVal);
    };

    return (
        <div className="h-full flex flex-col font-sans">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Editor CV</h2>
                <p className="text-sm text-gray-500">Edita tu información en Markdown.</p>
            </div>
            <textarea
                className="flex-1 w-full p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 font-mono text-sm leading-relaxed"
                value={content}
                onChange={handleChange}
                placeholder="# Tu Nombre..."
                spellCheck="false"
            />
        </div>
    );
}
