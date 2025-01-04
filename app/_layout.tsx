import { Stack } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="notes/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="notes/new" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="notes/[id]"
          options={{ headerShown: false }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
