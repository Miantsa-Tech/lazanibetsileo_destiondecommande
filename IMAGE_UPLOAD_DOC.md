# Fonctionnalités d'Upload d'Images

## 📸 Upload de Photos pour les Produits

### Description
Chaque produit peut maintenant avoir une photo personnalisée qui sera affichée dans la carte du produit et dans les détails.

### Fonctionnalités

#### 1. **Upload d'image lors de la création**
- Bouton "Choisir une image" dans le formulaire
- Aperçu en temps réel de l'image sélectionnée
- Validation de la taille (max 2 Mo)
- Formats supportés : PNG, JPG, JPEG, GIF, WebP

#### 2. **Modification de l'image**
- Possibilité de changer l'image d'un produit existant
- Bouton "Supprimer l'image" pour retirer la photo
- Aperçu de l'image actuelle

#### 3. **Affichage dans les cartes**
- Image affichée en haut de chaque carte produit
- Dimensions : 132px de hauteur
- Mode `object-cover` pour un affichage optimal
- Fallback : icône Package si pas d'image

#### 4. **Affichage dans les détails**
- Grande image dans la modale de détails
- Dimensions : 160px de hauteur
- Affichage complet du produit

### Interface utilisateur

#### Formulaire de création/modification
```
┌─────────────────────────────────────────┐
│ Photo du produit                        │
├─────────────────────────────────────────┤
│  ┌────────┐  [Choisir une image]       │
│  │  📷    │  PNG, JPG • Max 2 Mo       │
│  │        │  [Supprimer l'image]       │
│  └────────┘                             │
└─────────────────────────────────────────┘
```

#### Carte produit
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   [IMAGE DU       │  │
│  │    PRODUIT]       │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  Vin Rouge              │
│  75 cl                  │
│  25 000 Ar              │
│  150 bouteilles         │
└─────────────────────────┘
```

### Code d'implémentation

#### Interface Produit
```typescript
export interface Produit {
  id: string;
  nom: string;
  description: string;
  prixUnitaire: number;
  stock: number;
  unite: 'L' | 'CL' | 'bouteille';
  contenance?: number;
  image?: string; // URL ou base64 de l'image
}
```

#### Gestion de l'upload
```typescript
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
```

#### Affichage conditionnel
```typescript
{produit.image ? (
  <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
) : (
  <Package className="w-12 h-12 text-gray-300" />
)}
```

---

## 🏢 Synchronisation du Logo de l'Entreprise

### Description
Le logo de l'entreprise est maintenant synchronisé entre toutes les pages de l'application :
- Page de connexion (Login)
- Sidebar (Layout)
- Factures PDF

### Fonctionnalités

#### 1. **Upload du logo**
- Disponible dans la sidebar (icône caméra sur le logo)
- Disponible dans la page Paramètres
- Validation de la taille (max 2 Mo)
- Formats supportés : PNG, JPG, SVG

#### 2. **Affichage dans la page Login**
```typescript
<div className="inline-flex items-center justify-center w-20 h-20 bg-[#2D5016] rounded-2xl mb-4 overflow-hidden">
  {companyLogo ? (
    <img src={companyLogo} alt="Logo Lazan'iBetsileo" className="w-full h-full object-cover" />
  ) : (
    <Leaf className="w-10 h-10 text-white" />
  )}
</div>
```

#### 3. **Affichage dans la sidebar**
- Logo affiché en haut de la sidebar
- Icône Leaf par défaut si pas de logo
- Bouton de modification toujours accessible

#### 4. **Affichage dans les factures PDF**
- Logo inclus dans l'en-tête de la facture
- Dimensions : 80x80 pixels
- Affichage conditionnel

### Persistance
Le logo est stocké dans le contexte global `AppContext` via :
- `companyLogo` : état du logo
- `setCompanyLogo` : fonction de mise à jour

Le logo est partagé entre toutes les pages de l'application.

### Interface utilisateur

#### Dans la sidebar
```
┌────────────────────────────┐
│  ┌──────┐  Lazan'iBetsileo │
│  │ LOGO │  Gestion de      │
│  │  📷  │  Commandes       │
│  └──────┘                  │
└────────────────────────────┘
```

#### Dans la page Login
```
┌─────────────────────────────┐
│                             │
│      ┌──────────┐          │
│      │          │          │
│      │   LOGO   │          │
│      │          │          │
│      └──────────┘          │
│                             │
│    Lazan'iBetsileo         │
│  Système de Gestion        │
│     de Commandes           │
│                             │
└─────────────────────────────┘
```

#### Dans la page Paramètres
```
┌─────────────────────────────────────┐
│ Logo de l'entreprise                │
├─────────────────────────────────────┤
│  ┌────────┐  [Choisir un logo]     │
│  │        │  PNG, JPG ou SVG       │
│  │  LOGO  │  Max 2 Mo              │
│  │   📷   │  [Supprimer le logo]   │
│  └────────┘                         │
└─────────────────────────────────────┘
```

### Code d'implémentation

#### Contexte global
```typescript
// AppContext.tsx
const [companyLogo, setCompanyLogo] = useState<string>('');

return (
  <AppContext.Provider value={{
    // ... autres valeurs
    companyLogo,
    setCompanyLogo,
  }}>
    {children}
  </AppContext.Provider>
);
```

#### Page Login
```typescript
const { companyLogo } = useApp();

<div className="inline-flex items-center justify-center w-20 h-20 bg-[#2D5016] rounded-2xl mb-4 overflow-hidden">
  {companyLogo ? (
    <img src={companyLogo} alt="Logo Lazan'iBetsileo" className="w-full h-full object-cover" />
  ) : (
    <Leaf className="w-10 h-10 text-white" />
  )}
</div>
```

#### Composant LogoUpload
```typescript
export default function LogoUpload() {
  const { companyLogo, setCompanyLogo } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
            <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Leaf className="w-6 h-6 text-green-300" />
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
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
```

---

## 🎯 Avantages

### Pour les produits
✅ **Identification visuelle** : Reconnaître rapidement les produits
✅ **Professionalisme** : Interface plus attrayante
✅ **Marketing** : Meilleure présentation des produits
✅ **Clarté** : Distinction facile entre produits similaires

### Pour le logo
✅ **Personnalisation** : Logo propre à l'entreprise
✅ **Cohérence** : Même logo partout dans l'application
✅ **Branding** : Renforcement de l'identité visuelle
✅ **Flexibilité** : Modification facile à tout moment

---

## 📋 Checklist de validation

- [x] Upload d'image pour les produits
- [x] Affichage dans les cartes produit
- [x] Affichage dans les détails produit
- [x] Modification d'image existante
- [x] Suppression d'image
- [x] Validation de la taille (2 Mo)
- [x] Upload du logo de l'entreprise
- [x] Synchronisation avec la page Login
- [x] Synchronisation avec la sidebar
- [x] Synchronisation avec les factures PDF
- [x] Persistance dans le contexte global
- [x] Build réussi

---

**Dernière mise à jour** : 2024
**Version** : 1.0.0
**Statut** : ✅ Production ready
