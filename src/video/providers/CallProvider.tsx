import React, {
  createContext,
  useContext,
  useMemo,
} from "react";

import { Call } from "@stream-io/video-react-native-sdk";

import callService from "../services/callService";
import { useVideoContext } from "../context/VideoContext";

interface CallContextType {
  call: Call | null;

  join: (
    callType: string,
    callId: string
  ) => Promise<void>;

  leave: () => Promise<void>;
}

const CallContext =
  createContext<CallContextType | undefined>(
    undefined
  );

export function CallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    call,
    setCall,
    setLoading,
    setConnected,
  } = useVideoContext();

  async function join(
    callType: string,
    callId: string
  ) {
    setLoading(true);

    try {
      const activeCall =
        await callService.join(
          callType,
          callId
        );

      setCall(activeCall);
      setConnected(true);
    } finally {
      setLoading(false);
    }
  }

  async function leave() {
    await callService.leave();

    setCall(null);

    setConnected(false);
  }

  const value = useMemo(
    () => ({
      call,
      join,
      leave,
    }),
    [call]
  );

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
}

export function useCallProvider() {
  const context =
    useContext(CallContext);

  if (!context) {
    throw new Error(
      "useCallProvider must be used inside CallProvider."
    );
  }

  return context;
}