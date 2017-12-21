import { Album } from './album';
import { Song } from './song';

export interface Artist{
    artistId: number;
    name: string;
    album: Album[];
    songArtist;
    songFeaturedArtist;   
}