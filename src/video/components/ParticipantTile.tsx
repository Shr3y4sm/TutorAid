import React from "react";
import {
  ParticipantView,
} from "@stream-io/video-react-native-sdk";

export default function ParticipantTile({
  participant,
}: any) {
  return (
    <ParticipantView participant={participant} />
  );
}