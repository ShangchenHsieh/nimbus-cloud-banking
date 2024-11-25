import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Tracks token check completion
  const router = useRouter(); // Handles navigation

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      try {
        //await AsyncStorage.removeItem('access_token');
        const token = await AsyncStorage.getItem('access_token');
        console.log('Token retrieved:', token);

        setIsAuthenticated(!!token);
        console.log('Authentication state updated:', !!token);

        setAuthChecked(true);
        console.log('Auth check completed');
      } catch (error) {
        console.error('Error retrieving token:', error);
        setAuthChecked(true); // Ensure it completes even on error
      }
    };

    checkAuth();
  }, []); // Run once on component mount

  useEffect(() => {
    if (authChecked) {
      if (isAuthenticated) {
        router.replace('/home'); // Navigate to authenticated home
      } else {
        router.replace('/login'); // Navigate to unauthenticated login
      }
    }
  }, [authChecked, isAuthenticated]); // Re-run whenever authChecked or isAuthenticated changes

  if (!authChecked) {
    // Wait until token check completes before rendering
    console.log('Waiting for auth check to complete...');
    return null;
  }

  return (
    <Stack>
      {isAuthenticated ? (
        // Render authenticated layout
        <Stack.Screen name="(users)" options={{ headerShown: false }} />
      ) : (
        // Render unauthenticated layout
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
