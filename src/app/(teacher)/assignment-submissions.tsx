import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import Colors from "@/theme/colors";

export default function AssignmentSubmissionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>
          Assignment Submissions
        </Text>

        <Text style={styles.subtitle}>
          Coming Soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
});