import { Song } from '../api/song';

export interface Message{
    globalPlaylistSongId: number;
    username: string;
    song: Song;    
    votes: number;
    isStatic: boolean;
}