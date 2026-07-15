import React, { useEffect } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { currentSession } from "@/services/authService";

export default function RoleSelectionScreen() {
  useEffect(() => {
    async function checkSession() {
      const { data } = await currentSession();

      if (!data.session) {
        router.replace("/(auth)/login");
      }
    }

    checkSession();
  }, []);

  function continueAsTeacher() {
  router.replace("/(auth)/teacher-profile");
}

function continueAsStudent() {
  router.replace("/(auth)/student-profile");
}

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Welcome to TutorAid
        </Text>

        <Text style={styles.subtitle}>
          Choose how you want to continue
        </Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.studentCard}
          onPress={continueAsStudent}
        >
          <Text style={styles.cardTitle}>
            🎓 Student
          </Text>

          <Text style={styles.cardDescription}>
            Join live classes, access assignments,
            collaborate with teachers and learn
            from anywhere.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.teacherCard}
          onPress={continueAsTeacher}
        >
          <Text style={styles.cardTitle}>
            👨‍🏫 Teacher
          </Text>

          <Text style={styles.cardDescription}>
            Schedule classes, teach live,
            manage students and monitor
            learning progress.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    color: "#64748B",
    marginBottom: 40,
  },

  cards: {
    gap: 20,
  },

  studentCard: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },

  teacherCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },

  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },

  cardDescription: {
    color: "white",
    marginTop: 12,
    lineHeight: 22,
    fontSize: 15,
  },
});