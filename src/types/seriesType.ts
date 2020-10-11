export interface Url {
  type: string;
  url: string;
}

export interface Thumbnail {
  path: string;
  extension: string;
}

export interface CreatorItem {
  resourceURI: string;
  name: string;
  role: string;
}

export interface Creators {
  available: number;
  collectionURI: string;
  items: CreatorItem[];
  returned: number;
}

export interface CharacterItem {
  resourceURI: string;
  name: string;
}

export interface Characters {
  available: number;
  collectionURI: string;
  items: CharacterItem[];
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

export interface ComicItem {
  resourceURI: string;
  name: string;
}

export interface Comics {
  available: number;
  collectionURI: string;
  items: ComicItem[];
  returned: number;
}

export interface Events {
  available: number;
  collectionURI: string;
  items: any[];
  returned: number;
}

export interface Next {
  resourceURI: string;
  name: string;
}

export interface Previous {
  resourceURI: string;
  name: string;
}

export default interface SerieResult {
  id: number;
  title: string;
  description?: string;
  resourceURI: string;
  urls: Url[];
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: Thumbnail;
  creators: Creators;
  characters: Characters;
  stories: Stories;
  comics: Comics;
  events: Events;
  next?: Next;
  previous?: Previous;
}
