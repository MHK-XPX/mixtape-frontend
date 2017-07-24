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
            return;
        }else{
            this._songMap[pID] = [];
        }

        //Loop through each song and add it to _songMap
        for(let i=0; i<this._user.playlist[index].playlistSong.length; i++){
            pSong = this._user.playlist[index].playlistSong[i];
            this.addToSongMap(pID, pSong.songId);
        }
    }

    /*
        Called when we create a new playlist from the create menu. This method adds the playlist to the api and uses the returned json value
        to call the finalize playlist method, which adds the songs to the new playlists (since we dont know its id we have to call a seperate method after
        the async call)
        @param playlist: Object - the new playlist to add to the api
        @param songs: Song[] - The songs that will be in the playlist
    */
    public addPlaylist(playlist: Object, songs: Song[]): void{
        let s: Subscription;
        let returnedList: PlayList;

        s = this._apiService.postEntity('api/Playlists', playlist).subscribe(
            pl => returnedList = pl,
            err => console.log("Unable to create new playlist"),
            () => {
                this.finalizeAddPlaylist(returnedList, songs);
                s.unsubscribe();
            }
        );
    }

    /*
        This method is called when we delete a playlist from the edit menu. It first deletes all of the playlist songs that are contained 
        within the entity then it calls finalize delete and deletes itself (we can only delete empty parent objects)
        @param playlist: PlayList - the playlist to delete
    */
    public deletePlaylist(playlist: PlayList): void{
        let s: Subscription;
        let pls: PlaylistSong;

        //Delete all of the songs in the playlist
        for(let i=0; i<playlist.playlistSong.length; i++){
            pls = playlist.playlistSong[i];
            s = this._apiService.deleteEntity('api/PlaylistSongs', pls.playlistSongId).subscribe(
                sg => sg = sg,
                error => console.log("Unable to delete playlist: " + playlist.playlistId),
                () => {
                    //Once we delete the last song, we delete the playlist
                    if(i === playlist.playlistSong.length-1){
                        this.finalizeDeletePlaylist(playlist);
                    }
                    s.unsubscribe();
                }
            );
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
        Once we have the new playlist's id we can append playlist songs to it
        @playlist: Playlist - the newly added playlist
        @songs: Song[] - the songs to add to the playlist
    */
    private finalizeAddPlaylist(playlist: PlayList, songs: Song[]){
        let pID: number = playlist.playlistId;
        let s: Subscription;

        //Convert the songs to playlistSongs
        let song: Song;
        for(let i=0; i<songs.length; i++){
            song = songs[i];
            let pls = {
                "playlistId": pID,
                "songId": song.songId,
                "playlist": null,
                "song": null
            };
            
            //Add the new playlistSong to the api with the playlist as its parent
            s = this._apiService.postEntity('api/PlaylistSongs', pls).subscribe(
            ps => ps = ps,
            err => console.log("Unable to add song to new playlist"),
            () => {
                    this._songMap[pID] = songs;
                    this._storage.setValue('_songMap', this._songMap);
                    this.updateUser(); //Update the user so we can see the changes without refreshing
                    s.unsubscribe();
                }
            );
        }
    }

    /*
        This method is called after we delete all of the playlistSongs from the given playlist
        It removes the playlist from the api and from the _songMap
        @param playlist: Playlist - the now empty playlist to be removed from the api
    */
    private finalizeDeletePlaylist(playlist: PlayList){
        let s: Subscription;
        let pID: number = playlist.playlistId;

        s = this._apiService.deleteEntity('api/Playlists', pID).subscribe(
            p => p = p,
            err => console.log("Unable to delete playlist: " + pID),
            () => {
                this._songMap[pID] = [];
                console.log("Playlist: " + pID + " deleted");
                this.updateUser(); //Update the user so we can see the changes without refreshing
                s.unsubscribe();
            }
        );
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

    private updateUser(){
        let s: Subscription;
        s = this._apiService.getSingleEntity('api/Users', this._user.userId).subscribe(
            u => this._user = u,
            err => console.log("Unable to update user info"),
            () => {
                this._storage.setValue('_user', this._user);
                s.unsubscribe();
            }
        );
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