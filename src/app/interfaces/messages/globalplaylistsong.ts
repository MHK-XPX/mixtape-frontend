/*
    This interface is used to display songs on the global playlist
    globalPlaylistSongId: number - The ID of the object
    songId: number - The ID of the song 
    userId: number - the ID of the user
    votes: number - The number of votes (-3, 3)
    isStatic: boolean - If the song is stuck on the playlist (cannot be voted on anymore)
*/
import { Song } from '../api/song';
import { User } from '../api/user';

export interface GlobalPlaylistSong{
    globalPlaylistSongId: number;
    songId: number;
    userId: number;
    votes: number;
    isStatic: boolean;
    song: Song;
    user: User;
}