import { AlbumRating } from './albumrating';
import { Playlist } from './playlist';
import { SongRating } from './songrating';

export interface User{
    userId: number;
    FirstName: string;
    LastName: string;
    Password: string;
    Username: string;
    AlbumRating: AlbumRating[];
    Playlist: Playlist[];
    SongRating: SongRating[];
}