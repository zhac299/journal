import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Content wrapper */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 z-10 transform scale-100 transition-all duration-300 border border-slate-200 dark:border-slate-700 text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none text-2xl leading-none cursor-pointer"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
