import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="url(#nav-logo-grad)" />
    <path d="M7 14l4 4 3-6 3 4 4-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="nav-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1"/>
        <stop offset="1" stopColor="#4338CA"/>
      </linearGradient>
    </defs>
  </svg>
);

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "customer": return "tm-badge tm-badge-customer";
    case "admin":    return "tm-badge tm-badge-admin";
    case "driver":   return "tm-badge tm-badge-driver";
    default:         return "tm-badge";
  }
};

function Navigation() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="tm-nav no-print">
      <div style={{ maxWidth:"1280px",margin:"0 auto",padding:"0 1.5rem",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between" }}>

        {/* Wordmark */}
        <div style={{ display:"flex",alignItems:"center",gap:"0.625rem" }}>
          <LogoIcon />
          <span style={{ fontSize:"1.0625rem",fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.02em" }}>
            Travel<span style={{ color:"var(--accent)" }}>Mate</span>
          </span>
        </div>

        {/* Right */}
        <div style={{ display:"flex",alignItems:"center",gap:"0.875rem" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.625rem" }}>
            {/* Avatar */}
            <div style={{
              width:"32px",height:"32px",borderRadius:"50%",
              background:"linear-gradient(135deg, var(--accent), #4338CA)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"0.75rem",fontWeight:700,color:"#fff",flexShrink:0,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:"2px" }}>
              <span style={{ fontSize:"0.8125rem",fontWeight:600,color:"var(--text-primary)",lineHeight:1 }}>{user.name}</span>
              <span className={getRoleBadgeClass(user.role)} style={{ lineHeight:1 }}>{user.role}</span>
            </div>
          </div>

          <div style={{ width:"1px",height:"20px",background:"var(--border)" }} />

          <button onClick={logout} className="tm-btn tm-btn-ghost tm-btn-sm" style={{ gap:"0.375rem" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
