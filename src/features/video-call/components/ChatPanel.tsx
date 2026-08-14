/**
 * ChatPanel
 * ---------
 * Inline chat view for a single target user.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChatMessage, ChatPanelProps } from '../types';

export const ChatPanel: React.FC<ChatPanelProps> = ({
  currentUser,
  targetUser,
  messages,
  onSend,
}) => {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || !targetUser) return;
    onSend(trimmed);
    setDraft('');
  };

  const Behavior =
    Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {targetUser ? `Chat with ${targetUser}` : 'Select a participant to chat'}
      </Text>
      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {targetUser ? (
          messages.length ? (
            messages.map((message, index) => (
              <View
                key={`${message.sender}-${message.timestamp}-${index}`}
                style={[
                  styles.messageBubble,
                  message.sender === currentUser
                    ? styles.messageOutgoing
                    : styles.messageIncoming,
                ]}
              >
                <Text style={styles.messageSender}>{message.sender}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No messages yet. Send the first message.</Text>
          )
        ) : (
          <Text style={styles.emptyText}>Tap a participant to open chat.</Text>
        )}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={targetUser ? `Message ${targetUser}` : 'Select a participant first'}
          editable={Boolean(targetUser)}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[styles.sendButton, !targetUser && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!targetUser}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    marginTop: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  messages: {
    maxHeight: 200,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  messagesContent: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageIncoming: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
  },
  messageOutgoing: {
    backgroundColor: '#d1fae5',
    alignSelf: 'flex-end',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#999',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
