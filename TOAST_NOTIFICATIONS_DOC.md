# Système de Notifications Toast

## 📋 Vue d'ensemble

Un système de notifications toast a été implémenté pour fournir un feedback visuel immédiat après chaque action CRUD (Create, Read, Update, Delete) sur les produits, clients et commandes.

## 🎯 Fonctionnalités

### 1. **Notifications automatiques**

Les notifications s'affichent automatiquement après :

#### Produits
- ✅ **Ajout** : "Produit ajouté - Le produit [nom] a été ajouté avec succès."
- ✅ **Modification** : "Produit modifié - Le produit [nom] a été modifié avec succès."
- ✅ **Suppression** : "Produit supprimé - Le produit [nom] a été supprimé avec succès."

#### Clients
- ✅ **Ajout** : "Client ajouté - Le client [nom complet] a été ajouté avec succès."
- ✅ **Modification** : "Client modifié - Le client [nom complet] a été modifié avec succès."
- ✅ **Suppression** : "Client supprimé - Le client [nom complet] a été supprimé avec succès."

#### Commandes
- ✅ **Création** : "Commande créée - La commande [numéro] a été créée avec succès pour [client]."
- ✅ **Modification** : "Commande modifiée - La commande [numéro] a été modifiée avec succès."
- ✅ **Suppression** : "Commande supprimée - La commande [numéro] a été supprimée avec succès."
- ✅ **Changement de statut** : "Statut mis à jour - La commande [numéro] est maintenant [nouveau statut]."
- ✅ **Création de facture** : "Facture créée - La facture [numéro] a été créée avec succès pour la commande [numéro]."
- ⚠️ **Facture existante** : "Facture existante - Une facture existe déjà pour cette commande : [numéro]."

### 2. **Types de notifications**

| Type | Icône | Couleur | Utilisation |
|------|-------|---------|-------------|
| **Success** | ✅ CheckCircle | Vert | Actions réussies (ajout, modification, suppression) |
| **Error** | ❌ XCircle | Rouge | Erreurs et échecs |
| **Warning** | ⚠️ AlertTriangle | Orange | Avertissements (ex: facture existante) |
| **Info** | ℹ️ Info | Bleu | Informations (ex: changement de statut) |

### 3. **Caractéristiques techniques**

- ✅ **Auto-dismiss** : Les notifications disparaissent automatiquement après 4 secondes
- ✅ **Fermeture manuelle** : Bouton X pour fermer immédiatement
- ✅ **Empilement** : Plusieurs notifications peuvent s'afficher simultanément
- ✅ **Animations** : Apparition fluide avec animation fadeIn
- ✅ **Responsive** : S'adapte à toutes les tailles d'écran
- ✅ **Dark mode** : Support complet du mode sombre
- ✅ **Position** : Affichées en haut à droite de l'écran

## 🎨 Interface utilisateur

### Apparence des notifications

```
┌─────────────────────────────────────────┐
│ ✅  Produit ajouté                  [X] │
│     Le produit "Vin Rouge" a été ajouté │
│     avec succès.                        │
└─────────────────────────────────────────┘
```

### Exemples de notifications

#### Success (Vert)
```
┌─────────────────────────────────────────┐
│ ✅  Client ajouté                   [X] │
│     Le client "Rasoa Marie" a été ajouté│
│     avec succès.                        │
└─────────────────────────────────────────┘
```

#### Warning (Orange)
```
┌─────────────────────────────────────────┐
│ ⚠️  Facture existante               [X] │
│     Une facture existe déjà pour cette  │
│     commande : FAC-2024-001             │
└─────────────────────────────────────────┘
```

#### Info (Bleu)
```
┌─────────────────────────────────────────┐
│ ℹ️  Statut mis à jour               [X] │
│     La commande CMD-2024-001 est        │
│     maintenant "Validée".               │
└─────────────────────────────────────────┘
```

## 🔧 Architecture technique

### Structure des fichiers

```
src/
├── components/
│   └── Toast.tsx              # Composant Toast et contexte
├── pages/
│   ├── Products.tsx           # Utilise useToast()
│   ├── Clients.tsx            # Utilise useToast()
│   └── Orders.tsx             # Utilise useToast()
└── App.tsx                    # Intègre ToastProvider
```

### Composant Toast.tsx

```typescript
// Types de notifications
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

// Contexte global
interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}
```

### Utilisation dans les composants

```typescript
import { useToast } from '../components/Toast';

function MyComponent() {
  const toast = useToast();

  const handleAdd = () => {
    // ... logique d'ajout
    toast.success('Produit ajouté', 'Le produit a été ajouté avec succès.');
  };

  const handleError = () => {
    toast.error('Erreur', 'Une erreur est survenue.');
  };

  const handleWarning = () => {
    toast.warning('Attention', 'Cette action est irréversible.');
  };

  const handleInfo = () => {
    toast.info('Information', 'Le statut a été mis à jour.');
  };
}
```

## 📊 Configuration

### Durée d'affichage

Par défaut, les notifications disparaissent après **4 secondes**.

Pour modifier cette durée, éditer `src/components/Toast.tsx` :

```typescript
// Ligne 42
setTimeout(() => {
  removeToast(id);
}, 4000); // Modifier cette valeur (en millisecondes)
```

### Position

Les notifications s'affichent en **haut à droite** de l'écran.

Pour modifier la position, éditer `src/components/Toast.tsx` :

```typescript
// Ligne 60
<div className="fixed top-4 right-4 z-[100] ...">
// Options : top-4, bottom-4, left-4, right-4
```

### Couleurs

Les couleurs sont définies dans le composant `ToastItem` :

```typescript
const config = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
    titleColor: 'text-green-800 dark:text-green-200',
    msgColor: 'text-green-600 dark:text-green-300',
  },
  // ... autres types
};
```

## 🎯 Cas d'utilisation

### Scénario 1 : Ajout d'un produit

1. L'utilisateur clique sur "Nouveau produit"
2. Il remplit le formulaire
3. Il clique sur "Créer"
4. ✅ **Notification verte** : "Produit ajouté - Le produit 'Vin Rouge' a été ajouté avec succès."
5. La notification disparaît après 4 secondes

### Scénario 2 : Suppression d'un client

1. L'utilisateur clique sur l'icône de suppression
2. Une modale de confirmation apparaît
3. Il confirme la suppression
4. ✅ **Notification verte** : "Client supprimé - Le client 'Rasoa Marie' a été supprimé avec succès."
5. La notification disparaît après 4 secondes

### Scénario 3 : Tentative de création de facture en double

1. L'utilisateur clique sur "Commander" pour une commande déjà facturée
2. ⚠️ **Notification orange** : "Facture existante - Une facture existe déjà pour cette commande : FAC-2024-001"
3. Aucune facture n'est créée
4. La notification disparaît après 4 secondes

### Scénario 4 : Changement de statut d'une commande

1. L'utilisateur change le statut d'une commande via le dropdown
2. ℹ️ **Notification bleue** : "Statut mis à jour - La commande CMD-2024-001 est maintenant 'Validée'."
3. La notification disparaît après 4 secondes

## ✅ Avantages

### Pour l'utilisateur
- ✅ **Feedback immédiat** : Confirmation visuelle de chaque action
- ✅ **Clarté** : Messages explicites avec le nom de l'élément concerné
- ✅ **Non-intrusif** : Disparaît automatiquement, ne bloque pas l'interface
- ✅ **Esthétique** : Design moderne et cohérent avec l'application

### Pour le développeur
- ✅ **Réutilisable** : Un seul système pour toute l'application
- ✅ **Flexible** : 4 types de notifications (success, error, warning, info)
- ✅ **Simple** : API intuitive avec `toast.success()`, `toast.error()`, etc.
- ✅ **Type-safe** : TypeScript pour éviter les erreurs

## 📝 Documentation API

### Méthodes disponibles

```typescript
// Notification de succès (vert)
toast.success(title: string, message?: string): void

// Notification d'erreur (rouge)
toast.error(title: string, message?: string): void

// Notification d'avertissement (orange)
toast.warning(title: string, message?: string): void

// Notification d'information (bleu)
toast.info(title: string, message?: string): void

// Ajouter une notification personnalisée
toast.addToast(type: ToastType, title: string, message: string): void

// Supprimer une notification
toast.removeToast(id: string): void
```

### Exemples d'utilisation

```typescript
// Succès simple
toast.success('Opération réussie');

// Succès avec message détaillé
toast.success('Produit ajouté', 'Le produit "Vin Rouge" a été ajouté avec succès.');

// Erreur
toast.error('Erreur', 'Impossible de supprimer le produit.');

// Avertissement
toast.warning('Attention', 'Cette action est irréversible.');

// Information
toast.info('Info', 'Le statut a été mis à jour.');
```

## 🚀 Améliorations futures

### Fonctionnalités planifiées
- [ ] **Position personnalisable** : Permettre de choisir la position (top, bottom, left, right)
- [ ] **Durée configurable** : Permettre de définir la durée par notification
- [ ] **Actions personnalisées** : Ajouter des boutons d'action dans les notifications
- [ ] **Son de notification** : Option pour ajouter un son
- [ ] **File d'attente** : Limiter le nombre de notifications affichées simultanément
- [ ] **Thèmes personnalisés** : Permettre de personnaliser les couleurs

## 📚 Fichiers modifiés

1. **src/components/Toast.tsx** (nouveau)
   - Composant Toast
   - Contexte ToastContext
   - Hook useToast
   - Container et Item

2. **src/App.tsx**
   - Ajout de ToastProvider

3. **src/pages/Products.tsx**
   - Import de useToast
   - Notifications après ajout/modification/suppression

4. **src/pages/Clients.tsx**
   - Import de useToast
   - Notifications après ajout/modification/suppression

5. **src/pages/Orders.tsx**
   - Import de useToast
   - Notifications après création/modification/suppression
   - Notifications après changement de statut
   - Notifications après création de facture

## ✅ Checklist de validation

- [x] Composant Toast créé
- [x] Contexte ToastProvider intégré dans App.tsx
- [x] Notifications dans Products.tsx (ajout, modification, suppression)
- [x] Notifications dans Clients.tsx (ajout, modification, suppression)
- [x] Notifications dans Orders.tsx (création, modification, suppression, statut, facture)
- [x] Support du dark mode
- [x] Auto-dismiss après 4 secondes
- [x] Fermeture manuelle
- [x] Animations fluides
- [x] Build réussi

---

**Dernière mise à jour** : 2024
**Version** : 1.0.0
**Statut** : ✅ Production ready
