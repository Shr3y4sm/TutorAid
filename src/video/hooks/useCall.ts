import { useState } from "react";
import {
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";

export function useCall() {
  const client = useStreamVideoClient();

  const [loading, setLoading] =
    useState(false);

  async function joinCall(id: string) {
    if (!client) return;

    setLoading(true);

    try {
      const call = client.call("default", id);

      await call.join({
        create: true,
      });

      return call;
    } finally {
      setLoading(false);
    }
  }

  async function leaveCall(call: any) {
    await call.leave();
  }

  return {
    loading,
    joinCall,
    leaveCall,
  };
}