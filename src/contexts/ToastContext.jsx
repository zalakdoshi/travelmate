import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (variant) => {
    if (variant === "destructive") {
      return (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="1.5"/>
          <path d="M12 8v4m0 4h.01" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    }
    return (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="1.5"/>
        <path d="M8 12l3 3 5-5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="tm-toast-container no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`tm-toast ${
              toast.variant === "destructive" ? "tm-toast-destructive" : "tm-toast-default"
            }`}
          >
            <div style={{ flexShrink: 0, marginTop: "1px" }}>
              {getIcon(toast.variant)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--text-primary)",
                lineHeight: "1.3",
                marginBottom: toast.description ? "0.2rem" : 0,
              }}>
                {toast.title}
              </p>
              {toast.description && (
                <p style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.4",
                }}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return { toast: context.addToast };
}
