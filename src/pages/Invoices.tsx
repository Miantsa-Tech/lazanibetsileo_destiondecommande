import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMontant, formatDate, getStatutPaiementLabel, getStatutPaiementClass } from '../utils/format';
import { Eye, X, FileText, Download, Printer } from 'lucide-react';
import { generateInvoicePDF, printInvoice } from '../utils/invoiceUtils';

export default function Invoices() {
  const { factures, commandes, companyLogo } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filteredFactures = factures.filter(f => {
    const matchSearch = `${f.numero} ${f.nomClient}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || f.statutPaiement === filterStatut;
    return matchSearch && matchStatut;
  });

  const selectedFacture = factures.find(f => f.id === showDetail);
  const selectedCommande = selectedFacture ? commandes.find(c => c.id === selectedFacture.commandeId) : null;

  const totalPaye = factures.reduce((sum, f) => sum + f.montantPaye, 0);
  const totalDu = factures.reduce((sum, f) => sum + (f.montantTotal - f.montantPaye), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Factures</h1>
        <p className="text-sm text-gray-500 mt-1">{factures.length} factures émises</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total facturé</p>
          <p className="text-xl font-bold text-gray-800">{formatMontant(factures.reduce((s, f) => s + f.montantTotal, 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total payé</p>
          <p className="text-xl font-bold text-green-600">{formatMontant(totalPaye)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Reste à payer</p>
          <p className="text-xl font-bold text-red-600">{formatMontant(totalDu)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une facture..." className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
            <option value="">Tous les statuts</option>
            <option value="non_paye">Non payé</option>
            <option value="partiel">Partiel</option>
            <option value="paye">Payé</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Facture</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Commande</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Échéance</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFactures.map(facture => (
                <tr key={facture.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">{facture.numero}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{facture.numeroCommande}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{facture.nomClient}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-bold text-gray-800">{formatMontant(facture.montantTotal)}</p>
                    {facture.montantPaye > 0 && facture.montantPaye < facture.montantTotal && (
                      <p className="text-xs text-green-600">Payé: {formatMontant(facture.montantPaye)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutPaiementClass(facture.statutPaiement)}`}>
                      {getStatutPaiementLabel(facture.statutPaiement)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatDate(facture.dateEcheance)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowDetail(facture.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const cmd = commandes.find(c => c.id === facture.commandeId);
                          generateInvoicePDF(facture, cmd, companyLogo);
                        }}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const cmd = commandes.find(c => c.id === facture.commandeId);
                          printInvoice(facture, cmd, companyLogo);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
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
      </div>

      {/* Detail Modal */}
      {showDetail && selectedFacture && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedFacture.numero}</h2>
                <p className="text-sm text-gray-500">Facture liée à {selectedFacture.numeroCommande}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Invoice header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-[#2D5016]">Lazan'iBetsileo</h3>
                  <p className="text-xs text-gray-500">Région Betsileo, Madagascar</p>
                  <p className="text-xs text-gray-500">Tél: +261 20 75 000 00</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatutPaiementClass(selectedFacture.statutPaiement)}`}>
                    {getStatutPaiementLabel(selectedFacture.statutPaiement)}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Date: {formatDate(selectedFacture.dateCreation)}</p>
                  <p className="text-xs text-gray-500">Échéance: {formatDate(selectedFacture.dateEcheance)}</p>
                </div>
              </div>

              {/* Client info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Facturé à</p>
                <p className="font-medium text-gray-800">{selectedFacture.nomClient}</p>
              </div>

              {/* Lines */}
              {selectedCommande && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-gray-600">Désignation</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-600">Qté</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600">P.U.</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCommande.lignes.map((ligne, index) => (
                        <tr key={index} className="border-t border-gray-50">
                          <td className="px-3 py-2 text-gray-800">{ligne.nomProduit}</td>
                          <td className="px-3 py-2 text-center text-gray-600">{ligne.quantite}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{formatMontant(ligne.prixUnitaire)}</td>
                          <td className="px-3 py-2 text-right font-medium text-gray-800">{formatMontant(ligne.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total HT</span>
                  <span className="font-medium">{formatMontant(selectedFacture.montantTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (0%)</span>
                  <span className="font-medium">{formatMontant(0)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                  <span className="font-bold text-gray-800">Total TTC</span>
                  <span className="text-lg font-bold text-[#2D5016]">{formatMontant(selectedFacture.montantTotal)}</span>
                </div>
                {selectedFacture.montantPaye > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Montant payé</span>
                    <span className="font-medium text-green-600">{formatMontant(selectedFacture.montantPaye)}</span>
                  </div>
                )}
                {selectedFacture.montantTotal - selectedFacture.montantPaye > 0 && (
                  <div className="flex justify-between text-sm bg-red-50 rounded-lg p-2">
                    <span className="text-red-700 font-medium">Reste à payer</span>
                    <span className="font-bold text-red-700">{formatMontant(selectedFacture.montantTotal - selectedFacture.montantPaye)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
