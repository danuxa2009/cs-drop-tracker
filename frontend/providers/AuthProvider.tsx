"use client";

import { createContext, useContext } from "react";

const AuthContext = createContext<{ isGuest: boolean }>({ isGuest: true });

export function AuthProvider({ children, isGuest }: { children: React.ReactNode; isGuest: boolean }) {
  return <AuthContext.Provider value={{ isGuest }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
