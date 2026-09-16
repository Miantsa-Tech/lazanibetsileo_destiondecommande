import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Leaf } from 'lucide-react';

export default function LogoUpload() {
  const { companyLogo, setCompanyLogo } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille du logo ne doit pas dépasser 2 Mo');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo Lazan'iBetsileo" className="w-full h-full object-cover" />
          ) : (
            <Leaf className="w-6 h-6 text-green-300" />
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
          title="Changer le logo"
        >
          <Camera className="w-3 h-3" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="hidden"
      />
      <div>
        <h1 className="font-bold text-lg leading-tight">Lazan'iBetsileo</h1>
        <p className="text-xs text-green-300">Gestion de Commandes</p>
      </div>
    </div>
  );
}
