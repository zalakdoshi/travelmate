import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TripProvider } from "./contexts/TripContext";
import { ToastProvider } from "./contexts/ToastContext";
import LoginScreen from "./contexts/LoginScreen";
import Navigation from "./contexts/Navigation";
import CustomerDashboard from "./contexts/CustomerDashboard";
import AdminDashboard from "./contexts/AdminDashboard";
import DriverDashboard from "./contexts/DriverDashboard";
import LandingPage from "./contexts/LandingPage";
import "./index.css";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [showLanding, setShowLanding] = useState(true);

  // If authenticated, always show the dashboard
  if (isAuthenticated && user) {
    const renderDashboard = () => {
      switch (user.role) {
        case "customer": return <CustomerDashboard />;
        case "admin":    return <AdminDashboard />;
        case "driver":   return <DriverDashboard />;
        default:
          return (
            <div style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div className="tm-empty">
                <div className="tm-empty-icon">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>Invalid user role</p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Please contact support.
                </p>
              </div>
            </div>
          );
      }
    };

    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navigation />
        <TripProvider>{renderDashboard()}</TripProvider>
      </div>
    );
  }

  // Show landing page first, then login
  if (showLanding) {
    return (
      <LandingPage onGetStarted={() => setShowLanding(false)} />
    );
  }

  return <LoginScreen />;
}

function TravelApp() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default TravelApp;
