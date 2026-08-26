import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import { formatFileSize } from "@/utils/resource";
import { Resource } from "@/types/resource";

interface Props {
  resource: Resource;
  onPress: () => void;
}

/** Pick an Ionicons glyph based on the resource's mime type / extension. */
function fileIcon(resource: Resource) {
  const mime = (resource.mime_type || "").toLowerCase();
  const ext = (resource.file_name || "")
    .split(".")
    .pop()
    ?.toLowerCase();

  if (mime.includes("pdf") || ext === "pdf")
    return "document-text" as const;
  if (mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp"].includes(ext ?? ""))
    return "image" as const;
  if (mime.startsWith("video/") ||
    ["mp4", "mov", "avi", "mkv"].includes(ext ?? ""))
    return "film" as const;
  if (mime.startsWith("audio/") ||
    ["mp3", "wav", "m4a"].includes(ext ?? ""))
    return "musical-notes" as const;

  return "reader" as const;
}

export default function ResourceCard({
  resource,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={fileIcon(resource)}
          size={24}
          color={Colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {resource.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {resource.description || "No description"}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, styles.subjectBadge]}>
            <Text style={styles.badgeText}>
              {resource.subject}
            </Text>
          </View>

          {resource.category ? (
            <View style={[styles.badge, styles.categoryBadge]}>
              <Text style={[styles.badgeText, styles.categoryText]}>
                {resource.category}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.footer}>
          {resource.file_name}
          {"  •  "}
          {formatFileSize(resource.file_size)}
          {"  •  "}
          {new Date(
            resource.created_at
          ).toLocaleDateString()}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.7,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
    marginRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  description: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  metaRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },

  subjectBadge: {
    backgroundColor: "#DBEAFE",
  },

  categoryBadge: {
    backgroundColor: "#EDE9FE",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primaryDark,
  },

  categoryText: {
    color: "#6D28D9",
  },

  footer: {
    marginTop: 8,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});