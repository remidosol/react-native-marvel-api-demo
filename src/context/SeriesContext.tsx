import React, { createContext } from 'react';
import axios from 'axios';
import { Serie } from '../components/serie';
import Response from '../types/index';
import SerieResult from './../types/seriesType';

type SerieProps = React.ComponentProps<typeof Serie>

interface State {
    isLoading: boolean;
    hasError: boolean;
    series: Omit<SerieProps, 'onPress'>[];
    handleLoadMore: Function;
    offset: number;
}

enum ActionTypes {
    REQUEST_START = 'REQUEST_START',
    REQUEST_SUCCESS = 'REQUEST_SUCCESS',
    REQUEST_FAIL = 'REQUEST_FAIL',
}

const reducer = (state: State, action: { type: ActionTypes; data?: SerieResult[] }): State => {

    switch (action.type) {
        case ActionTypes.REQUEST_START:

            state = { ...state, isLoading: true };
            break;

        case ActionTypes.REQUEST_SUCCESS:

            state = {
                ...state, isLoading: false, series: action.data as SerieResult[],
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
    series: [],
    isLoading: false,
    hasError: false,
    handleLoadMore: () => { },
    offset: 0,
};

export const SeriesContext = createContext<State>(initialState);


export default ({ children }: any) => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const getData = () => {
        const url = 'http://gateway.marvel.com/v1/public/series?ts=1&limit=20&apikey=YOURAPIKEY&hash=YOURHASH&offset=';

        axios.get<Response<SerieResult>>(url + state.offset.toString())
            .then((responseJson) => {
                state.series.concat(responseJson.data.data.results);
                dispatch({ type: ActionTypes.REQUEST_SUCCESS, data: state.series });
            })
            .catch((_) => {
                dispatch({ type: ActionTypes.REQUEST_FAIL });
            });
    };

    React.useEffect(() => {
        dispatch({ type: ActionTypes.REQUEST_START });
        getData();

    }, [state.offset]);

    return (<SeriesContext.Provider value={state}>
        {children}
    </SeriesContext.Provider>);

};