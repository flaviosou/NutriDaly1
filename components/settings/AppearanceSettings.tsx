import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../ui/Card';
import ToggleSwitch from '../ui/ToggleSwitch';

const AppearanceSettings: React.FC = () => {
    const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

    return (
        <div className="space-y-8">
            <Card className="p-6 border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Tema</h3>
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium">Modo Escuro</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reduza o brilho e descanse seus olhos.</p>
                    </div>
                    <ToggleSwitch isEnabled={theme === 'dark'} onToggle={toggleTheme} />
                </div>
            </Card>

            <Card className="p-6 border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Acessibilidade</h3>
                <div className="mt-4">
                    <p className="font-medium">Tamanho da Fonte</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Ajuste o tamanho da fonte para melhor legibilidade.</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFontSize('sm')} className={`px-4 py-2 rounded-md ${fontSize === 'sm' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>Pequeno</button>
                        <button onClick={() => setFontSize('base')} className={`px-4 py-2 rounded-md ${fontSize === 'base' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>Normal</button>
                        <button onClick={() => setFontSize('lg')} className={`px-4 py-2 rounded-md ${fontSize === 'lg' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>Grande</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AppearanceSettings;
