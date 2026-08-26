import React, {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
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
import FolderRow from "@/components/resources/FolderRow";
import {
  getFolders,
  getResources,
} from "@/api/resource";
import { openResource } from "@/utils/resource";
import {
  FolderCrumb,
  Resource,
  ResourceFolder,
} from "@/types/resource";

const ROOT: FolderCrumb = { id: null, name: "All" };

/**
 * Read-only view of the teachers' resource repository.
 * Students can browse folders and open files, but cannot
 * create, upload, rename or delete anything.
 */
export default function StudentResourcesScreen() {
  const [crumbs, setCrumbs] = useState<FolderCrumb[]>(
    [ROOT]
  );
  const current = crumbs[crumbs.length - 1];

  const [folders, setFolders] = useState<
    ResourceFolder[]
  >([]);
  const [resources, setResources] = useState<
    Resource[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(load, search ? 400 : 0);

    return () => clearTimeout(timeout);
  }, [search, current.id]);

  async function load() {
    try {
      if (search.trim()) {
        // Search looks across the whole shared repository.
        const data = await getResources({
          limit: 50,
          q: search.trim(),
        });

        setResources(data.data);
        setFolders([]);
      } else {
        const [f, r] = await Promise.all([
          getFolders(current.id),
          getResources({
            limit: 50,
            folder: current.id ?? "root",
          }),
        ]);

        setFolders(f);
        setResources(r.data);
      }
    } catch (err) {
      console.error(
        "Failed to load resources:",
        err
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
  }

  function enterFolder(folder: ResourceFolder) {
    setSearch("");
    setCrumbs([
      ...crumbs,
      { id: folder.id, name: folder.name },
    ]);
  }

  function jumpToCrumb(crumb: FolderCrumb) {
    const idx = crumbs.findIndex(
      (c) => c.id === crumb.id
    );

    if (idx >= 0 && idx < crumbs.length - 1) {
      setCrumbs(crumbs.slice(0, idx + 1));
    }
  }

  async function handleOpen(resource: Resource) {
    try {
      await openResource(resource.file_url);
    } catch (err) {
      console.error(err);
    }
  }

  const isEmpty =
    !loading && folders.length === 0 &&
    resources.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Resources</Text>
        <Text style={styles.subtitle}>
          Study material shared by your teachers
        </Text>
      </View>

      {/* Breadcrumb trail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.crumbsRow}
        contentContainerStyle={
          styles.crumbsContent
        }
      >
        {crumbs.map((crumb, i) => (
          <TouchableOpacity
            key={crumb.id ?? "root"}
            style={styles.crumbItem}
            onPress={() => jumpToCrumb(crumb)}
          >
            <Text
              style={[
                styles.crumbText,
                i === crumbs.length - 1 &&
                  styles.crumbActive,
              ]}
              numberOfLines={1}
            >
              {crumb.name}
            </Text>
            {i < crumbs.length - 1 ? (
              <Ionicons
                name="chevron-forward"
                size={13}
                color={Colors.textSecondary}
              />
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search across the whole repository */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color={Colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search all resources..."
          placeholderTextColor={
            Colors.textSecondary
          }
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search ? (
          <TouchableOpacity
            onPress={() => setSearch("")}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />
        </View>
      ) : isEmpty ? (
        <View style={styles.empty}>
          <Ionicons
            name="folder-open-outline"
            size={48}
            color={Colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>
            {search
              ? "No resources found"
              : "Nothing here yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {folders.length > 0 && !search ? (
                <Text style={styles.sectionLabel}>
                  Folders
                </Text>
              ) : null}

              {!search &&
                folders.map((folder) => (
                  <FolderRow
                    key={folder.id}
                    folder={folder}
                    onPress={() =>
                      enterFolder(folder)
                    }
                  />
                ))}

              {resources.length > 0 ? (
                <Text style={styles.sectionLabel}>
                  Files
                </Text>
              ) : null}
            </>
          }
          renderItem={({ item }) => (
            <ResourceCard
              resource={item}
              onPress={() => handleOpen(item)}
            />
          )}
          contentContainerStyle={
            styles.listContent
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  header: {
    marginBottom: 12,
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

  crumbsRow: {
    flexGrow: 0,
    marginBottom: 10,
  },

  crumbsContent: {
    alignItems: "center",
    gap: 2,
  },

  crumbItem: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 140,
  },

  crumbText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  crumbActive: {
    color: Colors.primaryDark,
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
    height: 44,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
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

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});
