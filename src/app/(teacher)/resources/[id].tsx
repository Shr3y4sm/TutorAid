import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import Colors from "@/theme/colors";
import {
  deleteResource,
  getResource,
} from "@/api/resource";
import {
  openResource,
  formatFileSize,
} from "@/utils/resource";
import { Resource } from "@/types/resource";

function fileIcon(resource: Resource) {
  const mime = (resource.mime_type || "").toLowerCase();

  if (mime.includes("pdf")) return "document-text" as const;
  if (mime.startsWith("image/")) return "image" as const;
  if (mime.startsWith("video/")) return "film" as const;
  if (mime.startsWith("audio/"))
    return "musical-notes" as const;

  return "reader" as const;
}

export default function ResourceDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [resource, setResource] =
    useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const data = await getResource(String(id));
      setResource(data);
    } catch (err) {
      console.error("Failed to load resource:", err);
      Alert.alert(
        "Error",
        "Could not load this resource."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOpen() {
    if (!resource) return;

    try {
      setOpening(true);
      await openResource(resource.file_url);
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Unable to open this file on your device."
      );
    } finally {
      setOpening(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete Resource",
      "Students will no longer be able to access this resource. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteResource(String(id));
              router.back();
            } catch (err) {
              console.error(err);
              Alert.alert(
                "Error",
                "Failed to delete the resource."
              );
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }

  if (!resource) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Resource not found.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={confirmDelete}>
          <Ionicons
            name="trash-outline"
            size={22}
            color={Colors.danger}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconHero}>
          <Ionicons
            name={fileIcon(resource)}
            size={40}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {resource.title}
        </Text>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.subjectBadge]}>
            <Text style={styles.badgeText}>
              {resource.subject}
            </Text>
          </View>
          {resource.category ? (
            <View
              style={[styles.badge, styles.categoryBadge]}
            >
              <Text
                style={[styles.badgeText, styles.categoryText]}
              >
                {resource.category}
              </Text>
            </View>
          ) : null}
        </View>

        {resource.description ? (
          <Text style={styles.description}>
            {resource.description}
          </Text>
        ) : null}

        <View style={styles.infoCard}>
          <InfoRow
            icon="document-attach-outline"
            label="File"
            value={resource.file_name}
          />
          <InfoRow
            icon="server-outline"
            label="Size"
            value={formatFileSize(resource.file_size)}
          />
          <InfoRow
            icon="calendar-outline"
            label="Uploaded"
            value={new Date(
              resource.created_at
            ).toLocaleDateString()}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.openButton}
        onPress={handleOpen}
        disabled={opening}
      >
        {opening ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Ionicons
            name="open-outline"
            size={20}
            color="#FFF"
          />
        )}
        <Text style={styles.openButtonText}>Open File</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={18}
        color={Colors.textSecondary}
      />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 20,
  },

  iconHero: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  subjectBadge: {
    backgroundColor: "#DBEAFE",
  },

  categoryBadge: {
    backgroundColor: "#EDE9FE",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primaryDark,
  },

  categoryText: {
    color: "#6D28D9",
  },

  description: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
  },

  infoCard: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },

  infoLabel: {
    width: 70,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  infoValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    textAlign: "right",
  },

  openButton: {
    flexDirection: "row",
    height: 54,
    margin: 20,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  openButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
});

