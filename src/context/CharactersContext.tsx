import React, { createContext, Prop } from 'react';
import axios from 'axios';
import { Character } from '../components/character';
import { StackNavigatorParamList } from '../types';
import Response from '../types/index';
import CharacterResult from './../types/characterTypes';

type CharacterProps = React.ComponentProps<typeof Character>

interface State {
  isLoading: boolean;
  hasError: boolean;
  characters: Omit<CharacterProps, 'onPress'>[];
  handleLoadMore: Function;
  offset: number;
}

enum ActionTypes {
  REQUEST_START = 'REQUEST_START',
  REQUEST_SUCCESS = 'REQUEST_SUCCESS',
  REQUEST_FAIL = 'REQUEST_FAIL',
}

const reducer = (
  state: State,
  action: { type: ActionTypes; data?: CharacterResult[] }
): State => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = { ...state, isLoading: true };
      break;

    case ActionTypes.REQUEST_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        characters: action.data as CharacterResult[],
        handleLoadMore: (offset: typeof state.offset) => {
          state.offset =  offset + 20;
        },
      };
      break;

    case ActionTypes.REQUEST_FAIL:
      state = { ...state, isLoading: false, hasError: true };
      break;
  }

  return state;
};

const initialState = {
  characters: [],
  isLoading: false,
  hasError: false,
  handleLoadMore: () => {},
  offset: 0,
};

export const CharactersContext = createContext<State>(initialState);

export default ({ children }: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getData = () => {
    const url =
      'http://gateway.marvel.com/v1/public/characters?ts=1&limit=20&apikey=YOURAPIKEY&hash=YOURHASH&offset=';

    axios
      .get<Response<CharacterResult>>(`${url + state.offset.toString()}`)
      .then((responseJson) => {
        dispatch({
          type: ActionTypes.REQUEST_SUCCESS,
          data: state.characters.concat(responseJson.data.data.results),
        });
      })
      .catch((_) => {
        dispatch({ type: ActionTypes.REQUEST_FAIL });
      });
  };

  React.useEffect(() => {
    dispatch({ type: ActionTypes.REQUEST_START });
    getData();
  }, []); //state.offset

  return (
    <CharactersContext.Provider value={state}>
      {children}
    </CharactersContext.Provider>
  );
};
