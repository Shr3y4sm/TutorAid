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
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getStudentReport, StudentReport } from "@/api/reports";
import ReportView from "@/components/reports/ReportView";
import { getStudent } from "@/api/teacherStudents";

export default function StudentReportScreen() {
  const { id, name } = useLocalSearchParams<{
    id?: string;
    name?: string;
  }>();

  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const data = await getStudentReport(String(id));
      setReport(data);
    } catch (err: any) {
      console.error("Failed to load report:", err);
      Alert.alert(
        "Error",
        err?.message ?? "Unable to load this student's report."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

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
        <Text style={styles.title}>Performance Report</Text>
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
            <ReportView report={report} studentName={name} />
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
