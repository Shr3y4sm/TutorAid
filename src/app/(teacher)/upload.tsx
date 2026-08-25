import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

import Colors from "@/theme/colors";
import { uploadResource } from "@/api/resource";
import {
  getCurrentTeacherId,
} from "@/services/teacherService";

type PickedFile = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
};

export default function UploadScreen() {
  const [file, setFile] = useState<PickedFile | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  async function pickDocument() {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: true,
        });

      if (result.canceled) return;

      const asset = result.assets[0];

      setFile({
        uri: asset.uri,
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
      });
    } catch (err) {
      console.error("Document pick failed:", err);
    }
  }

  async function handleUpload() {
    if (!file) {
      Alert.alert(
        "No File",
        "Please choose a file to upload."
      );
      return;
    }

    if (!title.trim() || !subject.trim() ||
      !category.trim()) {
      Alert.alert(
        "Missing Details",
        "Title, subject and category are required."
      );
      return;
    }

    try {
      setUploading(true);

      const teacherId =
        await getCurrentTeacherId();

      const formData = new FormData();

      formData.append("teacher_id", String(teacherId));
      formData.append("title", title.trim());
      formData.append(
        "description",
        description.trim()
      );
      formData.append("subject", subject.trim());
      formData.append("category", category.trim());

      // React Native FormData file descriptor.
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ||
          "application/octet-stream",
      } as unknown as Blob);

      await uploadResource(formData);

      Alert.alert(
        "Uploaded",
        "Resource uploaded successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert(
        "Error",
        "Failed to upload the resource. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
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

          <Text style={styles.heading}>
            Upload Resource
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.filePicker}
            onPress={pickDocument}
          >
            <Ionicons
              name={file ? "document" : "cloud-upload-outline"}
              size={32}
              color={Colors.primary}
            />

            {file ? (
              <>
                <Text
                  style={styles.fileName}
                  numberOfLines={1}
                >
                  {file.name}
                </Text>
                <Text style={styles.fileHint}>
                  Tap to change file
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.filePickerTitle}>
                  Choose a file
                </Text>
                <Text style={styles.fileHint}>
                  PDFs, images, videos and documents
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Quadratic Equations Notes"
            placeholderTextColor={Colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Short summary for students"
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mathematics"
            placeholderTextColor={Colors.textSecondary}
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Notes / Worksheet / Slides"
            placeholderTextColor={Colors.textSecondary}
            value={category}
            onChangeText={setCategory}
          />

          <TouchableOpacity
            style={[
              styles.uploadButton,
              uploading && styles.uploadButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Ionicons
                name="cloud-upload"
                size={20}
                color="#FFF"
              />
            )}
            <Text style={styles.uploadButtonText}>
              {uploading ? "Uploading..." : "Upload"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  flex: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  filePicker: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },

  filePickerTitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },

  fileName: {
    marginTop: 6,
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },

  fileHint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 14,
  },

  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  uploadButton: {
    flexDirection: "row",
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  uploadButtonDisabled: {
    opacity: 0.7,
  },

  uploadButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
});

