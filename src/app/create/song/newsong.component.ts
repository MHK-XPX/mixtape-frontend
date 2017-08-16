import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../user/user.service';


import { Artist } from '../../playlist/interfaces/artist';
import { Album } from '../../playlist/interfaces/album';
import { Song } from '../../playlist/interfaces/song';

@Component({
    selector: 'create-song',
    templateUrl: './newsong.component.html',
    styleUrls: ['./newsong.component.css', '../shared/createstyle.css']
})

export class CreateNewSongComponent implements OnInit{
    //Model fields:
    private _selectedArtist: Artist;
    private _songName: string = "It's so easy"; //For testing use: "It's so easy"
    private _songURL: string = 'https://www.youtube.com/watch?v=KNE2Oqut238'; //For testing use: https://www.youtube.com/watch?v=KNE2Oqut238
    private _selectedAlbum: Album;
    
    //If the user selects the other option from the drop down menu (NOT IMPLEMENTED YET)
    //private _otherArtist: string = null;
    //private _otherAlbum: string = null;

    //Database fields:
    private _songs: Song[] = [];
    private _artists: Observable<Artist[]>;
    private _albums: Observable<Album[]>;

    constructor(private _userService: UserService){}

    ngOnInit(){
        this._artists = this._userService.getAllEntities('api/Artists');
        this._albums = this._userService.getAllEntities('api/Albums');
        
        //Load the songs, we do it like this to make sure that we don't have double songs
        let s: Subscription;
        s = this._userService.getAllEntities('api/Songs').subscribe(
            s => this._songs = s,
            err => console.log("Unable to load songs"),
            () => s.unsubscribe()
        );
    }

    /*
        New artist => New Album
        Same artist => Old Album v New Album

        New Album => Old Artist v New Artist
        Old Album => Old Artist

        This method (for now) will always be passed with a matching artist, album pair. Since we reduce the list when either one is selected, 
        the user is forced to pick an album that is from the given artist or vice versa
        Once the user can create their own stuff, it will be a lot more difficult to control the integrity of our data
    */
    private onSubmit(){      
        //If we have an invalid url alert the user and clear the value
        if(!this.checkUrl(this._songURL)){
            window.alert("Invalid URL!");
            this._songURL = '';
            return;
        }

        //If we have a valid url
        let s: Song;
        let name1: string;
        let name2: string = this._songName.replace(/[^a-zA-Z ]/g, "").toLowerCase();

        for(let i=0; i<this._selectedAlbum.song.length; i++){
            s = this._selectedAlbum.song[i];
            name1 = s.name.replace(/[^a-zA-Z ]/g, "").toLowerCase();

            //If we have a duplicate song we can return
            if(name1 === name2){
                alert("Song already exists");
                this._songName = "";
                this._songURL = "";
                return;
            }
        }

        //Valid url and new song => we can add it
        let newSong = {
            songId: this._songs.length + 1, //We can make sure we don't make the values in DB super big with this (not sure if people actually care tho)
            albumId: this._selectedAlbum.albumId,
            artistId: this._selectedArtist.artistId,
            name: this._songName,
            url: this._songURL
        }

        this._userService.addSong(newSong);
    }

    /*
        This method makes sure that our link starts with either:
            (ftp, http, https)://www.youtube.com
            www.youtube.com
            youtube.com
        Since the youtube player component only requires the id of the video, we don't really care what the prefix looks like
    */
    private checkUrl(url: string): boolean{ //So amazing: https://regex101.com/
        //Lets us check if we have a youtube link
        var regexp = /((ftp|http|https):\/\/(www.youtube.com)|www.youtube.com|youtube.com)/;
        //Lets us check if we can parse the video ID from the link (IE if the link is video valid)
        var fixedUrl = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

        //Kinda sloppy but works for now
        if(fixedUrl !== undefined && fixedUrl.length === 3 && fixedUrl[2] !== ""){ //Will always be split into three parts "youtube..." "v..." "ID"
            return regexp.test(url);
        }
        return false;
    }
}