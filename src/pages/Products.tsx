import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Produit } from '../data/mockData';
import { formatMontant, generateId } from '../utils/format';
import { Plus, Search, Edit2, Trash2, Eye, X, Package, AlertTriangle } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const STOCK_ALERT_THRESHOLD = 10;

// Liste des noms de produits prédéfinis
const PRODUITS_PREDIFINIS = [
  'Vin Rouge',
  'Vin Blanc',
  'Vin Rosé',
  'Vin Gris',
  'Vin Blanc Moelleux',
  'Vin Apéritif',
  'Vin Mousseux',
  'Vin Blanc Spécial',
  'Eau de Vie de Vin',
  'Eau de Vie à la Mandarine',
  'Liqueur à l\'Orange',
];

export default function Products() {
  const { produits, addProduit, updateProduit, deleteProduit } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Produit | null>(null);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const [form, setForm] = useState({ nom: '', description: '', prixUnitaire: '' as string | number, stock: '' as string | number, unite: 'bouteille' as 'L' | 'CL' | 'bouteille', contenance: '' as string | number, image: '' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; produit: Produit | null }>({ isOpen: false, produit: null });

  const filteredProduits = produits.filter(p => {
    return `${p.nom} ${p.description}`.toLowerCase().includes(search.toLowerCase());
  });

  const openCreate = () => {
    setForm({ nom: '', description: '', prixUnitaire: '', stock: '', unite: 'bouteille', contenance: '', image: '' });
    setEditingProduit(null);
    setShowModal(true);
  };

  const openEdit = (produit: Produit) => {
    setForm({ 
      nom: produit.nom, 
      description: produit.description, 
      prixUnitaire: produit.prixUnitaire, 
      stock: produit.stock, 
      unite: produit.unite, 
      contenance: produit.contenance || '',
      image: produit.image || ''
    });
    setEditingProduit(produit);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 2 Mo');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const produitData = {
      nom: form.nom,
      description: form.description,
      prixUnitaire: Number(form.prixUnitaire) || 0,
      stock: Number(form.stock) || 0,
      unite: form.unite,
      contenance: form.unite === 'bouteille' ? (Number(form.contenance) || 75) : undefined,
      image: form.image || undefined,
    };
    
    if (editingProduit) {
      updateProduit({ ...editingProduit, ...produitData });
    } else {
      addProduit({
        id: generateId(),
        ...produitData,
      });
    }
    setShowModal(false);
  };

  const requestDelete = (produit: Produit) => {
    setConfirmDelete({ isOpen: true, produit });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.produit) {
      deleteProduit(confirmDelete.produit.id);
    }
    setConfirmDelete({ isOpen: false, produit: null });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Produits</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{produits.length} produits enregistrés</p>
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
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProduits.map(produit => (
          <div key={produit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product image */}
            <div className="h-32 bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
              {produit.image ? (
                <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-12 h-12 text-gray-300" />
              )}
              {produit.stock <= STOCK_ALERT_THRESHOLD && (
                <div className="absolute top-2 right-2 bg-red-100 text-red-700 p-1 rounded-full" title="Stock faible">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{produit.nom}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{produit.description}</p>
              {produit.contenance && (
                <p className="text-xs text-[#E67E22] font-medium mt-1">{produit.contenance} cl</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#2D5016]">{formatMontant(produit.prixUnitaire)}</p>
                  <p className="text-xs text-gray-400">par {produit.unite === 'bouteille' ? 'bouteille' : produit.unite}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${produit.stock <= STOCK_ALERT_THRESHOLD ? 'text-red-600' : 'text-gray-700'}`}>
                    {produit.stock} {produit.unite === 'bouteille' ? 'bouteilles' : produit.unite}
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
                <button onClick={() => requestDelete(produit)} className="flex-1 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center justify-center" title="Supprimer">
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
                <select 
                  value={form.nom} 
                  onChange={(e) => setForm({...form, nom: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                  required
                >
                  <option value="">-- Sélectionner un produit --</option>
                  {PRODUITS_PREDIFINIS.map((nom) => (
                    <option key={nom} value={nom}>{nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none resize-none" />
              </div>
              
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo du produit</label>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {form.image ? (
                        <img src={form.image} alt="Aperçu" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E67E22] hover:bg-[#D35400] rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Choisir une image
                    </button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG • Max 2 Mo</p>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="text-xs text-red-600 hover:underline mt-1"
                      >
                        Supprimer l'image
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (Ar) *</label>
                  <input 
                    type="number" 
                    value={form.prixUnitaire} 
                    onChange={(e) => setForm({...form, prixUnitaire: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" 
                    min="0" 
                    placeholder="0"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input 
                    type="number" 
                    value={form.stock} 
                    onChange={(e) => setForm({...form, stock: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none" 
                    min="0" 
                    placeholder="0"
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unité de vente *</label>
                  <select 
                    value={form.unite} 
                    onChange={(e) => {
                      const newUnite = e.target.value as 'L' | 'CL' | 'bouteille';
                      setForm({
                        ...form, 
                        unite: newUnite,
                        // Réinitialiser la contenance si l'unité n'est pas "bouteille"
                        contenance: newUnite === 'bouteille' ? form.contenance : ''
                      });
                    }} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                  >
                    <option value="bouteille">Bouteille</option>
                    <option value="L">Litre (L)</option>
                    <option value="CL">Centilitre (CL)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenance (CL)
                    {form.unite !== 'bouteille' && <span className="text-xs text-gray-400 ml-1">(non applicable)</span>}
                  </label>
                  <input 
                    type="number" 
                    value={form.unite === 'bouteille' ? form.contenance : ''}
                    onChange={(e) => setForm({...form, contenance: e.target.value})} 
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none ${form.unite !== 'bouteille' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    min="0" 
                    placeholder="75"
                    disabled={form.unite !== 'bouteille'}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {form.unite === 'bouteille' ? 'Ex: 75 pour 75cl, 70 pour 70cl' : 'Contenance uniquement pour les bouteilles'}
                  </p>
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
              <div className="h-40 bg-gradient-to-br from-green-50 to-orange-50 rounded-lg flex items-center justify-center overflow-hidden">
                {showDetail.image ? (
                  <img src={showDetail.image} alt={showDetail.nom} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{showDetail.nom}</h3>
              </div>
              <p className="text-sm text-gray-600">{showDetail.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">Prix unitaire</p>
                  <p className="text-lg font-bold text-green-800">{formatMontant(showDetail.prixUnitaire)}</p>
                  <p className="text-xs text-green-600 mt-1">par {showDetail.unite === 'bouteille' ? 'bouteille' : showDetail.unite}</p>
                </div>
                <div className={`rounded-lg p-3 ${showDetail.stock <= STOCK_ALERT_THRESHOLD ? 'bg-red-50' : 'bg-blue-50'}`}>
                  <p className={`text-xs ${showDetail.stock <= STOCK_ALERT_THRESHOLD ? 'text-red-600' : 'text-blue-600'}`}>Stock actuel</p>
                  <p className={`text-lg font-bold ${showDetail.stock <= STOCK_ALERT_THRESHOLD ? 'text-red-800' : 'text-blue-800'}`}>{showDetail.stock} {showDetail.unite === 'bouteille' ? 'bouteilles' : showDetail.unite}</p>
                </div>
              </div>
              {showDetail.contenance && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600">Contenance</p>
                  <p className="text-lg font-bold text-orange-800">{showDetail.contenance} cl</p>
                </div>
              )}
              {showDetail.stock <= STOCK_ALERT_THRESHOLD && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 font-medium">Attention : stock faible ! Réapprovisionnement nécessaire.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Supprimer ce produit ?"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${confirmDelete.produit?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ isOpen: false, produit: null })}
        type="danger"
      />
    </div>
  );
}
