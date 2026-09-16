import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, Package, ShoppingCart, FileText,
  CreditCard, Truck, BarChart3, Settings, LogOut, Menu, X,
  ChevronDown, Leaf, User
} from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileModal from './ProfileModal';
import LogoUpload from './LogoUpload';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/produits', label: 'Produits', icon: Package },
  { path: '/commandes', label: 'Commandes', icon: ShoppingCart },
  { path: '/factures', label: 'Factures', icon: FileText },
  { path: '/reglements', label: 'Règlements', icon: CreditCard },
  { path: '/livraisons', label: 'Livraisons', icon: Truck },
  { path: '/rapports', label: 'Rapports', icon: BarChart3 },
  { path: '/parametres', label: 'Paramètres', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#2D5016] text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-xl
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <LogoUpload />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-green-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-green-300 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Bienvenue, {user?.prenom}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.photo ? (
                  <img src={user.photo} alt="Profil" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-[#2D5016] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user?.prenom} {user?.nom}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); setProfileModalOpen(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> Mon profil
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/parametres'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" /> Paramètres
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}
