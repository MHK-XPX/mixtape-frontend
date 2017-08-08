import { PlayList } from '../playlist/interfaces/playlist';
import { AlbumRating } from '../playlist/interfaces/albumrating';
import { SongRating } from '../playlist/interfaces/songrating';

export interface User{
     /*
        API USER LAYOUT:
            public int UserId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Password { get; set; }
            public string Username { get; set; }

    */
    userId: number;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
    albumRating: AlbumRating[];
    playlist: PlayList[];
    songRating: SongRating[];
}
/*


    "userId": 1,
    "firstName": "Joseph",
    "lastName": "Shaw",
    "password": "not yet encrypted",
    "username": "jshaw",
    "albumRating": [],
    "playlist": [],
    "songRating": []

*/