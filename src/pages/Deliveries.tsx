import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Livraison } from '../data/mockData';
import { formatDate, getStatutLivraisonLabel, getStatutLivraisonClass, generateId } from '../utils/format';
import { Plus, Search, Eye, X, Truck, MapPin, User } from 'lucide-react';

export default function Deliveries() {
  const { clients, commandes, livraisons, addLivraison, updateLivraison } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Livraison | null>(null);
  const [form, setForm] = useState({ commandeId: '', adresseLivraison: '', datePlanifiee: '', livreur: '', notes: '' });

  const filteredLivraisons = livraisons.filter(l => {
    const matchSearch = `${l.numero} ${l.nomClient} ${l.adresseLivraison}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || l.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const openCreate = () => {
    setForm({ commandeId: '', adresseLivraison: '', datePlanifiee: '', livreur: '', notes: '' });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commande = commandes.find(c => c.id === form.commandeId);
    if (!commande) return;

    addLivraison({
      id: generateId(),
      numero: `LIV-2024-${String(livraisons.length + 1).padStart(3, '0')}`,
      commandeId: form.commandeId,
      numeroCommande: commande.numero,
      clientId: commande.clientId,
      nomClient: commande.nomClient,
      adresseLivraison: form.adresseLivraison,
      statut: 'en_attente',
      datePlanifiee: form.datePlanifiee,
      dateLivraison: null,
      livreur: form.livreur,
      notes: form.notes,
    });
    setShowModal(false);
  };

  const changeStatut = (livraison: Livraison, newStatut: Livraison['statut']) => {
    updateLivraison({
      ...livraison,
      statut: newStatut,
      dateLivraison: newStatut === 'livree' ? new Date().toISOString().split('T')[0] : livraison.dateLivraison,
    });
  };

  const commandesEligibles = commandes.filter(c => c.statut === 'validee' || c.statut === 'en_cours');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Livraisons</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{livraisons.length} livraisons planifiées</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Planifier une livraison
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">En attente</p>
          <p className="text-xl font-bold text-gray-800">{livraisons.filter(l => l.statut === 'en_attente').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">En cours</p>
          <p className="text-xl font-bold text-blue-600">{livraisons.filter(l => l.statut === 'en_cours').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Livrées</p>
          <p className="text-xl font-bold text-green-600">{livraisons.filter(l => l.statut === 'livree').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Annulées</p>
          <p className="text-xl font-bold text-red-600">{livraisons.filter(l => l.statut === 'annulee').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une livraison..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3">
        {filteredLivraisons.map(livraison => (
          <div key={livraison.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${livraison.statut === 'livree' ? 'bg-green-100' : livraison.statut === 'en_cours' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Truck className={`w-5 h-5 ${livraison.statut === 'livree' ? 'text-green-600' : livraison.statut === 'en_cours' ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{livraison.numero}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutLivraisonClass(livraison.statut)}`}>
                      {getStatutLivraisonLabel(livraison.statut)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{livraison.nomClient} • {livraison.numeroCommande}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{livraison.adresseLivraison}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">Prévue: {formatDate(livraison.datePlanifiee)}</span>
                    {livraison.livreur && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <User className="w-3 h-3" /> {livraison.livreur}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowDetail(livraison)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Voir">
                  <Eye className="w-4 h-4" />
                </button>
                {livraison.statut === 'en_attente' && (
                  <button onClick={() => changeStatut(livraison, 'en_cours')} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors">
                    Démarrer
                  </button>
                )}
                {livraison.statut === 'en_cours' && (
                  <button onClick={() => changeStatut(livraison, 'livree')} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors">
                    Marquer livrée
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLivraisons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune livraison trouvée</p>
        </div>
      )}

      {/* Modal Create */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Planifier une livraison</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commande *</label>
                <select value={form.commandeId} onChange={(e) => setForm({...form, commandeId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required>
                  <option value="">Sélectionner une commande</option>
                  {commandesEligibles.map(c => (
                    <option key={c.id} value={c.id}>{c.numero} - {c.nomClient}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                <input type="text" value={form.adresseLivraison} onChange={(e) => setForm({...form, adresseLivraison: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required placeholder="Adresse complète..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date prévue *</label>
                  <input type="date" value={form.datePlanifiee} onChange={(e) => setForm({...form, datePlanifiee: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Livreur</label>
                  <select value={form.livreur} onChange={(e) => setForm({...form, livreur: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                    <option value="">Non assigné</option>
                    <option value="Tahina">Tahina</option>
                    <option value="Fidy">Fidy</option>
                    <option value="Soa">Soa</option>
                  </select>
                </div>
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
                  Planifier
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
              <h2 className="text-lg font-semibold text-gray-800">{showDetail.numero}</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getStatutLivraisonClass(showDetail.statut)}`}>
                  {getStatutLivraisonLabel(showDetail.statut)}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Commande</span>
                  <span className="font-medium text-gray-800">{showDetail.numeroCommande}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-800">{showDetail.nomClient}</span>
                </div>
                <div className="py-2 border-b border-gray-50">
                  <span className="text-gray-500 block mb-1">Adresse de livraison</span>
                  <span className="font-medium text-gray-800">{showDetail.adresseLivraison}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Date prévue</span>
                  <span className="font-medium text-gray-800">{formatDate(showDetail.datePlanifiee)}</span>
                </div>
                {showDetail.dateLivraison && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Date de livraison</span>
                    <span className="font-medium text-green-600">{formatDate(showDetail.dateLivraison)}</span>
                  </div>
                )}
                {showDetail.livreur && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Livreur</span>
                    <span className="font-medium text-gray-800">{showDetail.livreur}</span>
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
