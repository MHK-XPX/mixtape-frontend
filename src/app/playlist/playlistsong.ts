import { PlayList } from './playlist';
import { Song } from './song';

export interface PlaylistSong{
    /*
        {
        "playlistSongId": 17,
        "playlistId": 4,
        "songId": 8,
        "playlist": null,
        "song": null
    }
    */
    playlistSongId: number;
    playlistId: number;
    songId: number;
    playlist: PlayList;
    song: Song;
}