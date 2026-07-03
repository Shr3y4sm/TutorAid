import { View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router";

import { createCall } from "@/api/video";
import { useCallProvider } from "@/video/providers/CallProvider";

export default function TeacherDashboard() {
  const { join } = useCallProvider();

  async function startClass() {
    try {
      const response = await createCall();

      const callId = response.callId;

      await join("default", callId);

      router.push("/(video)/call");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Teacher Dashboard
      </Text>

      <Button
        title="Start Instant Class"
        onPress={startClass}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },
});