
interface Url {
    type: string;
    url: string;
}

interface Thumbnail {
    path: string;
    extension: string;
}

interface Item {
    resourceURI: string;
    name: string;
    role: string;
}

interface Creators {
    available: number;
    collectionURI: string;
    items: Item[];
    returned: number;
}


interface StoryItem {
    resourceURI: string;
    name: string;
    type: string;
}

interface CharacterSerieComicItem {
    resourceURI: string;
    name: string;
}

interface Characters {
    available: number;
    collectionURI: string;
    items: CharacterSerieComicItem[];
    returned: number;
}

interface Stories {
    available: number;
    collectionURI: string;
    items: StoryItem[];
    returned: number;
}

interface Comics {
    available: number;
    collectionURI: string;
    items: CharacterSerieComicItem[];
    returned: number;
}

interface Series {
    available: number;
    collectionURI: string;
    items: CharacterSerieComicItem[];
    returned: number;
}

interface Next {
    resourceURI: string;
    name: string;
}

interface Previous {
    resourceURI: string;
    name: string;
}

export default interface EventResult {
    id: number;
    title: string;
    description: string;
    resourceURI: string;
    urls: Url[];
    modified: Date;
    start: string;
    end: string;
    thumbnail: Thumbnail;
    creators: Creators;
    characters: Characters;
    stories: Stories;
    comics: Comics;
    series: Series;
    next: Next;
    previous: Previous;
}