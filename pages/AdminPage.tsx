import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { RecipeStatus, UserRole } from '../types';
import Button from '../components/ui/Button';

const AdminPage: React.FC = () => {
    const { recipes, updateRecipeStatus, getAllUsers, updateUserRole } = useData();

    const pendingRecipes = useMemo(() => recipes.filter(r => r.status === RecipeStatus.Pending), [recipes]);
    const users = useMemo(() => getAllUsers(), [getAllUsers]);

    const handleRecipeAction = (recipeId: string, status: RecipeStatus) => {
        updateRecipeStatus(recipeId, status);
    };

    const handleUserRoleChange = (userId: string, newRole: UserRole) => {
        updateUserRole(userId, newRole);
        alert(`Role for user ${userId} changed to ${newRole}. (Simulation)`);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Painel de Administração</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie receitas e usuários da plataforma.</p>
            </div>
            <div className="space-y-8">
                {/* Recipe Moderation Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Moderação de Receitas</h2>
                    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow overflow-hidden border border-light-border dark:border-dark-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Autor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                                    {pendingRecipes.length > 0 ? pendingRecipes.map(recipe => (
                                        <tr key={recipe.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-text dark:text-dark-text">{recipe.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{recipe.authorName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Button onClick={() => handleRecipeAction(recipe.id, RecipeStatus.Approved)} className="w-auto !py-1 !px-3 text-xs">Aprovar</Button>
                                                <Button onClick={() => handleRecipeAction(recipe.id, RecipeStatus.Hidden)} variant="secondary" className="w-auto !py-1 !px-3 text-xs">Ocultar</Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Nenhuma receita pendente.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Gerenciamento de Usuários</h2>
                     <div className="bg-light-card dark:bg-dark-card rounded-lg shadow overflow-hidden border border-light-border dark:border-dark-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plano Atual</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mudar Plano</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                                    {users.map(user => (
                                        <tr key={user.uid}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-text dark:text-dark-text">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {user.role !== UserRole.Admin && <Button onClick={() => handleUserRoleChange(user.uid, UserRole.Admin)} className="w-auto !py-1 !px-3 text-xs">Tornar Admin</Button>}
                                                {user.role !== UserRole.Member && <Button onClick={() => handleUserRoleChange(user.uid, UserRole.Member)} variant="secondary" className="w-auto !py-1 !px-3 text-xs">Tornar Membro</Button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;