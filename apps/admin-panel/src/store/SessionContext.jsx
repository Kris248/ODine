import { createContext, useContext, useMemo, useState } from "react";
import { loginWithPassword } from "../services/api/authApi.js";
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession
} from "../services/sessionStorage.js";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  async function login(credentials) {
    const nextSession = await loginWithPassword(credentials);
    setStoredSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    clearStoredSession();
    setSession(null);
  }

  const value = useMemo(() => ({ session, login, logout }), [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider.");
  }
  return context;
}
