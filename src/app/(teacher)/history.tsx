import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  getTeacherMeetings,
  MeetingSession,
} from "@/api/meetings";
import { getCurrentTeacherId } from "@/services/teacherService";

import CallLogCard from "@/components/CallLogCard";

export default function TeacherHistoryScreen() {
  const [meetings, setMeetings] = useState<MeetingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const id = await getCurrentTeacherId();
      const data = await getTeacherMeetings(id);
      setMeetings(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unable to load class history.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Class History</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading classes…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retry} onPress={load}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : meetings.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="videocam-outline" size={46} color="#94A3B8" />
          <Text style={styles.emptyText}>No classes yet.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
        >
          {meetings.map((m) => (
            <CallLogCard
              key={m.id}
              meeting={m}
              rightMeta={
                m.status === "ended" && m.ended_at
                  ? `Ended · ${new Date(m.ended_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : m.status === "live"
                  ? "Live now"
                  : ""
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
  },
  emptyText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 15,
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  retry: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});