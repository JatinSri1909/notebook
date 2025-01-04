import { View, Text, FlatList, Pressable, StyleSheet, StatusBar, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, type Note } from '../services/notesService';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadNotes = async () => {
    try {
      const allNotes = await notesService.getAllNotes();
      setNotes(allNotes);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const deleteNote = async (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notesService.deleteNote(id);
              await loadNotes(); // Reload notes after deletion
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>All Notes</Text>
        <Link href="../notes/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={28} color="#007AFF" />
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateText}>No notes yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to create your first note
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.noteCard}
            onPress={() => router.push({
              pathname: "./notes/[id]",
              params: { id: item.id }
            })}
          >
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.notePreview} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={styles.noteDate}>{item.date}</Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteNote(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 8,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  noteContent: {
    flex: 1,
    marginRight: 16,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  notePreview: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 13,
    color: '#C7C7CC',
  },
  deleteButton: {
    alignSelf: 'center',
    padding: 8,
  },
}); 