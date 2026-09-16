import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Commande, LigneCommande } from '../data/mockData';
import { formatMontant, formatDate, getStatutCommandeLabel, getStatutCommandeClass, generateId } from '../utils/format';
import { Plus, Search, Eye, Edit2, Trash2, FileText, X, ShoppingCart, ChevronDown } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function Orders() {
  const { clients, produits, commandes, factures, addCommande, updateCommande, deleteCommande, addFacture } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Commande | null>(null);
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [lignes, setLignes] = useState<LigneCommande[]>([]);
  const [notes, setNotes] = useState('');
  const [showProduitSelect, setShowProduitSelect] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; commande: Commande | null }>({ isOpen: false, commande: null });

  const filteredCommandes = commandes.filter(c => {
    const matchSearch = `${c.numero} ${c.nomClient}`.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const openCreate = () => {
    setSelectedClientId('');
    setLignes([]);
    setNotes('');
    setEditingCommande(null);
    setShowModal(true);
  };

  const openEdit = (commande: Commande) => {
    setSelectedClientId(commande.clientId);
    setLignes([...commande.lignes]);
    setNotes(commande.notes);
    setEditingCommande(commande);
    setShowModal(true);
  };

  const addLigne = (produitId: string) => {
    const produit = produits.find(p => p.id === produitId);
    if (!produit) return;
    const existing = lignes.find(l => l.produitId === produitId);
    if (existing) {
      setLignes(lignes.map(l => l.produitId === produitId ? { ...l, quantite: l.quantite + 1, total: (l.quantite + 1) * l.prixUnitaire } : l));
    } else {
      setLignes([...lignes, { produitId, nomProduit: produit.nom, quantite: 1, prixUnitaire: produit.prixUnitaire, total: produit.prixUnitaire, unite: produit.unite }]);
    }
    setShowProduitSelect(false);
  };

  const updateQuantite = (index: number, qte: number) => {
    if (qte <= 0) {
      setLignes(lignes.filter((_, i) => i !== index));
    } else {
      setLignes(lignes.map((l, i) => i === index ? { ...l, quantite: qte, total: qte * l.prixUnitaire } : l));
    }
  };

  const montantTotal = lignes.reduce((sum, l) => sum + l.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || lignes.length === 0) return;
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    if (editingCommande) {
      updateCommande({ ...editingCommande, clientId: selectedClientId, nomClient: `${client.nom} ${client.prenom}`, lignes, montantTotal, notes, dateModification: new Date().toISOString().split('T')[0] });
    } else {
      const newCmd: Commande = {
        id: generateId(),
        numero: `CMD-2024-${String(commandes.length + 1).padStart(3, '0')}`,
        clientId: selectedClientId,
        nomClient: `${client.nom} ${client.prenom}`,
        lignes,
        montantTotal,
        statut: 'en_cours',
        dateCreation: new Date().toISOString().split('T')[0],
        dateModification: new Date().toISOString().split('T')[0],
        notes,
      };
      addCommande(newCmd);
    }
    setShowModal(false);
  };

  const changeStatut = (commande: Commande, newStatut: Commande['statut']) => {
    updateCommande({ ...commande, statut: newStatut, dateModification: new Date().toISOString().split('T')[0] });
  };

  const requestDelete = (commande: Commande) => {
    setConfirmDelete({ isOpen: true, commande });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.commande) {
      deleteCommande(confirmDelete.commande.id);
    }
    setConfirmDelete({ isOpen: false, commande: null });
  };

  const handleCommander = (commande: Commande) => {
    // Vérifier si une facture existe déjà pour cette commande
    const factureExistante = factures.find(f => f.commandeId === commande.id);
    
    if (factureExistante) {
      alert(`Une facture existe déjà pour cette commande : ${factureExistante.numero}`);
      return;
    }

    // Créer automatiquement la facture
    const client = clients.find(c => c.id === commande.clientId);
    if (!client) return;

    const newFacture = {
      id: generateId(),
      numero: `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`,
      commandeId: commande.id,
      numeroCommande: commande.numero,
      clientId: client.id,
      nomClient: `${client.nom} ${client.prenom}`,
      montantTotal: commande.montantTotal,
      montantPaye: 0,
      statutPaiement: 'non_paye' as const,
      dateCreation: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    addFacture(newFacture);
    
    // Mettre à jour le statut de la commande à "validée"
    updateCommande({ 
      ...commande, 
      statut: 'validee', 
      dateModification: new Date().toISOString().split('T')[0] 
    });

    alert(`Facture ${newFacture.numero} créée avec succès pour la commande ${commande.numero}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Commandes</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{commandes.length} commandes au total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle commande
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une commande..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
            <option value="">Tous les statuts</option>
            <option value="en_cours">En cours</option>
            <option value="validee">Validée</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredCommandes.map(cmd => (
          <div key={cmd.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{cmd.numero}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutCommandeClass(cmd.statut)}`}>
                      {getStatutCommandeLabel(cmd.statut)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{cmd.nomClient} • {formatDate(cmd.dateCreation)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cmd.lignes.length} produit(s)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-[#2D5016]">{formatMontant(cmd.montantTotal)}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowDetail(cmd)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Voir">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(cmd)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Modifier">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => requestDelete(cmd)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {/* Change status dropdown */}
                  <div className="relative group">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Changer statut">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                      {(['en_cours', 'validee', 'livree', 'annulee'] as const).map(statut => (
                        <button key={statut} onClick={() => changeStatut(cmd, statut)} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700">
                          {getStatutCommandeLabel(statut)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Bouton Commander - Plus visible */}
                {cmd.statut === 'en_cours' && !factures.find(f => f.commandeId === cmd.id) && (
                  <button 
                    onClick={() => handleCommander(cmd)} 
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    title="Créer une facture pour cette commande"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Commander</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCommandes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingCommande ? `Modifier ${editingCommande.numero}` : 'Nouvelle commande'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Client selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required>
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nom} {c.prenom} ({c.type})</option>
                  ))}
                </select>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Produits *</label>
                  <button type="button" onClick={() => setShowProduitSelect(!showProduitSelect)} className="text-sm text-[#2D5016] font-medium hover:underline">
                    + Ajouter un produit
                  </button>
                </div>

                {showProduitSelect && (
                  <div className="mb-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {produits.map(p => (
                      <button key={p.id} type="button" onClick={() => addLigne(p.id)} className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 border-b border-gray-50 last:border-0 flex justify-between">
                        <span>{p.nom}</span>
                        <span className="text-gray-500">{formatMontant(p.prixUnitaire)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {lignes.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Produit</th>
                          <th className="text-center px-3 py-2 font-medium text-gray-600 w-20">Qté</th>
                          <th className="text-center px-3 py-2 font-medium text-gray-600 w-28">Unité</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lignes.map((ligne, index) => (
                          <tr key={index} className="border-t border-gray-50">
                            <td className="px-3 py-2 text-gray-800">{ligne.nomProduit}</td>
                            <td className="px-3 py-2 text-center">
                              <input 
                                type="number" 
                                value={ligne.quantite || ''} 
                                onChange={(e) => updateQuantite(index, Number(e.target.value))} 
                                className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm" 
                                min="0"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <select 
                                value={ligne.unite} 
                                onChange={(e) => {
                                  const newUnite = e.target.value as 'L' | 'CL' | 'bouteille';
                                  setLignes(lignes.map((l, i) => i === index ? { ...l, unite: newUnite } : l));
                                }}
                                className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                              >
                                <option value="bouteille">Bouteille</option>
                                <option value="L">Litre (L)</option>
                                <option value="CL">Centilitre (CL)</option>
                              </select>
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800">{formatMontant(ligne.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="bg-green-50 px-3 py-2 text-right">
                      <span className="text-sm font-medium text-gray-600">Total: </span>
                      <span className="text-lg font-bold text-[#2D5016]">{formatMontant(montantTotal)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Aucun produit ajouté</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none resize-none" placeholder="Notes optionnelles..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={!selectedClientId || lignes.length === 0} className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {editingCommande ? 'Modifier' : 'Créer la commande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{showDetail.numero}</h2>
                <p className="text-sm text-gray-500">{showDetail.nomClient}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatutCommandeClass(showDetail.statut)}`}>
                  {getStatutCommandeLabel(showDetail.statut)}
                </span>
                <span className="text-sm text-gray-500">Créée le {formatDate(showDetail.dateCreation)}</span>
              </div>

              {/* Lignes */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">Produit</th>
                      <th className="text-center px-3 py-2 font-medium text-gray-600">Qté</th>
                      <th className="text-center px-3 py-2 font-medium text-gray-600">Unité</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">P.U.</th>
                      <th className="text-right px-3 py-2 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showDetail.lignes.map((ligne, index) => (
                      <tr key={index} className="border-t border-gray-50">
                        <td className="px-3 py-2 text-gray-800">{ligne.nomProduit}</td>
                        <td className="px-3 py-2 text-center text-gray-600">{ligne.quantite}</td>
                        <td className="px-3 py-2 text-center text-gray-600">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                            {ligne.unite === 'bouteille' ? 'Bouteille' : ligne.unite}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatMontant(ligne.prixUnitaire)}</td>
                        <td className="px-3 py-2 text-right font-medium text-gray-800">{formatMontant(ligne.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-green-50 px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total commande</span>
                  <span className="text-xl font-bold text-[#2D5016]">{formatMontant(showDetail.montantTotal)}</span>
                </div>
              </div>

              {showDetail.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{showDetail.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Supprimer cette commande ?"
        message={`Êtes-vous sûr de vouloir supprimer la commande "${confirmDelete.commande?.numero}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, commande: null })}
        type="danger"
      />
    </div>
  );
}
