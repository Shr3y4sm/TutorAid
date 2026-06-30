import React from "react";
import {
  StreamVideoParticipantView,
} from "@stream-io/video-react-native-sdk";

export default function ParticipantTile({
  participant,
}: any) {
  return (
    <StreamVideoParticipantView participant={participant} />
  );
}