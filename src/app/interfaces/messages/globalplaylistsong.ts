import { Song } from '../api/song';
import { User } from '../api/user';

export interface GlobalPlaylistSong{
    /**
     * The ID of the object
     */
    globalPlaylistSongId: number;
    /**
     * The ID of the song
     */
    songId: number;
    /**
     * The ID of the user (who created the song)
     */
    userId: number;
    /**
     * The number of votes (-3, 3)
     */
    votes: number;
    /**
     * If the song is stuck on the playlist (cannot be voted on anymore)
     */
    isStatic: boolean;
    song: Song;
    user: User;
}