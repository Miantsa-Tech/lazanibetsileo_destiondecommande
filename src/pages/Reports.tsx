import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMontant, formatDate, getTypeClientLabel } from '../utils/format';
import { ventesParMois, topClients, topProduits } from '../data/mockData';
import { BarChart3, Download, TrendingUp, Users, Package, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#2D5016', '#E67E22', '#C0392B', '#3498DB', '#9B59B6', '#1ABC9C'];

export default function Reports() {
  const { clients, commandes, factures, reglements, produits } = useApp();
  const [period, setPeriod] = useState('mois');
  const [reportType, setReportType] = useState('ventes');

  // Données par type de client
  const parTypeClient = [
    { name: 'Particulier', value: clients.filter(c => c.type === 'particulier').length, ca: clients.filter(c => c.type === 'particulier').reduce((s, c) => s + c.chiffreAffaires, 0) },
    { name: 'Entreprise', value: clients.filter(c => c.type === 'entreprise').length, ca: clients.filter(c => c.type === 'entreprise').reduce((s, c) => s + c.chiffreAffaires, 0) },
    { name: 'VIP', value: clients.filter(c => c.type === 'vip').length, ca: clients.filter(c => c.type === 'vip').reduce((s, c) => s + c.chiffreAffaires, 0) },
    { name: 'Grossiste', value: clients.filter(c => c.type === 'grossiste').length, ca: clients.filter(c => c.type === 'grossiste').reduce((s, c) => s + c.chiffreAffaires, 0) },
  ];

  // Données stock par produit
  const stockParProduit = produits.map(p => ({
    name: p.nom.length > 20 ? p.nom.substring(0, 20) + '...' : p.nom,
    stock: p.stock,
  }));

  // Règlements par type
  const reglementsParType = [
    { name: 'Espèces', value: reglements.filter(r => r.typeReglement === 'especes').reduce((s, r) => s + r.montant, 0) },
    { name: 'Chèque', value: reglements.filter(r => r.typeReglement === 'cheque').reduce((s, r) => s + r.montant, 0) },
    { name: 'Virement', value: reglements.filter(r => r.typeReglement === 'virement').reduce((s, r) => s + r.montant, 0) },
    { name: 'MVola', value: reglements.filter(r => r.typeReglement === 'mvola').reduce((s, r) => s + r.montant, 0) },
    { name: 'Orange Money', value: reglements.filter(r => r.typeReglement === 'orange_money').reduce((s, r) => s + r.montant, 0) },
  ].filter(d => d.value > 0);

  const totalCA = commandes.filter(c => c.statut !== 'annulee').reduce((sum, c) => sum + c.montantTotal, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Rapports & Statistiques</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Analyses détaillées de votre activité</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Cette année</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'ventes', label: 'Ventes', icon: TrendingUp },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'produits', label: 'Produits', icon: Package },
          { id: 'paiements', label: 'Paiements', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              reportType === tab.id ? 'bg-[#2D5016] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {reportType === 'ventes' && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Chiffre d'affaires total</p>
              <p className="text-2xl font-bold text-[#2D5016]">{formatMontant(totalCA)}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Nombre de commandes</p>
              <p className="text-2xl font-bold text-gray-800">{commandes.filter(c => c.statut !== 'annulee').length}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500">Panier moyen</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatMontant(Math.round(totalCA / Math.max(commandes.filter(c => c.statut !== 'annulee').length, 1)))}
              </p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Évolution des ventes mensuelles</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventesParMois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: number) => [formatMontant(value), 'Ventes']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Line type="monotone" dataKey="ventes" stroke="#2D5016" strokeWidth={2} dot={{ r: 4 }} name="Ventes (Ar)" />
                  <Line type="monotone" dataKey="commandes" stroke="#E67E22" strokeWidth={2} dot={{ r: 4 }} name="Nb. Commandes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Top 5 des produits les plus vendus</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProduits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nom" tick={{ fontSize: 10 }} stroke="#9CA3AF" angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="quantite" fill="#E67E22" radius={[4, 4, 0, 0]} name="Quantité vendue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportType === 'clients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clients par type */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Répartition par type de client</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={parTypeClient} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {parTypeClient.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CA par type */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">CA par type de client</h3>
              <div className="space-y-3">
                {parTypeClient.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium text-gray-800">{formatMontant(item.ca)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${(item.ca / Math.max(...parTypeClient.map(p => p.ca))) * 100}%`, backgroundColor: COLORS[index % COLORS.length] }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top clients table */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Top 5 des clients par chiffre d'affaires</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">#</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Client</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Chiffre d'affaires</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Part</th>
                  </tr>
                </thead>
                <tbody>
                  {topClients.map((client, index) => (
                    <tr key={client.nom} className="border-t border-gray-50">
                      <td className="px-3 py-2">
                        <span className="w-6 h-6 bg-[#2D5016] text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-800">{client.nom}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-800">{formatMontant(client.ca)}</td>
                      <td className="px-3 py-2 text-right text-gray-500">{((client.ca / totalCA) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'produits' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Stock par produit</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockParProduit}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#9CA3AF" angle={-20} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="stock" fill="#2D5016" radius={[4, 4, 0, 0]} name="Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Products list */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">État du stock</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Produit</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Prix unitaire</th>
                    <th className="text-right px-3 py-2 font-medium text-gray-600">Stock</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">État</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map(produit => {
                    const isLow = produit.stock <= 10;
                    return (
                      <tr key={produit.id} className="border-t border-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">{produit.nom}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatMontant(produit.prixUnitaire)}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-800">{produit.stock}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {isLow ? 'Faible' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'paiements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paiements par type */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Répartition des paiements</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reglementsParType} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name} labelLine={false}>
                      {reglementsParType.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatMontant(value)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {reglementsParType.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-800">{formatMontant(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Résumé des paiements</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-green-600">Total encaissé</p>
                  <p className="text-2xl font-bold text-green-800">{formatMontant(reglements.reduce((s, r) => s + r.montant, 0))}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-xs text-red-600">Total restant dû</p>
                  <p className="text-2xl font-bold text-red-800">
                    {formatMontant(factures.reduce((s, f) => s + (f.montantTotal - f.montantPaye), 0))}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs text-blue-600">Nombre de transactions</p>
                  <p className="text-2xl font-bold text-blue-800">{reglements.length}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-xs text-purple-600">Factures impayées</p>
                  <p className="text-2xl font-bold text-purple-800">{factures.filter(f => f.statutPaiement !== 'paye').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
