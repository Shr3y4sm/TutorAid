import React from "react";
import { FlatList } from "react-native";
import {
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

import ParticipantTile from "./ParticipantTile";

export default function ParticipantGrid() {
  const { useParticipants } =
    useCallStateHooks();

  const participants =
    useParticipants();

  return (
    <FlatList
      data={participants}
      keyExtractor={(item) => item.sessionId}
      renderItem={({ item }) => (
        <ParticipantTile participant={item} />
      )}
    />
  );
}