# Création Automatique de Facture

## Vue d'ensemble

Le système a été modifié pour créer automatiquement une facture liée à chaque nouvelle commande. Lorsqu'un utilisateur crée une commande pour un client, une facture est automatiquement générée et associée à cette commande.

## Fonctionnement

### Processus automatique

1. **Création de la commande**
   - L'utilisateur remplit le formulaire de commande
   - Sélectionne un client
   - Ajoute des produits
   - Clique sur "Créer"

2. **Création automatique de la facture**
   - Le système crée automatiquement une facture liée à la commande
   - La facture est générée avec les mêmes données que la commande
   - Le statut de la commande passe à "validée"
   - Une notification confirme la création des deux éléments

3. **Liaison commande-facture**
   - La facture est liée à la commande via `id_commande`
   - Le montant de la facture correspond au montant total de la commande
   - La date d'échéance est fixée à 30 jours

## Code implémenté

### Dans `src/pages/Orders.tsx`

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedClientId || lignes.length === 0) return;
  const client = clients.find(c => c.id === selectedClientId);
  if (!client) return;

  if (editingCommande) {
    // Modification d'une commande existante
    updateCommande({ ...editingCommande, clientId: selectedClientId, nomClient: `${client.nom} ${client.prenom}`, lignes, montantTotal, notes, dateModification: new Date().toISOString().split('T')[0] });
    toast.success('Commande modifiée', `La commande ${editingCommande.numero} a été modifiée avec succès.`);
  } else {
    const now = new Date().toISOString();
    const newCmd: Commande = {
      id: generateId(),
      numero: `CMD-2024-${String(commandes.length + 1).padStart(3, '0')}`,
      clientId: selectedClientId,
      nomClient: `${client.nom} ${client.prenom}`,
      lignes,
      montantTotal,
      statut: 'en_cours',
      dateCreation: now.split('T')[0],
      dateModification: now.split('T')[0],
      notes,
    };
    
    // Créer la commande
    addCommande(newCmd);
    
    // Créer automatiquement une facture liée à la commande
    const newFacture: Facture = {
      id: generateId(),
      num_facture: `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`,
      id_commande: newCmd.id,
      date_facture: now.split('T')[0],
      date_echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      montant_ht: newCmd.montantTotal,
      montant_tva: 0,
      montant_ttc: newCmd.montantTotal,
      statut: 'emise',
      created_at: now,
      updated_at: now,
    };
    
    addFacture(newFacture);
    
    // Mettre à jour le statut de la commande à "validée"
    updateCommande({ 
      ...newCmd, 
      statut: 'validee', 
      dateModification: now.split('T')[0] 
    });
    
    toast.success('Commande et facture créées', `La commande ${newCmd.numero} et la facture ${newFacture.num_facture} ont été créées avec succès pour ${client.nom} ${client.prenom}.`);
  }
  setShowModal(false);
};
```

## Structure des données

### Commande créée

```typescript
{
  id: "unique-id",
  numero: "CMD-2024-001",
  clientId: "client-id",
  nomClient: "Rakoto Jean",
  lignes: [...],
  montantTotal: 450000,
  statut: "validee", // Passe directement à "validée"
  dateCreation: "2024-01-15",
  dateModification: "2024-01-15",
  notes: ""
}
```

### Facture créée automatiquement

```typescript
{
  id: "unique-facture-id",
  num_facture: "FAC-2024-001",
  id_commande: "unique-id", // Lien vers la commande
  date_facture: "2024-01-15",
  date_echeance: "2024-02-14", // 30 jours après
  montant_ht: 450000,
  montant_tva: 0,
  montant_ttc: 450000,
  statut: "emise",
  created_at: "2024-01-15T10:00:00.000Z",
  updated_at: "2024-01-15T10:00:00.000Z"
}
```

## Avantages

### 1. Gain de temps
- Plus besoin de créer manuellement la facture après la commande
- Processus automatisé et rapide
- Réduction des erreurs de saisie

### 2. Cohérence des données
- La facture est toujours liée à la commande
- Les montants sont identiques
- Pas de risque d'oubli

### 3. Traçabilité
- Chaque commande a sa facture
- Lien direct entre commande et facture
- Historique complet

### 4. Workflow simplifié
- Une seule action pour créer commande + facture
- Notification unique confirmant les deux créations
- Statut de commande automatiquement mis à jour

## Comportements

### Création d'une nouvelle commande

1. L'utilisateur clique sur "Nouvelle commande"
2. Remplit le formulaire (client, produits, quantités)
3. Clique sur "Créer"
4. Le système :
   - Crée la commande
   - Crée automatiquement la facture liée
   - Met le statut de la commande à "validée"
   - Affiche une notification de succès

### Modification d'une commande existante

1. L'utilisateur clique sur "Modifier"
2. Modifie les informations
3. Clique sur "Modifier"
4. Le système :
   - Met à jour la commande
   - **Ne crée pas de nouvelle facture** (la facture existante reste liée)
   - Affiche une notification de succès

### Suppression d'une commande

1. L'utilisateur clique sur "Supprimer"
2. Confirme la suppression
3. Le système :
   - Supprime la commande
   - La facture reste (peut être supprimée séparément si nécessaire)
   - Affiche une notification de succès

## Notifications

### Après création réussie

```
✅ Commande et facture créées
   La commande CMD-2024-001 et la facture FAC-2024-001 ont été créées avec succès pour Rakoto Jean.
```

### Après modification réussie

```
✅ Commande modifiée
   La commande CMD-2024-001 a été modifiée avec succès.
```

### Après suppression réussie

```
✅ Commande supprimée
   La commande CMD-2024-001 a été supprimée avec succès.
```

## Cas d'utilisation

### Cas 1 : Nouvelle commande client

**Scénario :**
- Client : Rakoto Jean
- Produits : Vin Rouge (10 bouteilles), Vin Blanc (5 bouteilles)
- Montant total : 450 000 Ar

**Résultat :**
- Commande CMD-2024-011 créée
- Facture FAC-2024-010 créée automatiquement
- Statut commande : "validée"
- Date échéance facture : 30 jours

### Cas 2 : Modification d'une commande

**Scénario :**
- Commande existante : CMD-2024-001
- Modification : ajout d'un produit

**Résultat :**
- Commande mise à jour
- Facture existante reste liée
- Pas de nouvelle facture créée

### Cas 3 : Commande avec plusieurs produits

**Scénario :**
- Client : Rasoa Marie
- Produits : 5 types de vins différents
- Montant total : 1 200 000 Ar

**Résultat :**
- Commande créée avec tous les produits
- Facture créée avec le montant total
- Lien automatique entre les deux

## Personnalisation

### Modifier la date d'échéance

```typescript
// Dans Orders.tsx, ligne de création de la facture
date_echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
// Changer 30 par le nombre de jours souhaité
```

### Modifier le format du numéro de facture

```typescript
// Dans Orders.tsx
num_facture: `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`,
// Modifier le format selon vos besoins
```

### Désactiver la création automatique

Si vous souhaitez désactiver la création automatique de facture :

```typescript
// Commenter ou supprimer ces lignes dans handleSubmit
/*
const newFacture: Facture = {
  // ...
};
addFacture(newFacture);
*/
```

## Tests et validation

### Checklist de validation

- ✅ Build réussi sans erreurs
- ✅ Création automatique de facture fonctionne
- ✅ Lien commande-facture correct
- ✅ Statut de commande mis à jour
- ✅ Notifications affichées correctement
- ✅ Modification de commande ne crée pas de nouvelle facture
- ✅ Suppression de commande fonctionne

### Scénarios de test

**Test 1 : Création de commande**
1. Créer une nouvelle commande
2. Vérifier que la commande est créée
3. Vérifier que la facture est créée automatiquement
4. Vérifier le lien entre les deux
5. Vérifier le statut de la commande

**Test 2 : Modification de commande**
1. Modifier une commande existante
2. Vérifier que la commande est mise à jour
3. Vérifier que la facture existante reste liée
4. Vérifier qu'aucune nouvelle facture n'est créée

**Test 3 : Suppression de commande**
1. Supprimer une commande
2. Vérifier que la commande est supprimée
3. Vérifier que la facture existe toujours
4. Vérifier les notifications

## Améliorations futures

### Possibilités d'amélioration

1. **Option de création de facture**
   - Ajouter une case à cocher "Créer une facture"
   - Permettre de choisir si on veut une facture ou non

2. **Personnalisation de la facture**
   - Permettre de modifier la date d'échéance avant création
   - Ajouter des notes sur la facture

3. **Gestion des statuts**
   - Permettre de choisir le statut initial de la commande
   - Options : "en_cours", "validée", etc.

4. **Numérotation personnalisée**
   - Permettre de définir le format de numérotation
   - Support de différents formats par année

5. **Validation avant création**
   - Afficher un récapitulatif avant création
   - Confirmer la création de la facture

## Conclusion

La création automatique de facture simplifie considérablement le workflow de gestion des commandes. Chaque commande créée génère automatiquement une facture liée, garantissant la cohérence des données et réduisant les erreurs manuelles. Le système est maintenant prêt pour la production avec un processus optimisé et intuitif.
