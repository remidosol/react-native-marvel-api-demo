import React, { useContext } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import { Comic } from '../components/comic';
import { StackNavigatorParamList } from '../types';
import axios from 'axios';
import Response from '../types/index';
import ComicResult from './../types/comicTypes';
import { ActionTypes, comicReducer } from './utils';

type ComicProps = React.ComponentProps<typeof Comic>

const initialState = {
  comics: [],
  isLoading: false,
  hasError: false,
  offset: 0,
};

function renderItem({ item }: { item: ComicProps }) {
  return <Comic {...item} />;
}

function keyExtractor(item: ComicProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamList, 'ComicList'>;
}

export const ComicList = (props: Props) => {
  const theme = useTheme();

  const [state, dispatch] = React.useReducer(comicReducer, initialState);

  const getData = (offset: number) => {
    const url =
      'http://gateway.marvel.com/v1/public/comics?ts=1&apikey=YOURAPIKEY&hash=YOURHASH&limit=50&offset=';

    axios
      .get<Response<ComicResult>>(`${url + offset.toString()}`)
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

  const data = state.comics.map((comicProps) => ({
    ...comicProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Comic', {
        ...comicProps,
      }),
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {state.isLoading ? (
        <ActivityIndicator size={100} color='#00ff00' />
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
          onEndReached={handleLoadMore}
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
