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

import {
  EventsScreen,
  StoriesScreen,
  ActionTypes,
  CreatorsScreen,
} from './ModalStackUtils';
import axios from 'axios';
import Response from '../types/index';
import CharacterResult from '../types/characterTypes';
import SerieResult from '../types/seriesType';
import { CharacterProps } from './character';
import { SerieProps } from './serie';
import { Dimensions } from 'react-native';
import { Url } from '../types/comicTypes';

type BaseProps = StackScreenProps<StackNavigatorParamList, 'Comic'>

interface charactersState {
  isLoading: boolean;
  characters: Omit<CharacterProps, 'onPress'>[];
}

interface serieState {
  isLoading: boolean;
  serie: Omit<SerieProps, 'onPress'>;
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

const serieReducer = (
  state: serieState,
  action: { type: ActionTypes; data?: SerieResult }
) => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = {
        ...state,
        isLoading: true,
      };
      break;
    case ActionTypes.GET_SERIE_DATA:
      state = {
        ...state,
        isLoading: false,
        serie: action.data as SerieResult,
      };
      break;
    default:
      break;
  }
  return state;
};

const detailedScreenBase = ({ navigation, route: { params } }: BaseProps) => {
  const [charactersState, characterDispatch] = React.useReducer(
    characterReducer,
    {
      characters: [],
      isLoading: true,
    }
  );

  const [serieState, serieDispatch] = React.useReducer(serieReducer, {
    serie: {} as SerieResult,
    isLoading: true,
  });

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
    } else if (actionType === ActionTypes.GET_SERIE_DATA) {
      axios
        .get<Response<SerieResult>>(`${params.series.resourceURI + key}`)
        .then(
          ({
            data: {
              data: { results },
            },
          }) => {
            serieDispatch({
              type: ActionTypes.GET_SERIE_DATA,
              data: results[0],
            });
          }
        )
        .catch((_) => {
          console.warn('Something went wrong...');
        });
    }
  };

  React.useEffect(() => {
    characterDispatch({ type: ActionTypes.REQUEST_START });
    getData(ActionTypes.GET_CHARACTER_DATA);
    serieDispatch({ type: ActionTypes.REQUEST_START });
    getData(ActionTypes.GET_SERIE_DATA);
  }, []);

  const theme = useTheme();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const characterData = charactersState.characters.map((characterProps) => ({
    ...characterProps,
    onPress: () => navigation && navigation.push('Hero', { ...characterProps }),
  }));

  // console.log(comicData[0])

  const serieData = {
    ...serieState.serie,
    onPress: () =>
      navigation && navigation.push('Serie', { ...serieState.serie }),
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
        <Title style={{ alignSelf: 'center' }}>
          {/* style={{ alignSelf: 'center' }} */}
          {/* {params.title} */}
          {params.title.length > 30
            ? params.title.substring(0, 30 - 3) + '..'
            : params.title}
        </Title>
        <Title>
          {/*style={{ alignSelf: 'center', }} */}
          {params.title.length > 30
            ? params.title.substring(27, params.title.length)
            : ''}
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
        <Text style={{ color: contentColor }}>{`#${params.id}\n`}</Text>
        <Text style={{ color: contentColor }}>
          {params.format && params.format !== ''
            ? `Format: ${params.format}\n`
            : '\n'}
        </Text>
        <Text style={{ color: contentColor }}>
          {`Page Count: ${params.pageCount}`}
        </Text>
      </Card.Content>
      {params.description !== '' ? (
        <Card.Content style={detailStyles.cardContent}>
          <Title>Description</Title>
          <Paragraph>{params.description}</Paragraph>
        </Card.Content>
      ) : null}
      {params.dates !== [] ? (
        <Card.Content style={[detailStyles.cardContent]}>
          <Title>Dates</Title>
          {params.dates.map((item, index) => {
            const getDate = new Date(
              // Date.UTC(
              //   parseInt(item.date.slice(0, 4)),
              //   parseInt(item.date.slice(5, 7)),
              //   parseInt(item.date.slice(8, 10))
              // )
              `${item.date.slice(0, 4)}-${item.date.slice(
                5,
                7
              )}-${item.date.slice(8, 10)}`
            );
            const localDate =
              item.date[0] !== '-'
                ? getDate.toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    formatMatcher: 'dd-mm-yyyy',
                  })
                : 'Wrong Date!';

            if (item.type === 'onsaleDate') {
              return (
                <Paragraph
                  key={index}
                  style={{ textDecorationLine: 'underline' }}
                >
                  {`Onsale Date: ${localDate}`}
                </Paragraph>
              );
            } else if (item.type === 'focDate') {
              return (
                <Paragraph
                  key={index}
                  style={{ textDecorationLine: 'underline' }}
                >
                  {`FOC Date: ${localDate}`}
                </Paragraph>
              );
            } else if (item.type === 'unlimitedDate') {
              return (
                <Paragraph
                  key={index}
                  style={{ textDecorationLine: 'underline' }}
                >
                  {`Unlimited Date: ${localDate}`}
                </Paragraph>
              );
            } else if (item.type === 'digitalPurchaseDate') {
              return (
                <Paragraph
                  key={index}
                  style={{ textDecorationLine: 'underline' }}
                >
                  {`Digital Purchase Date: ${localDate}`}
                </Paragraph>
              );
            }
          })}
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
            navigation.push('Serie', serieData);
          }}
        >
          SERIE
        </Button>
      </View>
      <View
        style={{
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

      <View
        style={{
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

type Props = StackScreenProps<StackNavigatorParamList, 'Comic'> & {
  options?: StackNavigationOptions;
}

export const DetailedComic = ({ navigation, options, route }: Props) => {
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
      initialRouteName='Comic'
      {...options}
    >
      <ModalStack.Screen
        name='Comic'
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
    alignItems: 'center',
    marginTop: 5,
    // lineHeight: 18,
    fontSize: 12,
    // fontWeight: 'bold',
  },
});
