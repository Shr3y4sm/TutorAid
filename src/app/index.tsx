import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

import supabase from "@/config/supabase";
import { getAuthStatus } from "@/api/auth";

export default function Index() {
  useEffect(() => {
    start();
  }, []);

  async function start() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/(auth)/login");
      return;
    }

    const status = await getAuthStatus(
      session.user.id
    );

    if (!status.success) {
      router.replace("/(auth)/role-selection");
      return;
    }

    if (!status.role) {
      router.replace("/(auth)/role-selection");
      return;
    }

    if (!status.profileExists) {
      if (status.role === "teacher") {
        router.replace("/(auth)/teacher-profile");
      } else {
        router.replace("/(auth)/student-profile");
      }
      return;
    }

    if (status.role === "teacher") {
      router.replace("/(teacher)/dashboard");
    } else {
      router.replace("/(student)/home");
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}