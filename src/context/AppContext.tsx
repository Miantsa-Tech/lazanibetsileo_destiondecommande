import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Client, Produit, Commande, Facture, Reglement, Livraison,
  clients as initialClients,
  produits as initialProduits,
  commandes as initialCommandes,
  factures as initialFactures,
  reglements as initialReglements,
  livraisons as initialLivraisons,
} from '../data/mockData';

interface User {
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'gestionnaire' | 'commercial' | 'comptable';
  photo?: string; // URL de la photo de profil (base64 ou URL)
  telephone?: string;
  adresse?: string;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  clients: Client[];
  produits: Produit[];
  commandes: Commande[];
  factures: Facture[];
  reglements: Reglement[];
  livraisons: Livraison[];

  // CRUD
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addProduit: (produit: Produit) => void;
  updateProduit: (produit: Produit) => void;
  deleteProduit: (id: string) => void;
  addCommande: (commande: Commande) => void;
  updateCommande: (commande: Commande) => void;
  deleteCommande: (id: string) => void;
  addFacture: (facture: Facture) => void;
  addReglement: (reglement: Reglement) => void;
  updateReglement: (reglement: Reglement) => void;
  addLivraison: (livraison: Livraison) => void;
  updateLivraison: (livraison: Livraison) => void;

  // Profil et logo
  updateUserProfile: (updates: Partial<User>) => void;
  companyLogo: string;
  setCompanyLogo: (logo: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [produits, setProduits] = useState<Produit[]>(initialProduits);
  const [commandes, setCommandes] = useState<Commande[]>(initialCommandes);
  const [factures, setFactures] = useState<Facture[]>(initialFactures);
  const [reglements, setReglements] = useState<Reglement[]>(initialReglements);
  const [livraisons, setLivraisons] = useState<Livraison[]>(initialLivraisons);
  const [companyLogo, setCompanyLogo] = useState<string>('');

  const login = (email: string, _password: string): boolean => {
    // Simulation d'authentification
    if (email && _password) {
      setUser({
        nom: 'Admin',
        prenom: 'Lazan\'iBetsileo',
        email: email,
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // CRUD Clients
  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const updateClient = (client: Client) => setClients(prev => prev.map(c => c.id === client.id ? client : c));
  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  // CRUD Produits
  const addProduit = (produit: Produit) => setProduits(prev => [...prev, produit]);
  const updateProduit = (produit: Produit) => setProduits(prev => prev.map(p => p.id === produit.id ? produit : p));
  const deleteProduit = (id: string) => setProduits(prev => prev.filter(p => p.id !== id));

  // CRUD Commandes
  const addCommande = (commande: Commande) => setCommandes(prev => [...prev, commande]);
  const updateCommande = (commande: Commande) => setCommandes(prev => prev.map(c => c.id === commande.id ? commande : c));
  const deleteCommande = (id: string) => setCommandes(prev => prev.filter(c => c.id !== id));

  // CRUD Factures
  const addFacture = (facture: Facture) => setFactures(prev => [...prev, facture]);

  // CRUD Règlements
  const addReglement = (reglement: Reglement) => setReglements(prev => [...prev, reglement]);
  const updateReglement = (reglement: Reglement) => setReglements(prev => prev.map(r => r.id === reglement.id ? reglement : r));

  // CRUD Livraisons
  const addLivraison = (livraison: Livraison) => setLivraisons(prev => [...prev, livraison]);
  const updateLivraison = (livraison: Livraison) => setLivraisons(prev => prev.map(l => l.id === livraison.id ? livraison : l));

  // Profil utilisateur
  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      clients,
      produits,
      commandes,
      factures,
      reglements,
      livraisons,
      addClient,
      updateClient,
      deleteClient,
      addProduit,
      updateProduit,
      deleteProduit,
      addCommande,
      updateCommande,
      deleteCommande,
      addFacture,
      addReglement,
      updateReglement,
      addLivraison,
      updateLivraison,
      updateUserProfile,
      companyLogo,
      setCompanyLogo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
