/**
 * ParticipantsModal
 * -----------------
 * A full-screen modal showing the participant list and (optionally) an
 * inline chat panel for the selected participant.
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParticipantsModalProps } from '../types';
import { ChatPanel } from './ChatPanel';
import { ParticipantRow } from './ParticipantRow';

export const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  visible,
  users,
  currentUser,
  selectedUser,
  unreadCounts,
  raisedHands = [],
  chatMessages,
  onSendChat,
  onSelectUser,
  onClose,
}) => {
  const participants = users.filter((u) => u !== currentUser);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Participants</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {participants.length ? (
            participants.map((user) => (
              <ParticipantRow
                key={user}
                name={user}
                selected={user === selectedUser}
                unreadCount={unreadCounts[user] ?? 0}
                handRaised={raisedHands.includes(user)}
                onChatPress={() => onSelectUser(user)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No other participants in this room.</Text>
          )}

          {selectedUser ? (
            <ChatPanel
              currentUser={currentUser}
              targetUser={selectedUser}
              messages={chatMessages[selectedUser] ?? []}
              onSend={onSendChat}
            />
          ) : null}

          <Pressable style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>Close</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7F4',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 200,
    marginTop: 8,
    alignSelf: 'center',
  },
  actionButtonText: {
    color: '#FBF7F4',
    fontWeight: '700',
    textAlign: 'center',
  },
});
