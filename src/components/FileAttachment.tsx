import React from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  url: string;
  /** Custom label for the open button (default: "Open File"). */
  label?: string;
  /** Optional display name for the file. */
  fileName?: string;
}

const isWeb = Platform.OS === "web";

function getFileKind(
  url: string
): "image" | "pdf" | "other" {
  const clean = url.split("?")[0].toLowerCase();

  if (
    /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/.test(
      clean
    )
  ) {
    return "image";
  }

  if (/\.pdf$/.test(clean)) {
    return "pdf";
  }

  return "other";
}

/**
 * FileAttachment
 * ---------------
 * A cross-platform file viewer:
 *  - Web: inline preview for images (and PDFs via embed), plus "Open in
 *    new tab" so the actual file can always be reviewed without leaving
 *    the app flow.
 *  - Native: opens the URL with Linking.
 */
export default function FileAttachment({
  url,
  label = "Open File",
  fileName,
}: Props) {
  const kind = getFileKind(url);

  const openInNewTab = () => {
    if (isWeb && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      openFile();
    }
  };

  const openFile = () => {
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Error",
        "Unable to open the file."
      );
    });
  };

  return (
    <View style={styles.container}>
      {isWeb && kind === "image" ? (
        <img
          src={url}
          alt={fileName ?? "attachment"}
          style={styles.webPreview as any}
        />
      ) : null}

      {isWeb && kind === "pdf" ? (
        <iframe
          src={url}
          title={fileName ?? "attachment"}
          style={styles.webPreview as any}
        />
      ) : null}

      {fileName ? (
        <Text style={styles.fileName}>
          {fileName}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.openButton}
        onPress={openFile}
      >
        <Text style={styles.openButtonText}>
          {kind === "other" ? "📥 " : "🔗 "}
          {label}
        </Text>
      </TouchableOpacity>

      {isWeb ? (
        <TouchableOpacity
          style={styles.newTabButton}
          onPress={openInNewTab}
        >
          <Text style={styles.newTabButtonText}>
            ↗ Open in new tab
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  webPreview: {
    width: "100%",
    height: 180,
    backgroundColor: "#EEF1F6",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    objectFit: "contain",
  },
  fileName: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 8,
  },
  openButton: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  openButtonText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },
  newTabButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  newTabButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
});