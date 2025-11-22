import React from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface CommentListProps {
    recipeId: string;
}

const CommentList: React.FC<CommentListProps> = ({ recipeId }) => {
    const { recipes } = useData();
    const { user } = useAuth();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe || recipe.comments.length === 0) {
        return <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Nenhum comentário ainda. Seja o primeiro!</p>;
    }
    
    const sortedComments = [...recipe.comments].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <div className="space-y-6 border-t border-light-border dark:border-dark-border pt-6">
            {sortedComments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                    <Link to={`/usuario/${comment.authorId}`}>
                        <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full object-cover" />
                    </Link>
                    <div className="flex-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-baseline gap-2">
                             <Link to={`/usuario/${comment.authorId}`} className="font-semibold text-sm text-light-text dark:text-dark-text hover:underline">{comment.authorName}</Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;