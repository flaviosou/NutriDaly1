import React, { useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';

const RecipeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { recipes, toggleLikeRecipe } = useData();
    const { user } = useAuth();
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const recipeContentRef = useRef<HTMLDivElement>(null);
    
    const recipe = recipes.find(r => r.id === id);

    if (!recipe) {
        return <Navigate to="/404" />;
    }

    const isLiked = user ? recipe.likedBy.includes(user.uid) : false;

    const handleLike = () => {
        if (user) {
            toggleLikeRecipe(recipe.id, user.uid);
        }
    };
    
    const handleDownloadPdf = async () => {
        if (!recipeContentRef.current) return;
        setIsDownloadingPdf(true);

        try {
            // Carregamento dinâmico das bibliotecas
            const { default: jsPDF } = await import('jspdf');
            const { default: html2canvas } = await import('html2canvas');
            
            const element = recipeContentRef.current;
            const canvas = await html2canvas(element, { 
                scale: 2,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc',
            });
            const data = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${recipe.title.replace(/ /g, '_')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsDownloadingPdf(false);
            setIsShareMenuOpen(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado!');
        setIsShareMenuOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <Link to="/comunidade" className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Voltar para a Comunidade
                </Link>
            </div>
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
                <div id="recipe-content-wrapper" ref={recipeContentRef} className="bg-light-card dark:bg-dark-card">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 md:h-80 object-cover" />
                    <div className="p-6 md:p-8">
                         <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                             <div>
                                 <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">{recipe.title}</h1>
                                <Link to={`/usuario/${recipe.authorId}`} className="flex items-center gap-2 mt-2 group">
                                    <img src={recipe.authorAvatar} alt={recipe.authorName} className="h-8 w-8 rounded-full object-cover border-2 border-light-border dark:border-dark-border group-hover:border-primary transition" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0 group-hover:text-primary transition">
                                        Por <span className="font-semibold">{recipe.authorName}</span> | Categoria: {recipe.category}
                                    </p>
                                </Link>
                             </div>
                             {/* Actions moved outside the PDF content area */}
                         </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <h3 className="text-xl font-bold text-light-text dark:text-dark-text border-b-2 border-primary pb-2">Ingredientes</h3>
                                <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="text-xl font-bold text-light-text dark:text-dark-text border-b-2 border-primary pb-2">Modo de Preparo</h3>
                                <div className="mt-4 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {recipe.instructions}
                                </div>
                            </div>
                        </div>
                         {recipe.tags.length > 0 && (
                             <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Tags:</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {recipe.tags.map(tag => <span key={tag} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}
                                </div>
                            </div>
                         )}
                    </div>
                </div>

                 {/* Actions bar below PDF content */}
                <div className="p-6 md:p-8 border-t border-light-border dark:border-dark-border flex items-center justify-end gap-2 flex-shrink-0">
                    <Button onClick={handleLike} disabled={!user} className="w-auto !py-2" variant={isLiked ? 'primary' : 'ghost'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        ({recipe.likes})
                    </Button>
                    <div className="relative">
                        <Button onClick={() => setIsShareMenuOpen(!isShareMenuOpen)} className="w-auto !p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                        </Button>
                        {isShareMenuOpen && (
                             <div className="absolute right-0 bottom-full mb-2 w-48 bg-light-card dark:bg-dark-card rounded-md shadow-lg z-10 border border-light-border dark:border-dark-border">
                                <button onClick={copyLink} className="w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700">Copiar Link</button>
                                <a href={`https://wa.me/?text=${encodeURIComponent(recipe.title + ' - ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700">WhatsApp</a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(recipe.title)}`} target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700">Twitter</a>
                                <button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="w-full text-left px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50">{isDownloadingPdf ? 'Baixando...' : 'Baixar PDF'}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Comentários ({recipe.comments.length})</h2>
                <CommentList recipeId={recipe.id} />
                <CommentForm recipeId={recipe.id} />
            </div>
        </div>
    );
};

export default RecipeDetailPage;