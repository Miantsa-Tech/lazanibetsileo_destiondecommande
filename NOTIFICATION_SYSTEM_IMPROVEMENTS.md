# Système de Notifications - Améliorations

## Vue d'ensemble

Le système de notifications a été amélioré pour offrir une expérience utilisateur plus intuitive et réactive. Deux fonctionnalités majeures ont été implémentées :

1. **Marquage automatique comme lu au clic**
2. **Compteur dynamique des notifications non lues**

## 1. Marquage Automatique comme Lu au Clic

### Comportement

Chaque notification est maintenant **cliquable** et est automatiquement marquée comme lue dès que l'utilisateur clique dessus.

### Fonctionnalités

- ✅ **Clic sur une notification** → Marquage immédiat comme lue
- ✅ **Indicateur visuel** → Point bleu pour les notifications non lues
- ✅ **Texte en gras** → Titre en gras pour les notifications non lues
- ✅ **Badge "Lu"** → Affichage d'un badge vert "✓ Lu" après marquage
- ✅ **Persistance** → L'état "lu" est conservé même si les données changent

### Implémentation Technique

```typescript
// État pour suivre les notifications lues
const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

// Fonction pour marquer comme lu
const markAsRead = (id: string) => {
  setReadNotificationIds(prev => new Set([...prev, id]));
  setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
};

// Gestionnaire de clic sur une notification
const handleNotificationClick = (id: string) => {
  markAsRead(id);
};
```

### Interface Utilisateur

**Avant le clic (non lue) :**
```
┌─────────────────────────────────────┐
│ 📦 Stock faible              ●      │  ← Point bleu
│ Vanille Bourbon - Plus que 5...    │  ← Texte en gras
│ 15/01/2024                         │
└─────────────────────────────────────┘
```

**Après le clic (lue) :**
```
┌─────────────────────────────────────┐
│ 📦 Stock faible                     │  ← Texte normal
│ Vanille Bourbon - Plus que 5...    │
│ 15/01/2024  ✓ Lu                   │  ← Badge vert
└─────────────────────────────────────┘
```

## 2. Compteur Dynamique des Notifications Non Lues

### Comportement

Le badge affichant le nombre de notifications non lues est maintenant **dynamique** et se met à jour en temps réel.

### Fonctionnalités

- ✅ **Compteur en temps réel** → Reflète le nombre exact de notifications non lues
- ✅ **Mise à jour automatique** → Se décrémente quand une notification est marquée comme lue
- ✅ **Réinitialisation** → Peut revenir à zéro quand toutes les notifications sont lues
- ✅ **Persistance** → Conserve l'état même après régénération des notifications

### Implémentation Technique

```typescript
// Compteur dynamique
const unreadCount = notifications.filter(n => !n.read).length;

// Régénération des notifications quand les données changent
useEffect(() => {
  setNotifications(generateNotifications());
}, [produits, commandes, factures, livraisons, readNotificationIds]);

// Génération des notifications avec état "lu" persistant
const generateNotifications = (): Notification[] => {
  const notifs: Notification[] = [];
  
  produits.filter(p => p.stock <= 10).forEach(p => {
    notifs.push({
      id: `stock-${p.id}`,
      // ...
      read: readNotificationIds.has(`stock-${p.id}`),  // ← État persistant
      // ...
    });
  });
  
  return notifs;
};
```

### Scénarios d'Utilisation

#### Scénario 1 : Nouvelle commande créée
```
État initial : 3 notifications non lues
↓
Création d'une nouvelle commande
↓
État final : 4 notifications non lues (compteur : 4)
```

#### Scénario 2 : Clic sur une notification
```
État initial : 4 notifications non lues (compteur : 4)
↓
Clic sur une notification
↓
État final : 3 notifications non lues (compteur : 3)
```

#### Scénario 3 : Toutes les notifications lues
```
État initial : 3 notifications non lues (compteur : 3)
↓
Clic sur toutes les notifications
↓
État final : 0 notifications non lues (compteur disparaît)
```

## 3. Persistance de l'État "Lu"

### Problème Résolu

Auparavant, quand les données changeaient (nouvelle commande, stock modifié, etc.), les notifications étaient régénérées et perdaient leur état "lu".

### Solution

L'état "lu" est maintenant stocké dans un `Set<string>` qui contient les IDs des notifications lues. Quand les notifications sont régénérées, elles vérifient si leur ID est dans ce Set pour restaurer leur état.

```typescript
// Stockage des IDs lus
const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

// Lors de la génération
read: readNotificationIds.has(`stock-${p.id}`)

// Lors du marquage comme lu
setReadNotificationIds(prev => new Set([...prev, id]));
```

## 4. Améliorations de l'Interface

### Dropdown des Notifications

- ✅ **Notifications cliquables** → Toute la zone est cliquable
- ✅ **Feedback visuel** → Curseur pointer au survol
- ✅ **Indicateur de non-lu** → Point bleu à côté du titre
- ✅ **Titre en gras** → Pour les notifications non lues
- ✅ **Badge "Lu"** → Affiché après marquage
- ✅ **Bouton supprimer** → Ne déclenche pas le marquage (stopPropagation)

### Modal "Voir Toutes les Notifications"

- ✅ **Notifications cliquables** → Marquage comme lu au clic
- ✅ **Même interface** → Cohérence avec le dropdown
- ✅ **Bouton supprimer** → Isolé avec stopPropagation

## 5. Code Complet

### NotificationsDropdown.tsx

```typescript
export default function NotificationsDropdown() {
  const { produits, commandes, factures, livraisons } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const generateNotifications = (): Notification[] => {
    const notifs: Notification[] = [];

    produits.filter(p => p.stock <= 10).forEach(p => {
      notifs.push({
        id: `stock-${p.id}`,
        type: 'stock',
        title: 'Stock faible',
        message: `${p.nom} - Plus que ${p.stock} unité(s) en stock`,
        date: new Date().toISOString(),
        read: readNotificationIds.has(`stock-${p.id}`),
        icon: <Package className="w-4 h-4" />,
        color: 'text-amber-600 bg-amber-100',
      });
    });

    // ... autres types de notifications

    return notifs;
  };

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setNotifications(generateNotifications());
  }, [produits, commandes, factures, livraisons, readNotificationIds]);

  const markAsRead = (id: string) => {
    setReadNotificationIds(prev => new Set([...prev, id]));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadNotificationIds(prev => new Set([...prev, ...allIds]));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-gray-100">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-[#2D5016] font-medium">
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                  !notif.read ? 'bg-green-50/30' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.color}`}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="p-0.5 rounded hover:bg-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-gray-400">{formatDate(notif.date)}</span>
                    {notif.read && (
                      <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Lu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t bg-gray-50 text-center">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setShowAllNotifications(true);
                }}
                className="text-xs text-[#2D5016] font-medium"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}

      <AllNotificationsModal
        isOpen={showAllNotifications}
        onClose={() => setShowAllNotifications(false)}
        notifications={notifications}
        onRemove={removeNotification}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
```

## 6. Avantages

### Pour l'Utilisateur

- ✅ **Interaction intuitive** → Clic simple pour marquer comme lu
- ✅ **Feedback immédiat** → Changement visuel instantané
- ✅ **Compteur fiable** → Reflète toujours l'état réel
- ✅ **Gain de temps** → Pas besoin de chercher le bouton "Marquer lu"

### Pour le Développeur

- ✅ **Code maintenable** → Logique claire et bien structurée
- ✅ **Performance** → Utilisation de Set pour O(1) lookup
- ✅ **Persistance** → État conservé même après régénération
- ✅ **Testable** → Fonctions pures et isolées

## 7. Tests et Validation

### Checklist de Validation

- ✅ Build réussi sans erreurs
- ✅ Clic sur notification → Marquage comme lu
- ✅ Compteur se met à jour immédiatement
- ✅ État "lu" persiste après régénération
- ✅ Badge "Lu" affiché correctement
- ✅ Point bleu disparaît après clic
- ✅ Titre repasse en normal après clic
- ✅ Modal supporte aussi le clic
- ✅ Bouton supprimer ne déclenche pas le marquage

### Scénarios de Test

**Test 1 : Marquage individuel**
1. Avoir 3 notifications non lues
2. Cliquer sur la première
3. Vérifier : compteur = 2, point bleu disparu, badge "Lu" affiché

**Test 2 : Compteur dynamique**
1. Créer une nouvelle commande
2. Vérifier : compteur augmente de 1
3. Cliquer sur la notification
4. Vérifier : compteur diminue de 1

**Test 3 : Persistance**
1. Marquer une notification comme lue
2. Modifier le stock d'un produit
3. Vérifier : la notification reste marquée comme lue

**Test 4 : Tout marquer lu**
1. Avoir 5 notifications non lues
2. Cliquer sur "Tout marquer lu"
3. Vérifier : compteur = 0, toutes les notifications ont le badge "Lu"

## 8. Améliorations Futures

### Possibilités

1. **Notifications groupées** → Grouper par type (stock, commandes, etc.)
2. **Filtres** → Filtrer par type ou par statut (lu/non lu)
3. **Actions rapides** → Boutons d'action directement dans la notification
4. **Sons de notification** → Alertes sonores pour les nouvelles notifications
5. **Notifications push** → Intégration avec l'API Notifications du navigateur
6. **Historique** → Conserver l'historique des notifications lues
7. **Export** → Exporter les notifications en CSV/PDF

## Conclusion

Le système de notifications est maintenant **entièrement interactif** et **dynamique**. Chaque notification peut être marquée comme lue en un clic, et le compteur reflète en temps réel le nombre de notifications non consultées. L'expérience utilisateur est fluide et intuitive, avec un feedback visuel immédiat à chaque action.
