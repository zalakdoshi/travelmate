import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import { useToast } from "../contexts/ToastContext";
import TripModal from "./TripModal";
import { getUsers, resetStorageToDefaults } from "../utils/storage";



const StatCard = ({ value, label, colorClass }) => (
  <div className={`tm-stat ${colorClass}`}>
    <p style={{
      fontSize: "2rem",
      fontWeight: 800,
      letterSpacing: "-0.04em",
      color: "var(--text-primary)",
      lineHeight: 1,
      marginBottom: "0.5rem",
    }}>
      {value}
    </p>
    <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>
      {label}
    </p>
  </div>
);

function EmptyPending() {
  return (
    <div className="tm-empty">
      <div className="tm-empty-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>All clear</p>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "220px" }}>
        No pending trips waiting for driver assignment.
      </p>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const { trips, getPendingTrips, getAvailableDrivers, assignDriverToTrip, refreshTrips } = useTrips();
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const allUsers = getUsers();
    setDrivers(allUsers.filter(u => u.role === "driver"));
    const map = {};
    allUsers.forEach(u => { map[u.id] = u; });
    setUserMap(map);
  }, [trips]);

  if (!user || user.role !== "admin") return null;

  const pendingTrips = getPendingTrips();
  const activeTrips = trips.filter(t => ["assigned", "accepted", "in-progress"].includes(t.status));
  const completedTrips = trips.filter(t => t.status === "completed");
  const totalRevenue = completedTrips.reduce((sum, t) => sum + t.price, 0);

  const handleAssignDriver = (tripId) => {
    const available = getAvailableDrivers();
    if (available.length === 0) {
      toast({ title: "No Drivers Available", description: "All drivers are currently busy or offline.", variant: "destructive" });
      return;
    }
    const driver = available[0];
    assignDriverToTrip(tripId, driver.id);
    toast({ title: "Driver Assigned", description: `${driver.name} has been assigned to the trip.` });
    refreshTrips();
  };

  const handleTripAction = (action, tripId) => {
    if (action === "assign") handleAssignDriver(tripId);
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const getDriverDot = (status) => {
    if (status === "available") return "tm-dot tm-dot-available";
    if (status === "busy") return "tm-dot tm-dot-busy";
    return "tm-dot tm-dot-offline";
  };

  return (
    <div className="tm-page" style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <span className="tm-hero-badge" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
            Admin Dashboard
          </span>
          <h1 style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}>
            Fleet Overview
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Manage trips and drivers in real time.
          </p>
        </div>

        {/* Reset */}
        <div>
          {confirmReset ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Are you sure?</span>
              <button
                onClick={() => { resetStorageToDefaults(); window.location.reload(); }}
                className="tm-btn tm-btn-danger tm-btn-sm"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="tm-btn tm-btn-ghost tm-btn-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="tm-btn tm-btn-ghost tm-btn-sm"
              style={{ gap: "0.375rem" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 019-9 9 9 0 016.36 2.64L21 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12a9 9 0 01-9 9 9 9 0 01-6.36-2.64L3 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              Reset App
            </button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
      className="admin-stats-grid"
      >
        <StatCard value={trips.length} label="Total Trips" colorClass="tm-stat-blue" />
        <StatCard value={activeTrips.length} label="Active Trips" colorClass="tm-stat-green" />
        <StatCard value={pendingTrips.length} label="Pending" colorClass="tm-stat-amber" />
        <StatCard value={`₹${totalRevenue.toLocaleString("en-IN")}`} label="Total Revenue" colorClass="tm-stat-purple" />
      </div>

      {/* ── Main Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "1.5rem",
        alignItems: "start",
      }}
      className="admin-main-grid"
      >
        {/* Trip Management */}
        <div className="tm-card">
          <div className="tm-section-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)" }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 12h6m-6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="tm-section-title">Pending Requests</span>
            {pendingTrips.length > 0 && (
              <span className="tm-badge tm-badge-pending" style={{ marginLeft: "auto" }}>
                {pendingTrips.length}
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {pendingTrips.length === 0 ? (
              <EmptyPending />
            ) : (
              pendingTrips.slice(-10).map((trip) => (
                <div key={trip.id} style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem 1.125rem",
                  transition: "border-color 0.2s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.625rem" }}>
                    <div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        {trip.customerName}
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {trip.from} → {trip.to}
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "1px" }}>
                        {new Date(trip.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {trip.vehicle}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        ₹{trip.price.toLocaleString("en-IN")}
                      </p>
                      {trip.driverId && userMap[trip.driverId] && (
                        <p style={{ fontSize: "0.8125rem", color: "#A5B4FC", marginTop: "2px" }}>
                          {userMap[trip.driverId].name}
                        </p>
                      )}
                    </div>
                  </div>
                  {trip.requirements && (
                    <p style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.625rem",
                      fontStyle: "italic",
                    }}>
                      "{trip.requirements}"
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleAssignDriver(trip.id)}
                      className="tm-btn tm-btn-primary tm-btn-sm"
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Assign Driver
                    </button>
                    <button
                      onClick={() => handleTripClick(trip)}
                      className="tm-btn tm-btn-ghost tm-btn-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Driver Status */}
        <div className="tm-card">
          <div className="tm-section-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)" }}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="tm-section-title">Drivers</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {drivers.map(driver => (
              <div key={driver.id} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 0.875rem",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {driver.name}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {driver.vehicle} · ⭐ {driver.rating}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div className={getDriverDot(driver.status)} />
                  <span style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: driver.status === "available" ? "var(--success)"
                      : driver.status === "busy" ? "var(--danger)"
                      : "var(--text-muted)",
                  }}>
                    {driver.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TripModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTrip(null); }}
        onAction={handleTripAction}
        userRole="admin"
      />

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .admin-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
