import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Person from './person'

type PeopleProps = {
  users: string[];
  currentUser: string;
  selectedUser: string | null;
  unreadCounts: Record<string, number>;
  raisedHands?: string[];
  onSelectUser: (username: string) => void;
};

function People({ users, currentUser, selectedUser, unreadCounts, raisedHands = [], onSelectUser }: PeopleProps) {
  const participants = users.filter((user) => user !== currentUser);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      {participants.length ? (
        participants.map((user) => (
          <Person
            key={user}
            name={user}
            selected={user === selectedUser}
            unreadCount={unreadCounts[user] ?? 0}
            handRaised={raisedHands.includes(user)}
            onChatPress={() => onSelectUser(user)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>No other participants in this room yet.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d8d8d8',
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
})

export default People