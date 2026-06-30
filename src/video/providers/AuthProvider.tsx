import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  User,
} from "@stream-io/video-react-native-sdk";

import streamClient from "../services/streamClient";

interface AuthContextType {
  user: User | null;

  authenticated: boolean;

  initialize: (
    user: User,
    token: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  async function initialize(
    currentUser: User,
    token: string
  ) {
    await streamClient.initialize(
      currentUser,
      token
    );

    setUser(currentUser);
  }

  async function logout() {
    await streamClient.disconnect();

    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,

      authenticated:
        user !== null,

      initialize,

      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}