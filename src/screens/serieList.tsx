import React, { useContext } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, ActivityIndicator, Colors } from 'react-native-paper';
import axios from 'axios';
import { Serie } from '../components/serie';
import Response from '../types/index';
import SerieResult from './../types/seriesType';
import { StackNavigatorParamList } from '../types';
import { ActionTypes, serieReducer } from './utils';

type SerieProps = React.ComponentProps<typeof Serie>

const initialState = {
  series: [],
  isLoading: false,
  hasError: false,
  offset: 0,
};

function renderItem({ item }: { item: SerieProps }) {
  return <Serie {...item} />;
}

function keyExtractor(item: SerieProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamList, 'SerieList'>;
}

export const SerieList = (props: Props) => {
  const theme = useTheme();

  const [state, dispatch] = React.useReducer(serieReducer, initialState);

  const getData = (offset: number) => {
    const url =
      'http://gateway.marvel.com/v1/public/series?ts=1&limit=50&apikey=YOURAPIKEY&hash=YOURHASH&offset=';

    axios
      .get<Response<SerieResult>>(`${url + offset.toString()}`)
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

  const data = state.series.map((serieProps) => ({
    ...serieProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Serie', {
        ...serieProps,
      }),
  })); //state.offset

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {state.isLoading ? (
        <ActivityIndicator animating={true} color={Colors.red800} size={100} />
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
    marginTop: 10,
  },
  list: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  column: {
    flexShrink: 1,
  },
});
