import {
  Text,
  View,
  StyleSheet,
} from "react-native";

import { StudentProfile } from "@/api/profile";

type Props = {
  profile: StudentProfile;
};

export default function ProfileHeaderCard({
  profile,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {profile.avatarInitials}
        </Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>
          {profile.name}
        </Text>

        <Text style={styles.meta}>
          {profile.studentId}
        </Text>

        <Text style={styles.meta}>
          {profile.department}
        </Text>

        <Text style={styles.semester}>
          Semester {profile.semester}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 30,
    fontWeight: "700",
  },

  details: {
    flex: 1,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  meta: {
    color: "#DBEAFE",
    marginTop: 4,
    fontWeight: "500",
  },

  semester: {
    color: "#FFFFFF",
    marginTop: 8,
    fontWeight: "700",
  },
});
