import React, { useEffect } from "react";
import { StreamVideo } from "@stream-io/video-react-native-sdk";

import streamClient from "../services/streamClient";

interface Props {
  children: React.ReactNode;
}

export default function StreamProvider({
  children,
}: Props) {
  const client = streamClient.getClient();

  useEffect(() => {
    return () => {
      streamClient.disconnect();
    };
  }, []);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <StreamVideo client={client}>
      {children}
    </StreamVideo>
  );
}