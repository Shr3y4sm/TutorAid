import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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
import { router, useFocusEffect } from "expo-router";

import Colors from "@/theme/colors";
import ResourceCard from "@/components/resources/ResourceCard";
import FolderRow from "@/components/resources/FolderRow";
import {
  createFolder,
  deleteFolder,
  getFolders,
  getResources,
  renameFolder,
} from "@/api/resource";
import {
  FolderCrumb,
  Resource,
  ResourceFolder,
} from "@/types/resource";

const ROOT: FolderCrumb = { id: null, name: "Root" };

export default function ResourcesScreen() {
  // Breadcrumb stack; the last entry is the open folder.
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

  // Create / rename folder modal.
  const [modalVisible, setModalVisible] =
    useState(false);
  const [editingFolder, setEditingFolder] =
    useState<ResourceFolder | null>(null);
  const [folderName, setFolderName] =
    useState("");

  // Reload on search change (debounced) or navigation.
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(load, search ? 400 : 0);

    return () => clearTimeout(timeout);
  }, [search, current.id]);

  // Reload when returning from upload / detail screens.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    try {
      if (search.trim()) {
        // Searching looks across the whole repository.
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
        "Failed to load repository:",
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

  function openCreateModal() {
    setEditingFolder(null);
    setFolderName("");
    setModalVisible(true);
  }

  function openRenameModal(
    folder: ResourceFolder
  ) {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setModalVisible(true);
  }

  async function saveFolder() {
    const name = folderName.trim();

    if (!name) return;

    try {
      if (editingFolder) {
        await renameFolder(editingFolder.id, name);
      } else {
        await createFolder(name, current.id);
      }

      setModalVisible(false);

      load();
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Could not save the folder."
      );
    }
  }

  function manageFolder(folder: ResourceFolder) {
    Alert.alert(folder.name, undefined, [
      {
        text: "Rename",
        onPress: () => openRenameModal(folder),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDeleteFolder(folder),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  function confirmDeleteFolder(
    folder: ResourceFolder
  ) {
    Alert.alert(
      "Delete Folder",
      `"${folder.name}" and its sub-folders will be removed. Files inside will move to Root.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFolder(folder.id);

              // Drop any breadcrumbs pointing below the deleted folder.
              setCrumbs((prev) =>
                prev.filter(
                  (c) =>
                    c.id !== folder.id
                )
              );

              load();
            } catch (err) {
              console.error(err);
              Alert.alert(
                "Error",
                "Could not delete the folder."
              );
            }
          },
        },
      ]
    );
  }

  const isEmpty =
    !loading && folders.length === 0 &&
    resources.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headingWrap}>
          <Text style={styles.heading}>Resources</Text>
          <Text style={styles.subtitle}>
            Your resource library
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.folderButton]}
            onPress={openCreateModal}
          >
            <Ionicons
              name="folder-open"
              size={17}
              color="#FFF"
            />
            <Text style={styles.actionText}>Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push({
                pathname: "/(teacher)/upload",
                params: {
                  folderId: current.id ?? "",
                  folderName: current.name,
                },
              })
            }
          >
            <Ionicons
              name="cloud-upload"
              size={17}
              color="#FFF"
            />
            <Text style={styles.actionText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Breadcrumb trail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.crumbsRow}
        contentContainerStyle={styles.crumbsContent}
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
              : "This folder is empty"}
          </Text>
          <Text style={styles.emptyText}>
            {search
              ? "Try a different search."
              : "Create a folder or upload a file."}
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
                    onLongPress={() =>
                      manageFolder(folder)
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
              onPress={() =>
                router.push({
                  pathname:
                    "/(teacher)/resources/[id]",
                  params: { id: item.id },
                })
              }
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

      {/* Create / rename folder modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingFolder
                ? "Rename Folder"
                : "New Folder"}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Folder name"
              placeholderTextColor={
                Colors.textSecondary
              }
              value={folderName}
              onChangeText={setFolderName}
              autoFocus
              onSubmitEditing={saveFolder}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalCancel,
                ]}
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text
                  style={
                    styles.modalCancelText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={saveFolder}
              >
                <Text
                  style={
                    styles.modalSaveText
                  }
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  headingWrap: {
    flex: 1,
    marginRight: 8,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
  },

  folderButton: {
    backgroundColor: Colors.warning,
  },

  actionText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
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
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },

  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 14,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  modalButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: Colors.primary,
  },

  modalCancel: {
    backgroundColor: Colors.progressTrack,
  },

  modalSaveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  modalCancelText: {
    color: Colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
});
