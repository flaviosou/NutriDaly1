import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { calculateBMI } from '../utils/bmi';

const Icon = ({ path, className="h-5 w-5" }: { path: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

const ProfilePage: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const { getRecipesByAuthor, getSavedRecipes } = useData();
    const [activeTab, setActiveTab] = useState<'recipes' | 'saved'>('recipes');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(user?.bio || '');

    if (!user) return null;
    
    const bmiInfo = useMemo(() => calculateBMI(user.weightKg, user.heightCm), [user.weightKg, user.heightCm]);

    const userRecipes = useMemo(() => getRecipesByAuthor(user.uid), [user.uid, getRecipesByAuthor]);
    const savedRecipes = useMemo(() => getSavedRecipes(user.uid), [user.uid, getSavedRecipes]);
    
    const handleSaveBio = () => {
        updateUserProfile({ bio: bioText });
        setIsEditingBio(false);
    };

    const TabButton = ({ tabName, label, iconPath, count }: { tabName: 'recipes' | 'saved', label: string, iconPath: string, count: number }) => (
        <button onClick={() => setActiveTab(tabName)} className={`flex items-center justify-center px-4 py-3 text-sm font-semibold border-b-2 transition-colors w-full md:w-auto ${activeTab === tabName ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'}`}>
            <Icon path={iconPath} />
            <span className="ml-2">{label}</span> <span className="ml-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <header className="mb-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group flex-shrink-0">
                          <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-dark-card shadow-lg" />
                          <Link to="/configuracoes" className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" className="h-8 w-8" />
                          </Link>
                      </div>
                      <div className="flex-grow">
                          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text text-center sm:text-left">{user.name}</h1>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-center sm:text-left">{user.email}</p>
                          
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
                          
                           <div className="mt-4 text-center sm:text-left max-w-lg">
                                {isEditingBio ? (
                                    <div>
                                        <textarea 
                                            value={bioText}
                                            onChange={(e) => setBioText(e.target.value)}
                                            className="w-full p-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
                                            rows={3}
                                            placeholder="Fale um pouco sobre você..."
                                        />
                                        <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                                            <Button className="w-auto !py-1 !px-3 text-xs" onClick={handleSaveBio}>Salvar</Button>
                                            <Button className="w-auto !py-1 !px-3 text-xs" variant="ghost" onClick={() => setIsEditingBio(false)}>Cancelar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="group/bio">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.bio || "Adicione uma bio para se apresentar à comunidade."}</p>
                                        <button onClick={() => setIsEditingBio(true)} className="text-primary text-xs font-semibold opacity-0 group-hover/bio:opacity-100 transition-opacity mt-1">
                                            Editar Bio
                                        </button>
                                    </div>
                                )}
                            </div>

                      </div>
                  </div>
                  <Link to="/comunidade/nova-receita" className="w-full sm:w-auto flex-shrink-0">
                      <Button className="w-full sm:w-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Publicar Receita
                      </Button>
                  </Link>
              </div>
            </header>

            {/* BMI Card */}
            {bmiInfo.value > 0 && (
                <div className="mb-8 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Seu Índice de Massa Corporal (IMC)</h3>
                    <div className="flex items-center gap-4 mt-3">
                        <div className={`text-3xl font-bold p-4 rounded-lg`} style={{ color: bmiInfo.color }}>{bmiInfo.value}</div>
                        <div className="flex-1">
                            <p className="font-semibold" style={{ color: bmiInfo.color }}>{bmiInfo.category}</p>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                                <div className="h-2.5 rounded-full" style={{ width: `${bmiInfo.progress}%`, backgroundColor: bmiInfo.color }}></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">O IMC é uma medida de referência, mas não substitui uma avaliação médica completa. <Link to="/configuracoes" className="text-primary underline">Atualize seu peso e altura.</Link></p>
                </div>
            )}


            {/* Tabs */}
            <div className="border-b border-light-border dark:border-dark-border">
                <nav className="flex flex-col md:flex-row -mb-px">
                    <TabButton tabName="recipes" label="Minhas Receitas" iconPath="M4 6h16M4 12h16M4 18h16" count={userRecipes.length}/>
                    <TabButton tabName="saved" label="Salvos" iconPath="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" count={savedRecipes.length}/>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'recipes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userRecipes.length > 0 ? (
                            userRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} hideAuthor />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">Você ainda não publicou nenhuma receita.</p>
                        )}
                    </div>
                )}
                 {activeTab === 'saved' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedRecipes.length > 0 ? (
                            savedRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">Você ainda não salvou (curtiu) nenhuma receita.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;