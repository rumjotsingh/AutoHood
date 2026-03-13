"use client";

import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false,
}: ConfirmDialogProps) {
  const icons = {
    danger: XCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  };

  const colors = {
    danger: {
      bg: "bg-red-100",
      text: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
  };

  const Icon = icons[type];
  const color = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${color.text}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <p className="text-gray-600 leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 ${color.button} text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
