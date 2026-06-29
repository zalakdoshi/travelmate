import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUsers } from "../utils/storage";
import { useToast } from "./ToastContext";

const LogoIcon = () => (
  <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="url(#login-logo-grad)" />
    <path d="M7 14l4 4 3-6 3 4 4-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="login-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1"/>
        <stop offset="1" stopColor="#4F46E5"/>
      </linearGradient>
    </defs>
  </svg>
);

const roles = [
  {
    value: "customer",
    label: "Customer",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
    color: "#A5B4FC",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.35)",
  },
  {
    value: "admin",
    label: "Admin",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21l1.18-6.86L2 9.27l6.91-1.01L12 2z"
          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#34D399",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.35)",
  },
  {
    value: "driver",
    label: "Driver",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="8" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M16 8V6a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <circle cx="8.5" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="15.5" cy="16" r="1.5" fill="currentColor"/>
      </svg>
    ),
    color: "#FCD34D",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
  },
];

const vehicles = [
  {
    value: "bike",
    label: "Bike",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="5" cy="17" r="3" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="19" cy="17" r="3" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M5 17l2.5-7H14l1.5 4H5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10l2-5h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "auto",
    label: "Auto",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="9" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M6 9V7a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="6" cy="19" r="2" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="14" cy="19" r="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M18 11l3 1v5h-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: "car",
    label: "Car",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M5 17H3a1 1 0 01-1-1v-5l2-5h12l2 5v5a1 1 0 01-1 1h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M5 11h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const editorialCopy = [
  { title: "Reliable rides", sub: "Fixed pricing · No surge · Real-time tracking" },
  { title: "India-wide coverage", sub: "10 cities · 9 vehicle options · Instant booking" },
  { title: "Built for everyone", sub: "Customers, admins, and drivers — one platform" },
];

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "customer",
    vehicleType: "bike",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const [copyIndex, setCopyIndex] = useState(0);

  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    try { setDemoUsers(getUsers()); } catch (e) {}
    const interval = setInterval(() => {
      setCopyIndex(prev => (prev + 1) % editorialCopy.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast({ title: "Missing Information", description: "Please enter both username and password.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const success = await login(
          formData.username, formData.password, formData.role,
          formData.role === "driver" ? formData.vehicleType : undefined
        );
        if (success) {
          toast({ title: "Welcome back!", description: `Signed in as ${formData.role}.` });
        } else {
          toast({ title: "Login Failed", description: "Invalid credentials or role mismatch. Check your details.", variant: "destructive" });
        }
      } catch (err) {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };



  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg-base)",
    }}>
      {/* ── Left panel — editorial ── */}
      <div style={{
        flex: "0 0 45%",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
      className="login-left-panel"
      >
        {/* Blobs */}
        <div className="tm-blob" style={{
          width: "400px", height: "400px",
          background: "var(--accent)",
          top: "-15%", left: "-15%",
        }} />
        <div className="tm-blob" style={{
          width: "300px", height: "300px",
          background: "#A855F7",
          bottom: "10%", right: "-10%",
          animationDelay: "-4s",
        }} />

        {/* Grid lines */}
        <div className="tm-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", position: "relative", zIndex: 1 }}>
          <LogoIcon />
          <span style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Travel<span style={{ color: "var(--accent)" }}>Mate</span>
          </span>
        </div>

        {/* Editorial copy — cycling */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div key={copyIndex} style={{ animation: "fadeUp 0.5s ease" }}>
            <p style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.875rem",
            }}>
              TravelMate
            </p>
            <h2 style={{
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "0.875rem",
            }}>
              {editorialCopy[copyIndex].title}.
            </h2>
            <p style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}>
              {editorialCopy[copyIndex].sub}
            </p>
          </div>

          {/* Cycling dots */}
          <div style={{ display: "flex", gap: "0.375rem", marginTop: "1.75rem" }}>
            {editorialCopy.map((_, i) => (
              <div key={i} style={{
                width: i === copyIndex ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === copyIndex ? "var(--accent)" : "var(--border)",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        {/* Demo creds preview */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "0.75rem",
          }}>
            Demo Credentials
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {demoUsers.slice(0, 5).map(u => (
              <div key={u.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.75rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}>
                <div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-primary)" }}>
                    {u.name}
                  </span>
                  <span style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                  }}>
                    {u.role}{u.vehicleType ? ` · ${u.vehicleType}` : ""}
                  </span>
                </div>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.05em",
                }}>
                  {u.password}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 2rem",
        position: "relative",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
          animation: "fadeUp 0.45s ease",
        }}>
          {/* Heading */}
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "0.375rem",
          }}>
            Sign in
          </h1>
          <p style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}>
            Choose your role and enter your credentials.
          </p>

          {/* Role Selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="tm-label">Sign in as</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleInputChange("role", r.value)}
                  className="tm-role-btn"
                  style={formData.role === r.value ? {
                    borderColor: r.border,
                    background: r.bg,
                  } : {}}
                >
                  <span style={{ color: formData.role === r.value ? r.color : "var(--text-muted)" }}>
                    {r.icon}
                  </span>
                  <span style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: formData.role === r.value ? r.color : "var(--text-secondary)",
                  }}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
              {/* Username */}
              <div>
                <label className="tm-label" htmlFor="tm-username">Username</label>
                <input
                  id="tm-username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={e => handleInputChange("username", e.target.value)}
                  className="tm-input"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="tm-label" htmlFor="tm-password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="tm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={e => handleInputChange("password", e.target.value)}
                    className="tm-input"
                    style={{ paddingRight: "2.75rem" }}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Vehicle Type (driver only) */}
              {formData.role === "driver" && (
                <div>
                  <label className="tm-label">Vehicle Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
                    {vehicles.map(v => (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => handleInputChange("vehicleType", v.value)}
                        className="tm-vehicle-btn"
                        style={formData.vehicleType === v.value ? {
                          borderColor: "var(--accent)",
                          background: "var(--accent-muted)",
                          color: "#A5B4FC",
                        } : { color: "var(--text-secondary)" }}
                      >
                        {v.icon}
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="tm-btn tm-btn-primary tm-btn-lg tm-shine"
              disabled={isLoading || !formData.username || !formData.password}
              style={{ width: "100%", fontSize: "0.9375rem" }}
            >
              {isLoading ? (
                <>
                  <div className="tm-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    <polyline points="10 17 15 12 10 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                  Continue as {formData.role}
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            marginTop: "1.5rem",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            textAlign: "center",
          }}>
            Use demo credentials from the left panel to explore.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
