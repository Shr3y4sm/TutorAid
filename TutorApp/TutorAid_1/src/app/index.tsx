import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function createClassCode() {
  return `${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function HomeScreen() {
  const [classname, onChangeClassname] = useState("");
  const [username, onChangeUsername] = useState("");

  const router = useRouter();

  let RTCView;

  if (Platform.OS !== "web") {
    // Only import mobile native wrappers during Android/iOS runtimes
    const WebRTCModule = require("react-native-webrtc");
    RTCView = WebRTCModule.RTCView;
  }

  const handleJoin = () => {
    if (!classname.trim() || !username.trim()) return;
    router.push({
      pathname: "/video",
      params: { classname: classname.trim(), username: username.trim() },
    });
  };

  const handleCreate = () => {
    if (!username.trim()) return;
    const newClass = createClassCode();
    onChangeClassname(newClass);
    router.push({
      pathname: "/video",
      params: { classname: newClass, username: username.trim() },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FBF7F4", justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ width: "80%", flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeClassname}
          value={classname}
          placeholder="Enter code to join"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Enter your username"
        />
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={handleJoin}>
            <Text style={styles.buttonText}>Join Class</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Class</Text>
          </Pressable>
        </View>
        <Text style={styles.hintText}>
          Use Join to enter an existing class code, or Create to generate a new class and open it.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 140,
    textAlign: "center",
    backgroundColor: "#222",
    color: "#FBF7F4",
    padding: 12,
    borderRadius: 200,
  },
  buttonText: {
    color: "#FBF7F4",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    width: 220,
    height: 44,
    borderWidth: 2,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FBF7F4",
    color: "#222",
  },
  hintText: {
    marginTop: 12,
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
});
