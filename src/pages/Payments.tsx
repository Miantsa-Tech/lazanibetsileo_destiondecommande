import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reglement } from '../data/mockData';
import { formatMontant, formatDate, getTypeReglementLabel, getTypeReglementClass, generateId } from '../utils/format';
import { Plus, Search, Eye, X, CreditCard, Receipt } from 'lucide-react';

export default function Payments() {
  const { clients, factures, reglements, addReglement } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Reglement | null>(null);
  const [form, setForm] = useState({ factureId: '', clientId: '', montant: 0, typeReglement: 'especes' as Reglement['typeReglement'], reference: '', notes: '' });

  const filteredReglements = reglements.filter(r => {
    const matchSearch = `${r.numero} ${r.nomClient} ${r.reference}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || r.typeReglement === filterType;
    return matchSearch && matchType;
  });

  const totalReglements = reglements.reduce((sum, r) => sum + r.montant, 0);

  const openCreate = () => {
    setForm({ factureId: '', clientId: '', montant: 0, typeReglement: 'especes', reference: '', notes: '' });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facture = factures.find(f => f.id === form.factureId);
    const client = clients.find(c => c.id === form.clientId);
    if (!facture || !client) return;

    addReglement({
      id: generateId(),
      numero: `REG-2024-${String(reglements.length + 1).padStart(3, '0')}`,
      factureId: form.factureId,
      numeroFacture: facture.numero,
      clientId: form.clientId,
      nomClient: `${client.nom} ${client.prenom}`,
      montant: form.montant,
      typeReglement: form.typeReglement,
      dateReglement: new Date().toISOString().split('T')[0],
      reference: form.reference,
      notes: form.notes,
    });
    setShowModal(false);
  };

  const handleFactureChange = (factureId: string) => {
    const facture = factures.find(f => f.id === factureId);
    if (facture) {
      setForm({ ...form, factureId, clientId: facture.clientId, montant: facture.montantTotal - facture.montantPaye });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Règlements</h1>
          <p className="text-sm text-gray-500 mt-1">{reglements.length} règlements enregistrés</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nouveau règlement
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Total des règlements</p>
          <p className="text-xl font-bold text-green-600">{formatMontant(totalReglements)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Nombre de transactions</p>
          <p className="text-xl font-bold text-gray-800">{reglements.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un règlement..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
            <option value="">Tous les types</option>
            <option value="especes">Espèces</option>
            <option value="cheque">Chèque</option>
            <option value="cb">Carte Bancaire</option>
            <option value="virement">Virement</option>
            <option value="mvola">MVola</option>
            <option value="orange_money">Orange Money</option>
            <option value="airtel_money">Airtel Money</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">N°</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Facture</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Montant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReglements.map(reglement => (
                <tr key={reglement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-800">{reglement.numero}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{reglement.numeroFacture}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{reglement.nomClient}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTypeReglementClass(reglement.typeReglement)}`}>
                      {getTypeReglementLabel(reglement.typeReglement)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-green-700">{formatMontant(reglement.montant)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatDate(reglement.dateReglement)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowDetail(reglement)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Nouveau règlement</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facture *</label>
                <select value={form.factureId} onChange={(e) => handleFactureChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required>
                  <option value="">Sélectionner une facture</option>
                  {factures.filter(f => f.statutPaiement !== 'paye').map(f => (
                    <option key={f.id} value={f.id}>{f.numero} - {f.nomClient} (Reste: {formatMontant(f.montantTotal - f.montantPaye)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (Ar) *</label>
                <input type="number" value={form.montant} onChange={(e) => setForm({...form, montant: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" min="0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de règlement *</label>
                <select value={form.typeReglement} onChange={(e) => setForm({...form, typeReglement: e.target.value as Reglement['typeReglement']})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                  <option value="especes">Espèces</option>
                  <option value="cheque">Chèque</option>
                  <option value="cb">Carte Bancaire</option>
                  <option value="virement">Virement</option>
                  <option value="mvola">MVola</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="airtel_money">Airtel Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                <input type="text" value={form.reference} onChange={(e) => setForm({...form, reference: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" placeholder="N° chèque, référence virement..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Détails du règlement</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-xl font-bold text-gray-800">{formatMontant(showDetail.montant)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeReglementClass(showDetail.typeReglement)}`}>
                  {getTypeReglementLabel(showDetail.typeReglement)}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">N° Règlement</span>
                  <span className="font-medium text-gray-800">{showDetail.numero}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Facture</span>
                  <span className="font-medium text-gray-800">{showDetail.numeroFacture}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-800">{showDetail.nomClient}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-800">{formatDate(showDetail.dateReglement)}</span>
                </div>
                {showDetail.reference && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-medium text-gray-800">{showDetail.reference}</span>
                  </div>
                )}
                {showDetail.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">{showDetail.notes}</p>
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
