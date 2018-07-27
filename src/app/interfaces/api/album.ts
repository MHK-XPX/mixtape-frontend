import { Song } from './song';
import { Artist } from './artist'

export interface Album{
    albumId: number;
    artistId: number;
    artwork: null;
    name: string;
    year: number;
    albumRating;
    song: Song[];
    artist?: Artist;
}