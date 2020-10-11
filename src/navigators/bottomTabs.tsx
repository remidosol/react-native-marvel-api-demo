import React from 'react';
import { Linking } from 'react-native';
import color from 'color';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  useTheme,
  Portal,
  FAB,
  Dialog,
  Button,
  Paragraph,
} from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, RouteProp } from '@react-navigation/native';

import overlay from '../overlay';
import { HeroList } from '../screens/heroList';
import { ComicList } from '../screens/comicList';
import { SerieList } from '../screens/serieList';
import { StackNavigatorParamList } from '../types';

import FlashMessage, { showMessage } from 'react-native-flash-message';

const Tab = createMaterialBottomTabNavigator();

type Props = {
  route: RouteProp<StackNavigatorParamList, 'HeroList'>;
}

export const BottomTabs = ({ route }: Props) => {
  const [visible, setVisible] = React.useState(false);

  const [showFlash, setShowFlash] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();

  const icon = 'frequently-asked-questions';

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface;

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName='HeroList'
        backBehavior='initialRoute'
        shifting={true}
        activeColor='#f0141e'
        inactiveColor={color(theme.colors.text)
          .alpha(0.6)
          .rgb()
          .string()}
        sceneAnimationEnabled={false}
      >
        <Tab.Screen
          name='HeroList'
          component={HeroList}
          options={{
            tabBarIcon: 'account-search',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name='ComicList'
          component={ComicList}
          options={{
            tabBarIcon: 'book-search',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name='SerieList'
          component={SerieList}
          options={{
            tabBarIcon: 'file-document-box-search',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      {showFlash && (
        <FlashMessage
          position={'top'}
          style={{ alignSelf: 'center' }}
          onPress={showDialog}
          duration={3000}
        />
      )}
      {visible && (
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Information</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                This is a React Native App that uses Marvel API developed by
                remidosol.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Alright!</Button>
              <Button
                onPress={() => {
                  Linking.openURL('https://www.github.com/remidosol');
                }}
              >
                More Info...
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      <Portal>
        <FAB
          visible={isFocused}
          icon={icon}
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color='white'
          theme={{
            colors: {
              accent: '#f0141e',
            },
          }}
          onPress={() => {
            showMessage({
              message: 'Touch Me!',
              description: 'Please touch here for more information!',
              color: '#FFFFFF',
              backgroundColor: '#f0141e',
              onPress: showDialog,
            });
          }}
        />
      </Portal>
    </React.Fragment>
  );
};
