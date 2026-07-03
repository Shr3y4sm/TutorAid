import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  StreamCall,
  CallContent,
} from "@stream-io/video-react-native-sdk";

import { useCallProvider } from "@/video/providers/CallProvider";

export default function CallScreen() {
  const { call } = useCallProvider();

  if (!call) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <CallContent />
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});