import { Song } from './song';

export interface Album{
    albumId: number;
    artistId: number;
    artwork: null;
    name: string;
    year: number;
    albumRating;
    song: Song[];
    artist: null;
}