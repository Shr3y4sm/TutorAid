import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import Colors from "@/theme/colors";

import { getTeacherSchedule } from "@/api/teacherSchedule";
import { getCurrentTeacherId } from "@/services/teacherService";

import ScheduleCard from "@/features/teacher/schedule/components/ScheduleCard";
import { TeacherSchedule } from "@/features/teacher/schedule/types/schedule";

export default function ScheduleScreen() {
  const [classes, setClasses] = useState<
    TeacherSchedule[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    try {
      const teacherId =
        await getCurrentTeacherId();

      const data =
        await getTeacherSchedule(
          teacherId
        );

      setClasses(data);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Schedule
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push(
              "/(teacher)/add-schedule"
            )
          }
        >
          <Ionicons
            name="add"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text
              style={styles.emptyText}
            >
              No schedule found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:
      Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 16,
  },
});