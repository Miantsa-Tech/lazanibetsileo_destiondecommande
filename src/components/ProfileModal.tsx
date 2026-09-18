import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Camera, User, Mail, Phone, MapPin, Shield } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUserProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
  });
  const [photo, setPhoto] = useState<string>(user?.photo || '');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      ...form,
      photo: photo,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Mon profil</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Photo de profil */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {photo ? (
                  <img src={photo} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#2D5016] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {form.prenom?.[0]}{form.nom?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#E67E22] hover:bg-[#D35400] rounded-full flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Cliquez sur l'icône caméra pour changer la photo</p>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-3.5 h-3.5" /> Prénom
                </label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <User className="w-3.5 h-3.5" /> Nom
                </label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-3.5 h-3.5" /> Téléphone
              </label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="+261 XX XX XXX XX"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Adresse
              </label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                placeholder="Votre adresse"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2D5016] outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Shield className="w-3.5 h-3.5" /> Rôle
              </label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrateur' : user?.role || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 capitalize"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
