import React, { useState, useEffect } from "react";

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="url(#land-logo-grad)" />
    <path d="M7 14l4 4 3-6 3 4 4-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="land-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1"/>
        <stop offset="1" stopColor="#4338CA"/>
      </linearGradient>
    </defs>
  </svg>
);

const features = [
  { icon: "🗺️", color: "rgba(79,70,229,0.08)",   title: "Smart Route Planning",    desc: "Optimized routes across 10 major Indian cities. Get accurate pricing before you book." },
  { icon: "⚡", color: "rgba(217,119,6,0.08)",    title: "Instant Assignment",      desc: "Admin-powered driver assignment ensures your ride is confirmed within minutes." },
  { icon: "🚗", color: "rgba(5,150,105,0.08)",    title: "Choose Your Ride",        desc: "Bike, Auto, or Car — economy to premium. 9 vehicle options across 3 categories." },
  { icon: "📊", color: "rgba(124,58,237,0.08)",   title: "Live Trip Tracking",      desc: "Real-time status updates from pending to in-progress to completed." },
  { icon: "💰", color: "rgba(5,150,105,0.08)",    title: "Transparent Pricing",     desc: "Fixed per-km rates. Zero surge pricing. Know exactly what you'll pay upfront." },
  { icon: "🛡️", color: "rgba(79,70,229,0.08)",   title: "Role-Based Access",       desc: "Dedicated dashboards for customers, drivers, and admins — each perfectly tailored." },
];

const stats = [
  { value: "10+", label: "Cities Covered" },
  { value: "9",   label: "Vehicle Options" },
  { value: "3",   label: "User Roles" },
  { value: "₹5/km", label: "Starting Price" },
];

const roles = [
  {
    icon: "👤", role: "Customer",
    color: "rgba(79,70,229,0.08)", borderColor: "rgba(79,70,229,0.2)", textColor: "#4F46E5",
    desc: "Book trips, track rides, and manage your travel history from a clean, intuitive dashboard.",
    perks: ["Route booking","Live status","Trip history"],
  },
  {
    icon: "🛡️", role: "Admin", featured: true,
    color: "rgba(5,150,105,0.08)", borderColor: "rgba(5,150,105,0.2)", textColor: "#059669",
    desc: "Manage the entire fleet — assign drivers, monitor trips, and track revenue in real time.",
    perks: ["Driver assignment","Analytics","Fleet overview"],
  },
  {
    icon: "🚘", role: "Driver",
    color: "rgba(217,119,6,0.08)", borderColor: "rgba(217,119,6,0.2)", textColor: "#D97706",
    desc: "Accept trips, manage your schedule, and track your earnings with a dedicated driver view.",
    perks: ["Trip management","Earnings tracker","Status toggle"],
  },
];

function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", color: "var(--text-primary)" }}>

      {/* ── Navbar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "64px",
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-xs)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem",
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <LogoIcon />
            <span style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Travel<span style={{ color: "var(--accent)" }}>Mate</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={onGetStarted} className="tm-btn tm-btn-ghost" style={{ fontSize: "0.875rem" }}>
              Sign In
            </button>
            <button onClick={onGetStarted} className="tm-btn tm-btn-primary tm-shine">
              Get Started →
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "7rem 1.5rem 4rem", overflow: "hidden",
      }}>
        <div className="tm-grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div className="tm-blob" style={{ width:"600px",height:"600px", background:"#6366F1", top:"-10%",left:"-15%" }} />
        <div className="tm-blob" style={{ width:"450px",height:"450px", background:"#7C3AED", bottom:"-5%",right:"-10%", animationDelay:"-3s" }} />
        <div className="tm-blob" style={{ width:"300px",height:"300px", background:"#059669", top:"40%",right:"25%", animationDelay:"-5s" }} />

        <div style={{ maxWidth:"1280px", margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:"760px" }}>

            <div style={{ marginBottom:"1.75rem", animation:"fadeUp 0.5s ease-out" }}>
              <span className="tm-hero-badge">
                <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"var(--accent)",display:"inline-block" }} />
                Reliable rides across India
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.5rem,6vw,4.5rem)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05,
              color: "var(--text-primary)", marginBottom: "1.5rem",
              animation: "fadeUp 0.55s ease-out 0.05s both",
            }}>
              Travel smarter,<br />
              <span style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #7C3AED 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                everywhere
              </span>{" "}you go.
            </h1>

            <p style={{
              fontSize: "clamp(1rem,2vw,1.1875rem)",
              color: "var(--text-secondary)", lineHeight: 1.7,
              maxWidth: "540px", marginBottom: "2.5rem", fontWeight: 400,
              animation: "fadeUp 0.6s ease-out 0.1s both",
            }}>
              Book rides across 10 major Indian cities in seconds. Choose from bikes, autos, and cars.
              Transparent pricing, real-time tracking.
            </p>

            <div style={{
              display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap",
              animation:"fadeUp 0.65s ease-out 0.15s both",
            }}>
              <button onClick={onGetStarted} className="tm-btn tm-btn-primary tm-btn-lg tm-shine"
                style={{ fontSize:"1rem", padding:"0 2rem" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Start Booking
              </button>
              <button onClick={onGetStarted} className="tm-btn tm-btn-ghost tm-btn-lg" style={{ fontSize:"1rem" }}>
                View Demo →
              </button>
            </div>

            <p style={{ marginTop:"2rem", fontSize:"0.8125rem", color:"var(--text-muted)", animation:"fadeUp 0.7s ease-out 0.2s both" }}>
              No credit card required · Free to use · Instant access
            </p>
          </div>

          {/* Floating stats */}
          <div style={{
            position:"absolute", right:"0", top:"50%", transform:"translateY(-50%)",
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem",
            maxWidth:"320px", width:"100%", animation:"fadeUp 0.7s ease-out 0.2s both",
          }} className="hero-stats">
            {stats.map((s,i)=>(
              <div key={i} style={{
                background:"rgba(255,255,255,0.9)", border:"1px solid var(--border)",
                borderRadius:"var(--radius-lg)", padding:"1.25rem",
                backdropFilter:"blur(12px)", boxShadow:"var(--shadow-sm)",
                transition:"transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="var(--shadow-md)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="var(--shadow-sm)";}}>
                <div style={{ fontSize:"1.75rem",fontWeight:800,letterSpacing:"-0.03em",color:"var(--text-primary)",lineHeight:1,marginBottom:"0.375rem" }}>{s.value}</div>
                <div style={{ fontSize:"0.8125rem",color:"var(--text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="tm-section-divider" />

      {/* ── Features ── */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg-surface)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ marginBottom:"0.75rem" }}>
            <span style={{ fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--accent)" }}>Features</span>
          </div>
          <h2 style={{ fontSize:"clamp(1.75rem,3.5vw,2.5rem)",fontWeight:700,letterSpacing:"-0.03em",color:"var(--text-primary)",marginBottom:"0.875rem",maxWidth:"420px" }}>
            Everything you need to move.
          </h2>
          <p style={{ fontSize:"1rem",color:"var(--text-secondary)",marginBottom:"3rem",maxWidth:"400px",lineHeight:1.7 }}>
            Built for customers, drivers, and administrators — a complete travel management platform.
          </p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:"1rem" }}>
            {features.map((f,i)=>(
              <div key={i} className="tm-feature-card">
                <div className="tm-feature-icon" style={{ background:f.color }}>{f.icon}</div>
                <h3 style={{ fontSize:"0.9375rem",fontWeight:700,color:"var(--text-primary)",marginBottom:"0.5rem",letterSpacing:"-0.01em" }}>{f.title}</h3>
                <p style={{ fontSize:"0.875rem",color:"var(--text-secondary)",lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="tm-section-divider" />

      {/* ── Roles ── */}
      <section style={{ padding:"5rem 1.5rem", background:"var(--bg-base)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
          <div style={{ marginBottom:"0.75rem" }}>
            <span style={{ fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--accent)" }}>Built for everyone</span>
          </div>
          <h2 style={{ fontSize:"clamp(1.75rem,3.5vw,2.5rem)",fontWeight:700,letterSpacing:"-0.03em",color:"var(--text-primary)",marginBottom:"3rem",maxWidth:"440px" }}>
            Three roles,<br/>one platform.
          </h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:"1rem",alignItems:"start" }}>
            {roles.map((r,i)=>(
              <div key={i} style={{
                background:"var(--bg-surface)", border:`1px solid ${r.featured?r.borderColor:"var(--border)"}`,
                borderRadius:"var(--radius-xl)", padding:"1.75rem", position:"relative",
                boxShadow: r.featured ? "var(--shadow-md)" : "var(--shadow-xs)",
                transition:"transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="var(--shadow-lg)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=r.featured?"var(--shadow-md)":"var(--shadow-xs)";}}>
                {r.featured && (
                  <div style={{ position:"absolute",top:"1.25rem",right:"1.25rem" }}>
                    <span className="tm-badge" style={{ background:r.color,color:r.textColor,borderColor:r.borderColor }}>Most used</span>
                  </div>
                )}
                <div style={{ width:"48px",height:"48px",borderRadius:"var(--radius-md)",background:r.color,border:`1px solid ${r.borderColor}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.375rem",marginBottom:"1.25rem" }}>{r.icon}</div>
                <h3 style={{ fontSize:"1.125rem",fontWeight:700,letterSpacing:"-0.02em",color:"var(--text-primary)",marginBottom:"0.625rem" }}>{r.role}</h3>
                <p style={{ fontSize:"0.875rem",color:"var(--text-secondary)",lineHeight:1.65,marginBottom:"1.25rem" }}>{r.desc}</p>
                <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem" }}>
                  {r.perks.map((p,j)=>(
                    <div key={j} style={{ display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.8125rem",color:"var(--text-secondary)" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" stroke={r.textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="tm-section-divider" />

      {/* ── CTA ── */}
      <section style={{ padding:"6rem 1.5rem", background:"var(--bg-surface)", position:"relative", overflow:"hidden" }}>
        <div className="tm-blob" style={{ width:"500px",height:"500px",background:"#6366F1",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.05 }} />
        <div style={{ maxWidth:"580px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ marginBottom:"1.5rem" }}>
            <span className="tm-hero-badge">Ready to ride?</span>
          </div>
          <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,letterSpacing:"-0.04em",color:"var(--text-primary)",marginBottom:"1rem",lineHeight:1.1 }}>
            Your journey starts<br/>right now.
          </h2>
          <p style={{ fontSize:"1rem",color:"var(--text-secondary)",marginBottom:"2.5rem",lineHeight:1.7 }}>
            Join thousands of travelers already using TravelMate across India.
          </p>
          <button onClick={onGetStarted} className="tm-btn tm-btn-primary tm-btn-lg tm-shine"
            style={{ fontSize:"1rem",padding:"0 2.5rem" }}>
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop:"1px solid var(--border)", padding:"2rem 1.5rem", background:"var(--bg-base)" }}>
        <div style={{ maxWidth:"1280px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.625rem" }}>
            <LogoIcon />
            <span style={{ fontSize:"0.9375rem",fontWeight:700,letterSpacing:"-0.01em",color:"var(--text-primary)" }}>
              Travel<span style={{ color:"var(--accent)" }}>Mate</span>
            </span>
          </div>
          <p style={{ fontSize:"0.8125rem",color:"var(--text-muted)" }}>
            © 2025 TravelMate. Built for reliable travel across India.
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width:900px){ .hero-stats{ display:none !important; } }
      `}</style>
    </div>
  );
}

export default LandingPage;
