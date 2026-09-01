/**
 * ClassNotesOverlay
 * -----------------
 * Teacher-facing in-call notes sheet. Lists the note history for the
 * current meet_code and lets the teacher append a new pointer note.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  ClassNote,
  createClassNote,
  getMeetingNotes,
} from "@/api/classNotes";

interface Props {
  visible: boolean;
  meetCode: string;
  teacherId?: string;
  onClose: () => void;
}

export const ClassNotesOverlay: React.FC<Props> = ({
  visible,
  meetCode,
  teacherId,
  onClose,
}) => {
  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!visible || !meetCode) return;
    setLoading(true);
    setError("");
    try {
      const data = await getMeetingNotes(meetCode);
      setNotes(data);
    } catch (err: any) {
      setError(err?.message ?? "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  }, [visible, meetCode]);

  useEffect(() => {
    if (visible) {
      load();
      setBody("");
    }
  }, [visible, load]);

  async function handleSave() {
    const text = body.trim();
    if (!text || !teacherId) return;

    setSaving(true);
    setError("");
    try {
      const note = await createClassNote({
        teacher_id: teacherId,
        meet_code: meetCode,
        body: text,
      });
      setNotes((prev) => [...prev, note]);
      setBody("");
    } catch (err: any) {
      setError(err?.message ?? "Unable to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Class Notes</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            {meetCode}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={notes.length === 0 && styles.listEmpty}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator color="#0EC877" />
              ) : (
                <Text style={styles.empty}>
                  No notes yet for this class.
                </Text>
              )
            }
            renderItem={({ item }) => (
              <View style={styles.noteCard}>
                <Text style={styles.noteBody}>{item.body}</Text>
                <Text style={styles.noteTime}>
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Write a quick pointer about this class…"
              placeholderTextColor="#888"
              value={body}
              onChangeText={setBody}
              multiline
            />
            <Pressable
              style={[styles.saveBtn, (!body.trim() || saving) && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!body.trim() || saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "…" : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1A1D24",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 360,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  close: {
    color: "#BBB",
    fontSize: 20,
  },
  subtitle: {
    color: "#0EC877",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 10,
  },
  error: {
    color: "#F03F05",
    fontSize: 13,
    marginBottom: 8,
  },
  list: {
    flexGrow: 0,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    color: "#777",
    textAlign: "center",
    paddingVertical: 20,
  },
  noteCard: {
    backgroundColor: "#262A33",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  noteBody: {
    color: "#E8EAED",
    fontSize: 14,
    lineHeight: 20,
  },
  noteTime: {
    color: "#777",
    fontSize: 11,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#262A33",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
    minHeight: 44,
    maxHeight: 120,
  },
  saveBtn: {
    backgroundColor: "#0EC877",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: "#08130D",
    fontWeight: "700",
    fontSize: 14,
  },
});