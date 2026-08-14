import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

type PersonProps = {
  name: string;
  selected?: boolean;
  unreadCount?: number;
  handRaised?: boolean;
  onChatPress: () => void;
};

function Person({ name, selected = false, unreadCount = 0, handRaised = false, onChatPress }: PersonProps) {
  return (
    <View style={[styles.component, selected && styles.selected]}>
      <View style={styles.nameArea}>
        <Text style={styles.text}>{name}</Text>
        {handRaised ? <Text style={styles.handRaisedIcon}>✋</Text> : null}
      </View>
      <View style={styles.chatArea}>
        {unreadCount > 0 ? (
          <View style={styles.personBadge}>
            <Text style={styles.personBadgeText}>{unreadCount}</Text>
          </View>
        ) : null}
        <Pressable style={styles.chatButton} onPress={onChatPress}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  component: {
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
  chatArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  personBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f03f05',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  personBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
})

export default Person