import React, { useContext, useEffect } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import Response from '../types/index';
import CharacterResult from './../types/characterTypes';
import { Character } from '../components/character';
import { StackNavigatorParamList } from '../types';
import { ActionTypes, characterReducer } from './utils';

type CharacterProps = React.ComponentProps<typeof Character>

const initialState = {
  characters: [],
  isLoading: false,
  hasError: false,
  offset: 0,
};

function renderItem({ item }: { item: CharacterProps }) {
  return <Character {...item} />;
}

function keyExtractor(item: CharacterProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamList, 'HeroList'>;
}

export const HeroList = (props: Props) => {
  const [state, dispatch] = React.useReducer(characterReducer, initialState);

  const getData = (offset: number) => {
    const url =
      'http://gateway.marvel.com/v1/public/characters?ts=1&limit=50&apikey=YOURAPIKEY&hash=YOURHASH&offset=';

    axios
      .get<Response<CharacterResult>>(`${url + offset.toString()}`)
      .then((responseJson) => {
        if (offset === 0) {
          dispatch({
            type: ActionTypes.REQUEST_SUCCESS,
            data: responseJson.data.data.results,
          });
        } else {
          dispatch({
            type: ActionTypes.FETCH_AGAIN,
            data: responseJson.data.data.results,
          });
        }
      })
      .catch((_) => {
        dispatch({ type: ActionTypes.REQUEST_FAIL });
      });
  };

  const handleLoadMore = () => {
    dispatch({ type: ActionTypes.INCREASE_OFFSET });
    getData(state.offset);
  };

  React.useEffect(() => {
    dispatch({ type: ActionTypes.REQUEST_START });
    getData(0);
  }, []); //state.offset

  const data = state.characters.map((characterProps) => ({
    ...characterProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Hero', {
        ...characterProps,
      }),
  }));

  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {state.isLoading ? (
        <ActivityIndicator size={100} color='#0000ff' /> //#00ff00
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.list,
            { backgroundColor: theme.colors.background },
          ]}
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ height: StyleSheet.hairlineWidth }} />
          )}
          onEndReached={handleLoadMore} //handleLoadMore
          numColumns={3}
          columnWrapperStyle={styles.column}
          disableVirtualization={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  column: {
    flexShrink: 1,
  },
});
