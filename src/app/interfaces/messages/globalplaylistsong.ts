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