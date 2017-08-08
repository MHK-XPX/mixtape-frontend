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

import 'rxjs/Rx';

@Injectable()
export class UserService {
    //Data fields:
    private _user: User;

    //control fields:
    private _loggedIn: boolean = false;

    constructor(private _apiService: ApiService, private _storage: StorageService){}

    public logIn(): void{
        this._user = this._storage.getValue('_user');
        this._loggedIn = this._storage.getValue('loggedIn');

        this._storage.setValue('_playlists', this._user.playlist);
        this._storage.setValue('_songMap', {});
    }

    public logOut(): void{
        //Clear values
        this._user = null;
        this._loggedIn = false;

        //Clear local storage
        this._storage.removeValue('_user');

        //Set local storage
        this._storage.setValue('loggedIn', this._loggedIn);
    }

    /*
        This method is called whenever we add a song to a given playlist
        @param playlistSong: Object - The playlist song to add to the api
        @param pID: number - The playlistId of the playlist we want to add a song to
    */
    public addSong(playlistSong: Object): void{
        this.performApiAction(
            this._apiService.postEntity('api/PlaylistSongs', playlistSong),
            "Unable to add song"
        );
    }

    /*
        This method is called whenver we remove a song from a playlist
        @param song: Song = The song to remove
        @param playlist: PlayList - the playlist to remove the song from
        @param index: number - the index of the song in the playlist
    */
    public removeSong(song: Song, playlist: PlayList, index: number): void{
        let plsID = playlist.playlistSong[index].playlistSongId;

        this.performApiAction(
            this._apiService.deleteEntity('api/PlaylistSongs', plsID),
            "Unable to remove song"
        );
    }

    /*
        This method is called whenever we perform an action on the api (add, delete, edit, etc something)
        @param action: Observable<any> - The action to perform on the api
        @param errorMessage: string - The message to output if the action is invalid
    */
    private performApiAction(action: Observable<any>, errorMessage: string): void{
        let s: Subscription;
        s = action.subscribe(
            data => data = data,
            err => console.log(errorMessage),
            () => s.unsubscribe()
        );
    }

    /*
        This method is called when we create a playlist. It adds the playlist to the api then recursively
        adds each of the songs to the newly created playlist
        @param playlistToCreate: Object - The layout of the playlist to send to the api (since it's missing fields it is an object not a playlist)
        @param songs: Song[] - A list of songs to add to the new playlist
        @param index: number - Index to keep track of which song we are adding and when to break
        @param createdPlaylist: PlayList - The playlist returned from the api that we aim our songs at
    */
    public addPlaylist(playlistToCreate: Object, songs: Song[], index=0, createdPlaylist: PlayList): void{
        //Once we have saved the new playlist to the api we update the user and return
        if(index >= songs.length){
            //this.performApiEdit(null, "Failed to update user");
            this.updateUserInfo();
            return;
        }

        let s: Subscription;
        let p: PlayList;
        let song: Song;

        //Create the playlist first
        if(createdPlaylist === null){
            s = this._apiService.postEntity('api/Playlists', playlistToCreate).subscribe(
                pl => p = pl,
                err => console.log("Unable to create playlist"),
                () => {
                    this.addPlaylist(null, songs, 0, p);
                    s.unsubscribe();
                }
            );
        }else{ //Then add the songs to it when the subscription is complete
            song = songs[index];
            let pls = {
                "playlistId": createdPlaylist.playlistId,
                "songId": song.songId,
                "playlist": null,
                "song": null
            };

            s = this._apiService.postEntity('api/PlaylistSongs', pls).subscribe(
                data => data = data,
                err => console.log("Unable to load songs into new playlist"),
                () => {
                    this.addPlaylist(null, songs, index + 1, createdPlaylist);
                    s.unsubscribe();
                }
            );
        }
    }

    /*
        This method is called when we delete a playlist. It removes the songs recursivley then removes the playlist from the api
        @param playlist: PlayList - the playlist to remove from the api
        @param pID: number - the playlistId of the playlist to remove
        @param index: number - Index to keep track of which song we are removing and when to break
    */
    public removePlaylist(playlist: PlayList, pID: number, index = 0): void{
        //Once all of the songs are removed, we can remove the playlist
        if(index >= playlist.playlistSong.length){
            //this.performApiEdit(this._apiService.deleteEntity('api/Playlists', pID), "Unable to remove playlist after deleting songs");
            this.performApiAction(this._apiService.deleteEntity('api/Playlists', pID), "Unable to remove playlist after deleting songs");
            this.updateUserInfo();
            return;
        }

        let s: Subscription;
        let plsID: number = playlist.playlistSong[index].playlistSongId;
        
        s = this._apiService.deleteEntity('api/PlaylistSongs', plsID).subscribe(
            a => a = a,
            err => console.log("Unable to delete playlist: " + playlist.name),
            () => {
                this.removePlaylist(playlist, pID, index + 1);
                s.unsubscribe();
            }
        );
    }

    public getSingleEntity(path: string, id: number): Observable<any>{
        return this._apiService.getSingleEntity(path, id);
    }

    /*
        Returns Observable from api for a given path (mainly used in the tab features to display all songs, albums, artists, etc)
    */
    public getAllEntities(path: string): Observable<any[]>{
        return this._apiService.getAllEntities(path);
    }

    //Pulls the video ID from the URL with regex, saves it to this.URL
    public getThumbnail(url: string): string{ 
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

    public getUserID(): number{
        this._user = this._storage.getValue('_user');
        return this._user.userId;
    }

    /*
        This method is called whenever we make a large change to the user. For now, it is only called when we delete
        an entire playlist or add a new playlist. It updates the stored value of the user and their respective playlists in local storage
    */
    private updateUserInfo(){
        let s: Subscription;

        s = this._apiService.getSingleEntity('api/Users', this._user.userId).subscribe(
            user => this._user = user,
            err => console.log("Unable to update user information"),
            () => {
                this._storage.setValue('_user', this._user);
                this._storage.setValue('_playlists', this._user.playlist);
                s.unsubscribe();
            }
        );

    }
}