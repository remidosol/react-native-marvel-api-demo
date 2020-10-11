import CharacterResult, {
  StoryItem,
  ComicsSeriesEventsItem,
} from './types/characterTypes';
import SeriesResult from './types/seriesType';
import ComicResult, { CreatorItem } from './types/comicTypes';
import SerieResult from './types/seriesType';
import { CharacterProps } from './components/character';
import { ComicProps } from './components/comic';
import { SerieProps } from './components/serie';

export type StackNavigatorParamList = {
  HeroList: CharacterResult[];
  ComicList: ComicResult[];
  SerieList: SeriesResult[];
  Hero: CharacterResult;
  Comic: ComicResult;
  Serie: SerieResult;
  Character: CharacterProps;
  Characters: CharacterProps[];
  Comics: ComicProps[];
  Series: SerieProps[];
  Stories: StoryItem[];
  Events: ComicsSeriesEventsItem[];
  Creators: CreatorItem[];
}
