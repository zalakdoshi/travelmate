import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  authenticateUser,
  initializeStorage,
} from "../utils/storage";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeStorage();
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (name, password, role, vehicleType) => {
    const foundUser = authenticateUser(name, password, role, vehicleType);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeCurrentUser();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
