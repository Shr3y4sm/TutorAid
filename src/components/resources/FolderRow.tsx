import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import { ResourceFolder } from "@/types/resource";

interface Props {
  folder: ResourceFolder;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function FolderRow({
  folder,
  onPress,
  onLongPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name="folder"
          size={20}
          color={Colors.warning}
        />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {folder.name}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  rowPressed: {
    opacity: 0.7,
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
});