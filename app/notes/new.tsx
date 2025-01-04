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
    color: undefined,
    position: 0,
  });
  const [titleStyle, setTitleStyle] = useState<NoteTextStyle>({
    fontSize: 24,
    fontFamily: undefined,
    fontStyle: 'normal' as const,
    color: undefined,
    position: 0,
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const titleInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const { colors } = useTheme();
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleFontSizeChange = (size: number) => {
    if (isEditingTitle) {
      setTitleStyle(prev => ({ ...prev, fontSize: size }));
    } else if (selection) {
      const newStyle = {
        ...currentStyle,
        fontSize: size,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const handleFontFamilyChange = (family: string | undefined) => {
    if (isEditingTitle) {
      setTitleStyle(prev => ({ ...prev, fontFamily: family }));
    } else if (selection) {
      const newStyle = {
        ...currentStyle,
        fontFamily: family,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const handleFontStyleChange = (style: 'normal' | 'italic') => {
    if (isEditingTitle) {
      setTitleStyle(prev => ({ ...prev, fontStyle: style }));
    } else if (selection) {
      const newStyle = {
        ...currentStyle,
        fontStyle: style,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const handleFontColorChange = (color: string) => {
    if (isEditingTitle) {
      setTitleStyle(prev => ({ ...prev, color }));
    } else if (selection) {
      const newStyle = {
        ...currentStyle,
        color,
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
      await notesService.addNote(title.trim(), content.trim(), textStyles, titleStyle);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
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
        onFontColorChange={handleFontColorChange}
        currentSize={isEditingTitle ? titleStyle.fontSize || 24 : currentStyle.fontSize || 16}
        currentFamily={isEditingTitle ? titleStyle.fontFamily : currentStyle.fontFamily}
        currentStyle={isEditingTitle ? titleStyle.fontStyle || 'normal' : currentStyle.fontStyle || 'normal'}
        currentColor={isEditingTitle ? titleStyle.color || colors.text : currentStyle.color || colors.text}
      />

      <TextInput
        ref={titleInputRef}
        style={[
          styles.titleInput,
          {
            color: titleStyle.color || colors.text,
            fontSize: titleStyle.fontSize || 24,
            fontFamily: titleStyle.fontFamily,
            fontStyle: titleStyle.fontStyle || 'normal',
          }
        ]}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.subtitle}
        onFocus={() => setIsEditingTitle(true)}
      />

      <TextInput
        ref={inputRef}
        style={[
          styles.contentInput,
          {
            color: currentStyle.color || colors.text,
            fontSize: currentStyle.fontSize || 16,
            fontFamily: currentStyle.fontFamily,
            fontStyle: currentStyle.fontStyle || 'normal',
          }
        ]}
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.subtitle}
        onFocus={() => setIsEditingTitle(false)}
        onSelectionChange={(event) => {
          if (!isEditingTitle) {
            setSelection(event.nativeEvent.selection);
          }
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
    padding: 8,
    paddingTop: 40,
    backgroundColor: '#f6f6f6',
    height: 70,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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