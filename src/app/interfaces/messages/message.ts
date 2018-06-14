/*
    The messages sent from user to api
    globalPlaylistSongId: number - The ID of the globalplaylist that is is referring to
    username: string - the username of the user who sent the message
    song: Song - The song sent
    votes: number - the number of votes on the song
    isStatic: boolean - if the song can be voted on or not

*/
import { Song } from '../api/song';

export interface Message{
    globalPlaylistSongId: number;
    username: string;
    song: Song;    
    votes: number;
    isStatic: boolean;
}