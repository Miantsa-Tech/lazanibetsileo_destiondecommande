import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { Client } from '../data/mockData';
import { formatMontant, formatDate, getTypeClientLabel, getTypeClientClass, generateId } from '../utils/format';
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, UserPlus } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '', ville: '', type: 'particulier' as Client['type'] });
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; client: Client | null }>({ isOpen: false, client: null });

  const filteredClients = clients.filter(c => {
    const matchSearch = `${c.nom} ${c.prenom} ${c.email} ${c.ville}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || c.type === filterType;
    return matchSearch && matchType;
  });

  const openCreate = () => {
    setForm({ nom: '', prenom: '', email: '', telephone: '', adresse: '', ville: '', type: 'particulier' });
    setEditingClient(null);
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setForm({ nom: client.nom, prenom: client.prenom, email: client.email, telephone: client.telephone, adresse: client.adresse, ville: client.ville, type: client.type });
    setEditingClient(client);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nomComplet = `${form.nom} ${form.prenom}`.trim();
    if (editingClient) {
      updateClient({ ...editingClient, ...form });
      toast.success('Client modifié', `Le client "${nomComplet}" a été modifié avec succès.`);
    } else {
      addClient({
        id: generateId(),
        ...form,
        dateCreation: new Date().toISOString().split('T')[0],
        chiffreAffaires: 0,
        actif: true,
      });
      toast.success('Client ajouté', `Le client "${nomComplet}" a été ajouté avec succès.`);
    }
    setShowModal(false);
  };

  const requestDelete = (client: Client) => {
    setConfirmDelete({ isOpen: true, client });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.client) {
      const nomClient = `${confirmDelete.client.nom} ${confirmDelete.client.prenom}`.trim();
      deleteClient(confirmDelete.client.id);
      toast.success('Client supprimé', `Le client "${nomClient}" a été supprimé avec succès.`);
    }
    setConfirmDelete({ isOpen: false, client: null });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{clients.length} clients enregistrés</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] focus:border-[#2D5016] outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
          >
            <option value="">Tous les types</option>
            <option value="particulier">Particulier</option>
            <option value="entreprise">Entreprise</option>
            <option value="vip">VIP</option>
            <option value="grossiste">Grossiste</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Ville</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">CA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#2D5016] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {client.nom[0]}{client.prenom?.[0] || ''}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{client.nom} {client.prenom}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTypeClientClass(client.type)}`}>
                      {getTypeClientLabel(client.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{client.ville}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 hidden sm:table-cell">{formatMontant(client.chiffreAffaires)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatDate(client.dateCreation)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowDetail(client)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Voir">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(client)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Modifier">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => requestDelete(client)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingClient ? 'Modifier le client' : 'Nouveau client'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input type="text" value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input type="tel" value={form.telephone} onChange={(e) => setForm({...form, telephone: e.target.value})} placeholder="+261 XX XX XXX XX" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input type="text" value={form.adresse} onChange={(e) => setForm({...form, adresse: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input type="text" value={form.ville} onChange={(e) => setForm({...form, ville: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value as Client['type']})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                    <option value="particulier">Particulier</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="vip">VIP</option>
                    <option value="grossiste">Grossiste</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
                  {editingClient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Détails du client</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#2D5016] rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {showDetail.nom[0]}{showDetail.prenom?.[0] || ''}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{showDetail.nom} {showDetail.prenom}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getTypeClientClass(showDetail.type)}`}>
                    {getTypeClientLabel(showDetail.type)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{showDetail.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-800">{showDetail.telephone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ville</p>
                  <p className="font-medium text-gray-800">{showDetail.ville}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date d'inscription</p>
                  <p className="font-medium text-gray-800">{formatDate(showDetail.dateCreation)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-800">{showDetail.adresse}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">Chiffre d'affaires total</p>
                <p className="text-xl font-bold text-green-800">{formatMontant(showDetail.chiffreAffaires)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Supprimer ce client ?"
        message={`Êtes-vous sûr de vouloir supprimer le client "${confirmDelete.client?.nom} ${confirmDelete.client?.prenom}" ? Cette action est irréversible et supprimera toutes les données associées.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, client: null })}
        type="danger"
      />
    </div>
  );
}
