import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import RecipeCard from '../components/RecipeCard';
import { RecipeCategory } from '../types';
import Button from '../components/ui/Button';

const CommunityPage: React.FC = () => {
    const { getCommunityRecipes } = useData();
    const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');

    const approvedRecipes = useMemo(() => getCommunityRecipes(), [getCommunityRecipes]);

    const filteredRecipes = useMemo(() => {
        if (selectedCategory === 'all') {
            return approvedRecipes;
        }
        return approvedRecipes.filter(r => r.category === selectedCategory);
    }, [approvedRecipes, selectedCategory]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Comunidade</h1>
                    <p className="text-gray-600 mt-1">Explore receitas deliciosas compartilhadas por outros usuários.</p>
                </div>
                <Link to="/comunidade/nova-receita">
                    <Button className="w-full md:w-auto">Publicar Nova Receita</Button>
                </Link>
            </div>
            
            <div className="mb-6">
                 <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>Todos</button>
                    {Object.values(RecipeCategory).map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>{cat}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg col-span-full mt-6">
                    <h3 className="text-xl font-semibold text-gray-700">Nenhuma receita encontrada.</h3>
                    <p className="mt-2 text-gray-500">Seja o primeiro a publicar nesta categoria!</p>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;