import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface FontToolbarProps {
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string | undefined) => void;
  onFontStyleChange: (style: 'normal' | 'italic') => void;
  currentSize: number;
  currentFamily: string | undefined;
  currentStyle: 'normal' | 'italic';
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24];
const FONT_FAMILIES = [
  { name: 'Default', value: undefined },
  { name: 'System', value: 'System' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Serif', value: 'serif' },
];

export function FontToolbar({
  onFontSizeChange,
  onFontFamilyChange,
  onFontStyleChange,
  currentSize,
  currentFamily,
  currentStyle,
}: FontToolbarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.subtitle }]}>Size</Text>
          <View style={styles.options}>
            {FONT_SIZES.map((size) => (
              <Pressable
                key={size}
                style={[
                  styles.option,
                  currentSize === size && { backgroundColor: colors.primary },
                ]}
                onPress={() => onFontSizeChange(size)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: currentSize === size ? '#FFF' : colors.text },
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.subtitle }]}>Font</Text>
          <View style={styles.options}>
            {FONT_FAMILIES.map((font) => (
              <Pressable
                key={font.name}
                style={[
                  styles.option,
                  currentFamily === font.value && { backgroundColor: colors.primary },
                ]}
                onPress={() => onFontFamilyChange(font.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: currentFamily === font.value ? '#FFF' : colors.text },
                    font.value ? { fontFamily: font.value } : null,
                  ]}
                >
                  {font.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.subtitle }]}>Style</Text>
          <View style={styles.options}>
            <Pressable
              style={[
                styles.option,
                currentStyle === 'normal' && { backgroundColor: colors.primary },
              ]}
              onPress={() => onFontStyleChange('normal')}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentStyle === 'normal' ? '#FFF' : colors.text },
                ]}
              >
                Normal
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                currentStyle === 'italic' && { backgroundColor: colors.primary },
              ]}
              onPress={() => onFontStyleChange('italic')}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentStyle === 'italic' ? '#FFF' : colors.text },
                  { fontStyle: 'italic' },
                ]}
              >
                Italic
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  section: {
    marginHorizontal: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
  },
});

export default FontToolbar; 