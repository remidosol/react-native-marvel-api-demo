
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

interface Series {
    available: number;
    collectionURI: string;
    items: CharacterSerieComicItem[];
    returned: number;
}

interface Comics {
    available: number;
    collectionURI: string;
    items: CharacterSerieComicItem[];
    returned: number;
}

interface Events {
    available: number;
    collectionURI: string;
    items: any[];
    returned: number;
}

interface OriginalIssue {
    resourceURI: string;
    name: string;
}

export default interface StoryResult {
    id: number;
    title: string;
    description: string;
    resourceURI: string;
    type: string;
    modified: Date;
    thumbnail?: any;
    creators: Creators;
    characters: Characters;
    series: Series;
    comics: Comics;
    events: Events;
    originalIssue: OriginalIssue;
}