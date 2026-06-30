import { View, StyleSheet } from "react-native";
import { router } from "expo-router";

import QuickActionCard from "./QuickActionCard";
import { quickActions } from "../../constants/quickActions";

export default function QuickActions() {
  function navigate(title: string) {
    switch (title) {
      case "Courses":
        router.push("/(student)/courses");
        break;

      case "Assignments":
        router.push("/(student)/assignments");
        break;

      case "AI Tutor":
        router.push("/(student)/ai");
        break;

      case "Schedule":
        alert("Schedule coming soon!");
        break;
    }
  }

  return (
    <View style={styles.container}>
      {quickActions.map((item) => (
        <QuickActionCard
          key={item.id}
          title={item.title}
          icon={item.icon}
          color={item.color}
          onPress={() => navigate(item.title)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
});