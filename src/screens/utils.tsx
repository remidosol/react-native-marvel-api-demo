import CharacterResult from './../types/characterTypes';
import ComicResult from './../types/comicTypes';
import SeriesResult from './../types/seriesType';
import { Character } from '../components/character';
import { Comic } from '../components/comic';
import { Serie } from '../components/serie';

type CharacterProps = React.ComponentProps<typeof Character>
type ComicProps = React.ComponentProps<typeof Comic>
type SerieProps = React.ComponentProps<typeof Serie>

export enum ActionTypes {
  REQUEST_START = 'REQUEST_START',
  REQUEST_SUCCESS = 'REQUEST_SUCCESS',
  REQUEST_FAIL = 'REQUEST_FAIL',
  INCREASE_OFFSET = 'INCREASE_OFFSET',
  FETCH_AGAIN = 'FETCH_AGAIN',
}

interface CharacterState {
  isLoading: boolean;
  hasError: boolean;
  characters: Omit<CharacterProps, 'onPress'>[];
  offset: number;
}

export const characterReducer = (
  state: CharacterState,
  action: { type: ActionTypes; data?: CharacterResult[] }
): CharacterState => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = { ...state, isLoading: true };
      break;

    case ActionTypes.REQUEST_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        characters: action.data as CharacterResult[],
      };
      break;

    case ActionTypes.REQUEST_FAIL:
      state = { ...state, isLoading: false, hasError: true };
      break;

    case ActionTypes.INCREASE_OFFSET:
      state = {
        ...state,
        isLoading: false,
        offset: state.offset + 50,
      };
      break;

    case ActionTypes.FETCH_AGAIN:
      state = {
        ...state,
        isLoading: false,
        characters: state.characters.concat(action.data as CharacterResult[]),
      };
      break;
  }

  return state;
};

interface ComicState {
  isLoading: boolean;
  hasError: boolean;
  comics: Omit<ComicProps, 'onPress'>[];
  offset: number;
}

export const comicReducer = (
  state: ComicState,
  action: { type: ActionTypes; data?: ComicResult[] }
): ComicState => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = { ...state, isLoading: true };
      break;

    case ActionTypes.REQUEST_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        comics: action.data as ComicResult[],
      };
      break;

    case ActionTypes.REQUEST_FAIL:
      state = { ...state, isLoading: false, hasError: true };
      break;

    case ActionTypes.INCREASE_OFFSET:
      state = {
        ...state,
        isLoading: false,
        offset: state.offset + 50,
      };
      break;

    case ActionTypes.FETCH_AGAIN:
      state = {
        ...state,
        isLoading: false,
        comics: state.comics.concat(action.data as ComicResult[]),
      };
      break;
  }

  return state;
};

interface SerieState {
  isLoading: boolean;
  hasError: boolean;
  series: Omit<SerieProps, 'onPress'>[];
  offset: number;
}

export const serieReducer = (
  state: SerieState,
  action: { type: ActionTypes; data?: SeriesResult[] }
): SerieState => {
  switch (action.type) {
    case ActionTypes.REQUEST_START:
      state = { ...state, isLoading: true };
      break;

    case ActionTypes.REQUEST_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        series: action.data as SeriesResult[],
      };
      break;

    case ActionTypes.REQUEST_FAIL:
      state = { ...state, isLoading: false, hasError: true };
      break;

    case ActionTypes.INCREASE_OFFSET:
      state = {
        ...state,
        isLoading: false,
        offset: state.offset + 50,
      };
      break;

    case ActionTypes.FETCH_AGAIN:
      state = {
        ...state,
        isLoading: false,
        series: state.series.concat(action.data as SeriesResult[]),
      };
      break;
  }

  return state;
};
