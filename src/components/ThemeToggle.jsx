import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

const STORAGE_KEY = 'cvcreator-theme';

function getStoredTheme() {
	if (typeof window === 'undefined') return 'light';
	return localStorage.getItem(STORAGE_KEY) || 'light';
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState(getStoredTheme);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	const toggleTheme = () => {
		const next = theme === 'light' ? 'dark' : 'light';
		setTheme(next);
		localStorage.setItem(STORAGE_KEY, next);
		document.documentElement.classList.toggle('dark', next === 'dark');
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
			className="cursor-pointer shrink-0"
			aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
		>
			{theme === 'light' ? (
				<Moon className="h-6 w-6" />
			) : (
				<Sun className="h-6 w-6" />
			)}
		</Button>
	);
}
