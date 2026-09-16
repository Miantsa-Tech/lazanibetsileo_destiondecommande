# Fonctionnalités d'Upload d'Images

## 📸 Photos des Produits

### Description

Chaque produit peut maintenant avoir une photo personnalisée qui sera affichée dans :
- La liste des produits (cartes)
- La modale de détails du produit
- Les factures (via l'utilitaire invoiceUtils)

### Comment ajouter une photo à un produit

1. **Créer un nouveau produit** :
   - Cliquez sur "Nouveau produit"
   - Remplissez les informations du produit
   - Dans la section "Photo du produit", cliquez sur "Choisir une image"
   - Sélectionnez une image (PNG, JPG - max 2 Mo)
   - L'aperçu s'affiche immédiatement
   - Cliquez sur "Créer" pour sauvegarder

2. **Modifier un produit existant** :
   - Cliquez sur l'icône ✏️ (Modifier) du produit
   - Dans le formulaire, vous pouvez :
     - Changer l'image en cliquant sur "Choisir une image"
     - Supprimer l'image en cliquant sur "Supprimer l'image"
   - Cliquez sur "Modifier" pour sauvegarder

### Interface utilisateur

#### Dans le formulaire de produit

```
┌─────────────────────────────────────────┐
│ Photo du produit                        │
│                                         │
│  ┌────────┐  [Choisir une image]       │
│  │  📷    │  PNG, JPG • Max 2 Mo       │
│  │        │  [Supprimer l'image]       │
│  └────────┘                             │
│     ↕                                   │
│   (clic sur l'icône caméra)            │
└─────────────────────────────────────────┘
```

#### Dans la carte produit (liste)

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │    [Image du produit]       │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Vin Rouge                       │
│ Vin rouge tranquille...         │
│ 75 cl                           │
│ 25 000 Ar          150 bouteilles│
│                                 │
│ [👁️] [✏️] [🗑️]                 │
│ [📄 Commander]                  │
└─────────────────────────────────┘
```

#### Dans la modale de détails

```
┌─────────────────────────────────┐
│ Détails du produit              │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │    [Image du produit]       │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Vin Rouge                       │
│ Vin rouge tranquille ordinaire  │
│                                 │
│ Prix unitaire: 25 000 Ar        │
│ Stock: 150 bouteilles           │
│ Contenance: 75 cl               │
└─────────────────────────────────┘
```

### Spécifications techniques

- **Formats supportés** : PNG, JPG, JPEG, GIF, WebP
- **Taille maximale** : 2 Mo
- **Stockage** : Base64 (dans le state React)
- **Affichage** : Object-fit cover pour un rendu uniforme
- **Responsive** : S'adapte à toutes les tailles d'écran

### Code source

#### Interface Produit (mockData.ts)

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

#### Gestion de l'upload (Products.tsx)

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

---

## 🏢 Logo de l'Entreprise

### Description

Le logo de l'entreprise est maintenant synchronisé entre :
- La sidebar (navigation principale)
- Le formulaire de login
- Les factures PDF

### Comment changer le logo

1. **Via la sidebar** :
   - Cliquez sur l'icône 📷 en bas à droite du logo actuel
   - Sélectionnez une image (PNG, JPG - max 2 Mo)
   - Le logo est mis à jour immédiatement partout

2. **Via les paramètres** :
   - Allez dans "Paramètres"
   - Section "Informations de l'entreprise"
   - Cliquez sur "Choisir un logo"
   - Sélectionnez une image
   - Le logo est mis à jour partout

### Emplacements du logo

#### 1. Sidebar (Layout.tsx)

```
┌─────────────────────────────────┐
│ ┌────────┐                      │
│ │ [Logo] │ Lazan'iBetsileo     │
│ │   ↕    │ Gestion de Commandes│
│ └────────┘                      │
│                                 │
│ 📊 Tableau de bord              │
│ 👥 Clients                      │
│ 📦 Produits                     │
│ ...                             │
└─────────────────────────────────┘
```

#### 2. Formulaire de Login (Login.tsx)

```
┌─────────────────────────────────┐
│                                 │
│        ┌──────────┐            │
│        │          │            │
│        │  [Logo]  │            │
│        │          │            │
│        └──────────┘            │
│                                 │
│     Lazan'iBetsileo            │
│  Système de Gestion de         │
│      Commandes                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Email                   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Mot de passe            │   │
│  └─────────────────────────┘   │
│  [Se connecter]                │
└─────────────────────────────────┘
```

#### 3. Factures PDF (invoiceUtils.ts)

```
┌─────────────────────────────────────────┐
│ ┌────────┐                              │
│ │ [Logo] │ Lazan'iBetsileo             │
│ │        │ Région Betsileo, Madagascar │
│ └────────┘ Tél: +261 20 75 000 00     │
│          │ Email: contact@...          │
│                                        │
│                          FACTURE       │
│                        FAC-2024-001    │
│                                        │
│ Date: 15/05/2024                       │
│ Échéance: 15/06/2024                   │
│ État: Émise                            │
└─────────────────────────────────────────┘
```

### Spécifications techniques

- **Formats supportés** : PNG, JPG, JPEG, SVG, GIF, WebP
- **Taille maximale** : 2 Mo
- **Stockage** : Base64 (dans le contexte global)
- **Persistance** : localStorage (via AppContext)
- **Synchronisation** : Temps réel entre tous les composants

### Code source

#### Contexte global (AppContext.tsx)

```typescript
interface AppContextType {
  // ... autres propriétés
  companyLogo: string;
  setCompanyLogo: (logo: string) => void;
}

const [companyLogo, setCompanyLogo] = useState<string>('');
```

#### Composant LogoUpload (LogoUpload.tsx)

```typescript
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
```

#### Utilisation dans Login.tsx

```typescript
const { login, companyLogo } = useApp();

// Dans le JSX
{companyLogo ? (
  <img src={companyLogo} alt="Logo Lazan'iBetsileo" className="w-full h-full object-cover" />
) : (
  <Leaf className="w-10 h-10 text-white" />
)}
```

---

## 🎨 Améliorations UX/UI

### Pour les produits

✅ **Aperçu immédiat** : L'image s'affiche dès la sélection
✅ **Suppression facile** : Bouton dédié pour supprimer l'image
✅ **Affichage uniforme** : Object-fit cover pour un rendu professionnel
✅ **Indicateur visuel** : Icône caméra pour indiquer la possibilité d'upload
✅ **Contrôle de taille** : Alerte si l'image dépasse 2 Mo

### Pour le logo

✅ **Synchronisation automatique** : Changement instantané partout
✅ **Persistance** : Le logo est conservé après rechargement
✅ **Fallback élégant** : Icône Leaf si aucun logo n'est défini
✅ **Interface intuitive** : Bouton caméra bien visible
✅ **Responsive** : S'adapte à toutes les tailles d'écran

---

## 📊 Cas d'utilisation

### Cas 1 : Ajout de photos aux produits

**Situation** : Vous voulez ajouter des photos à vos produits pour mieux les identifier.

**Processus** :
1. Allez dans "Produits"
2. Cliquez sur "Nouveau produit" ou ✏️ sur un produit existant
3. Remplissez les informations
4. Cliquez sur "Choisir une image"
5. Sélectionnez une photo du produit
6. Validez

**Résultat** : La photo apparaît dans la liste et les détails du produit.

### Cas 2 : Changement du logo de l'entreprise

**Situation** : Vous voulez mettre à jour le logo de l'entreprise.

**Processus** :
1. Cliquez sur l'icône 📷 en bas du logo dans la sidebar
2. Sélectionnez le nouveau logo
3. Validez

**Résultat** : Le nouveau logo apparaît :
- Dans la sidebar
- Sur la page de login
- Sur les factures PDF

### Cas 3 : Workflow complet

**Processus** :
1. Configurez le logo de l'entreprise
2. Ajoutez des photos à vos produits
3. Créez des commandes avec ces produits
4. Générez des factures avec le logo et les photos

**Résultat** : Une expérience utilisateur cohérente et professionnelle.

---

## 🔧 Configuration technique

### Stockage des images

Les images sont stockées en **Base64** directement dans le state React :
- **Avantages** : Simple, pas de serveur nécessaire
- **Inconvénients** : Augmente la taille du state, pas persistant entre sessions

### Pour une application en production

Il serait recommandé de :
1. Utiliser un service de stockage cloud (AWS S3, Cloudinary, etc.)
2. Implémenter un backend pour gérer les uploads
3. Utiliser une base de données pour stocker les URLs des images
4. Implémenter un système de cache pour optimiser les performances

### Exemple d'implémentation backend

```typescript
// Backend (Node.js + Express)
app.post('/api/products/:id/image', upload.single('image'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  Product.update({ id: req.params.id }, { image: imageUrl });
  res.json({ success: true, imageUrl });
});

// Frontend
const uploadProductImage = async (productId: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`/api/products/${productId}/image`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
```

---

## ✅ Checklist de validation

### Photos des produits

- [x] Upload d'image fonctionnel
- [x] Aperçu immédiat
- [x] Affichage dans la liste
- [x] Affichage dans les détails
- [x] Suppression d'image
- [x] Contrôle de taille (2 Mo)
- [x] Formats supportés (PNG, JPG)
- [x] Responsive design
- [x] Mode sombre supporté

### Logo de l'entreprise

- [x] Upload de logo fonctionnel
- [x] Synchronisation sidebar
- [x] Synchronisation login
- [x] Synchronisation factures
- [x] Persistance (localStorage)
- [x] Fallback élégant
- [x] Contrôle de taille (2 Mo)
- [x] Responsive design
- [x] Mode sombre supporté

---

## 📚 Documentation associée

- [PRODUCT_IMAGES_DOC.md](./PRODUCT_IMAGES_DOC.md) : Documentation complète
- [LOGO_SYNCHRONIZATION.md](./LOGO_SYNCHRONIZATION.md) : Synchronisation du logo
- [INVOICE_IMPROVEMENTS.md](./INVOICE_IMPROVEMENTS.md) : Améliorations des factures

---

**Dernière mise à jour** : 2024
**Version** : 4.0.0
**Statut** : ✅ Production ready
