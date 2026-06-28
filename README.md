<div align="center">

# 🛣️ TravelMate

### A premium ride-booking platform built for India

**Book rides across 10 major cities · Real-time tracking · Role-based dashboards**

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) · [Report Bug](https://github.com/zalakdoshi/travelmate/issues) · [Request Feature](https://github.com/zalakdoshi/travelmate/issues)

</div>

---

## 📸 Overview

TravelMate is a production-grade ride-booking SaaS application with a **premium light-theme editorial UI**. It features three fully independent role-based dashboards — for Customers, Drivers, and Admins — each with dedicated workflows and real-time state management.

> Designed with a Linear / Framer / Stripe-inspired design language — clean typography, soft shadows, indigo accent system, and elegant micro-interactions.

---

## ✨ Features

### 🧑 Customer
- Book rides between 10 major Indian cities
- Choose from 9 vehicle options across 3 categories (Bike, Auto, Car)
- Real-time price calculation (per-km fixed rates, no surge)
- Track trip status (Pending → Assigned → In Progress → Completed)
- View last 5 recent trips with status badges

### 🛡️ Admin
- View fleet overview with live stats (Total Trips, Active, Pending, Revenue)
- Assign available drivers to pending trips in one click
- Monitor all driver statuses (Available / Busy / Offline)
- Reset app data for demo purposes

### 🚘 Driver
- Toggle availability (Online / Offline)
- Accept or reject assigned trips
- Start and complete trips with action buttons
- Track today's earnings and overall completed trips
- View average rating

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Font | Inter (300–900) |
| Accent Color | Indigo `#4F46E5` |
| Background | Warm White `#F8F9FC` |
| Surface | Pure White `#FFFFFF` |
| Border | `#E2E6F0` |
| Text Primary | `#0F1117` |
| Text Secondary | `#5A6280` |
| Border Radius | Pill buttons · 16px cards · 10px inputs |
| Shadows | Layered soft shadows (xs → lg) |
| Motion | Fade-up · Scale-in · Slide-in-right |

---

## 🗂️ Project Structure

```
travelmate_app/
├── public/
│   └── index.html
├── src/
│   ├── App.js                        # Root app with routing logic
│   ├── index.css                     # Global design system & CSS tokens
│   ├── contexts/
│   │   ├── AuthContext.jsx           # Authentication state & login logic
│   │   ├── TripContext.jsx           # Trip state management
│   │   ├── ToastContext.jsx          # Toast notification system
│   │   ├── LandingPage.jsx           # Public landing page
│   │   ├── LoginScreen.jsx           # Split-panel login screen
│   │   ├── Navigation.jsx            # Top navbar
│   │   ├── CustomerDashboard.jsx     # Customer view
│   │   ├── AdminDashboard.jsx        # Admin view
│   │   ├── DriverDashboard.jsx       # Driver view
│   │   ├── BookingForm.jsx           # Trip booking form
│   │   └── TripModal.jsx             # Trip detail modal
│   └── utils/
│       ├── constants.jsx             # Cities, distances, vehicle rates
│       └── storage.js                # LocalStorage CRUD utilities
├── tailwind.config.js                # Custom Tailwind design tokens
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or above
- npm v8 or above

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zalakdoshi/travelmate.git

# 2. Navigate to the project directory
cd travelmate

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app will open automatically at **http://localhost:3000**

---

## 🔑 Demo Credentials

> Select the correct **role button** on the login screen before signing in.

| Role | Username | Password | Role to Select |
|---|---|---|---|
| 👤 Customer | `customer` | `customer123` | Customer |
| 🛡️ Admin | `admin` | `admin123` | Admin |
| 🚘 Driver | `driver` | `driver123` | Driver |

---

## 🛣️ App Flow

```
Landing Page
    │
    ▼
Login Screen  ──────────────────────────┐
    │                                   │
    ▼                                   │
Role Check                              │
    │                                   │
    ├── Customer ──► Customer Dashboard │
    │                (Booking Form +    │
    │                 Recent Trips)     │
    │                                   │
    ├── Admin ──────► Admin Dashboard   │
    │                (Stats + Trip Mgmt │
    │                 + Driver Status)  │
    │                                   │
    └── Driver ─────► Driver Dashboard  │
                     (Status Toggle +   │
                      My Trips +        │
                      Earnings)         │
```

---

## 🗺️ Cities Covered

Delhi · Mumbai · Bangalore · Chennai · Kolkata · Hyderabad · Pune · Ahmedabad · Jaipur · Surat

---

## 🚗 Vehicle Categories & Rates

| Category | Option | Rate |
|---|---|---|
| 🏍️ Bike | Economy | ₹5/km |
| 🏍️ Bike | Premium | ₹8/km |
| 🏍️ Bike | Sport | ₹12/km |
| 🛺 Auto | Standard | ₹10/km |
| 🛺 Auto | AC | ₹15/km |
| 🛺 Auto | Premium | ₹20/km |
| 🚗 Car | Hatchback | ₹15/km |
| 🚗 Car | Sedan | ₹25/km |
| 🚗 Car | SUV | ₹35/km |

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Tailwind CSS 3** | Utility-first styling + custom design tokens |
| **Context API** | Global state (Auth, Trips, Toasts) |
| **LocalStorage** | Persistent data (users, trips) |
| **SessionStorage** | Current user session |
| **CSS Custom Properties** | Design system tokens |
| **Google Fonts (Inter)** | Typography |

---

## 📦 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🔧 Resetting Demo Data

If you want to reset all trips and restore original users:

1. Log in as **Admin**
2. Click the **"Reset App"** button (top right of Admin Dashboard)
3. The page will reload with fresh default data

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by [Zalak Doshi](https://github.com/zalakdoshi)

⭐ Star this repo if you found it helpful!

</div>
