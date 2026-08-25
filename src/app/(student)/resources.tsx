import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import ResourceCard from "@/components/resources/ResourceCard";
import { getResources } from "@/api/resource";
import { openResource } from "@/utils/resource";
import { Resource } from "@/types/resource";

export default function StudentResourcesScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState<string | undefined>(
    undefined
  );

  // Debounced search + subject filter hitting the API.
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      load();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, subject]);

  async function load() {
    try {
      const data = await getResources({
        limit: 50,
        q: search.trim() || undefined,
        subject,
      });

      setResources(data.data);
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
  }

  async function handleOpen(resource: Resource) {
    try {
      await openResource(resource.file_url);
    } catch (err) {
      console.error(err);
    }
  }

  // Subject chips derived from what has been shared.
  const subjects = Array.from(
    new Set(resources.map((r) => r.subject))
  ).sort();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Resources</Text>
        <Text style={styles.subtitle}>
          Study material shared by your teachers
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color={Colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {subjects.length > 0 && !loading ? (
        <View style={styles.chipsRow}>
          <FilterChip
            label="All"
            active={!subject}
            onPress={() => setSubject(undefined)}
          />
          {subjects.map((s) => (
            <FilterChip
              key={s}
              label={s}
              active={subject === s}
              onPress={() =>
                setSubject(subject === s ? undefined : s)
              }
            />
          ))}
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              onPress={() => handleOpen(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Ionicons
                  name="folder-open-outline"
                  size={48}
                  color={Colors.textSecondary}
                />
                <Text style={styles.emptyText}>
                  No resources found.
                </Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text
        style={[styles.chipText, active && styles.chipTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  header: {
    marginBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  chipTextActive: {
    color: "#FFF",
  },

  listContent: {
    paddingBottom: 24,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 8,
  },

  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
