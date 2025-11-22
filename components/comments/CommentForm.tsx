import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

interface CommentFormProps {
    recipeId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ recipeId }) => {
    const [text, setText] = useState('');
    const { user } = useAuth();
    const { addComment } = useData();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) return;

        setIsLoading(true);
        await new Promise(res => setTimeout(res, 300)); // Simulate async
        addComment(recipeId, user, text.trim());
        setText('');
        setIsLoading(false);
    };

    if (!user) {
        return (
            <div className="mt-6 p-4 text-center bg-gray-100 dark:bg-slate-700/50 rounded-lg border-2 border-dashed">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    <Link to="/login" className="font-bold text-primary underline">Faça login</Link> para deixar um comentário e interagir com a comunidade!
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex items-start gap-3">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Adicione um comentário..."
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 bg-gray-100 dark:bg-slate-700 text-light-text dark:text-dark-text shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    required
                />
                <div className="mt-2 flex justify-end">
                    <Button type="submit" isLoading={isLoading} className="w-auto">
                        Publicar
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;