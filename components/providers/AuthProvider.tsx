"use client";

import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "DEALER";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mocking an authenticated admin user
  const [user] = useState<User | null>({
    id: "admin-1",
    email: "admin@carbazaar.co.ug",
    role: "ADMIN",
  });

  return (
    <AuthContext.Provider value={{ user, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
