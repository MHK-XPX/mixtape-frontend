import { AlbumRating } from './albumrating';
import { Playlist } from './playlist';
import { SongRating } from './songrating';

export interface User{
    userId: number;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
    albumRating: AlbumRating[];
    playlist: Playlist[];
    songRating: SongRating[];
}