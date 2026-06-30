import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { Call } from "@stream-io/video-react-native-sdk";

interface VideoContextState {
  call: Call | null;

  setCall: (call: Call | null) => void;

  loading: boolean;

  setLoading: (loading: boolean) => void;

  connected: boolean;

  setConnected: (connected: boolean) => void;
}

const VideoContext =
  createContext<VideoContextState | undefined>(
    undefined
  );

interface Props {
  children: React.ReactNode;
}

export function VideoProvider({
  children,
}: Props) {
  const [call, setCall] =
    useState<Call | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  const value = useMemo(
    () => ({
      call,
      setCall,
      loading,
      setLoading,
      connected,
      setConnected,
    }),
    [
      call,
      loading,
      connected,
    ]
  );

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoContext() {
  const context =
    useContext(VideoContext);

  if (!context) {
    throw new Error(
      "useVideoContext must be used inside VideoProvider."
    );
  }

  return context;
}