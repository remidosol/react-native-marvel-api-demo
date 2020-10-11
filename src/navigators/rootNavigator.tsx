import React from 'react';
import { Dimensions } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import FlashMessage, { showMessage } from 'react-native-flash-message';
// import CharactersContextProvider from '../context/CharactersContext'
// import ComicsContextProvider from '../context/ComicsContext'
// import SeriesContextProvider from '../context/SeriesContext'

import { StackNavigator } from './stack';
import { DrawerContent } from './drawerContent';

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  React.useEffect(() => {
    showMessage({
      message: 'Welcome',
      description: "Welcome to remidosol's First Experience",
      backgroundColor: '#f0141e',
      color: '#FFFFFF',
    });

    // return () => {}
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      <FlashMessage
        position={'top'}
        style={{ justifyContent: 'center' }}
        duration={3000}
      />
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name='Home' component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
