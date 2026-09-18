import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconColor = type === 'danger' ? 'text-red-500 bg-red-100' : type === 'warning' ? 'text-amber-500 bg-amber-100' : 'text-blue-500 bg-blue-100';
  const btnColor = type === 'danger' ? 'bg-red-600 hover:bg-red-700' : type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-xl animate-fadeIn">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors ${btnColor}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
