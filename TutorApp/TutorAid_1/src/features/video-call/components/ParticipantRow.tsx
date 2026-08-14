/**
 * ParticipantRow
 * --------------
 * A single row in the participants list, showing the user's name,
 * hand-raised indicator, unread message badge, and a Chat button.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface ParticipantRowProps {
  name: string;
  selected?: boolean;
  unreadCount?: number;
  handRaised?: boolean;
  onChatPress: () => void;
}

export const ParticipantRow: React.FC<ParticipantRowProps> = ({
  name,
  selected = false,
  unreadCount = 0,
  handRaised = false,
  onChatPress,
}) => {
  return (
    <View style={[styles.container, selected && styles.selected]}>
      <View style={styles.nameArea}>
        <Text style={styles.text}>{name}</Text>
        {handRaised ? <Text style={styles.handRaisedIcon}>✋</Text> : null}
      </View>
      <View style={styles.chatArea}>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
        <Pressable style={styles.chatButton} onPress={onChatPress}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DED7',
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#eef6ff',
  },
  nameArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontWeight: '600',
    color: '#111',
  },
  handRaisedIcon: {
    fontSize: 16,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f03f05',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  chatArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatButton: {
    backgroundColor: '#1f6feb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
