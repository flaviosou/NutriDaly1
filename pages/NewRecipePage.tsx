import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { RecipeCategory } from '../types';
import CameraModal from '../components/ui/CameraModal';


const NewRecipePage: React.FC = () => {
    const { addRecipe } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<RecipeCategory>(RecipeCategory.Lunch);
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    
    const inputStyles = "block w-full rounded-md border-0 py-1.5 bg-transparent text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6";

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredientField = () => setIngredients([...ingredients, '']);
    
    const removeIngredientField = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        addRecipe({
            authorId: user.uid,
            title,
            description,
            category,
            ingredients: ingredients.filter(ing => ing.trim() !== ''),
            instructions,
            tags: tags.split(',').map(tag => tag.trim()).filter(t => t),
            imageUrl: imagePreview || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/300`,
        }, user);

        navigate('/perfil');
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Publicar Nova Receita</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Compartilhe suas criações com a comunidade.</p>
            </div>
            <div className="max-w-3xl mx-auto bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text">Imagem da Receita</label>
                        <div className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-slate-700/50 p-2">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Pré-visualização" className="h-full w-full object-contain rounded-md" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="mt-1 text-sm">Carregue ou tire uma foto</p>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <div className="flex gap-2 mt-2">
                            <Button type="button" variant="ghost" className="text-sm" onClick={() => fileInputRef.current?.click()}>Carregar do dispositivo</Button>
                            <Button type="button" variant="ghost" className="text-sm" onClick={() => setIsCameraOpen(true)}>Tirar foto</Button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-light-text dark:text-dark-text">Título da Receita</label>
                        <input id="title" value={title} onChange={e => setTitle(e.target.value)} required className={`mt-2 ${inputStyles}`} />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-light-text dark:text-dark-text">Descrição Breve</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`mt-2 ${inputStyles}`}></textarea>
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-light-text dark:text-dark-text">Categoria</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as RecipeCategory)} className={`mt-2 ${inputStyles}`}>
                            {Object.values(RecipeCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text">Ingredientes</label>
                        {ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                                <input type="text" value={ing} onChange={e => handleIngredientChange(index, e.target.value)} className={inputStyles} placeholder="Ex: 1 xícara de farinha" />
                                <button type="button" onClick={() => removeIngredientField(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full disabled:opacity-50" disabled={ingredients.length <= 1}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={addIngredientField} className="mt-2 text-sm font-medium text-primary hover:text-primary-hover">+ Adicionar ingrediente</button>
                    </div>

                     <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-light-text dark:text-dark-text">Modo de Preparo</label>
                        <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} rows={5} className={`mt-2 ${inputStyles}`} required></textarea>
                    </div>

                    <div>
                         <label htmlFor="tags" className="block text-sm font-medium text-light-text dark:text-dark-text">Tags (separadas por vírgula)</label>
                         <input id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Ex: saudável, rápido, vegano" className={`mt-2 ${inputStyles}`} />
                    </div>

                    <div className="pt-4">
                        <Button type="submit">Salvar Receita</Button>
                    </div>
                </form>
            </div>
            <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={setImagePreview} />
        </div>
    );
};

export default NewRecipePage;