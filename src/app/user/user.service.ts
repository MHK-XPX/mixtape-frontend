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

        //If we already have the songs we can just return, this may be removed later, it depnds how I implement edits on playlists
        if(this._songMap[pID] !== null && this._songMap[pID] !== undefined){
            console.log("Already have PID: " + pID);
            return;
        }else{
            console.log("Creating new PID for: " + pID);
            this._songMap[pID] = [];
        }

        //Loop through each song and add it to _songMap
        for(let i=0; i<this._user.playlist[index].playlistSong.length; i++){
            pSong = this._user.playlist[index].playlistSong[i];
            this.addToSongMap(pID, pSong.songId);
        }
    }

    /*
        This method is called when we add a song to a given playlist
        it takes a playlist song and adds it to the api. Once it is added to the api,
        it also adds the json string value to our _songMap in local storage which allows it to be viewed through all of the components
        @param pls: Object - the playlist song to add to the api
    */
    public addSong(pls: Object): void{
        let s: Subscription;
        let plSong: PlaylistSong;
        s = this._apiService.postEntity('api/PlaylistSongs', pls).subscribe(
            sg => plSong = sg,
            err => console.log("Unable to add song to playlist"),
            () => {
                this.addToSongMap(plSong.playlistId, plSong.songId);
                s.unsubscribe();
            }
        );
    }

    /*
        This method is called when we delete a song from our playlist. 
        It takes a song and playlistID as parameters, it removes the playlist song from the api
        and updates our _songMap from local storage so that it can be viewed from all components
        @param song: Song - the song we want to remove from our playlist
        @param pID: number - the playlistId of the playlist that contains the song to remove
    */
    public deleteSong(song: Song, pID: number): void{
        let s: Subscription;
        let plSong: PlaylistSong;

        for(let i=0; i<song.playlistSong.length; i++){
            plSong = song.playlistSong[i];
            //If the playlist songs Id matches the playlistId we have the playlist song to remove
            if(plSong.playlistId === pID){
                break;
            }else{
                plSong = null;
            }
        }

        //Saftey check and removal of the song
        if(plSong !== null){
            s = this._apiService.deleteEntity('api/PlaylistSongs', plSong.playlistSongId).subscribe(
                s => s = s,
                err => console.log("Unable to delete song from playlist"),
                () => {
                    this.removeFromSongMap(pID, song);
                    s.unsubscribe();
                }
            );
        }
    }

    /*
        This method is called after we add a song to our playlist (I.E we finished adding it to the backend)
        it updates our _songMap in local storage so all components that use it can view the change
        @param pID: number - the playlistId of the playlist we changed
        @param songID: number - the id of the song we added to the playlist
    */
    private addToSongMap(pID: number, songID: number): void{
        let s: Subscription;
        let songs: Song[] = this._songMap[pID]; //Holds all the playlist songs for the given playlist

        //Get song information from the api and close the sub.
        s = this._apiService.getSingleEntity('api/Songs', songID).subscribe(
            sg => songs.push(sg),
            err => console.log("Unable to get song from edited playlist"),
            () => {
                this._songMap[pID] = songs;
                this._storage.setValue('_songMap', this._songMap);
                s.unsubscribe();
            } 
        );
    }

    /*
        This method is called after we delete a song from the api,
        it removes the song from _songMap which allows the changed to be viewed in all connected components
        @param pID: number - the playlistId of the playlist we edited
        @param song: Song - The song removed from the playlist
    */
    private removeFromSongMap(pID: number, song: Song): void{
        let songs: Song[];
        let index = -1;
        
        this._songMap = this._storage.getValue('_songMap'); //Make sure we get the newest verison of the _songMap
        songs = this._songMap[pID];

        //Try to get the index of the song to delete and remove it from our _songMap
        index = songs.findIndex(obj => obj.songId === song.songId);
        if(index !== -1){
            songs.splice(index, 1);
            this._songMap[pID] = songs;
            this._storage.setValue('_songMap', this._songMap);
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

    public getAllEntity(path: string): Observable<any[]>{
        return this._apiService.getAllEntities(path);
    }

    public postEntity(path: string, obj: Object){
        let s: Subscription;
        s = this._apiService.postEntity(path, obj).subscribe(
            p => console.log("Posting: " + obj),
            err => console.log(err),
            () => s.unsubscribe()
        );
    }

    public deleteEntity(path: string, id: number){
        let s: Subscription;
        s = this._apiService.deleteEntity(path, id).subscribe(
            d => console.log("Deleting id: " + id),
            err => console.log(err),
            () => s.unsubscribe()
        );
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