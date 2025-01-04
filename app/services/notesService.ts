import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NoteTextStyle {
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  position: number;
}

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  textStyles: NoteTextStyle[];
};

const STORAGE_KEY = 'notes';

export const notesService = {
  async getAllNotes(): Promise<Note[]> {
    try {
      const notes = await AsyncStorage.getItem(STORAGE_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async addNote(title: string, content: string, textStyles: NoteTextStyle[] = []): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        textStyles,
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newNote, ...notes]));
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  async updateNote(note: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.map(n => n.id === note.id ? note : n);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async getNoteById(id: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }
}; 