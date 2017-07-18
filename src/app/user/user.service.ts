import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { User } from './user';

import { PlaylistSong } from '../playlist/playlistsong';
import { PlayList } from '../playlist/playlist';
import { Artist } from '../playlist/artist';
import { Song } from '../playlist/song';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import 'rxjs/add/operator/take'

@Injectable()
export class UserService{
    //Had to change to makeshift dict, since Map cannot be converted to json => we cannot store it in SessionStorage
    private _songMap = {};

    private _user: User;
    
    constructor(private _apiService: ApiService, private _storage: StorageService){}

    /*
        Pulls user from session storage (set from login component) and starts loading all of the user's songs, since it is async we want to start early,
        but this might be changed later...depends on the scope
    */
    public logIn(){
        this._user = this._storage.getValue('_user');

        for(let i=0; i<this._user.playlist.length; i++){
            this.getPlayListSongs(i, this._user.playlist[i].playlistId);
        }
    }

    /*
        Called when we click logout from the menu bar. It sets the loggIn value to false and removes the user and _songMap data from session storage
    */
    public logOut(){
        this._storage.setValue('loggedIn', false);
        this._storage.removeValue('_user');
        this._storage.removeValue('_songMap');
        this._songMap = {}; //To be extra safe about the songs clearing
    }

    //For now, lets just load them for all user (IE get api/Playlists)
    public getPlayLists(): PlayList[]{
        this._user = this._storage.getValue('_user');
        return this._user.playlist;
    }

    /*
        This method takes a playlist and its ID and adds all of its songs to the playlist dictonary '_songMap'
        @param index: number - the index of the playlist we want to get the songs for
        @param pID: number - the playlist ID, this will be used as the key in the key value pair dict '_songMap'
    */
    public getPlayListSongs(index: number, pID: number){
        let pSong: PlaylistSong;
        let songs: Song[] = [];

        //If we already have the songs we can just return, this may be removed later, it depnds how I implement edits on playlists
        if(this._songMap[pID] !== null && this._songMap[pID] !== undefined){
            console.log("Already have PID: " + pID);
            return;
        }else{
            console.log("Creating new PID for: " + pID);
        }

        //Loop through each song and add it to _songMap
        for(let i=0; i<this._user.playlist[index].playlistSong.length; i++){
            pSong = this._user.playlist[index].playlistSong[i];
            this._apiService.getSingleEntity('api/Songs', pSong.songId).subscribe(
                s => songs.push(s),
                err => console.log("Unable to load songs"),
                () => {
                    this._songMap[pID] = songs;
                    this._storage.setValue('_songMap', this._songMap); //Add it to storage when complete
                }
            );
        }
    }

    /*
        Pulls the songs for the user's playlist from session storage
        @param index: number - the playlistId of the playlist we want to pull
        @return - A list of Songs[] for the given playlist
    */
    public getSongs(index: number){
        this._songMap = this._storage.getValue('_songMap');
        return this._songMap[index];
    }

    //Pulls the video ID from the URL with regex, saves it to this.URL
    public getThumbnail(url: string){ 
        var prefixImgUrl: string = "http://img.youtube.com/vi/"; 
        var suffixImgUrl: string = "/default.jpg";   
        var ID;
        var imgURL: string = '';
        //Pull the video ID from the link so we can embed the video
        if(url !== ''){
            var fixedUrl = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(fixedUrl !== undefined){
                ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            }else{
                ID = url;
            }
            imgURL = prefixImgUrl + ID + suffixImgUrl;
        }
        return imgURL;
    }

    public getUser(){
        this._user = this._storage.getValue('_user');
        return this._user;
    }

    public getUserName(){
        this._user = this._storage.getValue('_user');
        return this._user.username;
    }
    
    public getUserID(){
        this._user = this._storage.getValue('_user');
        return this._user.userId;
    }
}