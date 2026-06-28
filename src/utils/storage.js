// ============= STORAGE UTILITIES =============
export const STORAGE_KEYS = {
  TRIPS: "travel_app_trips",
  USERS: "travel_app_users",
  CURRENT_USER: "travel_app_current_user",
  USER_PREFERENCE: "travel_app_user_preference",
};

// Default users with both full name and short username for flexible login
const defaultUsers = [
  {
    id: 1,
    name: "John Customer",
    username: "customer",
    role: "customer",
    password: "customer123",
  },
  {
    id: 2,
    name: "Admin User",
    username: "admin",
    role: "admin",
    password: "admin123",
  },
  {
    id: 3,
    name: "Driver One",
    username: "driver",
    role: "driver",
    status: "available",
    vehicle: "Sedan",
    vehicleType: "car",
    rating: 4.8,
    password: "driver123",
  },
];

// Cookie utilities
export function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

export function getCookie(name) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
}

// Session storage utilities
export function setSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSession(key) {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function removeSession(key) {
  sessionStorage.removeItem(key);
}

// Local storage utilities
export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocal(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Initialize default data
export function initializeStorage() {
  const existingUsers = getLocal(STORAGE_KEYS.USERS);

  // Migrate old users missing the `username` field, or init fresh
  if (!existingUsers || existingUsers.length === 0) {
    setLocal(STORAGE_KEYS.USERS, defaultUsers);
  } else {
    // If any existing user is missing `username`, replace all with fresh defaults
    const needsMigration = existingUsers.some((u) => !u.username);
    if (needsMigration) {
      // Merge: keep status/rating changes but re-apply username from defaultUsers by id
      const migrated = existingUsers.map((u) => {
        const def = defaultUsers.find((d) => d.id === u.id);
        return def ? { ...def, ...u, username: def.username } : u;
      });
      setLocal(STORAGE_KEYS.USERS, migrated);
    }
  }

  const existingTrips = getLocal(STORAGE_KEYS.TRIPS);
  if (!existingTrips) {
    setLocal(STORAGE_KEYS.TRIPS, []);
  }
}

// User management
export function getUsers() {
  const users = getLocal(STORAGE_KEYS.USERS);
  if (!users || users.length === 0) {
    initializeStorage();
    return defaultUsers;
  }
  return users;
}

export function authenticateUser(name, password, role, vehicleType) {
  const users = getUsers();
  const input = (name || "").trim().toLowerCase();
  const found = users.find((user) => {
    // Match by short username OR full name (case-insensitive)
    const matchName = user.name.toLowerCase() === input;
    const matchUsername = user.username && user.username.toLowerCase() === input;
    if (!(matchName || matchUsername)) return false;
    if (user.password !== password) return false;
    // If a role is provided, it must match
    if (role && user.role !== role) return false;
    // If driver role and vehicleType provided, it must match (or we skip check)
    if (role === "driver" && vehicleType && user.vehicleType && user.vehicleType !== vehicleType) return false;
    return true;
  });
  return found || null;
}

export function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    setLocal(STORAGE_KEYS.USERS, users);
  }
}

// Trip management
export function getTrips() {
  return getLocal(STORAGE_KEYS.TRIPS) || [];
}

export function addTrip(trip) {
  const trips = getTrips();
  trips.push(trip);
  setLocal(STORAGE_KEYS.TRIPS, trips);
}

export function updateTrip(updatedTrip) {
  const trips = getTrips();
  const index = trips.findIndex((trip) => trip.id === updatedTrip.id);
  if (index !== -1) {
    trips[index] = updatedTrip;
    setLocal(STORAGE_KEYS.TRIPS, trips);
  }
}

export function getTripsByDriverId(driverId) {
  const trips = getTrips();
  return trips.filter((trip) => trip.driverId === driverId);
}

// Auth management
export function setCurrentUser(user) {
  setSession(STORAGE_KEYS.CURRENT_USER, user);
  setCookie(STORAGE_KEYS.USER_PREFERENCE, user.role);
}

export function getCurrentUser() {
  return getSession(STORAGE_KEYS.CURRENT_USER);
}

export function removeCurrentUser() {
  removeSession(STORAGE_KEYS.CURRENT_USER);
}

// Generate unique IDs
export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// =======================
// 🧹 Reset & Clear Tools
// =======================

export function clearAllAppData() {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.TRIPS);
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCE);
}

export function resetStorageToDefaults() {
  clearAllAppData();
  initializeStorage(); // Restores default users, empty trips
}
