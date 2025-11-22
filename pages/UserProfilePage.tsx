import React, { useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/ui/Button';
import { AppLayoutContext } from '../App';

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { getUserById, getCommunityRecipes, followUser, unfollowUser } = useData();
    const { user: currentUser } = useAuth();
    const { openChat } = useOutletContext<AppLayoutContext>();
    
    const user = useMemo(() => userId ? getUserById(userId) : undefined, [userId, getUserById]);
    
    // Show only public recipes on a public profile page
    const userRecipes = useMemo(() => {
        if (!userId) return [];
        return getCommunityRecipes().filter(recipe => recipe.authorId === userId);
    }, [userId, getCommunityRecipes]);

    if (!userId) {
        return <p className="text-center text-red-500">ID de usuário inválido.</p>;
    }

    if (!user) {
        return <p className="text-center text-gray-500 py-10">Usuário não encontrado.</p>;
    }
    
    const isFollowing = currentUser ? user.followers.includes(currentUser.uid) : false;

    const handleFollow = () => {
        if(currentUser) followUser(user.uid, currentUser.uid);
    };

    const handleUnfollow = () => {
        if(currentUser) unfollowUser(user.uid, currentUser.uid);
    }
    
    const handleStartChat = () => {
        openChat(user);
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
             <header className="mb-10">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-dark-card shadow-lg" />
                        <div>
                            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text text-center sm:text-left">{user.name}</h1>
                            
                             <div className="flex justify-center sm:justify-start items-center gap-6 mt-3 text-gray-700 dark:text-gray-300">
                                <div className="text-center">
                                    <span className="font-bold text-lg">{userRecipes.length}</span>
                                    <p className="text-sm">Receitas</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-lg">{user.followers.length}</span>
                                    <p className="text-sm">Seguidores</p>
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-lg">{user.following.length}</span>
                                    <p className="text-sm">Seguindo</p>
                                </div>
                            </div>
                            {user.bio && (
                                <p className="mt-4 text-center sm:text-left max-w-lg text-gray-700 dark:text-gray-300">{user.bio}</p>
                            )}
                        </div>
                    </div>
                    {currentUser && currentUser.uid !== user.uid && (
                        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                            {isFollowing ? (
                                <Button onClick={handleUnfollow} variant="ghost" className="w-full sm:w-auto">Deixar de Seguir</Button>
                            ) : (
                                <Button onClick={handleFollow} className="w-full sm:w-auto">Seguir</Button>
                            )}
                            <Button onClick={handleStartChat} variant="secondary" className="w-full sm:w-auto">Conversar</Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Recipe Grid */}
            <div className="border-t border-light-border dark:border-dark-border pt-8">
                 <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Receitas de {user.name}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRecipes.length > 0 ? (
                        userRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} hideAuthor />)
                    ) : (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">Este usuário ainda não publicou nenhuma receita na comunidade.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;