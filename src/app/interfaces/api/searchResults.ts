import { Artist } from "./artist";
import { Album } from "./album";
import { Song } from "./song";

export interface SearchResults{
    artists: Artist[];
    albums: Album[];
    songs: Song[];
}