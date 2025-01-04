import { View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, NoteTextStyle } from '../services/notesService';
import FontToolbar from '../components/FontToolbar';
import { useTheme } from '../context/ThemeContext';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [textStyles, setTextStyles] = useState<NoteTextStyle[]>([]);
  const [currentStyle, setCurrentStyle] = useState<NoteTextStyle>({
    fontSize: 16,
    fontFamily: undefined,
    fontStyle: 'normal' as const,
    position: 0,
  });
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleFontSizeChange = (size: number) => {
    if (selection) {
      const newStyle = {
        fontSize: size,
        fontFamily: currentStyle.fontFamily,
        fontStyle: currentStyle.fontStyle,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const handleFontFamilyChange = (family: string | undefined) => {
    if (selection) {
      const newStyle = {
        fontSize: currentStyle.fontSize,
        fontFamily: family,
        fontStyle: currentStyle.fontStyle,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const handleFontStyleChange = (style: 'normal' | 'italic') => {
    if (selection) {
      const newStyle = {
        fontSize: currentStyle.fontSize,
        fontFamily: currentStyle.fontFamily,
        fontStyle: style,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    try {
      await notesService.addNote(title.trim(), content.trim(), textStyles);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Pressable style={styles.saveButton} onPress={saveNote}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </Pressable>
      </View>

      <FontToolbar
        onFontSizeChange={handleFontSizeChange}
        onFontFamilyChange={handleFontFamilyChange}
        onFontStyleChange={handleFontStyleChange}
        currentSize={currentStyle.fontSize || 16}
        currentFamily={currentStyle.fontFamily}
        currentStyle={currentStyle.fontStyle || 'normal'}
      />

      <TextInput
        style={[styles.titleInput, { color: colors.text }]}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.subtitle}
      />
      <TextInput
        ref={inputRef}
        style={[
          styles.contentInput,
          { color: colors.text },
          {
            fontSize: currentStyle.fontSize,
            fontFamily: currentStyle.fontFamily,
            fontStyle: currentStyle.fontStyle,
          }
        ]}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.subtitle}
        onSelectionChange={(event) => {
          setSelection(event.nativeEvent.selection);
        }}
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