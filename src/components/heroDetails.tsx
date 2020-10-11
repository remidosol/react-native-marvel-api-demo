import React from 'react';
import { View, Linking, StyleSheet } from 'react-native';
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

import { ComicsScreen } from '../screens/comicModal';
import { SeriesScreen } from '../screens/serieModal';

import { EventsScreen, StoriesScreen, ActionTypes } from './ModalStackUtils';
import axios from 'axios';
import Response from '../types/index';
import ComicResult from '../types/comicTypes';
import SerieResult from '../types/seriesType';
import { ComicProps } from './comic';
import { SerieProps } from './serie';
import { Dimensions } from 'react-native';

type BaseProps = StackScreenProps<StackNavigatorParamList, 'Hero'>

interface comicState {
  isLoading: boolean;
  comics: Omit<ComicProps, 'onPress'>[];
}

interface serieState {
  isLoading: boolean;
  series: Omit<SerieProps, 'onPress'>[];
}

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

const serieReducer = (
  state: serieState,
  action: { type: ActionTypes; data?: SerieResult[] }
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
        series: action.data as SerieResult[],
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
  const [serieState, serieDispatch] = React.useReducer(serieReducer, {
    isLoading: true,
    series: [],
  });

  const getData = (actionType: ActionTypes) => {
    const key =
      '?limit=100&ts=1&apikey=YOURAPIKEY&hash=YOURHASH';
    if (actionType === ActionTypes.GET_COMIC_DATA) {
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
    } else if (actionType === ActionTypes.GET_SERIE_DATA) {
      axios
        .get<Response<SerieResult>>(`${params.series.collectionURI + key}`)
        .then(
          ({
            data: {
              data: { results },
            },
          }) => {
            serieDispatch({ type: ActionTypes.GET_SERIE_DATA, data: results });
          }
        )
        .catch((_) => {
          console.warn('Something went wrong...');
        });
    }
  };

  React.useEffect(() => {
    comicDispatch({ type: ActionTypes.REQUEST_START });
    getData(ActionTypes.GET_COMIC_DATA);
    serieDispatch({ type: ActionTypes.REQUEST_START });
    getData(ActionTypes.GET_SERIE_DATA);
  }, [null]);

  const comicData = comicState.comics.map((comicProps) => ({
    ...comicProps,
    onPress: () => navigation && navigation.push('Comic', { ...comicProps }),
  }));

  // console.log(comicData[0])

  const serieData = serieState.series.map((serieProps) => ({
    ...serieProps,
    onPress: () => navigation && navigation.push('Serie', { ...serieProps }),
  }));

  const theme = useTheme();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const setDate = (): string => {
    const getDate = new Date(
      `${params.modified.slice(0, 4)}-${params.modified.slice(
        5,
        7
      )}-${params.modified.slice(8, 10)}`
    );
    const localDate =
      params.modified[0] !== '-'
        ? getDate.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            formatMatcher: 'dd-mm-yyyy',
          })
        : 'Wrong Date!';

    return localDate;
  };

  return (
    <ScrollView>
      {/* <Card> */}
      <Card.Cover
        style={[detailStyles.cardCover, { borderColor: imageBorderColor }]}
        source={{
          uri: `${params.thumbnail.path}.${params.thumbnail.extension}`,
        }}
      />
      <Card.Content style={detailStyles.cardTitle}>
        <Title style={{ alignSelf: 'center' }}>
          {params.name.length > 30
            ? params.name.substring(0, 30 - 3) +
              '\n' +
              params.name.substring(27, params.name.length)
            : params.name}
        </Title>
        <Paragraph style={{ alignSelf: 'center', color: contentColor }}>
          {`#${params.id}`}
        </Paragraph>
      </Card.Content>
      {params.description && params.description !== '' ? (
        <Card.Content style={detailStyles.cardContent}>
          <Title>Description</Title>
          <Paragraph>{params.description}</Paragraph>
        </Card.Content>
      ) : null}

      {params.modified && params.modified !== '' && (
        <Card.Content style={detailStyles.cardContent}>
          <Title>Modified</Title>
          <Paragraph>{setDate()}</Paragraph>
        </Card.Content>
      )}

      <View
        style={{
          // flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          margin: 5,
        }}
      >
        <Button
          loading={comicState.isLoading}
          mode='outlined'
          style={{ alignSelf: 'flex-start' }}
          onPress={() => {
            navigation.push('Comics', comicData);
          }}
        >
          COMICS
        </Button>
        <Button
          loading={serieState.isLoading}
          mode='outlined'
          style={{ alignSelf: 'flex-end' }}
          onPress={() => {
            navigation.push('Series', serieData);
          }}
        >
          SERIES
        </Button>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          margin: 5,
        }}
      >
        <Button
          mode='outlined'
          onPress={() => {
            navigation.push('Stories', [...params.stories.items]);
          }}
        >
          STORIES
        </Button>
        <Button
          mode='outlined'
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
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          margin: 5,
        }}
      >
        {params.urls.map((item) => {
          if (item.type === 'detail') {
            return (
              <Button
                key={0}
                mode='outlined'
                onPress={() => {
                  Linking.openURL(item.url);
                }}
              >
                DETAILS
              </Button>
            );
          } else if (item.type === 'wiki') {
            return (
              <Button
                key={1}
                mode='outlined'
                onPress={() => {
                  Linking.openURL(item.url);
                }}
              >
                WIKI
              </Button>
            );
          } else if (item.type === 'comiclink') {
            return (
              <Button
                key={2}
                mode='outlined'
                onPress={() => {
                  Linking.openURL(item.url);
                }}
              >
                COMICLINK
              </Button>
            );
          }
        })}
      </View>
      {/* </Card> */}
      {/* </Card.Actions> */}
    </ScrollView>
  );
};

const ModalStack = createStackNavigator<StackNavigatorParamList>();

type Props = StackScreenProps<StackNavigatorParamList, 'Hero'> & {
  options?: StackNavigationOptions;
}

export const DetailedHero = ({ navigation, options, route }: Props) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]); //

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
      initialRouteName='Hero'
      {...options}
    >
      <ModalStack.Screen
        name='Hero'
        component={detailedScreenBase}
        options={({ route }) => ({
          title: `${route.params.id}`,
          headerTitleAlign: 'center',
        })}
        initialParams={{
          ...route.params,
        }}
      />
      <ModalStack.Screen
        name='Comics'
        component={ComicsScreen}
        options={() => ({
          title: `Comics`,
        })}
      />
      <ModalStack.Screen
        name='Series'
        component={SeriesScreen}
        options={() => ({
          title: `Series`,
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
    marginTop: 10,
    lineHeight: 18,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
