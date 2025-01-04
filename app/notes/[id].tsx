import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, type Note } from '../services/notesService';
import { useTheme } from '../context/ThemeContext';

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    const noteData = await notesService.getNoteById(id as string);
    setNote(noteData);
  };

  if (!note) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.date, { color: colors.subtitle }]}>{note.date}</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>
        <Text style={[styles.noteText, { color: colors.text }]}>{note.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  date: {
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 