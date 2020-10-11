import React from 'react';
import { RouteProp } from '@react-navigation/native';

import { DetailedHero } from '../components/heroDetails';
import { DetailedComic } from '../components/comicDetails';
import { DetailedSerie } from '../components/serieDetails';
import { StackNavigatorParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import CharacterResult from '../types/characterTypes';

type DetailedHeroProps = StackScreenProps<StackNavigatorParamList, 'Hero'>

type DetailedComicProps = StackScreenProps<StackNavigatorParamList, 'Comic'>

type DetailedSerieProps = StackScreenProps<StackNavigatorParamList, 'Serie'>

export const HeroDetails = ({ route }: DetailedHeroProps) => (
  <DetailedHero {...route.params} />
);

export const ComicDetails = (props: DetailedComicProps) => {
  return <DetailedComic {...props.route.params} />;
};

export const SerieDetails = (props: DetailedSerieProps) => {
  return <DetailedSerie {...props.route.params} />;
};
