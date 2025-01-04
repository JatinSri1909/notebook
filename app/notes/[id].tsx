import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { notesService, type Note, NoteTextStyle } from '../services/notesService';
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
        <Text style={[styles.date, { color: colors.subtitle }]}>{note.date}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[
          styles.title,
          { color: colors.text },
          note.titleStyle && {
            fontSize: note.titleStyle.fontSize,
            fontFamily: note.titleStyle.fontFamily,
            fontStyle: note.titleStyle.fontStyle,
            color: note.titleStyle.color,
          }
        ]}>
          {note.title}
        </Text>
        {renderStyledText(note.content, note.textStyles)}
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
}); 