import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Alert,
} from "react-native";

import Colors from "@/theme/colors";

import { getTeacherAiTools } from "@/api/teacherAi";

import AiToolCard from "@/features/teacher/ai/components/AiToolCard";

import { AiTool } from "@/features/teacher/ai/types/ai";

export default function TeacherAiScreen() {
  const [tools, setTools] =
    useState<AiTool[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data =
      await getTeacherAiTools();

    setTools(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        AI Assistant
      </Text>

      <FlatList
        data={tools}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <AiToolCard
            title={item.title}
            description={item.description}
            onPress={() =>
              Alert.alert(
                item.title,
                "AI integration coming next."
              )
            }
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

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});