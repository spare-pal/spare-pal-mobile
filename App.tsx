import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import "react-native-devsettings/withAsyncStorage";
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { AppContextProvider } from './app/context';
import AppNavigator from './app/navigation';
import ExpoNotification from './app/notifications/expo-notifications';
import { ThemeStatic, Typography } from './app/theme';
import { ThemeColors } from './app/types/theme';
import { getPersistor, getStore } from './app/utils/reduxStore';


export function AppContainer() {
  const myStore = getStore();
  const myPersistor = getPersistor();

  return (
    <Provider store={myStore}>
      <NativeBaseProvider>
        <PersistGate persistor={myPersistor}>
          <AppContextProvider>
            <ExpoNotification />
            <StatusBar
              animated
              barStyle={'dark-content'}
              backgroundColor={'rgba(0,0,0,0.4)'}
            />
            <AppNavigator initialScreen={undefined} />
            <FlashMessage
              titleStyle={styles().flashMessageTitle}
              floating
              position="bottom"
            />
          </AppContextProvider>
        </PersistGate>
      </NativeBaseProvider>
    </Provider>
  );
}
export default function App() {
  const [isFontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFontsAndApp() {
      try {
        await SplashScreen.preventAutoHideAsync();
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.error(e);
      }
    }
    loadFontsAndApp();
  }, []);
  if (!isFontsLoaded) {
    return null;
  } return <AppContainer />;
}

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1, backgroundColor: '#000',
    },
    flashMessageTitle: {
      ...Typography.FontWeights.Light,
      ...Typography.FontSizes.Body,
      color: ThemeStatic.white,
    },
  });
