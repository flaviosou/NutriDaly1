import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Goal, Restriction } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CameraModal from '../ui/CameraModal';
import { calculateBMI } from '../../utils/bmi';

const ProfileSettings: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [name, setName] = useState(user?.name || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
    const [age, setAge] = useState(user?.age?.toString() || '');
    const [height, setHeight] = useState(user?.heightCm?.toString() || '');
    const [weight, setWeight] = useState(user?.weightKg?.toString() || '');
    const [goal, setGoal] = useState<Goal>(user?.preferences.goal || Goal.MaintainWeight);
    const [restrictions, setRestrictions] = useState<Restriction[]>(user?.preferences.restrictions || []);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const bmiInfo = useMemo(() => calculateBMI(Number(weight), Number(height)), [weight, height]);

    const handleRestrictionChange = (restriction: Restriction) => {
        setRestrictions(prev => 
            prev.includes(restriction) 
            ? prev.filter(r => r !== restriction)
            : [...prev, restriction]
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCapture = (dataUrl: string) => {
        setAvatarPreview(dataUrl);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({
            name,
            avatarUrl: avatarPreview,
            age: parseInt(age, 10),
            heightCm: parseInt(height, 10),
            weightKg: parseInt(weight, 10),
            preferences: { goal, restrictions }
        });
        alert('Perfil atualizado com sucesso!');
    };
    
    const inputStyles = "mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-transparent";

    return (
        <>
            <Card className="p-6 border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Informações do Perfil</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Foto de Perfil</label>
                        <div className="mt-2 flex items-center gap-4">
                            <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                            <div className="flex gap-2">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>Carregar</Button>
                                <Button type="button" variant="ghost" onClick={() => setIsCameraOpen(true)}>Tirar Foto</Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nome Completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputStyles} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                             <label className="block text-sm font-medium">Idade</label>
                             <input type="number" value={age} onChange={e => setAge(e.target.value)} className={inputStyles} />
                        </div>
                         <div>
                             <label className="block text-sm font-medium">Altura (cm)</label>
                             <input type="number" value={height} onChange={e => setHeight(e.target.value)} className={inputStyles} />
                        </div>
                         <div>
                             <label className="block text-sm font-medium">Peso (kg)</label>
                             <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inputStyles} />
                        </div>
                    </div>

                    {bmiInfo.value > 0 && (
                        <div className="p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg">
                             <p className="text-sm font-medium text-center">Seu IMC é de <span className="font-bold">{bmiInfo.value}</span> - <span style={{ color: bmiInfo.color }}>{bmiInfo.category}</span></p>
                        </div>
                    )}


                    <div>
                        <label className="block text-sm font-medium">Seu objetivo</label>
                        <select value={goal} onChange={e => setGoal(e.target.value as Goal)} className={inputStyles}>
                            {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium">Restrições Alimentares</label>
                        <div className="mt-2 space-y-2">
                            {Object.values(Restriction).map(r => (
                                <div key={r} className="flex items-center">
                                    <input id={`setting-${r}`} name={r} type="checkbox" checked={restrictions.includes(r)} onChange={() => handleRestrictionChange(r)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <label htmlFor={`setting-${r}`} className="ml-3 block text-sm capitalize">{r}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="w-auto">Salvar Alterações</Button>
                    </div>
                </form>
            </Card>
            <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
        </>
    );
};

export default ProfileSettings;