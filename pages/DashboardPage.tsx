import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Recipe } from '../types';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { getLatestCommunityRecipe } = useData();
    
    const [isLoading, setIsLoading] = useState(true);
    const [latestRecipe, setLatestRecipe] = useState<Recipe | undefined>(undefined);

    useEffect(() => {
        setIsLoading(true);
        const latest = getLatestCommunityRecipe();
        setLatestRecipe(latest);
        setIsLoading(false);
    }, [getLatestCommunityRecipe]);

    
    if (isLoading) return <Spinner />;
    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Bom dia, {user.name}!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Veja o que há de novo na comunidade hoje.</p>
            </div>
            
            {latestRecipe ? (
                <div>
                     <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">Destaque da Comunidade</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-1 lg:col-span-1">
                             <RecipeCard recipe={latestRecipe} />
                        </div>
                        <div className="md:col-span-1 lg:col-span-2 flex items-center justify-center bg-light-card dark:bg-dark-card rounded-lg p-8 border-2 border-dashed border-light-border dark:border-dark-border">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-primary">Explore mais receitas</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Junte-se à conversa e descubra o que os outros membros estão cozinhando.</p>
                                <Link to="/comunidade">
                                    <Button variant="secondary" className="mt-4 w-auto">
                                        Ir para a Comunidade
                                    </Button>
                                </Link>
                            </div>
                        </div>
                     </div>
                </div>
            ) : (
                 <div className="text-center py-16 bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">A comunidade está só começando!</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">Ainda não há receitas publicadas. Que tal ser o primeiro a compartilhar?</p>
                    <div className="w-full max-w-xs mx-auto">
                        <Link to="/comunidade/nova-receita">
                            <Button>Publicar minha primeira receita</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;