import React from "react";
import { useLocalSearchParams } from "expo-router";
import { VideoCallScreen } from "@/features/video-call";

export default function CallRoute() {
  const params = useLocalSearchParams<{
    classname?: string;
    username?: string;
  }>();

  const classname = Array.isArray(params.classname)
    ? params.classname[0]
    : params.classname;
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  return (
    <VideoCallScreen
      classname={String(classname ?? "")}
      username={String(username ?? "unknown")}
    />
  );
}