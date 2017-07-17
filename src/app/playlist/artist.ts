import { Album } from './album';
import { Song } from './song';
export interface Artist{
    /*
    artistId": 3,
        "name": "AC/DC",
        "album": [],
        "songArtist": [],
        "songFeaturedArtist": []
    },*/
    artistId: number;
    name: string;
    album: Album[];
    songArtist;
    songFeaturedArtist;   
}