# Mode Sombre - Lazan'iBetsileo

## Description

L'application de gestion de commandes Lazan'iBetsileo intègre un **mode sombre** complet et fonctionnel qui permet aux utilisateurs de basculer entre un thème clair et un thème sombre selon leurs préférences.

## Fonctionnalités

### 🌓 Basculement du thème
- **Bouton de bascule** : Icône soleil/lune dans le header (à côté des notifications)
- **Persistance** : Le thème choisi est sauvegardé dans le `localStorage` et reste actif même après fermeture du navigateur
- **Transition fluide** : Animations douces lors du changement de thème

### 🎨 Adaptation complète

Le mode sombre affecte tous les éléments de l'interface :

#### Layout principal
- Sidebar avec navigation
- Header avec menu utilisateur
- Zone de contenu principale

#### Composants
- Cartes KPI (Dashboard)
- Tableaux de données (Clients, Produits, Commandes, etc.)
- Formulaires et inputs
- Modales (création, édition, détails)
- Dropdowns (notifications, menu utilisateur)
- Boutons et badges

#### Éléments spécifiques
- Inputs et champs de formulaire
- Tables avec hover effects
- Badges colorés (statuts, types)
- Graphiques (Recharts)
- Scrollbars personnalisées

## Utilisation

### Pour l'utilisateur

1. **Activer/Désactiver le mode sombre** :
   - Cliquez sur l'icône 🌙 (lune) ou ☀️ (soleil) dans le header
   - Le thème change instantanément

2. **Persistance automatique** :
   - Votre préférence est sauvegardée automatiquement
   - Elle sera restaurée à votre prochaine connexion

### Pour les développeurs

#### Architecture technique

```typescript
// ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

#### Utilisation du hook

```typescript
import { useTheme } from '../context/ThemeContext';

function MonComposant() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

#### Classes Tailwind pour le dark mode

```jsx
// Syntaxe Tailwind CSS
<div className="bg-white dark:bg-slate-800">
  <h1 className="text-gray-800 dark:text-slate-100">Titre</h1>
</div>
```

#### Styles globaux (index.css)

```css
/* Configuration Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

/* Styles automatiques pour le dark mode */
.dark .bg-white {
  background-color: #1e293b;
}

.dark .text-gray-800 {
  color: #f1f5f9;
}
```

## Palette de couleurs

### Mode Clair
- **Background** : `#F8F9FA` (gris très clair)
- **Cards** : `#FFFFFF` (blanc)
- **Text principal** : `#2C3E50` (gris foncé)
- **Text secondaire** : `#6C757D` (gris moyen)
- **Borders** : `#E9ECEF` (gris clair)

### Mode Sombre
- **Background** : `#0f172a` (slate-900)
- **Cards** : `#1e293b` (slate-800)
- **Text principal** : `#f1f5f9` (slate-100)
- **Text secondaire** : `#94a3b8` (slate-400)
- **Borders** : `#334155` (slate-700)

### Couleurs d'accent (identiques dans les deux modes)
- **Primary** : `#2D5016` (vert foncé)
- **Secondary** : `#E67E22` (orange)
- **Accent** : `#C0392B` (rouge)

## Composants modifiés

### Fichiers principaux

1. **src/index.css**
   - Configuration du variant dark pour Tailwind v4
   - Styles globaux pour le dark mode
   - Transitions fluides

2. **src/context/ThemeContext.tsx**
   - Contexte React pour gérer l'état du thème
   - Hook `useTheme()` pour accéder au thème
   - Persistance localStorage

3. **src/App.tsx**
   - Intégration du `ThemeProvider`

4. **src/components/ThemeToggle.tsx**
   - Composant bouton de bascule
   - Icônes soleil/lune animées

5. **src/components/Layout.tsx**
   - Intégration du ThemeToggle dans le header
   - Classes dark pour la sidebar et le header

6. **src/components/NotificationsDropdown.tsx**
   - Adaptation complète au dark mode

7. **Pages principales**
   - Dashboard.tsx
   - Clients.tsx
   - Products.tsx
   - Orders.tsx
   - Invoices.tsx
   - Payments.tsx
   - Deliveries.tsx
   - Reports.tsx
   - Settings.tsx

## Tests

### Vérification manuelle

1. ✅ Basculer entre mode clair et sombre
2. ✅ Vérifier la persistance après rechargement
3. ✅ Tester tous les composants (modales, dropdowns, formulaires)
4. ✅ Vérifier la lisibilité du texte
5. ✅ Tester les graphiques (Recharts)
6. ✅ Vérifier les scrollbars
7. ✅ Tester sur différents navigateurs

### Checklist de validation

- [ ] Le bouton de bascule fonctionne
- [ ] Le thème est sauvegardé dans localStorage
- [ ] Toutes les pages s'adaptent correctement
- [ ] Les formulaires sont lisibles
- [ ] Les tableaux sont lisibles
- [ ] Les modales s'adaptent
- [ ] Les notifications s'adaptent
- [ ] Les graphiques restent lisibles
- [ ] Pas de flash blanc lors du chargement
- [ ] Les transitions sont fluides

## Performance

- **Impact minimal** : Les classes CSS sont générées à la compilation
- **Pas de re-render** : Le changement de thème utilise une classe CSS globale
- **LocalStorage** : Lecture synchrone au chargement (très rapide)
- **Transitions** : 0.2s pour un effet fluide sans lag

## Accessibilité

- **Contraste** : Respect des normes WCAG 2.1 AA
- **Lisibilité** : Textes suffisamment contrastés dans les deux modes
- **Navigation** : Focus visible dans les deux thèmes
- **Réduction motion** : Respecte les préférences utilisateur

## Améliorations futures

- [ ] Mode "auto" (détection des préférences système)
- [ ] Thèmes personnalisés (couleurs configurables)
- [ ] Animation de transition entre les thèmes
- [ ] Preview du thème avant application
- [ ] Synchronisation multi-appareils

## Support navigateurs

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Notes techniques

### Tailwind CSS v4

L'application utilise Tailwind CSS v4 avec la nouvelle syntaxe `@custom-variant` :

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Cela permet d'activer le dark mode en ajoutant la classe `dark` sur l'élément `<html>`.

### React Context

Le `ThemeContext` utilise :
- `useState` pour l'état du thème
- `useEffect` pour appliquer la classe CSS
- `localStorage` pour la persistance

### Transitions CSS

Les transitions sont configurées globalement :

```css
* {
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}
```

## Contact

Pour toute question ou suggestion concernant le mode sombre :
- Email : contact@lazanimbetsileo.mg
- Localisation : Fianarantsoa, Madagascar

---

**Dernière mise à jour** : 2024
**Version** : 1.0.0
