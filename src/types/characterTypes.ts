export interface Thumbnail {
  path: string;
  extension: string;
}

export interface ComicsSeriesEventsItem {
  resourceURI: string;
  name: string;
}

export interface Comics {
  available: number;
  collectionURI: string;
  items: ComicsSeriesEventsItem[];
  returned: number;
}

export interface Series {
  available: number;
  collectionURI: string;
  items: ComicsSeriesEventsItem[];
  returned: number;
}

export interface StoryItem {
  resourceURI: string;
  name: string;
  type: string;
}

export interface Stories {
  available: number;
  collectionURI: string;
  items: StoryItem[];
  returned: number;
}

export interface Events {
  available: number;
  collectionURI: string;
  items: ComicsSeriesEventsItem[];
  returned: number;
}

export interface Url {
  type: string;
  url: string;
}

export default interface CharacterResult {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: Comics;
  series: Series;
  stories: Stories;
  events: Events;
  urls: Url[];
}
