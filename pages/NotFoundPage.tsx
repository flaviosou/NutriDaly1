
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-800">Página não encontrada</h2>
      <p className="mt-2 text-gray-600">
        Desculpe, a página que você está procurando não existe.
      </p>
      <div className="mt-6 w-full max-w-xs">
        <Link to="/dashboard">
          <Button>Voltar para o Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
