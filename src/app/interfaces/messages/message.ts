import { Song } from '../api/song';

export interface Message{
    /**
     * The ID of the globalplaylist that is is referring to
     */
    globalPlaylistSongId: number;
    /**
     * The username of the user who sent the message
     */
    username: string;
    /**
     * The song send
     */
    song: Song;    
    /**
     * The number of votes on the song
     */
    votes: number;
    /**
     * If the song can be voted on or not
     */
    isStatic: boolean;
}