"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mocking an authenticated admin user
  const [user, setUser] = useState<User | null>({
    id: "admin-1",
    email: "admin@carbazaar.co.ug",
    role: "ADMIN",
  });

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: false, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
