import React from 'react';
import { View, Linking, StyleSheet, Text } from 'react-native';
// import type { ParamListBase } from '@react-navigation/native'
import { Title, useTheme, Card, Paragraph, Button } from 'react-native-paper';
import {
  createStackNavigator,
  StackScreenProps,
  StackNavigationOptions,
  TransitionPresets,
  StackNavigationProp,
} from '@react-navigation/stack';
import color from 'color';
import { ScrollView } from 'react-native-gesture-handler';

import { StackNavigatorParamList } from '../types';

import { CharactersScreen } from '../screens/characterModal';
import { ComicsScreen } from '../screens/comicModal';

import {
  EventsScreen,
  StoriesScreen,
  ActionTypes,
  CreatorsScreen,
} from './ModalStackUtils';
import axios from 'axios';
import Response from '../types/index';
import CharacterResult from '../types/characterTypes';
import ComicResult from '../types/comicTypes';
import { CharacterProps } from './character';
import { Dimensions } from 'react-native';
import { Url } from '../types/comicTypes';
import { ComicProps } from './comic';

type BaseProps = StackScreenProps<StackNavigatorParamList, 'Serie'>

interface charactersState {
  isLoading: boolean;
  characters: Omit<CharacterProps, 'onPress'>[];
}

interface comicState {
  isLoading: boolean;
  comics: Omit<ComicProps, 'onPress'>[];
}

const characterReducer = (
  state: charactersState,
  action: { type: ActionTypes; data?: CharacterResult[] }
) => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = {
        ...state,
        isLoading: true,
      };
      break;
    case ActionTypes.GET_CHARACTER_DATA:
      state = {
        isLoading: false,
        characters: action.data as CharacterResult[],
      };
      break;
    default:
      break;
  }
  return state;
};

const comicReducer = (
  state: comicState,
  action: { type: ActionTypes; data?: ComicResult[] }
) => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = {
        ...state,
        isLoading: true,
      };
      break;
    case ActionTypes.GET_COMIC_DATA:
      state = {
        isLoading: false,
        comics: action.data as ComicResult[],
      };
      break;
    default:
      break;
  }
  return state;
};

const detailedScreenBase = ({ navigation, route: { params } }: BaseProps) => {
  const [comicState, comicDispatch] = React.useReducer(comicReducer, {
    comics: [],
    isLoading: true,
  });

  const [charactersState, characterDispatch] = React.useReducer(
    characterReducer,
    {
      characters: [],
      isLoading: true,
    }
  );

  const theme = useTheme();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const getData = (actionType: ActionTypes) => {
    const key =
      '?limit=100&ts=1&apikey=YOURAPIKEY&hash=YOURHASH';

    if (actionType === ActionTypes.GET_CHARACTER_DATA) {
      axios
        .get<Response<CharacterResult>>(
          `${params.characters.collectionURI + key}`
        )
        .then(
          ({
            data: {
              data: { results },
            },
          }) => {
            characterDispatch({
              type: ActionTypes.GET_CHARACTER_DATA,
              data: results,
            });
          }
        )
        .catch((_) => {
          console.warn('Something went wrong...');
        });
    } else if (actionType === ActionTypes.GET_COMIC_DATA) {
      axios
        .get<Response<ComicResult>>(`${params.comics.collectionURI + key}`)
        .then(
          ({
            data: {
              data: { results },
            },
          }) => {
            comicDispatch({ type: ActionTypes.GET_COMIC_DATA, data: results });
          }
        )
        .catch((_) => {
          console.warn('Something went wrong...');
        });
    }
  };

  React.useEffect(() => {
    characterDispatch({ type: ActionTypes.REQUEST_START });
    comicDispatch({ type: ActionTypes.REQUEST_START });
    getData(ActionTypes.GET_CHARACTER_DATA);
    getData(ActionTypes.GET_COMIC_DATA);
  }, []);

  const characterData = charactersState.characters.map((characterProps) => ({
    ...characterProps,
    onPress: () => navigation && navigation.push('Hero', { ...characterProps }),
  }));

  const comicData = comicState.comics.map((comicProps) => ({
    ...comicProps,
    onPress: () => navigation && navigation.push('Comic', { ...comicProps }),
  }));

  const capitalCase = (str: string): string => {
    const substr: Array<string> = str.toLowerCase().split(' ');
    for (let i = 0; i < substr.length; i++) {
      substr[i] = substr[i].charAt(0).toUpperCase() + substr[i].slice(1);
    }
    str = substr.join(' ');

    return str;
  };

  return (
    <ScrollView>
      <Card.Cover
        style={[detailStyles.cardCover, { borderColor: imageBorderColor }]}
        source={{
          uri: `${params.thumbnail.path}.${params.thumbnail.extension}`,
        }}
      />
      <Card.Content style={detailStyles.cardTitle}>
        <Title>
          {/*style={{ alignSelf: 'center', }} */}
          {params.title.length > 30
            ? params.title.substring(0, 30 - 3) +
              '..' +
              params.title.substring(27, params.title.length)
            : params.title}
        </Title>
      </Card.Content>
      <Card.Content
        style={{
          // alignSelf: 'center',
          marginTop: 10,
          flexDirection: 'column',
          alignItems: 'center',
          // justifyContent: 'center',
        }}
      >
        <Text style={{ color: contentColor }}>{`#${params.id}`}</Text>
        <Text style={{ color: contentColor }}>
          {params.type &&
            params.type !== '' &&
            `Type: ${capitalCase(params.type)}`}
        </Text>
        <Text style={{ color: contentColor }}>
          {`Publishing Year Range: ${params.startYear} - ${params.endYear}`}
        </Text>
      </Card.Content>
      {params.description && params.description !== '' ? (
        <Card.Content style={detailStyles.cardContent}>
          <Title>Description</Title>
          <Paragraph>{params.description}</Paragraph>
        </Card.Content>
      ) : null}
      {/* <Card.Actions
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          flexDirection: 'column',
        }}
      > */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Button
          onPress={() => {
            navigation.push('Characters', characterData);
          }}
        >
          CHARACTERS
        </Button>
        <Button
          onPress={() => {
            navigation.push('Comics', comicData);
          }}
        >
          COMICS
        </Button>
      </View>
      <View
        style={{
          // flex: 0.1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Button
          onPress={() => {
            navigation.push('Stories', params.stories.items);
          }}
        >
          STORIES
        </Button>
        <Button
          onPress={() => {
            navigation.push('Events', params.events.items);
          }}
        >
          EVENTS
        </Button>
      </View>

      <Button
        style={{ alignSelf: 'center' }}
        onPress={() => {
          navigation.push('Creators', params.creators.items);
        }}
      >
        CREATORS
      </Button>

      <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {params.urls.map((item: Url, index) => {
          switch (item.type) {
            case 'detail':
              return (
                <Button
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  DETAILS
                </Button>
              );
              break;

            case 'wiki':
              return (
                <Button
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  WIKI
                </Button>
              );
              break;

            case 'purchase':
              return (
                <Button
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  PURCHASE
                </Button>
              );
              break;

            case 'reader':
              return (
                <Button
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  READER
                </Button>
              );
              break;

            case 'inAppLink':
              return (
                <Button
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  IN APP LINK
                </Button>
              );

            default:
              break;
          }
        })}
      </View>
      {/* </Card.Actions> */}
    </ScrollView>
  );
};

const ModalStack = createStackNavigator<StackNavigatorParamList>();

type Props = StackScreenProps<StackNavigatorParamList, 'Serie'> & {
  options?: StackNavigationOptions;
}

export const DetailedSerie = ({ navigation, options, route }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ModalStack.Navigator
      mode='modal'
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0
            ? 0
            : undefined,
      })}
      initialRouteName='Serie'
      {...options}
    >
      <ModalStack.Screen
        name='Serie'
        component={detailedScreenBase}
        options={({ route }) => ({
          title: `${route.params.id}`,
          headerTitleAlign: 'center',
        })}
        initialParams={{ ...route.params }}
      />
      <ModalStack.Screen
        name='Characters'
        component={CharactersScreen}
        options={() => ({
          title: `Characters`,
        })}
      />
      <ModalStack.Screen
        name='Comics'
        component={ComicsScreen}
        options={() => ({
          title: `Comics`,
        })}
      />
      <ModalStack.Screen
        name='Stories'
        component={StoriesScreen}
        options={() => ({
          title: `Stories`,
        })}
      />
      <ModalStack.Screen
        name='Events'
        component={EventsScreen}
        options={() => ({
          title: `Events`,
        })}
      />
      <ModalStack.Screen
        name='Creators'
        component={CreatorsScreen}
        options={() => ({
          title: `Creators`,
        })}
      />
    </ModalStack.Navigator>
  );
};

const detailStyles = StyleSheet.create({
  cardCover: {
    borderRadius: (Dimensions.get('window').width - 50) / 4,
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height / 2,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardContent: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    // justifyContent: 'space-around',
    // flexDirection: 'column',
    alignItems: 'center',
    // alignSelf: 'center',
    marginTop: 5,
    // lineHeight: 18,
    fontSize: 12,
    // fontWeight: 'bold',
  },
});
