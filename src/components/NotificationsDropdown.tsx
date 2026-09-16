import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, AlertTriangle, ShoppingCart, CreditCard, Truck, Package, Check } from 'lucide-react';
import { formatMontant, formatDate } from '../utils/format';

interface Notification {
  id: string;
  type: 'stock' | 'commande' | 'facture' | 'livraison' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function NotificationsDropdown() {
  const { produits, commandes, factures, livraisons } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Générer les notifications à partir des données réelles
  const generateNotifications = (): Notification[] => {
    const notifs: Notification[] = [];

    // Alertes stock faible
    produits.filter(p => p.stock <= 10).forEach(p => {
      notifs.push({
        id: `stock-${p.id}`,
        type: 'stock',
        title: 'Stock faible',
        message: `${p.nom} - Plus que ${p.stock} unité(s) en stock`,
        date: new Date().toISOString(),
        read: false,
        icon: <Package className="w-4 h-4" />,
        color: 'text-amber-600 bg-amber-100',
      });
    });

    // Commandes en cours
    commandes.filter(c => c.statut === 'en_cours').slice(0, 3).forEach(c => {
      notifs.push({
        id: `cmd-${c.id}`,
        type: 'commande',
        title: 'Nouvelle commande',
        message: `${c.nomClient} - ${formatMontant(c.montantTotal)}`,
        date: c.dateCreation,
        read: false,
        icon: <ShoppingCart className="w-4 h-4" />,
        color: 'text-blue-600 bg-blue-100',
      });
    });

    // Factures impayées
    factures.filter(f => f.statutPaiement === 'non_paye').forEach(f => {
      notifs.push({
        id: `fac-${f.id}`,
        type: 'facture',
        title: 'Facture impayée',
        message: `${f.nomClient} - ${formatMontant(f.montantTotal)}`,
        date: f.dateCreation,
        read: false,
        icon: <CreditCard className="w-4 h-4" />,
        color: 'text-red-600 bg-red-100',
      });
    });

    // Livraisons en attente
    livraisons.filter(l => l.statut === 'en_attente').forEach(l => {
      notifs.push({
        id: `liv-${l.id}`,
        type: 'livraison',
        title: 'Livraison en attente',
        message: `${l.nomClient} - ${l.adresseLivraison}`,
        date: l.datePlanifiee,
        read: false,
        icon: <Truck className="w-4 h-4" />,
        color: 'text-purple-600 bg-purple-100',
      });
    });

    return notifs;
  };

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-fadeIn overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-[#2D5016] hover:text-[#3D6B1E] font-medium">
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-green-50/30' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="p-0.5 rounded hover:bg-gray-200 text-gray-400 flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-400">{formatDate(notif.date)}</span>
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-[10px] text-[#2D5016] hover:underline font-medium"
                        >
                          Marquer lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
              <button className="text-xs text-[#2D5016] hover:text-[#3D6B1E] font-medium">
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
