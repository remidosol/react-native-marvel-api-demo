import React, { createContext } from 'react';
import axios from 'axios';
import { Comic } from '../components/comic';
import Response from '../types/index';
import ComicResult from './../types/comicTypes';

type ComicProps = React.ComponentProps<typeof Comic>

interface State {
    isLoading: boolean;
    hasError: boolean;
    comics: Omit<ComicProps, 'onPress'>[];
    handleLoadMore: Function;
    offset: number;
}

enum ActionTypes {
    REQUEST_START = 'REQUEST_START',
    REQUEST_SUCCESS = 'REQUEST_SUCCESS',
    REQUEST_FAIL = 'REQUEST_FAIL',
}

const reducer = (state: State, action: { type: ActionTypes; data?: ComicResult[] }): State => {

    switch (action.type) {
        case ActionTypes.REQUEST_START:

            state = { ...state, isLoading: true };
            break;

        case ActionTypes.REQUEST_SUCCESS:

            state = {
                ...state, isLoading: false, comics: action.data as ComicResult[],
                handleLoadMore: (offset: typeof state.offset) => {
                    offset = state.offset + 20;
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
    comics: [],
    isLoading: false,
    hasError: false,
    handleLoadMore: () => { },
    offset: 0,
};

export const ComicsContext = createContext<State>(initialState);


export default ({ children }: any) => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const getData = () => {
        const url = 'http://gateway.marvel.com/v1/public/comics?ts=1&limit=20&apikey=YOURAPIKEY&hash=YOURHASH&offset=';

        axios.get<Response<ComicResult>>(url + state.offset.toString())
            .then((responseJson) => {
                state.comics.concat(responseJson.data.data.results);
                dispatch({ type: ActionTypes.REQUEST_SUCCESS, data: state.comics });
            })
            .catch((_) => {
                dispatch({ type: ActionTypes.REQUEST_FAIL });
            });
    };

    React.useEffect(() => {
        dispatch({ type: ActionTypes.REQUEST_START });
        getData();

    }, [state.offset]);

    return (<ComicsContext.Provider value={state}>
        {children}
    </ComicsContext.Provider>);

};