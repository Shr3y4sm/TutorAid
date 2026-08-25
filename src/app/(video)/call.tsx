import React from "react";
import { useLocalSearchParams } from "expo-router";
import { VideoCallScreen } from "@/features/video-call";

export default function CallRoute() {
  const params = useLocalSearchParams<{
    classname?: string;
    username?: string;
    role?: string;
    entityId?: string;
  }>();

  const classname = Array.isArray(params.classname)
    ? params.classname[0]
    : params.classname;
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;
  const role = Array.isArray(params.role)
    ? params.role[0]
    : params.role;
  const entityId = Array.isArray(params.entityId)
    ? params.entityId[0]
    : params.entityId;

  return (
    <VideoCallScreen
      classname={String(classname ?? "")}
      username={String(username ?? "unknown")}
      role={role as "teacher" | "student" | undefined}
      entityId={entityId}
    />
  );
}