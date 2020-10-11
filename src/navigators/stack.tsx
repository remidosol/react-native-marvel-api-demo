import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BottomTabs } from './bottomTabs';
import { DetailedHero } from '../components/heroDetails';
import { DetailedComic } from '../components/comicDetails';
import { DetailedSerie } from '../components/serieDetails';
import { StackNavigatorParamList } from '../types';

const Stack = createStackNavigator<StackNavigatorParamList>();

export const StackNavigator = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName='HeroList'
      headerMode='screen'
      screenOptions={{
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
              // style={{  }}
            >
              {previous ? (
                <Appbar.BackAction
                  style={{ alignSelf: 'flex-start' }}
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
                  }}
                >
                  <Avatar.Image
                    size={40}
                    source={{
                      uri:
                        'https://cdn.iconscout.com/icon/free/png-512/marvel-282124.png', //https://cdn.pixabay.com/photo/2019/11/05/20/02/man-4604423_960_720.png
                    }}
                    style={{ backgroundColor: '#f0141e' }}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={
                  title === 'HeroList' || 'ComicList' || 'SerieList' ? (
                    <MaterialCommunityIcons
                      style={{ marginRight: 10 }}
                      name='music-rest-quarter'
                      size={40}
                      color='#f0141e'
                    />
                  ) : (
                    title
                  )
                }
                titleStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#f0141e',
                  // alignSelf: 'center',
                  marginLeft: Dimensions.get('window').width / 4,
                }}
              />
            </Appbar.Header>
          );
        },
      }}
    >
      <Stack.Screen
        name='HeroList'
        component={BottomTabs}
        options={({ route }) => {
          //   console.log('!@# options', { route })
          const routeName = route.state
            ? route.state.routes[route.state.index].name
            : 'HeroList';
          return { headerTitle: routeName };
        }}
      />

      <Stack.Screen
        name='Hero'
        component={DetailedHero}
        options={{ headerTitle: 'Hero' }}
      />
      <Stack.Screen
        name='Comic'
        component={DetailedComic}
        options={{ headerTitle: 'Comic' }}
      />
      <Stack.Screen
        name='Serie'
        component={DetailedSerie}
        options={{ headerTitle: 'Serie' }}
      />
    </Stack.Navigator>
  );
};
