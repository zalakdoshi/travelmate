import React from "react";

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

const DetailRow = ({ label, children }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.625rem 0",
    borderBottom: "1px solid var(--border-subtle)",
  }}>
    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
      {label}
    </span>
    <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500, textAlign: "right" }}>
      {children}
    </span>
  </div>
);

function TripModal({ trip, isOpen, onClose, onAction, userRole }) {
  if (!trip || !isOpen) return null;

  const getActionButtons = () => {
    if (!onAction) return null;
    switch (userRole) {
      case "admin":
        if (trip.status === "pending") {
          return (
            <button
              onClick={() => onAction("assign", trip.id)}
              className="tm-btn tm-btn-primary"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
              Assign Driver
            </button>
          );
        }
        break;
      case "driver":
        if (trip.status === "assigned") {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => onAction("accept", trip.id)} className="tm-btn tm-btn-success">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Accept
              </button>
              <button onClick={() => onAction("reject", trip.id)} className="tm-btn tm-btn-danger">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Reject
              </button>
            </div>
          );
        } else if (trip.status === "accepted") {
          return (
            <button onClick={() => onAction("start", trip.id)} className="tm-btn tm-btn-purple">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Start Trip
            </button>
          );
        } else if (trip.status === "in-progress") {
          return (
            <button onClick={() => onAction("complete", trip.id)} className="tm-btn tm-btn-success">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Complete Trip
            </button>
          );
        }
        break;
      default:
        return null;
    }
    return null;
  };

  return (
    <div
      className="tm-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="tm-modal">
        {/* Header */}
        <div style={{
          padding: "1.5rem 1.5rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "0.25rem",
            }}>
              Trip Details
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                {trip.from} → {trip.to}
              </span>
              <span className={getStatusClass(trip.status)}>
                {trip.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#252530"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem 1.5rem" }}>
          {/* Price highlight */}
          <div style={{
            background: "var(--accent-muted)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: "0.8125rem", color: "#A5B4FC", marginBottom: "0.25rem" }}>
                Total Fare
              </p>
              <p style={{
                fontSize: "1.625rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                lineHeight: 1,
              }}>
                ₹{trip.price.toLocaleString("en-IN")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Distance</p>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {trip.distance} km
              </p>
            </div>
          </div>

          {/* Details */}
          <div>
            <DetailRow label="Customer">{trip.customerName}</DetailRow>
            <DetailRow label="Route">{trip.from} → {trip.to}</DetailRow>
            <DetailRow label="Date">
              {new Date(trip.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </DetailRow>
            <DetailRow label="Vehicle">
              <span style={{ textTransform: "capitalize" }}>{trip.vehicle}</span>
            </DetailRow>
            {trip.driverName && (
              <DetailRow label="Driver">
                <span style={{ color: "var(--success)" }}>{trip.driverName}</span>
              </DetailRow>
            )}
            {trip.requirements && (
              <DetailRow label="Requirements">
                <span style={{ color: "var(--text-secondary)", fontStyle: "italic", maxWidth: "200px" }}>
                  {trip.requirements}
                </span>
              </DetailRow>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "1rem 1.5rem 1.25rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.625rem",
          borderTop: "1px solid var(--border-subtle)",
        }}>
          <button onClick={onClose} className="tm-btn tm-btn-ghost">
            Close
          </button>
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
}

export default TripModal;
