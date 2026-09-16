// Données simulées pour Lazan'iBetsileo
// Contexte malgache - Région Betsileo

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  type: 'particulier' | 'entreprise' | 'vip' | 'grossiste';
  dateCreation: string;
  chiffreAffaires: number;
  actif: boolean;
}

export interface Categorie {
  id: string;
  nom: string;
  description: string;
}

export interface Produit {
  id: string;
  nom: string;
  description: string;
  categorieId: string;
  prixUnitaire: number;
  prixGros: number;
  stock: number;
  stockMinimum: number;
  image: string;
  actif: boolean;
  dateCreation: string;
}

export interface LigneCommande {
  produitId: string;
  nomProduit: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Commande {
  id: string;
  numero: string;
  clientId: string;
  nomClient: string;
  lignes: LigneCommande[];
  montantTotal: number;
  statut: 'en_cours' | 'validee' | 'annulee' | 'livree';
  dateCreation: string;
  dateModification: string;
  notes: string;
}

export interface Facture {
  id: string;
  numero: string;
  commandeId: string;
  numeroCommande: string;
  clientId: string;
  nomClient: string;
  montantTotal: number;
  montantPaye: number;
  statutPaiement: 'non_paye' | 'partiel' | 'paye';
  dateCreation: string;
  dateEcheance: string;
}

export interface Reglement {
  id: string;
  numero: string;
  factureId: string;
  numeroFacture: string;
  clientId: string;
  nomClient: string;
  montant: number;
  typeReglement: 'especes' | 'cheque' | 'cb' | 'virement' | 'mvola' | 'orange_money' | 'airtel_money';
  dateReglement: string;
  reference: string;
  notes: string;
}

export interface Livraison {
  id: string;
  numero: string;
  commandeId: string;
  numeroCommande: string;
  clientId: string;
  nomClient: string;
  adresseLivraison: string;
  statut: 'en_attente' | 'en_cours' | 'livree' | 'annulee';
  datePlanifiee: string;
  dateLivraison: string | null;
  livreur: string;
  notes: string;
}

// Catégories de produits (artisanat et produits malgaches)
export const categories: Categorie[] = [
  { id: 'cat1', nom: 'Produits Alimentaires', description: 'Riz, épices, conserves locales' },
  { id: 'cat2', nom: 'Artisanat', description: 'Objets artisanaux, vannerie, sculpture' },
  { id: 'cat3', nom: 'Textile', description: 'Lamba, vêtements traditionnels' },
  { id: 'cat4', nom: 'Épices & Condiments', description: 'Vanille, girofle, poivre' },
  { id: 'cat5', nom: 'Boissons', description: 'Jus naturels, rhum, café' },
  { id: 'cat6', nom: 'Cosmétiques Naturels', description: 'Huiles essentielles, savons' },
];

// Clients réalistes
export const clients: Client[] = [
  { id: 'cli1', nom: 'Rakoto', prenom: 'Jean', email: 'jean.rakoto@gmail.com', telephone: '+261 34 12 345 67', adresse: 'Lot II M 45 Ambatobe', ville: 'Antananarivo', type: 'particulier', dateCreation: '2024-01-15', chiffreAffaires: 2450000, actif: true },
  { id: 'cli2', nom: 'Rasoa', prenom: 'Marie', email: 'marie.rasoa@yahoo.fr', telephone: '+261 33 45 678 90', adresse: 'Rue Rainilaiarivony 23', ville: 'Fianarantsoa', type: 'vip', dateCreation: '2024-02-10', chiffreAffaires: 8750000, actif: true },
  { id: 'cli3', nom: 'Rabe & Fils SARL', prenom: '', email: 'contact@rabefils.mg', telephone: '+261 32 11 222 33', adresse: 'Zone Industrielle Tanjombato', ville: 'Antananarivo', type: 'entreprise', dateCreation: '2024-01-20', chiffreAffaires: 15200000, actif: true },
  { id: 'cli4', nom: 'Randrianarisoa', prenom: 'Pierre', email: 'pierre.r@outlook.com', telephone: '+261 34 56 789 01', adresse: 'Lot 123 Ankadivato', ville: 'Antsirabe', type: 'grossiste', dateCreation: '2024-03-05', chiffreAffaires: 22300000, actif: true },
  { id: 'cli5', nom: 'Andriamihaja', prenom: 'Hery', email: 'hery.andria@gmail.com', telephone: '+261 33 78 901 23', adresse: 'Lot 45 Ambohimanarina', ville: 'Antananarivo', type: 'particulier', dateCreation: '2024-03-15', chiffreAffaires: 1200000, actif: true },
  { id: 'cli6', nom: 'Madagascar Export SA', prenom: '', email: 'export@madagex.mg', telephone: '+261 20 22 333 44', adresse: 'Zone Franche Ambatolampy', ville: 'Ambatolampy', type: 'entreprise', dateCreation: '2024-02-28', chiffreAffaires: 35600000, actif: true },
  { id: 'cli7', nom: 'Ravelomanana', prenom: 'Voahangy', email: 'voahangy.r@gmail.com', telephone: '+261 34 90 123 45', adresse: 'Rue de la Gare 67', ville: 'Fianarantsoa', type: 'vip', dateCreation: '2024-04-01', chiffreAffaires: 5400000, actif: true },
  { id: 'cli8', nom: 'Ratsirarson', prenom: 'Bako', email: 'bako.ratsira@yahoo.fr', telephone: '+261 32 45 678 01', adresse: 'Lot 78 Ambalavao', ville: 'Ambalavao', type: 'grossiste', dateCreation: '2024-04-10', chiffreAffaires: 18900000, actif: true },
  { id: 'cli9', nom: 'Razafindrabe', prenom: 'Noro', email: 'noro.razafi@gmail.com', telephone: '+261 33 12 345 67', adresse: 'Lot 234 Ivato', ville: 'Antananarivo', type: 'particulier', dateCreation: '2024-05-01', chiffreAffaires: 890000, actif: true },
  { id: 'cli10', nom: 'Betsileo Trading', prenom: '', email: 'info@betsileotrading.mg', telephone: '+261 20 75 111 22', adresse: 'Centre-ville', ville: 'Fianarantsoa', type: 'entreprise', dateCreation: '2024-01-05', chiffreAffaires: 28400000, actif: true },
];

// Produits réalistes
export const produits: Produit[] = [
  { id: 'prod1', nom: 'Riz de Vakinankaratra (50kg)', description: 'Riz blanc premium de la région Vakinankaratra', categorieId: 'cat1', prixUnitaire: 180000, prixGros: 165000, stock: 45, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-01-01' },
  { id: 'prod2', nom: 'Vanille Bourbon (1kg)', description: 'Vanille de première qualité, grade A', categorieId: 'cat4', prixUnitaire: 1500000, prixGros: 1350000, stock: 12, stockMinimum: 5, image: '', actif: true, dateCreation: '2024-01-01' },
  { id: 'prod3', nom: 'Lamba Hoany Traditionnel', description: 'Tissu traditionnel malgache tissé main', categorieId: 'cat3', prixUnitaire: 85000, prixGros: 70000, stock: 30, stockMinimum: 8, image: '', actif: true, dateCreation: '2024-01-15' },
  { id: 'prod4', nom: 'Girofle Séché (1kg)', description: 'Clous de girofle de Sainte-Marie', categorieId: 'cat4', prixUnitaire: 45000, prixGros: 38000, stock: 60, stockMinimum: 15, image: '', actif: true, dateCreation: '2024-02-01' },
  { id: 'prod5', nom: 'Panier Tressé Betsileo', description: 'Panier artisanal en raphia, fait main', categorieId: 'cat2', prixUnitaire: 35000, prixGros: 28000, stock: 25, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-02-10' },
  { id: 'prod6', nom: 'Café Vert de Madagascar (5kg)', description: 'Grains de café arabica de la région Vakinankaratra', categorieId: 'cat5', prixUnitaire: 125000, prixGros: 110000, stock: 20, stockMinimum: 8, image: '', actif: true, dateCreation: '2024-02-15' },
  { id: 'prod7', nom: 'Huile Essentielle Ravintsara (100ml)', description: 'Huile essentielle pure de ravintsara', categorieId: 'cat6', prixUnitaire: 55000, prixGros: 45000, stock: 40, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-03-01' },
  { id: 'prod8', nom: 'Savon Artisanal au Curcuma', description: 'Savon naturel fait main au curcuma malgache', categorieId: 'cat6', prixUnitaire: 12000, prixGros: 9000, stock: 100, stockMinimum: 20, image: '', actif: true, dateCreation: '2024-03-10' },
  { id: 'prod9', nom: 'Rhum Arrangé Vanille (70cl)', description: 'Rhum arrangé à la vanille de Madagascar', categorieId: 'cat5', prixUnitaire: 75000, prixGros: 62000, stock: 35, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-03-15' },
  { id: 'prod10', nom: 'Poivre Noir de Madagascar (500g)', description: 'Poivre noir premium, récolte sélectionnée', categorieId: 'cat4', prixUnitaire: 65000, prixGros: 55000, stock: 3, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-04-01' },
  { id: 'prod11', nom: 'Nappe Brodée Antemoro', description: 'Nappe brodée sur papier Antemoro traditionnel', categorieId: 'cat2', prixUnitaire: 120000, prixGros: 100000, stock: 15, stockMinimum: 5, image: '', actif: true, dateCreation: '2024-04-10' },
  { id: 'prod12', nom: 'Miel de la Forêt (1kg)', description: 'Miel naturel de la forêt de Betsileo', categorieId: 'cat1', prixUnitaire: 48000, prixGros: 40000, stock: 28, stockMinimum: 10, image: '', actif: true, dateCreation: '2024-04-15' },
];

// Commandes
export const commandes: Commande[] = [
  { id: 'cmd1', numero: 'CMD-2024-001', clientId: 'cli2', nomClient: 'Rasoa Marie', lignes: [{ produitId: 'prod2', nomProduit: 'Vanille Bourbon (1kg)', quantite: 2, prixUnitaire: 1500000, total: 3000000 }, { produitId: 'prod4', nomProduit: 'Girofle Séché (1kg)', quantite: 5, prixUnitaire: 45000, total: 225000 }], montantTotal: 3225000, statut: 'livree', dateCreation: '2024-05-10', dateModification: '2024-05-15', notes: 'Client VIP - livraison prioritaire' },
  { id: 'cmd2', numero: 'CMD-2024-002', clientId: 'cli3', nomClient: 'Rabe & Fils SARL', lignes: [{ produitId: 'prod1', nomProduit: 'Riz de Vakinankaratra (50kg)', quantite: 20, prixUnitaire: 165000, total: 3300000 }, { produitId: 'prod6', nomProduit: 'Café Vert de Madagascar (5kg)', quantite: 10, prixUnitaire: 110000, total: 1100000 }], montantTotal: 4400000, statut: 'validee', dateCreation: '2024-06-01', dateModification: '2024-06-02', notes: 'Commande en gros' },
  { id: 'cmd3', numero: 'CMD-2024-003', clientId: 'cli4', nomClient: 'Randrianarisoa Pierre', lignes: [{ produitId: 'prod3', nomProduit: 'Lamba Hoany Traditionnel', quantite: 15, prixUnitaire: 70000, total: 1050000 }, { produitId: 'prod5', nomProduit: 'Panier Tressé Betsileo', quantite: 20, prixUnitaire: 28000, total: 560000 }], montantTotal: 1610000, statut: 'en_cours', dateCreation: '2024-06-10', dateModification: '2024-06-10', notes: '' },
  { id: 'cmd4', numero: 'CMD-2024-004', clientId: 'cli1', nomClient: 'Rakoto Jean', lignes: [{ produitId: 'prod7', nomProduit: 'Huile Essentielle Ravintsara (100ml)', quantite: 3, prixUnitaire: 55000, total: 165000 }, { produitId: 'prod8', nomProduit: 'Savon Artisanal au Curcuma', quantite: 10, prixUnitaire: 12000, total: 120000 }], montantTotal: 285000, statut: 'livree', dateCreation: '2024-06-15', dateModification: '2024-06-20', notes: '' },
  { id: 'cmd5', numero: 'CMD-2024-005', clientId: 'cli6', nomClient: 'Madagascar Export SA', lignes: [{ produitId: 'prod2', nomProduit: 'Vanille Bourbon (1kg)', quantite: 10, prixUnitaire: 1350000, total: 13500000 }, { produitId: 'prod10', nomProduit: 'Poivre Noir de Madagascar (500g)', quantite: 20, prixUnitaire: 55000, total: 1100000 }], montantTotal: 14600000, statut: 'validee', dateCreation: '2024-07-01', dateModification: '2024-07-02', notes: 'Export international' },
  { id: 'cmd6', numero: 'CMD-2024-006', clientId: 'cli7', nomClient: 'Ravelomanana Voahangy', lignes: [{ produitId: 'prod9', nomProduit: 'Rhum Arrangé Vanille (70cl)', quantite: 6, prixUnitaire: 75000, total: 450000 }, { produitId: 'prod12', nomProduit: 'Miel de la Forêt (1kg)', quantite: 5, prixUnitaire: 48000, total: 240000 }], montantTotal: 690000, statut: 'en_cours', dateCreation: '2024-07-10', dateModification: '2024-07-10', notes: 'Livraison à Fianarantsoa' },
  { id: 'cmd7', numero: 'CMD-2024-007', clientId: 'cli8', nomClient: 'Ratsirarson Bako', lignes: [{ produitId: 'prod1', nomProduit: 'Riz de Vakinankaratra (50kg)', quantite: 50, prixUnitaire: 165000, total: 8250000 }, { produitId: 'prod4', nomProduit: 'Girofle Séché (1kg)', quantite: 30, prixUnitaire: 38000, total: 1140000 }], montantTotal: 9390000, statut: 'validee', dateCreation: '2024-07-15', dateModification: '2024-07-16', notes: 'Grossiste - prix négocié' },
  { id: 'cmd8', numero: 'CMD-2024-008', clientId: 'cli5', nomClient: 'Andriamihaja Hery', lignes: [{ produitId: 'prod11', nomProduit: 'Nappe Brodée Antemoro', quantite: 2, prixUnitaire: 120000, total: 240000 }], montantTotal: 240000, statut: 'annulee', dateCreation: '2024-07-20', dateModification: '2024-07-22', notes: 'Annulée par le client' },
  { id: 'cmd9', numero: 'CMD-2024-009', clientId: 'cli10', nomClient: 'Betsileo Trading', lignes: [{ produitId: 'prod3', nomProduit: 'Lamba Hoany Traditionnel', quantite: 30, prixUnitaire: 70000, total: 2100000 }, { produitId: 'prod5', nomProduit: 'Panier Tressé Betsileo', quantite: 50, prixUnitaire: 28000, total: 1400000 }, { produitId: 'prod11', nomProduit: 'Nappe Brodée Antemoro', quantite: 10, prixUnitaire: 100000, total: 1000000 }], montantTotal: 4500000, statut: 'livree', dateCreation: '2024-08-01', dateModification: '2024-08-10', notes: 'Commande artisanat' },
  { id: 'cmd10', numero: 'CMD-2024-010', clientId: 'cli9', nomClient: 'Razafindrabe Noro', lignes: [{ produitId: 'prod8', nomProduit: 'Savon Artisanal au Curcuma', quantite: 5, prixUnitaire: 12000, total: 60000 }, { produitId: 'prod7', nomProduit: 'Huile Essentielle Ravintsara (100ml)', quantite: 2, prixUnitaire: 55000, total: 110000 }], montantTotal: 170000, statut: 'en_cours', dateCreation: '2024-08-15', dateModification: '2024-08-15', notes: '' },
];

// Factures
export const factures: Facture[] = [
  { id: 'fac1', numero: 'FAC-2024-001', commandeId: 'cmd1', numeroCommande: 'CMD-2024-001', clientId: 'cli2', nomClient: 'Rasoa Marie', montantTotal: 3225000, montantPaye: 3225000, statutPaiement: 'paye', dateCreation: '2024-05-10', dateEcheance: '2024-06-10' },
  { id: 'fac2', numero: 'FAC-2024-002', commandeId: 'cmd2', numeroCommande: 'CMD-2024-002', clientId: 'cli3', nomClient: 'Rabe & Fils SARL', montantTotal: 4400000, montantPaye: 2200000, statutPaiement: 'partiel', dateCreation: '2024-06-01', dateEcheance: '2024-07-01' },
  { id: 'fac3', numero: 'FAC-2024-003', commandeId: 'cmd3', numeroCommande: 'CMD-2024-003', clientId: 'cli4', nomClient: 'Randrianarisoa Pierre', montantTotal: 1610000, montantPaye: 0, statutPaiement: 'non_paye', dateCreation: '2024-06-10', dateEcheance: '2024-07-10' },
  { id: 'fac4', numero: 'FAC-2024-004', commandeId: 'cmd4', numeroCommande: 'CMD-2024-004', clientId: 'cli1', nomClient: 'Rakoto Jean', montantTotal: 285000, montantPaye: 285000, statutPaiement: 'paye', dateCreation: '2024-06-15', dateEcheance: '2024-07-15' },
  { id: 'fac5', numero: 'FAC-2024-005', commandeId: 'cmd5', numeroCommande: 'CMD-2024-005', clientId: 'cli6', nomClient: 'Madagascar Export SA', montantTotal: 14600000, montantPaye: 7300000, statutPaiement: 'partiel', dateCreation: '2024-07-01', dateEcheance: '2024-08-01' },
  { id: 'fac6', numero: 'FAC-2024-006', commandeId: 'cmd6', numeroCommande: 'CMD-2024-006', clientId: 'cli7', nomClient: 'Ravelomanana Voahangy', montantTotal: 690000, montantPaye: 0, statutPaiement: 'non_paye', dateCreation: '2024-07-10', dateEcheance: '2024-08-10' },
  { id: 'fac7', numero: 'FAC-2024-007', commandeId: 'cmd7', numeroCommande: 'CMD-2024-007', clientId: 'cli8', nomClient: 'Ratsirarson Bako', montantTotal: 9390000, montantPaye: 9390000, statutPaiement: 'paye', dateCreation: '2024-07-15', dateEcheance: '2024-08-15' },
  { id: 'fac8', numero: 'FAC-2024-008', commandeId: 'cmd9', numeroCommande: 'CMD-2024-009', clientId: 'cli10', nomClient: 'Betsileo Trading', montantTotal: 4500000, montantPaye: 4500000, statutPaiement: 'paye', dateCreation: '2024-08-01', dateEcheance: '2024-09-01' },
  { id: 'fac9', numero: 'FAC-2024-009', commandeId: 'cmd10', numeroCommande: 'CMD-2024-010', clientId: 'cli9', nomClient: 'Razafindrabe Noro', montantTotal: 170000, montantPaye: 0, statutPaiement: 'non_paye', dateCreation: '2024-08-15', dateEcheance: '2024-09-15' },
];

// Règlements
export const reglements: Reglement[] = [
  { id: 'reg1', numero: 'REG-2024-001', factureId: 'fac1', numeroFacture: 'FAC-2024-001', clientId: 'cli2', nomClient: 'Rasoa Marie', montant: 3225000, typeReglement: 'mvola', dateReglement: '2024-05-12', reference: 'MV-20240512-001', notes: 'Paiement complet via MVola' },
  { id: 'reg2', numero: 'REG-2024-002', factureId: 'fac2', numeroFacture: 'FAC-2024-002', clientId: 'cli3', nomClient: 'Rabe & Fils SARL', montant: 2200000, typeReglement: 'virement', dateReglement: '2024-06-05', reference: 'VIR-BOA-20240605', notes: 'Paiement partiel - reste 2 200 000 Ar' },
  { id: 'reg3', numero: 'REG-2024-003', factureId: 'fac4', numeroFacture: 'FAC-2024-004', clientId: 'cli1', nomClient: 'Rakoto Jean', montant: 285000, typeReglement: 'especes', dateReglement: '2024-06-18', reference: 'ESP-001', notes: '' },
  { id: 'reg4', numero: 'REG-2024-004', factureId: 'fac5', numeroFacture: 'FAC-2024-005', clientId: 'cli6', nomClient: 'Madagascar Export SA', montant: 7300000, typeReglement: 'virement', dateReglement: '2024-07-05', reference: 'VIR-BMOI-20240705', notes: 'Premier versement - 50%' },
  { id: 'reg5', numero: 'REG-2024-005', factureId: 'fac7', numeroFacture: 'FAC-2024-007', clientId: 'cli8', nomClient: 'Ratsirarson Bako', montant: 9390000, typeReglement: 'cheque', dateReglement: '2024-07-20', reference: 'CHQ-2024-001234', notes: 'Chèque de banque' },
  { id: 'reg6', numero: 'REG-2024-006', factureId: 'fac8', numeroFacture: 'FAC-2024-008', clientId: 'cli10', nomClient: 'Betsileo Trading', montant: 4500000, typeReglement: 'orange_money', dateReglement: '2024-08-05', reference: 'OM-20240805-BET', notes: 'Paiement via Orange Money' },
];

// Livraisons
export const livraisons: Livraison[] = [
  { id: 'liv1', numero: 'LIV-2024-001', commandeId: 'cmd1', numeroCommande: 'CMD-2024-001', clientId: 'cli2', nomClient: 'Rasoa Marie', adresseLivraison: 'Rue Rainilaiarivony 23, Fianarantsoa', statut: 'livree', datePlanifiee: '2024-05-12', dateLivraison: '2024-05-12', livreur: 'Tahina', notes: 'Livré à temps' },
  { id: 'liv2', numero: 'LIV-2024-002', commandeId: 'cmd2', numeroCommande: 'CMD-2024-002', clientId: 'cli3', nomClient: 'Rabe & Fils SARL', adresseLivraison: 'Zone Industrielle Tanjombato, Antananarivo', statut: 'en_cours', datePlanifiee: '2024-06-05', dateLivraison: null, livreur: 'Fidy', notes: 'En cours de livraison' },
  { id: 'liv3', numero: 'LIV-2024-003', commandeId: 'cmd4', numeroCommande: 'CMD-2024-004', clientId: 'cli1', nomClient: 'Rakoto Jean', adresseLivraison: 'Lot II M 45 Ambatobe, Antananarivo', statut: 'livree', datePlanifiee: '2024-06-18', dateLivraison: '2024-06-18', livreur: 'Tahina', notes: '' },
  { id: 'liv4', numero: 'LIV-2024-004', commandeId: 'cmd6', numeroCommande: 'CMD-2024-006', clientId: 'cli7', nomClient: 'Ravelomanana Voahangy', adresseLivraison: 'Rue de la Gare 67, Fianarantsoa', statut: 'en_attente', datePlanifiee: '2024-07-15', dateLivraison: null, livreur: 'Soa', notes: 'En attente de validation' },
  { id: 'liv5', numero: 'LIV-2024-005', commandeId: 'cmd7', numeroCommande: 'CMD-2024-007', clientId: 'cli8', nomClient: 'Ratsirarson Bako', adresseLivraison: 'Lot 78 Ambalavao', statut: 'en_cours', datePlanifiee: '2024-07-20', dateLivraison: null, livreur: 'Fidy', notes: 'Livraison en gros - camion' },
  { id: 'liv6', numero: 'LIV-2024-006', commandeId: 'cmd9', numeroCommande: 'CMD-2024-009', clientId: 'cli10', nomClient: 'Betsileo Trading', adresseLivraison: 'Centre-ville, Fianarantsoa', statut: 'livree', datePlanifiee: '2024-08-05', dateLivraison: '2024-08-05', livreur: 'Tahina', notes: 'Livraison complète' },
];

// Données pour les graphiques du dashboard
export const ventesParMois = [
  { mois: 'Jan', ventes: 4500000, commandes: 8 },
  { mois: 'Fév', ventes: 6200000, commandes: 12 },
  { mois: 'Mar', ventes: 5800000, commandes: 10 },
  { mois: 'Avr', ventes: 7100000, commandes: 14 },
  { mois: 'Mai', ventes: 8900000, commandes: 16 },
  { mois: 'Jun', ventes: 7500000, commandes: 13 },
  { mois: 'Jul', ventes: 12400000, commandes: 18 },
  { mois: 'Aoû', ventes: 9800000, commandes: 15 },
];

export const topClients = [
  { nom: 'Madagascar Export SA', ca: 35600000 },
  { nom: 'Betsileo Trading', ca: 28400000 },
  { nom: 'Randrianarisoa Pierre', ca: 22300000 },
  { nom: 'Ratsirarson Bako', ca: 18900000 },
  { nom: 'Rabe & Fils SARL', ca: 15200000 },
];

export const topProduits = [
  { nom: 'Riz de Vakinankaratra', quantite: 120 },
  { nom: 'Vanille Bourbon', quantite: 25 },
  { nom: 'Lamba Hoany Traditionnel', quantite: 75 },
  { nom: 'Girofle Séché', quantite: 65 },
  { nom: 'Panier Tressé Betsileo', quantite: 90 },
];
