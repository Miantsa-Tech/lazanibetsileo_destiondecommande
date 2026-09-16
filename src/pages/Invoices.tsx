import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Facture } from '../data/mockData';
import { formatMontant, formatDate, getStatutPaiementLabel, getStatutPaiementClass, generateId } from '../utils/format';
import { Eye, X, FileText, Download, Printer, Plus, Calendar, User, CreditCard, Hash } from 'lucide-react';
import { generateInvoicePDF, printInvoice } from '../utils/invoiceUtils';

export default function Invoices() {
  const location = useLocation();
  const { factures, commandes, clients, addFacture, companyLogo } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFacture, setNewFacture] = useState({
    commandeId: '',
    dateEcheance: '',
  });

  // Ouvrir automatiquement le formulaire si une commande est passée via navigation
  useEffect(() => {
    const state = location.state as { selectedCommandeId?: string } | null;
    if (state?.selectedCommandeId) {
      setNewFacture({
        commandeId: state.selectedCommandeId,
        dateEcheance: '',
      });
      setShowCreateModal(true);
      // Nettoyer le state pour éviter de rouvrir le modal au rafraîchissement
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredFactures = factures.filter(f => {
    const matchSearch = `${f.numero} ${f.nomClient}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || f.statutPaiement === filterStatut;
    return matchSearch && matchStatut;
  });

  const selectedFacture = factures.find(f => f.id === showDetail);
  const selectedCommande = selectedFacture ? commandes.find(c => c.id === selectedFacture.commandeId) : null;

  const totalPaye = factures.reduce((sum, f) => sum + f.montantPaye, 0);
  const totalDu = factures.reduce((sum, f) => sum + (f.montantTotal - f.montantPaye), 0);
  const totalFacture = factures.reduce((sum, f) => sum + f.montantTotal, 0);

  const handleCreateFacture = (e: React.FormEvent) => {
    e.preventDefault();
    const commande = commandes.find(c => c.id === newFacture.commandeId);
    if (!commande) return;

    const client = clients.find(c => c.id === commande.clientId);
    if (!client) return;

    const newFact: Facture = {
      id: generateId(),
      numero: `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`,
      commandeId: commande.id,
      numeroCommande: commande.numero,
      clientId: client.id,
      nomClient: `${client.nom} ${client.prenom}`,
      montantTotal: commande.montantTotal,
      montantPaye: 0,
      statutPaiement: 'non_paye',
      dateCreation: new Date().toISOString().split('T')[0],
      dateEcheance: newFacture.dateEcheance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    addFacture(newFact);
    setShowCreateModal(false);
    setNewFacture({ commandeId: '', dateEcheance: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Factures</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{factures.length} factures émises</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvelle facture
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400">Total facturé</p>
          <p className="text-xl font-bold text-gray-800 dark:text-slate-100">{formatMontant(totalFacture)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400">Total payé</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatMontant(totalPaye)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400">Reste à payer</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatMontant(totalDu)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-slate-400">Factures impayées</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{factures.filter(f => f.statutPaiement !== 'paye').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Rechercher par référence ou client..." 
              className="w-full pl-4 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100"
            />
          </div>
          <select 
            value={filterStatut} 
            onChange={(e) => setFilterStatut(e.target.value)} 
            className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100"
          >
            <option value="">Tous les états</option>
            <option value="non_paye">Non payé</option>
            <option value="partiel">Partiel</option>
            <option value="paye">Payé</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Référence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Client</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">État</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase hidden lg:table-cell">Échéance</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Montant</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
              {filteredFactures.map(facture => (
                <tr key={facture.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-800 dark:text-slate-100">{facture.numero}</span>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{facture.numeroCommande}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      <span className="text-sm text-gray-700 dark:text-slate-200">{facture.nomClient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutPaiementClass(facture.statutPaiement)}`}>
                      {getStatutPaiementLabel(facture.statutPaiement)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400 dark:text-slate-500" />
                      <span className="text-sm text-gray-600 dark:text-slate-300">{formatDate(facture.dateCreation)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-gray-600 dark:text-slate-300">{formatDate(facture.dateEcheance)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{formatMontant(facture.montantTotal)}</p>
                    {facture.montantPaye > 0 && facture.montantPaye < facture.montantTotal && (
                      <p className="text-xs text-green-600 dark:text-green-400">Payé: {formatMontant(facture.montantPaye)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setShowDetail(facture.id)} 
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors" 
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const cmd = commandes.find(c => c.id === facture.commandeId);
                          generateInvoicePDF(facture, cmd, companyLogo);
                        }}
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors" 
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const cmd = commandes.find(c => c.id === facture.commandeId);
                          printInvoice(facture, cmd, companyLogo);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors" 
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFactures.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-slate-400">Aucune facture trouvée</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedFacture && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-3xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Détails de la facture</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">{selectedFacture.numero}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">RÉFÉRENCE</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-slate-100">{selectedFacture.numero}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Commande: {selectedFacture.numeroCommande}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">CLIENT</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-slate-100">{selectedFacture.nomClient}</p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">ÉTAT</p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatutPaiementClass(selectedFacture.statutPaiement)}`}>
                    {getStatutPaiementLabel(selectedFacture.statutPaiement)}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">DATES</p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-200">
                    <span className="font-medium">Émission:</span> {formatDate(selectedFacture.dateCreation)}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-200">
                    <span className="font-medium">Échéance:</span> {formatDate(selectedFacture.dateEcheance)}
                  </p>
                </div>
              </div>

              {/* Liste des produits */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">PRODUITS COMMANDÉS</h3>
                {selectedCommande && (
                  <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-slate-900">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-slate-300">Produit</th>
                          <th className="text-center px-3 py-2 font-medium text-gray-600 dark:text-slate-300">Quantité</th>
                          <th className="text-center px-3 py-2 font-medium text-gray-600 dark:text-slate-300">Unité</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-slate-300">Prix unitaire</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600 dark:text-slate-300">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {selectedCommande.lignes.map((ligne, index) => (
                          <tr key={index} className="bg-white dark:bg-slate-800">
                            <td className="px-3 py-2 text-gray-800 dark:text-slate-100">{ligne.nomProduit}</td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-slate-300">{ligne.quantite}</td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-slate-300">
                              <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs">
                                {ligne.unite === 'bouteille' ? 'Bouteille' : ligne.unite}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-600 dark:text-slate-300">{formatMontant(ligne.prixUnitaire)}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800 dark:text-slate-100">{formatMontant(ligne.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Totaux */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-300">Sous-total HT</span>
                    <span className="font-medium text-gray-800 dark:text-slate-100">{formatMontant(selectedFacture.montantTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-300">TVA (0%)</span>
                    <span className="font-medium text-gray-800 dark:text-slate-100">{formatMontant(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 dark:border-slate-700 pt-2">
                    <span className="font-bold text-gray-800 dark:text-slate-100">Total TTC</span>
                    <span className="text-lg font-bold text-[#2D5016] dark:text-emerald-400">{formatMontant(selectedFacture.montantTotal)}</span>
                  </div>
                  {selectedFacture.montantPaye > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 dark:text-green-400">Montant payé</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{formatMontant(selectedFacture.montantPaye)}</span>
                    </div>
                  )}
                  {selectedFacture.montantTotal - selectedFacture.montantPaye > 0 && (
                    <div className="flex justify-between text-sm bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                      <span className="text-red-700 dark:text-red-400 font-medium">Reste à payer</span>
                      <span className="font-bold text-red-700 dark:text-red-400">{formatMontant(selectedFacture.montantTotal - selectedFacture.montantPaye)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    const cmd = commandes.find(c => c.id === selectedFacture.commandeId);
                    generateInvoicePDF(selectedFacture, cmd, companyLogo);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Télécharger PDF
                </button>
                <button
                  onClick={() => {
                    const cmd = commandes.find(c => c.id === selectedFacture.commandeId);
                    printInvoice(selectedFacture, cmd, companyLogo);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Printer className="w-4 h-4" /> Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Nouvelle facture</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateFacture} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Commande associée *
                </label>
                <select
                  value={newFacture.commandeId}
                  onChange={(e) => setNewFacture({ ...newFacture, commandeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner une commande</option>
                  {commandes
                    .filter(cmd => !factures.some(f => f.commandeId === cmd.id))
                    .map(cmd => (
                      <option key={cmd.id} value={cmd.id}>
                        {cmd.numero} - {cmd.nomClient} - {formatMontant(cmd.montantTotal)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  value={newFacture.dateEcheance}
                  onChange={(e) => setNewFacture({ ...newFacture, dateEcheance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Par défaut: 30 jours après la date d'émission
                </p>
              </div>

              {newFacture.commandeId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Aperçu</p>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Montant: <span className="font-bold">{formatMontant(commandes.find(c => c.id === newFacture.commandeId)?.montantTotal || 0)}</span>
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Client: <span className="font-bold">{clients.find(c => c.id === commandes.find(cmd => cmd.id === newFacture.commandeId)?.clientId)?.nom} {clients.find(c => c.id === commandes.find(cmd => cmd.id === newFacture.commandeId)?.clientId)?.prenom}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
