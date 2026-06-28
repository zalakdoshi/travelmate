import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getTrips,
  addTrip,
  updateTrip,
  getUsers,
  updateUser,
} from "../utils/storage";
import { TripStatus } from "../utils/constants";

const TripContext = createContext();

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = () => {
    setLoading(true);
    const allTrips = getTrips();
    setTrips(allTrips);
    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const addNewTrip = (trip) => {
    addTrip(trip);
    setTrips((prev) => [...prev, trip]);
  };

  const updateTripData = (updatedTrip) => {
    updateTrip(updatedTrip);
    setTrips((prev) =>
      prev.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const getTripsByCustomerId = (customerId) => {
    return trips.filter((trip) => trip.customerId === customerId);
  };

  const getTripsByDriverId = (driverId) => {
    return trips.filter((trip) => trip.driverId === driverId);
  };

  const getPendingTrips = () => {
    return trips.filter((trip) => trip.status === TripStatus.PENDING);
  };

  const getAvailableDrivers = () => {
    const users = getUsers();
    return users.filter(
      (user) => user.role === "driver" && user.status === "available"
    );
  };

  const assignDriverToTrip = (tripId, driverId) => {
    const trip = trips.find((t) => t.id === tripId);
    const users = getUsers();
    const driver = users.find((u) => u.id === driverId);

    if (trip && driver) {
      const updatedTrip = {
        ...trip,
        status: TripStatus.ASSIGNED,
        driverId,
        driverName: driver.name,
        assignedAt: new Date().toISOString(),
      };

      const updatedDriver = {
        ...driver,
        status: "busy",
      };

      updateTripData(updatedTrip);
      updateUser(updatedDriver);
    }
  };

  const rejectTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      const updatedTrip = {
        ...trip,
        status: TripStatus.REJECTED,
        rejectedAt: new Date().toISOString(),
      };
      updateTripData(updatedTrip);

      // If driver was assigned, make them available again
      if (trip.driverId) {
        const users = getUsers();
        const driver = users.find((u) => u.id === trip.driverId);
        if (driver) {
          updateUser({ ...driver, status: "available" });
        }
      }
    }
  };

  const rejectTripByDriver = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip && trip.driverId) {
      // Reset trip to pending status for reassignment
      const updatedTrip = {
        ...trip,
        status: TripStatus.PENDING,
        driverId: null,
        driverName: null,
        rejectedAt: new Date().toISOString(),
      };
      updateTripData(updatedTrip);

      // Make driver available again
      const users = getUsers();
      const driver = users.find((u) => u.id === trip.driverId);
      if (driver) {
        updateUser({ ...driver, status: "available" });
      }
    }
  };

  const acceptTrip = (tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      const updatedTrip = {
        ...trip,
        status: TripStatus.ACCEPTED,
        acceptedAt: new Date().toISOString(),
      };
      updateTripData(updatedTrip);
    }
  };

  const refreshTrips = () => {
    loadTrips();
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        addNewTrip,
        updateTrip: updateTripData,
        getTripsByCustomerId,
        getTripsByDriverId,
        getPendingTrips,
        getAvailableDrivers,
        assignDriverToTrip,
        rejectTrip,
        rejectTripByDriver,
        acceptTrip,
        refreshTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within TripProvider");
  }
  return context;
}
