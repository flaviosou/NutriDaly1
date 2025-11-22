import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

const AccountSettings: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        alert("Conta deletada com sucesso! (Simulação)");
        setIsModalOpen(false);
        logout();
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="space-y-8">
             <Card className="p-6 border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Sessão</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie sua sessão ativa.</p>
                <div className="mt-4">
                    <Button variant="ghost" className="w-auto text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
                        Encerrar Sessão (Logout)
                    </Button>
                </div>
            </Card>

            <Card className="p-6 border-light-border dark:border-dark-border">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Alterar Senha</h3>
                <form className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Senha Atual</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Nova Senha</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-transparent" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="w-auto" onClick={(e) => { e.preventDefault(); alert("Senha alterada (simulação)!"); }}>Salvar Senha</Button>
                    </div>
                </form>
            </Card>

            <Card className="p-6 border-red-500">
                <h3 className="text-lg font-semibold text-red-600">Zona de Perigo</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua conta e todos os seus dados.</p>
                <div className="mt-4">
                    <Button variant="secondary" className="w-auto bg-red-600 hover:bg-red-700" onClick={() => setIsModalOpen(true)}>
                        Deletar minha conta
                    </Button>
                </div>
            </Card>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold">Tem certeza?</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Você está prestes a deletar sua conta permanentemente. Todos os seus dados, incluindo receitas publicadas e salvas, serão perdidos.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="ghost" className="w-auto" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                            <Button className="w-auto bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount}>Sim, deletar</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;