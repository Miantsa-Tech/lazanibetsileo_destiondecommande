import React from 'react';
import { Bell, X, Check } from 'lucide-react';
import { formatDate } from '../utils/format';

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

interface AllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRemove: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export default function AllNotificationsModal({ isOpen, onClose, notifications, onRemove, onMarkAsRead }: AllNotificationsModalProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl shadow-xl animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Toutes les notifications</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''} • {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">Aucune notification</p>
              <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Vous n'avez pas encore de notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead && onMarkAsRead(notif.id)}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    !notif.read
                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm ${!notif.read ? 'font-bold' : 'font-semibold'} text-gray-800 dark:text-slate-100`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-400 dark:text-slate-500">{formatDate(notif.date)}</p>
                          {notif.read && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Lu
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(notif.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-500 flex-shrink-0 transition-colors"
                        title="Supprimer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#2D5016] hover:bg-[#3D6B1E] text-white rounded-lg text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
