import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import { useToast } from "../contexts/ToastContext";
import TripModal from "./TripModal";
import { getUsers, updateUser } from "../utils/storage";

const getStatusClass = (status) => {
  const map = {
    assigned: "tm-badge-assigned",
    accepted: "tm-badge-accepted",
    "in-progress": "tm-badge-progress",
    completed: "tm-badge-completed",
    rejected: "tm-badge-rejected",
  };
  return `tm-badge ${map[status] || "tm-badge-cancelled"}`;
};

function EmptyTrips() {
  return (
    <div className="tm-empty">
      <div className="tm-empty-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
        No active trips
      </p>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "220px" }}>
        You'll see assigned trips here once an admin dispatches one to you.
      </p>
    </div>
  );
}

function DriverDashboard() {
  const { user } = useAuth();
  const { getTripsByDriverId, updateTrip, refreshTrips } = useTrips();
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverStatus, setDriverStatus] = useState("available");

  useEffect(() => {
    if (user) {
      const users = getUsers();
      const current = users.find(u => u.id === user.id);
      if (current?.status) setDriverStatus(current.status);
    }
  }, [user]);

  if (!user || user.role !== "driver") return null;

  const driverTrips = getTripsByDriverId(user.id);
  const activeTrips = driverTrips.filter(t => ["assigned", "accepted", "in-progress"].includes(t.status));
  const completedTrips = driverTrips.filter(t => t.status === "completed");
  const todayTrips = completedTrips.filter(t => {
    return new Date(t.date).toDateString() === new Date().toDateString();
  });
  const todayEarnings = todayTrips.reduce((s, t) => s + t.price, 0);

  const toggleDriverStatus = () => {
    const newStatus = driverStatus === "available" ? "offline" : "available";
    const users = getUsers();
    const driverUser = users.find(u => u.id === user.id);
    if (driverUser) {
      updateUser({ ...driverUser, status: newStatus });
      setDriverStatus(newStatus);
      toast({ title: "Status Updated", description: `You are now ${newStatus}.` });
    }
  };

  const handleTripAction = (action, tripId) => {
    const trip = driverTrips.find(t => t.id === tripId);
    if (!trip) return;
    let newStatus, message;
    switch (action) {
      case "accept": newStatus = "accepted"; message = "Trip accepted"; break;
      case "reject":
        newStatus = "rejected"; message = "Trip rejected";
        const u1 = getUsers().find(u => u.id === user.id);
        if (u1) { updateUser({ ...u1, status: "available" }); setDriverStatus("available"); }
        break;
      case "start": newStatus = "in-progress"; message = "Trip started — safe travels!"; break;
      case "complete":
        newStatus = "completed"; message = "Trip completed successfully";
        const u2 = getUsers().find(u => u.id === user.id);
        if (u2) { updateUser({ ...u2, status: "available" }); setDriverStatus("available"); }
        break;
      default: return;
    }
    updateTrip({ ...trip, status: newStatus });
    toast({ title: "Trip Updated", description: message });
    refreshTrips();
    setIsModalOpen(false);
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  return (
    <div className="tm-page" style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

      {/* ── Driver Status Hero ── */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem 2.5rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="tm-blob" style={{
          width: "300px", height: "300px",
          background: driverStatus === "available" ? "#10B981" : "#EF4444",
          right: "-5%", top: "-40%",
          opacity: 0.06,
          transition: "background 0.5s ease",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <span className="tm-hero-badge" style={{
              background: driverStatus === "available" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              borderColor: driverStatus === "available" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
              color: driverStatus === "available" ? "#34D399" : "#FCA5A5",
            }}>
              <div className={driverStatus === "available" ? "tm-dot tm-dot-available" : "tm-dot tm-dot-offline"} />
              {driverStatus === "available" ? "Online · Ready for trips" : "Offline · Not accepting trips"}
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}>
            {user.name?.split(" ")[0]}'s Dashboard
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            {user.vehicle} · ⭐ {user.rating || 4.8} rating
          </p>
        </div>

        <button
          onClick={toggleDriverStatus}
          className={`tm-btn tm-btn-lg ${driverStatus === "available" ? "tm-btn-ghost" : "tm-btn-success"}`}
          style={{ position: "relative", zIndex: 1 }}
        >
          {driverStatus === "available" ? (
            <>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              Go Offline
            </>
          ) : (
            <>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Go Online
            </>
          )}
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
      className="driver-stats-grid"
      >
        <div className="tm-stat tm-stat-green">
          <p style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
            ₹{todayEarnings.toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>Today's Earnings</p>
        </div>
        <div className="tm-stat tm-stat-blue">
          <p style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
            {completedTrips.length}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>Total Completed</p>
        </div>
        <div className="tm-stat tm-stat-amber">
          <p style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
            {user.rating || 4.8}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>Avg. Rating ⭐</p>
        </div>
      </div>

      {/* ── Active Trips ── */}
      <div className="tm-card">
        <div className="tm-section-header">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)" }}>
            <path d="M5 17H3a1 1 0 01-1-1v-5l2-5h12l2 5v5a1 1 0 01-1 1h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="tm-section-title">My Trips</span>
          {activeTrips.length > 0 && (
            <span className="tm-badge tm-badge-assigned" style={{ marginLeft: "auto" }}>
              {activeTrips.length} active
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {activeTrips.length === 0 ? (
            <EmptyTrips />
          ) : (
            activeTrips.map(trip => (
              <div key={trip.id} style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1rem 1.125rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {trip.customerName}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {trip.from} → {trip.to}
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "1px" }}>
                      {new Date(trip.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {trip.distance}km
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={getStatusClass(trip.status)}>
                      {trip.status}
                    </span>
                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginTop: "0.375rem" }}>
                      ₹{trip.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {trip.status === "assigned" && (
                    <>
                      <button onClick={() => handleTripAction("accept", trip.id)} className="tm-btn tm-btn-success tm-btn-sm">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Accept
                      </button>
                      <button onClick={() => handleTripAction("reject", trip.id)} className="tm-btn tm-btn-danger tm-btn-sm">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                        Reject
                      </button>
                    </>
                  )}
                  {trip.status === "accepted" && (
                    <button onClick={() => handleTripAction("start", trip.id)} className="tm-btn tm-btn-purple tm-btn-sm">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Start Trip
                    </button>
                  )}
                  {trip.status === "in-progress" && (
                    <button onClick={() => handleTripAction("complete", trip.id)} className="tm-btn tm-btn-success tm-btn-sm">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Complete Trip
                    </button>
                  )}
                  <button onClick={() => handleTripClick(trip)} className="tm-btn tm-btn-ghost tm-btn-sm">
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TripModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTrip(null); }}
        onAction={handleTripAction}
        userRole="driver"
      />

      <style>{`
        @media (max-width: 768px) {
          .driver-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default DriverDashboard;
