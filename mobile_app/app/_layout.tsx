import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Tracks token check completion
  const router = useRouter(); // Handles navigation
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication...');
      try {
        const token = await AsyncStorage.getItem('access_token');
        console.log('Token retrieved:', token);

        setIsAuthenticated(!!token);
        console.log('Authentication state updated:', !!token);

        // Check if admin mode is set in AsyncStorage
        const adminMode = await AsyncStorage.getItem('isAdmin');
        setIsAdmin(adminMode === 'true'); // Set admin state based on stored value
        console.log('Admin mode state updated:', adminMode === 'true');

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
      console.log('Auth checked, navigating...');
      console.log('isAuthenticated:', isAuthenticated);
      console.log('isAdmin:', isAdmin);

      if (isAuthenticated) {
        if (isAdmin) {
          console.log('Navigating to admin dashboard...');
          router.replace('/dash'); // Navigate to admin dashboard
        } else {
          console.log('Navigating to user home...');
          router.replace('/home'); // Navigate to user home
        }
      } else {
        console.log('Navigating to login screen...');
        router.replace('/about'); // Navigate to unauthenticated login
      }
    }
  }, [authChecked, isAuthenticated, isAdmin]); // Re-run whenever authChecked, isAuthenticated, or isAdmin changes

  if (!authChecked) {
    // Wait until token check completes before rendering
    console.log('Waiting for auth check to complete...');
    return null;
  }

  const setAdminMode = () => {
    setIsAdmin(true); // Set admin mode when navigating from /adminLogin
  };

  return (
    <Stack>
      {isAuthenticated ? (
        isAdmin ? (
          // Render admin layout
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        ) : (
          // Render authenticated user layout
          <Stack.Screen name="(users)" options={{ headerShown: false }} />
        )
      ) : (
        // Render unauthenticated layout
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
