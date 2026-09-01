import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as ContextSafeArea } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getStudentReport, StudentReport } from "@/api/reports";
import ReportView from "@/components/reports/ReportView";
import { getCurrentStudentId } from "@/services/studentService";

export default function ReportsScreen() {
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  async function load(id?: string | null) {
    try {
      const sid = id ?? studentId;
      let current = sid;
      if (!current) {
        current = await getCurrentStudentId();
        setStudentId(current);
      }
      const data = await getStudentReport(current);
      setReport(data);
    } catch (err: any) {
      console.error("Failed to load report:", err);
      Alert.alert(
        "Error",
        err?.message ?? "Unable to load your performance report."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  return (
    <ContextSafeArea style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>My Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : report ? (
        <SafeAreaView style={styles.body}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ReportView report={report} />
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Report unavailable.</Text>
        </View>
      )}
    </ContextSafeArea>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  body: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
  },
});
