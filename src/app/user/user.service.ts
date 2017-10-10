import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { User } from './user';

import { PlaylistSong } from '../playlist/interfaces/playlistsong';
import { PlayList } from '../playlist/interfaces/playlist';
import { Artist } from '../playlist/interfaces/artist';
import { Song } from '../playlist/interfaces/song';

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
    }

    public logOut(): void{
        //Clear values
        this._user = null;
        this._loggedIn = false;

        //Clear local storage
        this._storage.removeValue('_user');

        //Set local storage
        this._storage.setValue('loggedIn', this._loggedIn);
        this._storage.setValue('_playlists', {});
        this._storage.setPlaylist('_playlist', {});
    }

    public addSong(song: Object): void{
        this.performApiAction(
            this._apiService.postEntity('api/Songs', song),
            "Unable to add song to database"
        )
    }

    /*
        This method is called whenever we add a song to a given playlist
        @param playlistSong: Object - The playlist song to add to the api
        @param pID: number - The playlistId of the playlist we want to add a song to
    */
    public addPlaylistSong(playlistSong: Object): void{
        return this.performApiAction(
            this._apiService.postEntity('api/PlaylistSongs', playlistSong),
            "Unable to add song to playlist"
        );
    }

    /*
        This method is called whenver we remove a song from a playlist
        @param song: Song = The song to remove
        @param playlist: PlayList - the playlist to remove the song from
        @param index: number - the index of the song in the playlist
    */
    public removePlaylistSong(song: Song, playlist: PlayList, index: number): void{
        let plsID = playlist.playlistSong[index].playlistSongId;

        this.performApiAction(
            this._apiService.deleteEntity('api/PlaylistSongs', plsID),
            "Unable to remove song from playlist"
        );
    }

    /*
        The method adds a playlist to the DB and returns the newly created entity 
        @param playlist: Object - The playlist to add to the database
        @return playlist: any (really PlayList) - The newly created playlist returned from the backend
    */
    public addPlaylist(playlist: Object): any{
        let playlists: PlayList[] = this._storage.getValue('_playlists');
        let newPlaylist: PlayList;
        let s: Subscription;

        s = this._apiService.postEntity('api/Playlists', playlist).subscribe(
            p => newPlaylist = p,
            err => console.log("Unable to create playlist"),
            () => {
                s.unsubscribe();
                this._storage.setPlaylist('_playlist', newPlaylist);
                playlists.push(newPlaylist);
                this._storage.setValue('_playlists', playlists);
                return newPlaylist
            }
        );
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
            this.performApiAction(this._apiService.deleteEntity('api/Playlists', pID), "Unable to remove playlist after deleting songs");
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

    public updatePlaylist(playlist: PlayList, pID: number): void{
        this.performApiAction(this._apiService.putEntity('api/Playlists', playlist, pID), "Unable to update playlist info");
    }

    /*
        This method is called whenever we perform an action on the api (add, delete, edit, etc something)
        @param action: Observable<any> - The action to perform on the api
        @param errorMessage: string - The message to output if the action is invalid
    */
    private performApiAction(action: Observable<any>, errorMessage: string): any{
        let s: Subscription;
        let d: any;
        s = action.subscribe(
            data => d = data,
            err => console.log(errorMessage),
            () => {
                s.unsubscribe()
                return d;
            }
        );
    }

    /*
        This method returns a single entity of any type from the DB
        @param path: string - The api path
        @param id: number - The ID of the single entity to fetch
        @return Observable<any> - The returned value from the DB (not subscribed)
    */
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
}