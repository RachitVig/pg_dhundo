import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Alias for backward compatibility
  const addToast = showToast;

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-3 p-4 pr-12 rounded-2xl shadow-xl shadow-slate-200/50 relative overflow-hidden bg-white border border-slate-100 max-w-sm`}
            >
              <div className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center ${
                toast.type === 'error' ? 'bg-rose-100 text-rose-600' :
                toast.type === 'info' ? 'bg-blue-100 text-blue-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {toast.type === 'error' ? <AlertCircle size={20} /> :
                 toast.type === 'info' ? <Info size={20} /> :
                 <CheckCircle2 size={20} />}
              </div>
              <p className="text-xs font-bold text-slate-700 leading-relaxed">{toast.message}</p>

              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Progress bar effect */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  toast.type === 'error' ? 'bg-rose-500' :
                  toast.type === 'info' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
