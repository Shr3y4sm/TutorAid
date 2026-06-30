import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { User } from "@stream-io/video-react-native-sdk";

import streamClient from "../services/streamClient";
import {
  StreamContextType,
  StreamUser,
} from "../types/video";

const StreamContext =
  createContext<StreamContextType | null>(null);

export function StreamProvider({
  children,
}: React.PropsWithChildren) {
  const [initialized, setInitialized] =
    useState(false);

  async function initialize(user: StreamUser) {
    await streamClient.initialize(user as User);

    setInitialized(true);
  }

  async function disconnect() {
    await streamClient.disconnect();

    setInitialized(false);
  }

  const value = useMemo(
    () => ({
      initialized,
      initialize,
      disconnect,
    }),
    [initialized]
  );

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
}

export function useStreamContext() {
  const context = useContext(StreamContext);

  if (!context) {
    throw new Error(
      "useStreamContext must be used inside StreamProvider."
    );
  }

  return context;
}