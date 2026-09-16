import React from 'react';
import { useApp } from '../context/AppContext';
import { formatMontant, getStatutCommandeLabel, getStatutCommandeClass } from '../utils/format';
import { ventesParMois, topClients, topProduits } from '../data/mockData';
import {
  TrendingUp, ShoppingCart, Users, AlertTriangle,
  FileText, CreditCard, ArrowUpRight, ArrowDownRight, Package
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';

const COLORS = ['#2D5016', '#E67E22', '#C0392B', '#3498DB', '#9B59B6'];

export default function Dashboard() {
  const { clients, produits, commandes, factures, reglements, livraisons } = useApp();

  // Calcul des KPIs
  const totalCA = commandes.filter(c => c.statut !== 'annulee').reduce((sum, c) => sum + c.montantTotal, 0);
  const commandesEnCours = commandes.filter(c => c.statut === 'en_cours').length;
  const commandesValidees = commandes.filter(c => c.statut === 'validee').length;
  const facturesImpayees = factures.filter(f => f.statutPaiement === 'non_paye' || f.statutPaiement === 'partiel');
  const totalImpaye = facturesImpayees.reduce((sum, f) => sum + (f.montantTotal - f.montantPaye), 0);
  const stockFaible = produits.filter(p => p.stock <= 10);
  const livraisonsEnCours = livraisons.filter(l => l.statut === 'en_cours' || l.statut === 'en_attente').length;

  // Statut des commandes pour le pie chart
  const statutData = [
    { name: 'En cours', value: commandes.filter(c => c.statut === 'en_cours').length },
    { name: 'Validées', value: commandes.filter(c => c.statut === 'validee').length },
    { name: 'Livrées', value: commandes.filter(c => c.statut === 'livree').length },
    { name: 'Annulées', value: commandes.filter(c => c.statut === 'annulee').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Tableau de bord</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Vue d'ensemble de votre activité commerciale</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{formatMontant(totalCA)}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Chiffre d'affaires total</p>
        </div>

        {/* Commandes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              {commandesEnCours} en cours
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{commandes.length}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Total commandes</p>
        </div>

        {/* Clients */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +3
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{clients.length}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Clients actifs</p>
        </div>

        {/* Impayés */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> {facturesImpayees.length} factures
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{formatMontant(totalImpaye)}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Montant impayé</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des ventes */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Évolution des ventes</h3>
              <p className="text-xs text-gray-500">Chiffre d'affaires mensuel</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventesParMois}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D5016" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2D5016" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value: number) => [formatMontant(value), 'Ventes']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="#2D5016" strokeWidth={2} fill="url(#colorVentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des commandes */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Statut des commandes</h3>
          <p className="text-xs text-gray-500 mb-4">Répartition actuelle</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {statutData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {statutData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Top 5 Clients</h3>
              <p className="text-xs text-gray-500">Par chiffre d'affaires</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div key={client.nom} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-[#2D5016] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{client.nom}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-[#2D5016] h-1.5 rounded-full"
                      style={{ width: `${(client.ca / topClients[0].ca) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{formatMontant(client.ca)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="space-y-4">
          {/* Stock faible */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-800">Alertes stock</h3>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                {stockFaible.length} alertes
              </span>
            </div>
            {stockFaible.length > 0 ? (
              <div className="space-y-2">
                {stockFaible.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{p.nom}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-red-600">{p.stock} unités</span>
                      <span className="text-xs text-gray-400 ml-1">/ min 10</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune alerte de stock</p>
            )}
          </div>

          {/* Dernières commandes */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Dernières commandes</h3>
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              {commandes.slice(-4).reverse().map(cmd => (
                <div key={cmd.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{cmd.numero}</p>
                    <p className="text-xs text-gray-500">{cmd.nomClient}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutCommandeClass(cmd.statut)}`}>
                      {getStatutCommandeLabel(cmd.statut)}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">{formatMontant(cmd.montantTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Produits */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-800">Top 5 Produits les plus vendus</h3>
            <p className="text-xs text-gray-500">Quantités vendues cette période</p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProduits} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="nom" tick={{ fontSize: 11 }} stroke="#9CA3AF" width={160} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="quantite" fill="#E67E22" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
