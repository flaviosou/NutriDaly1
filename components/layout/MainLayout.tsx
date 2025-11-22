
import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-16">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">{title}</h1>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
