import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import BookingForm from "./BookingForm";
import TripModal from "./TripModal";

const getStatusClass = (status) => {
  const map = {
    pending: "tm-badge-pending",
    assigned: "tm-badge-assigned",
    accepted: "tm-badge-accepted",
    "in-progress": "tm-badge-progress",
    completed: "tm-badge-completed",
    rejected: "tm-badge-rejected",
    cancelled: "tm-badge-cancelled",
  };
  return `tm-badge ${map[status] || "tm-badge-cancelled"}`;
};

function EmptyTrips() {
  return (
    <div className="tm-empty">
      <div className="tm-empty-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M9 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4m6 16h4a2 2 0 002-2V6a2 2 0 00-2-2h-4m-6 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
        No trips yet
      </p>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "200px" }}>
        Book your first ride using the form on the left.
      </p>
    </div>
  );
}

function CustomerDashboard() {
  const { user } = useAuth();
  const { getTripsByCustomerId } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user || user.role !== "customer") return null;

  const customerTrips = getTripsByCustomerId(user.id);
  const recentTrips = customerTrips.slice(-5).reverse();

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  return (
    <div className="tm-page" style={{
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "2.5rem 1.5rem",
    }}>

      {/* ── Hero ── */}
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem 2.5rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blob */}
        <div className="tm-blob" style={{
          width: "300px", height: "300px",
          background: "var(--accent)",
          right: "-5%", top: "-30%",
          opacity: 0.07,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <span className="tm-hero-badge">
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A5B4FC", display: "inline-block" }} />
              Customer Dashboard
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "0.375rem",
          }}>
            Where to next, {user.name?.split(" ")[0]}?
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>
            Book a reliable ride across India — transparent pricing, real-time tracking.
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: "1.5rem",
        alignItems: "start",
      }}
      className="customer-grid"
      >
        {/* Booking Form */}
        <BookingForm />

        {/* Recent Trips */}
        <div className="tm-card" style={{ padding: "1.5rem" }}>
          <div className="tm-section-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)" }}>
              <path d="M9 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4m6 16h4a2 2 0 002-2V6a2 2 0 00-2-2h-4m-6 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="tm-section-title">Recent Trips</span>
            <span className="tm-badge tm-badge-assigned" style={{ marginLeft: "auto" }}>
              {recentTrips.length}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recentTrips.length === 0 ? (
              <EmptyTrips />
            ) : (
              recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="tm-trip-card"
                  onClick={() => handleTripClick(trip)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && handleTripClick(trip)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        {trip.from} → {trip.to}
                      </p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "1px" }}>
                        {new Date(trip.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className={getStatusClass(trip.status)}>
                      {trip.status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      {trip.vehicle}
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      ₹{trip.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {trip.driverName && (
                    <div style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "var(--success)" }}>
                      <span style={{ marginRight: "0.25rem" }}>●</span> {trip.driverName}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TripModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTrip(null); }}
        userRole="customer"
      />

      <style>{`
        @media (max-width: 900px) {
          .customer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default CustomerDashboard;
