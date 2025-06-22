import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

import Navigation from './navigation';
import { AuthProvider } from './contexts/AuthContext';

// Initialize Supabase client
const supabaseUrl = Constants.manifest?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.manifest?.extra?.supabaseAnonKey || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Keep the splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          'Righteous': require('./assets/fonts/Righteous-Regular.ttf'),
          'Happy-Monkey': require('./assets/fonts/HappyMonkey-Regular.ttf'),
          'Luckiest-Guy': require('./assets/fonts/LuckiestGuy-Regular.ttf'),
        });
      } catch (e) {
        console.warn('Error loading assets:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider supabase={supabase}>
        <NavigationContainer>
          <Navigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
