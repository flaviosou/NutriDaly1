import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, Link, useOutletContext } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { DataProvider } from './contexts/DataContext';
import { useData } from './hooks/useData';
import { ThemeProvider } from './contexts/ThemeContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import NewRecipePage from './pages/NewRecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import { UserRole, User } from './types';
import ChatModal from './components/chat/ChatModal';

// Context Type for Outlet
export type AppLayoutContext = {
  openChat: (user: User) => void;
};


// Novo Layout para páginas autenticadas, agora responsivo
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<User | null>(null);
  
  const { user: currentUser } = useAuth();
  const { getChatForUsers, sendMessageToChat } = useData();

  const activeChat = chatTargetUser && currentUser ? getChatForUsers(currentUser.uid, chatTargetUser.uid) : null;
  
  const handleSendMessage = (text: string) => {
      if (activeChat && currentUser) {
          sendMessageToChat(activeChat.id, currentUser.uid, text);
          // Trigger a re-render to show the new message by creating a new object
          setChatTargetUser(prev => prev ? {...prev} : null);
      }
  };


  return (
    <div className="relative flex h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border p-4 sticky top-0 z-20">
          <Link to="/dashboard" className="text-xl font-bold text-primary">NutriDaily</Link>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300 hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-10">
            <Outlet context={{ openChat: setChatTargetUser } satisfies AppLayoutContext} />
          </div>
        </main>
      </div>

      {chatTargetUser && activeChat && currentUser && (
        <ChatModal 
          chat={activeChat}
          recipient={chatTargetUser}
          currentUser={currentUser}
          onClose={() => setChatTargetUser(null)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <HashRouter>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rotas Protegidas com o novo Layout */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/receita/:id" element={<RecipeDetailPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/configuracoes" element={<SettingsPage />} />
                <Route path="/comunidade/nova-receita" element={<NewRecipePage />}/>
                
                {/* Community and User Profiles are now accessible to all logged-in members */}
                <Route path="/comunidade" element={<CommunityPage />}/>
                <Route path="/usuario/:userId" element={<UserProfilePage />}/>
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <AdminPage />
                  </ProtectedRoute>
                }/>
              </Route>

              {/* Rota Not Found */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </HashRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;