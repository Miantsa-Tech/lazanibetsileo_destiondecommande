import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Produit } from '../data/mockData';
import { categories } from '../data/mockData';
import { formatMontant, generateId } from '../utils/format';
import { Plus, Search, Edit2, Trash2, Eye, X, Package, AlertTriangle } from 'lucide-react';

export default function Products() {
  const { produits, addProduit, updateProduit, deleteProduit } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Produit | null>(null);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [form, setForm] = useState({ nom: '', description: '', categorieId: 'cat1', prixUnitaire: 0, prixGros: 0, stock: 0, stockMinimum: 5 });

  const filteredProduits = produits.filter(p => {
    const matchSearch = `${p.nom} ${p.description}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.categorieId === filterCat;
    return matchSearch && matchCat && p.actif;
  });

  const openCreate = () => {
    setForm({ nom: '', description: '', categorieId: 'cat1', prixUnitaire: 0, prixGros: 0, stock: 0, stockMinimum: 5 });
    setEditingProduit(null);
    setShowModal(true);
  };

  const openEdit = (produit: Produit) => {
    setForm({ nom: produit.nom, description: produit.description, categorieId: produit.categorieId, prixUnitaire: produit.prixUnitaire, prixGros: produit.prixGros, stock: produit.stock, stockMinimum: produit.stockMinimum });
    setEditingProduit(produit);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduit) {
      updateProduit({ ...editingProduit, ...form });
    } else {
      addProduit({
        id: generateId(),
        ...form,
        image: '',
        actif: true,
        dateCreation: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduit(id);
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.nom || '-';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">{produits.filter(p => p.actif).length} produits actifs</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nouveau produit
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
              placeholder="Rechercher un produit..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] focus:border-[#2D5016] outline-none"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProduits.map(produit => (
          <div key={produit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product image placeholder */}
            <div className="h-32 bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center relative">
              <Package className="w-12 h-12 text-gray-300" />
              {produit.stock <= produit.stockMinimum && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-700 p-1 rounded-full" title="Stock faible">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-gray-600">
                  {getCategoryName(produit.categorieId)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{produit.nom}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{produit.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#2D5016]">{formatMontant(produit.prixUnitaire)}</p>
                  <p className="text-xs text-gray-400">Gros: {formatMontant(produit.prixGros)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${produit.stock <= produit.stockMinimum ? 'text-red-600' : 'text-gray-700'}`}>
                    {produit.stock} unités
                  </p>
                  <p className="text-xs text-gray-400">en stock</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <button onClick={() => setShowDetail(produit)} className="flex-1 p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors flex items-center justify-center" title="Voir">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(produit)} className="flex-1 p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors flex items-center justify-center" title="Modifier">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(produit.id)} className="flex-1 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center justify-center" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProduits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProduit ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input type="text" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={form.categorieId} onChange={(e) => setForm({...form, categorieId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (Ar) *</label>
                  <input type="number" value={form.prixUnitaire} onChange={(e) => setForm({...form, prixUnitaire: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix gros (Ar)</label>
                  <input type="number" value={form.prixGros} onChange={(e) => setForm({...form, prixGros: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock actuel *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum</label>
                  <input type="number" value={form.stockMinimum} onChange={(e) => setForm({...form, stockMinimum: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" min="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors">
                  {editingProduit ? 'Modifier' : 'Créer'}
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
              <h2 className="text-lg font-semibold text-gray-800">Détails du produit</h2>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="h-40 bg-gradient-to-br from-green-50 to-orange-50 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{showDetail.nom}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{getCategoryName(showDetail.categorieId)}</span>
              </div>
              <p className="text-sm text-gray-600">{showDetail.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">Prix unitaire</p>
                  <p className="text-lg font-bold text-green-800">{formatMontant(showDetail.prixUnitaire)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600">Prix gros</p>
                  <p className="text-lg font-bold text-orange-800">{formatMontant(showDetail.prixGros)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-500">Stock actuel</p>
                  <p className={`text-lg font-bold ${showDetail.stock <= showDetail.stockMinimum ? 'text-red-600' : 'text-gray-800'}`}>{showDetail.stock} unités</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Stock minimum</p>
                  <p className="text-lg font-bold text-gray-800">{showDetail.stockMinimum} unités</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
