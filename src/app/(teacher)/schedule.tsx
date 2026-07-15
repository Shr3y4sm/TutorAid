import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "@/theme/colors";

import { getTeacherSchedule } from "@/api/teacherSchedule";

import {
  TeacherSchedule,
} from "@/features/teacher/schedule/types/schedule";

import ScheduleCard from "@/features/teacher/schedule/components/ScheduleCard";
import { getCurrentTeacherId } from "@/services/teacherService";
export default function ScheduleScreen() {
  const [classes, setClasses] =
    useState<TeacherSchedule[]>([]);

  useEffect(() => {
    load();
  }, []);

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
    console.error(err);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Today's Schedule
      </Text>

      <FlatList
        data={classes}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <ScheduleCard
  schedule={item}
/>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});