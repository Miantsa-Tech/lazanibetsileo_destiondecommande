// Utilitaires de formatage pour Lazan'iBetsileo
// Contexte malgache : Ariary (MGA), dates JJ/MM/AAAA

/**
 * Formate un montant en Ariary (MGA)
 * Ex: 1500000 → "1 500 000 Ar"
 */
export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-MG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant) + ' Ar';
}

/**
 * Formate une date au format JJ/MM/AAAA
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  return `${jour}/${mois}/${annee}`;
}

/**
 * Formate un numéro de téléphone malgache
 */
export function formatTelephone(tel: string): string {
  return tel;
}

/**
 * Retourne la classe CSS pour un statut de commande
 */
export function getStatutCommandeClass(statut: string): string {
  switch (statut) {
    case 'en_cours': return 'bg-blue-100 text-blue-800';
    case 'validee': return 'bg-green-100 text-green-800';
    case 'annulee': return 'bg-red-100 text-red-800';
    case 'livree': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Retourne le label d'un statut de commande
 */
export function getStatutCommandeLabel(statut: string): string {
  switch (statut) {
    case 'en_cours': return 'En cours';
    case 'validee': return 'Validée';
    case 'annulee': return 'Annulée';
    case 'livree': return 'Livrée';
    default: return statut;
  }
}

/**
 * Retourne la classe CSS pour un statut de paiement
 */
export function getStatutPaiementClass(statut: string): string {
  switch (statut) {
    case 'non_paye': return 'bg-red-100 text-red-800';
    case 'partiel': return 'bg-yellow-100 text-yellow-800';
    case 'paye': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Retourne le label d'un statut de paiement
 */
export function getStatutPaiementLabel(statut: string): string {
  switch (statut) {
    case 'non_paye': return 'Non payé';
    case 'partiel': return 'Partiel';
    case 'paye': return 'Payé';
    default: return statut;
  }
}

/**
 * Retourne la classe CSS pour un statut de livraison
 */
export function getStatutLivraisonClass(statut: string): string {
  switch (statut) {
    case 'en_attente': return 'bg-gray-100 text-gray-800';
    case 'en_cours': return 'bg-blue-100 text-blue-800';
    case 'livree': return 'bg-green-100 text-green-800';
    case 'annulee': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Retourne le label d'un statut de livraison
 */
export function getStatutLivraisonLabel(statut: string): string {
  switch (statut) {
    case 'en_attente': return 'En attente';
    case 'en_cours': return 'En cours';
    case 'livree': return 'Livrée';
    case 'annulee': return 'Annulée';
    default: return statut;
  }
}

/**
 * Retourne le label d'un type de client
 */
export function getTypeClientLabel(type: string): string {
  switch (type) {
    case 'particulier': return 'Particulier';
    case 'entreprise': return 'Entreprise';
    case 'vip': return 'VIP';
    case 'grossiste': return 'Grossiste';
    default: return type;
  }
}

/**
 * Retourne la classe CSS pour un type de client
 */
export function getTypeClientClass(type: string): string {
  switch (type) {
    case 'particulier': return 'bg-blue-100 text-blue-700';
    case 'entreprise': return 'bg-purple-100 text-purple-700';
    case 'vip': return 'bg-amber-100 text-amber-700';
    case 'grossiste': return 'bg-teal-100 text-teal-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Retourne le label d'un type de règlement
 */
export function getTypeReglementLabel(type: string): string {
  switch (type) {
    case 'especes': return 'Espèces';
    case 'cheque': return 'Chèque';
    case 'cb': return 'Carte Bancaire';
    case 'virement': return 'Virement';
    case 'mvola': return 'MVola';
    case 'orange_money': return 'Orange Money';
    case 'airtel_money': return 'Airtel Money';
    default: return type;
  }
}

/**
 * Retourne la classe CSS pour un type de règlement
 */
export function getTypeReglementClass(type: string): string {
  switch (type) {
    case 'especes': return 'bg-green-100 text-green-700';
    case 'cheque': return 'bg-blue-100 text-blue-700';
    case 'cb': return 'bg-purple-100 text-purple-700';
    case 'virement': return 'bg-indigo-100 text-indigo-700';
    case 'mvola': return 'bg-red-100 text-red-700';
    case 'orange_money': return 'bg-orange-100 text-orange-700';
    case 'airtel_money': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formate un nombre pour l'affichage compact
 */
export function formatCompact(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}
