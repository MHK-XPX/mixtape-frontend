import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { User } from './user';

import { PlaylistSong } from '../playlist/playlistsong';
import { PlayList } from '../playlist/playlist';
import { Artist } from '../playlist/artist';
import { Song } from '../playlist/song';

//import { PlayListService } from '../playlist/playlist.service';
import { ApiService } from '../shared/api.service';

import 'rxjs/add/operator/take'

@Injectable()
export class UserService{
    private _playlists: PlayList[] = [];
    private _playlist: PlayList;
    private _playlistSongs: Song[] = [];
    
    private _songMap: Map<number, Song[]> = new Map<number, Song[]>();

    public loggedIn: boolean = false;

    private _user: User;
    private _userID: number;

    private _getter: Subscription;
    
    constructor(private _apiService: ApiService){}

    public getUserName(){
        return this._user.username;
    }

    public logIn(user: User){
        this.loggedIn = true;
        this._user = user;
        this._userID = this._userID;
        console.log("User: " + this._user.username + " signed in");

        for(let i=0; i<this._user.playlist.length; i++){
            this.getPlayListSongs(i, this._user.playlist[i].playlistId);
        }
    }

    public logOut(){
        this.loggedIn = false;
        console.log("User: " + this._user.username + " signed out");
        this._user = null;
        this._songMap.clear();
    }

    public loadPlayListsData(index: number){ //This will be reworked once we can go n layers into the api
        for(let i=0; i<this._user.playlist[index].playlistSong.length; i++){
            console.log(i);
        }
    }

    //Called per playlist
    private parseSongs(index: number){
    
    }

    //For now, lets just load them for all user (IE get api/Playlists)
    public getPlayLists(): PlayList[]{
        return this._user.playlist;
    }

    public getPlayListSongs(index: number, pID: number){
        let pSong: PlaylistSong;
        let songs: Song[] = [];

        if(this._songMap.has(pID)){
            console.log("Already have PID: " + pID);
            return;
        }else{
            console.log("Creating new PID for: " + pID);
        }

        for(let i=0; i<this._user.playlist[index].playlistSong.length; i++){
            pSong = this._user.playlist[index].playlistSong[i];
            this._apiService.getSingleEntity('api/Songs', pSong.songId).subscribe(
                s => songs.push(s),
                err => console.log("Unable to load songs"),
                () => this._songMap.set(pID, songs)
            );

        }
    }

    public getSongs(index: number){
        //return this._playlistSongs;
        return this._songMap.get(index);
    }

    public clearSongs(){
        this._playlistSongs = [];
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
        return this._user;
    }
    public getUserID(){
        return this._user.userId;
    }
}