import { Song } from './song';

export interface Album{
    /*
    "albumId": 1,
        "artistId": 1,
        "artwork": null,
        "name": "Garth Brooks",
        "year": 1989,
        "albumRating": [],
        "song": [],
        "artist": null
    */
    albumId: number;
    artistId: number;
    artwork: null;
    name: string;
    year: number;
    albumRating;
    song: Song[];
    artist: null;
}