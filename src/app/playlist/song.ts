import { PlaylistSong } from './playlistsong';
import { SongRating } from './songrating';
export interface Song{
    /*
    "songId": 1,
        "albumId": 2,
        "artistId": 1,
        "featuredArtistId": null,
        "name": "The Thunder Rolls",
        "url": "https://www.youtube.com/watch?v=tdsJI8Wc2D4",
        "playlistSong": [],
        "songRating": [],
        "album": null,
        "artist": null,
        "featuredArtist": null
        */
    songId: number; //optional
    albumId: number;
    artistId: number;
    featuredArtistId: number;
    name: string;
    url: string;
    playlistSong: PlaylistSong[];
    songRating: SongRating[];
    album: string;
    artist: string;
    featuredArtist: string
}