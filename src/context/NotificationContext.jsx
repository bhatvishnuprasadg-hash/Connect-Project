import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);
  return (
    <NotificationContext.Provider value={{ tick, bump }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationBus() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationBus must be used within NotificationProvider");
  return ctx;
}
