/*export class Song{
    ID: string = '' //Id of the song
    URL: string = '';
    imageURL: string = ''; //Url of the thumbnail for the song

    //Youtube stores their thumbnails at the url below it only requires a video ID between the prefix and suffix 
    prefixImgUrl: string = "http://img.youtube.com/vi/"; 
    suffixImgUrl: string = "/default.jpg"; 
    
    //Pulls the video ID from the URL with regex, saves it to this.URL
    constructor(url: string){   
        var ID;
        //Pull the video ID from the link so we can embed the video
        if(url !== ''){
            var fixedUrl = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(fixedUrl !== undefined){
                ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            }else{
                ID = url;
            }

            this.URL = ID; //Change to equal URL!
            this.ID = ID;
            this.imageURL = this.prefixImgUrl + ID + this.suffixImgUrl;
        }
    }
}*/
import { PlaylistSong } from './playlistsong';
export interface Song{
    /*
    "songId": 1,
        "albumId": 2,
        "artistId": 1,
        "featuredArtistId": null,
        "name": "The Thunder Rolls",
        "url": "https://www.youtube.com/watch?v=tdsJI8Wc2D4",
        "playlistSong": [],
        "songRating": [],
        "album": null,
        "artist": null,
        "featuredArtist": null
        */
    songId: number; //optional
    albumId: number;
    artistId: number;
    featuredArtistId: number;
    name: string;
    url: string;
    playlistSong: PlaylistSong[];
    songRating;
    album: string;
    artist: string;
    featuredArtist: string
}