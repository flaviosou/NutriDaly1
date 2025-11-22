
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-700 hover:bg-green-100 hover:text-primary'
    }`;

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-primary font-bold">
              NutriDaily
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/comunidade" className={navLinkClass}>Comunidade</NavLink>
                <NavLink to="/perfil" className={navLinkClass}>Perfil</NavLink>
                {user?.role === UserRole.Admin && (
                   <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="ml-4 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;