import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, type Note, NoteTextStyle } from '../services/notesService';
import { useTheme } from '../context/ThemeContext';
import FontToolbar from '../components/FontToolbar';

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleStyle, setTitleStyle] = useState<NoteTextStyle>({
    fontSize: 24,
    fontFamily: undefined,
    fontStyle: 'normal' as const,
    color: undefined,
    position: 0,
  });
  const [textStyles, setTextStyles] = useState<NoteTextStyle[]>([]);
  const [currentStyle, setCurrentStyle] = useState<NoteTextStyle>({
    fontSize: 16,
    fontFamily: undefined,
    fontStyle: 'normal' as const,
    color: undefined,
    position: 0,
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    const noteData = await notesService.getNoteById(id as string);
    if (noteData) {
      setNote(noteData);
      setTitle(noteData.title);
      setContent(noteData.content);
      setTextStyles(noteData.textStyles);
      if (noteData.titleStyle) {
        setTitleStyle(noteData.titleStyle);
      }
    }
  };

  const handleSave = async () => {
    if (!note) return;
    
    try {
      const updatedNote: Note = {
        ...note,
        title,
        content,
        textStyles,
        titleStyle,
      };
      await notesService.updateNote(updatedNote);
      setIsEditing(false);
      loadNote();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

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

  const handleFontFamilyChange = (family: string) => {
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

  const handleFontStyleChange = (style: string) => {
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
      setTitleStyle(prev => ({ ...prev, color: color }));
    } else if (selection) {
      const newStyle = {
        ...currentStyle,
        color: color,
        position: selection.start
      };
      setCurrentStyle(newStyle);
      setTextStyles(prev => [...prev, newStyle]);
    }
  };

  const renderStyledText = (content: string, styles: NoteTextStyle[]) => {
    if (!styles.length) {
      return <Text style={[styles.noteText, { color: colors.text }]}>{content}</Text>;
    }

    // Sort styles by position
    const sortedStyles = [...styles].sort((a, b) => a.position - b.position);
    const textPieces = [];
    let lastIndex = 0;

    sortedStyles.forEach((style, index) => {
      // Add text before this style with default styling
      if (style.position > lastIndex) {
        textPieces.push(
          <Text key={`default-${index}`} style={[styles.noteText, { color: colors.text }]}>
            {content.slice(lastIndex, style.position)}
          </Text>
        );
      }

      // Add text with this style
      const nextPosition = index < sortedStyles.length - 1 ? sortedStyles[index + 1].position : content.length;
      textPieces.push(
        <Text
          key={`styled-${index}`}
          style={[
            styles.noteText,
            { color: colors.text },
            {
              fontSize: style.fontSize,
              fontFamily: style.fontFamily,
              fontStyle: style.fontStyle,
            },
          ]}
        >
          {content.slice(style.position, nextPosition)}
        </Text>
      );

      lastIndex = nextPosition;
    });

    // Add any remaining text with default styling
    if (lastIndex < content.length) {
      textPieces.push(
        <Text key="default-last" style={[styles.noteText, { color: colors.text }]}>
          {content.slice(lastIndex)}
        </Text>
      );
    }

    return <Text>{textPieces}</Text>;
  };

  if (!note) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        {isEditing ? (
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </Pressable>
        ) : (
          <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {isEditing && (
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
      )}

      <ScrollView style={styles.content}>
        {isEditing ? (
          <>
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
              value={title}
              onChangeText={setTitle}
              onFocus={() => setIsEditingTitle(true)}
            />
            <TextInput
              ref={contentInputRef}
              style={[
                styles.contentInput,
                {
                  color: currentStyle.color || colors.text,
                  fontSize: currentStyle.fontSize || 16,
                  fontFamily: currentStyle.fontFamily,
                  fontStyle: currentStyle.fontStyle || 'normal',
                }
              ]}
              multiline
              value={content}
              onChangeText={setContent}
              onFocus={() => setIsEditingTitle(false)}
              onSelectionChange={(event) => {
                if (!isEditingTitle) {
                  setSelection(event.nativeEvent.selection);
                }
              }}
            />
          </>
        ) : (
          <Pressable onPress={() => setIsEditing(true)}>
            <Text style={[styles.title, { color: colors.text }, titleStyle]}>
              {note.title}
            </Text>
            {renderStyledText(note.content, note.textStyles)}
          </Pressable>
        )}
      </ScrollView>
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
    padding: 8,
    paddingTop: 40,
    height: 70,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
  },
  content: {
    flex: 1,
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
  editButton: {
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