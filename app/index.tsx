import { View, Text, FlatList, Pressable, StyleSheet, StatusBar, Alert } from 'react-native';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, type Note } from './services/notesService';
import { useTheme } from './context/ThemeContext';

export default function Index() {
  const { colors, toggleTheme } = useTheme();
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

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

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
              await loadNotes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#000000' ? 'dark-content' : 'light-content'} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notebook</Text>
        <Pressable onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons 
            name={colors.text === '#000000' ? 'moon' : 'sunny'} 
            size={24} 
            color={colors.text}
          />
        </Pressable>
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
              Tap + to create your first note
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.noteCard,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
            onPress={() => router.push({
              pathname: "/notes/[id]",
              params: { id: item.id }
            })}
          >
            <View style={styles.noteContent}>
              <Text 
                style={[
                  styles.noteTitle, 
                  { color: colors.text },
                  item.titleStyle && {
                    fontSize: item.titleStyle.fontSize,
                    fontFamily: item.titleStyle.fontFamily,
                    fontStyle: item.titleStyle.fontStyle,
                    color: item.titleStyle.color || colors.text,
                  }
                ]}
              >
                {item.title}
              </Text>
              <Text 
                style={[
                  styles.notePreview,
                  { color: colors.subtitle },
                  item.textStyles.length > 0 && {
                    fontSize: item.textStyles[item.textStyles.length - 1].fontSize || 16,
                    fontFamily: item.textStyles[item.textStyles.length - 1].fontFamily,
                    fontStyle: item.textStyles[item.textStyles.length - 1].fontStyle || 'normal',
                    color: item.textStyles[item.textStyles.length - 1].color || colors.subtitle,
                  }
                ]} 
                numberOfLines={2}
              >
                {item.content}
              </Text>
              <Text style={[styles.noteDate, { color: colors.subtitle }]}>
                {item.date}
              </Text>
            </View>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteNote(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.delete} />
            </Pressable>
          </Pressable>
        )}
      />

      <Link href="./notes/new" asChild>
        <Pressable style={styles.fab}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Add padding for FAB
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  themeButton: {
    position: 'absolute',
    right: 20,
    top: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
