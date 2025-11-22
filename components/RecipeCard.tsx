import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import Card from './ui/Card';

interface RecipeCardProps {
  recipe: Recipe;
  hideAuthor?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, hideAuthor = false }) => {
  const { user } = useAuth();
  const { toggleLikeRecipe } = useData();
  const navigate = useNavigate();

  const isLiked = user ? recipe.likedBy.includes(user.uid) : false;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
        toggleLikeRecipe(recipe.id, user.uid);
    } else {
        navigate('/login');
    }
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
        navigate('/login');
    } else {
        navigate(`/usuario/${recipe.authorId}`);
    }
  }

  return (
    <Card className="flex flex-col h-full group transition-shadow duration-300 hover:shadow-xl bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border">
        <div className="overflow-hidden">
            <Link to={`/receita/${recipe.id}`}>
                <img className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300" src={recipe.imageUrl} alt={recipe.title} />
            </Link>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            {!hideAuthor && (
                <button onClick={handleAuthorClick} className="flex items-center gap-2 mb-3 group/author">
                    <img src={recipe.authorAvatar} alt={recipe.authorName} className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 dark:border-slate-700 group-hover/author:border-primary transition-colors" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover/author:text-primary transition-colors">{recipe.authorName}</p>
                </button>
            )}
            
            <Link to={`/receita/${recipe.id}`} className="block">
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text group-hover:text-primary transition-colors">{recipe.title}</h3>
            </Link>

            <div className="flex-grow" />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{recipe.tags.length > 0 ? recipe.tags[0] : recipe.category}</span>
                </div>
                <button onClick={handleLike} disabled={!user} className={`flex items-center space-x-1 transition-colors ${!user ? 'cursor-not-allowed text-gray-400' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{recipe.likes}</span>
                </button>
            </div>
        </div>
    </Card>
  );
};

export default RecipeCard;