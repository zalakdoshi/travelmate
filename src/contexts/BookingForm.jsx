import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTrips } from "../contexts/TripContext";
import { useToast } from "../contexts/ToastContext";
import {
  cities, distances, vehicleRates, vehicleCategories,
} from "../utils/constants";
import { generateId } from "../utils/storage";

const vehicleIcons = {
  bike: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="5" cy="17" r="3" stroke="currentColor" strokeWidth="1.75"/>
      <circle cx="19" cy="17" r="3" stroke="currentColor" strokeWidth="1.75"/>
      <path d="M5 17l2.5-7H14l1.5 4H5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 10l2-5h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  ),
  auto: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <rect x="2" y="9" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.75"/>
      <path d="M6 9V7a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.75"/>
      <circle cx="6" cy="19" r="2" stroke="currentColor" strokeWidth="1.75"/>
      <circle cx="14" cy="19" r="2" stroke="currentColor" strokeWidth="1.75"/>
      <path d="M18 11l3 1v5h-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  car: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M5 17H3a1 1 0 01-1-1v-5l2-5h12l2 5v5a1 1 0 01-1 1h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.75"/>
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.75"/>
      <path d="M5 11h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  ),
};

function BookingForm() {
  const { user } = useAuth();
  const { addNewTrip } = useTrips();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    vehicleType: "",
    vehicleOption: "",
    requirements: "",
  });
  const [priceCalculation, setPriceCalculation] = useState(null);

  useEffect(() => {
    calculatePrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.from, formData.to, formData.vehicleOption]);

  const calculatePrice = () => {
    if (formData.from && formData.to && formData.from !== formData.to && formData.vehicleOption) {
      const routeKey = `${formData.from}-${formData.to}`;
      const distance = distances[routeKey] || 0;
      const rate = vehicleRates[formData.vehicleOption];
      if (distance > 0 && rate) {
        setPriceCalculation({ distance, rate, totalPrice: distance * rate });
        return;
      }
    }
    setPriceCalculation(null);
  };

  const handleVehicleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, vehicleType: type, vehicleOption: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || user.role !== "customer") {
      toast({ title: "Error", description: "Only customers can book trips.", variant: "destructive" });
      return;
    }
    if (!formData.from || !formData.to || formData.from === formData.to) {
      toast({ title: "Invalid Route", description: "Please select valid pickup and destination locations.", variant: "destructive" });
      return;
    }
    if (!formData.time) {
      toast({ title: "Missing Time", description: "Please select travel time.", variant: "destructive" });
      return;
    }
    if (!formData.vehicleOption) {
      toast({ title: "Missing Vehicle", description: "Please select a vehicle option.", variant: "destructive" });
      return;
    }
    if (!priceCalculation) {
      toast({ title: "Price Error", description: "Unable to calculate price for this route.", variant: "destructive" });
      return;
    }

    const trip = {
      id: generateId(),
      customerId: user.id,
      customerName: user.name,
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      vehicle: formData.vehicleOption,
      requirements: formData.requirements || "",
      price: priceCalculation.totalPrice,
      distance: priceCalculation.distance,
      status: "pending",
      driverId: null,
      driverName: null,
      createdAt: new Date().toISOString(),
    };

    addNewTrip(trip);
    toast({
      title: "Trip Booked!",
      description: `Your trip from ${formData.from} to ${formData.to} is confirmed.`,
    });

    setFormData({
      from: "",
      to: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      vehicleType: "",
      vehicleOption: "",
      requirements: "",
    });
    setPriceCalculation(null);
  };

  return (
    <div className="tm-card">
      {/* Header */}
      <div className="tm-section-header">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ color: "var(--text-secondary)" }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="tm-section-title">Book a Trip</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Route */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
          <div>
            <label className="tm-label">From</label>
            <select
              value={formData.from}
              onChange={e => setFormData(p => ({ ...p, from: e.target.value }))}
              className="tm-select"
              required
            >
              <option value="">Pickup city</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="tm-label">To</label>
            <select
              value={formData.to}
              onChange={e => setFormData(p => ({ ...p, to: e.target.value }))}
              className="tm-select"
              required
            >
              <option value="">Destination</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
          <div>
            <label className="tm-label">Travel Date</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              className="tm-input"
              required
            />
          </div>
          <div>
            <label className="tm-label">Travel Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
              className="tm-input"
              required
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="tm-label">Vehicle Category</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.625rem" }}>
            {Object.keys(vehicleCategories).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleVehicleTypeChange(type)}
                className="tm-vehicle-btn"
                style={formData.vehicleType === type ? {
                  borderColor: "var(--accent)",
                  background: "var(--accent-muted)",
                  color: "#A5B4FC",
                } : { color: "var(--text-secondary)" }}
              >
                {vehicleIcons[type]}
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, textTransform: "capitalize" }}>
                  {type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Options */}
        {formData.vehicleType && (
          <div>
            <label className="tm-label">
              {formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)} Options
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {vehicleCategories[formData.vehicleType].map(opt => (
                <label
                  key={opt.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    border: `1px solid ${formData.vehicleOption === opt.key ? "var(--accent)" : "var(--border-subtle)"}`,
                    borderRadius: "var(--radius-md)",
                    background: formData.vehicleOption === opt.key ? "var(--accent-muted)" : "var(--bg-elevated)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <input
                      type="radio"
                      name="vehicleOption"
                      value={opt.key}
                      checked={formData.vehicleOption === opt.key}
                      onChange={e => setFormData(p => ({ ...p, vehicleOption: e.target.value }))}
                      style={{ accentColor: "var(--accent)", width: "16px", height: "16px" }}
                    />
                    <span style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: formData.vehicleOption === opt.key ? "#A5B4FC" : "var(--text-primary)",
                    }}>
                      {opt.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "0.8125rem",
                    color: formData.vehicleOption === opt.key ? "#A5B4FC" : "var(--text-muted)",
                    fontWeight: 600,
                  }}>
                    ₹{opt.rate}/km
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        <div>
          <label className="tm-label">Special Requirements</label>
          <textarea
            placeholder="Any special requirements (optional)..."
            value={formData.requirements}
            onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))}
            rows={2}
            className="tm-textarea"
          />
        </div>

        {/* Price Preview */}
        {priceCalculation && (
          <div className="tm-price-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "#A5B4FC" }}>
                {priceCalculation.distance} km · ₹{priceCalculation.rate}/km
              </span>
              <span style={{ fontSize: "0.8125rem", color: "#A5B4FC" }}>
                Estimated fare
              </span>
            </div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}>
              ₹{priceCalculation.totalPrice.toLocaleString("en-IN")}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="tm-btn tm-btn-primary tm-btn-lg tm-shine"
          disabled={!priceCalculation}
          style={{ width: "100%", fontSize: "0.9375rem" }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
