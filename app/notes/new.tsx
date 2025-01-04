import { View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService } from '../services/notesService';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    try {
      await notesService.addNote(title.trim(), content.trim());
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Pressable style={styles.saveButton} onPress={saveNote}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </Pressable>
      </View>

      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f6f6f6',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    paddingTop: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    paddingTop: 8,
  },
}); 