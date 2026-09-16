import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, User, Bell, Shield, Globe, Database, Leaf } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-[#2D5016]" />
              <h2 className="text-lg font-semibold text-gray-800">Profil utilisateur</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input type="text" defaultValue={user?.prenom || 'Admin'} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" defaultValue={user?.nom || 'Lazan\'iBetsileo'} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue={user?.email || 'admin@lazanimbetsileo.mg'} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <input type="text" defaultValue="Administrateur" disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
              Enregistrer les modifications
            </button>
          </div>

          {/* Entreprise */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-5 h-5 text-[#2D5016]" />
              <h2 className="text-lg font-semibold text-gray-800">Informations de l'entreprise</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                <input type="text" defaultValue="Lazan'iBetsileo" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIF / STAT</label>
                <input type="text" defaultValue="123 456 789 012" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" defaultValue="+261 20 75 000 00" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue="contact@lazanimbetsileo.mg" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input type="text" defaultValue="Rue principale, Fianarantsoa, Région Betsileo, Madagascar" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
              Enregistrer
            </button>
          </div>

          {/* Sécurité */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#2D5016]" />
              <h2 className="text-lg font-semibold text-gray-800">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="2fa" className="w-4 h-4 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016]" />
                <label htmlFor="2fa" className="text-sm text-gray-700">Activer la double authentification (2FA)</label>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#2D5016]" />
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Alertes stock faible</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016]" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Nouvelles commandes</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016]" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Factures impayées</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016]" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Rapports hebdomadaires</span>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#2D5016] focus:ring-[#2D5016]" />
              </label>
            </div>
          </div>

          {/* Préférences */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#2D5016]" />
              <h3 className="font-semibold text-gray-800">Préférences</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                  <option>Français</option>
                  <option>Malagasy</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                  <option>Ariary (MGA)</option>
                  <option>Euro (EUR)</option>
                  <option>Dollar (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                  <option>Indian/Antananarivo (UTC+3)</option>
                  <option>Europe/Paris (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Système */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#2D5016]" />
              <h3 className="font-semibold text-gray-800">Système</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Version</span>
                <span className="font-medium text-gray-800">1.0.0</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Dernière MAJ</span>
                <span className="font-medium text-gray-800">15/08/2024</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">Base de données</span>
                <span className="font-medium text-green-600">Connectée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
