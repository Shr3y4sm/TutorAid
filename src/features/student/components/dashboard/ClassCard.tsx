import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  subject: string;
  teacher: string;
  time: string;
  room: string;
  /** Present when the class has a live/linked meet code. */
  onJoin?: () => void;
};

export default function ClassCard({
  subject,
  teacher,
  time,
  room,
  onJoin,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.subject}>
          {subject}
        </Text>

        <Text style={styles.teacher}>
          {teacher}
        </Text>

        <Text style={styles.room}>
          {room}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>
          {time}
        </Text>

        {onJoin ? (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={onJoin}
          >
            <Ionicons
              name="videocam"
              size={13}
              color="#FFF"
            />
            <Text style={styles.joinText}>
              Join
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },

  left: {
    flex: 1,
  },

  subject: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  teacher: {
    marginTop: 5,
    color: "#64748B",
  },

  room: {
    marginTop: 3,
    color: "#94A3B8",
  },

  right: {
    alignItems: "flex-end",
    gap: 8,
  },

  time: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  joinText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});