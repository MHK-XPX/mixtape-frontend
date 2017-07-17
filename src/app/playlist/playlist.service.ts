import { Injectable } from '@angular/core';

import { PlaylistSong } from './playlistsong';
import { PlayList } from './playlist';
import { Artist } from './artist';
import { Song } from './song';

import { ApiService } from '../shared/api.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PlayListService{
    //Contains all of our created playlists
    private playlistsongs: PlaylistSong[] = [];
    private userPlaylistSongs: PlaylistSong[] = [];

    private playlists: PlayList[] = [];
    private userPlaylists: PlayList[] =[];
    
    private playlist: PlayList;

    private _uID;
    
    constructor(private _apiService: ApiService){
        //this.loadAllPlaylists();
        //this._uID = this._userService.getUserID();
    }

    public loadUserPlaylists(userID: number): any{
        let globalPlaylists: PlayList[];
        let userPlaylists: PlayList[] = [];

        /*this._apiService.getAllEntities('api/Playlists').subscribe(
            playlist => globalPlaylists = playlist,
            error => console.log("Unable to load user playlists"),
            () => {
                let puid: number;
                let p: PlayList;
                for(let i=0; i<globalPlaylists.length; i++){
                    p = globalPlaylists[i];
                    puid = p.userId;
                    if(puid === userID){
                        userPlaylists.push(p);
                    }
                }
                return userPlaylists;
            }
        );*/
    }

    private loadAllPlaylists(userID: number){ 
        let playlists: PlayList[];
        /*this._apiService.getAllEntities('api/Playlists').subscribe(
                        playlist => playlists = playlist,
                        error => console.log("Unable to load playlists to edit"),
                        () => {
                            for(let i=0; i<playlists.length; i++){
                                this.filterPlaylists(playlists[i]);
                            }
                            this.loadAllPlaylistSongs();
                        });*/
        /*let playlists: PlayList[];
        this._apiService.getAllEntities('api/Playlists').subscribe(
                        playlist => playlists = playlist,
                        error => console.log("Unable to load playlists to edit"),
                        () => {
                            for(let i=0; i<playlists.length; i++){
                                this.filterPlaylists(playlists[i]);
                            }
                            this.loadAllPlaylistSongs();
                        });*/
    }

    private loadAllPlaylistSongs(){
        let playlistsongs: PlaylistSong[];
       /* this._apiService.getAllEntities('api/PlaylistSongs').subscribe(
                        playlistsong => playlistsongs = playlistsong,
                        error => console.log("Unable to load playlists to edit"),
                        () => {
                            for(let i=0; i<playlistsongs.length; i++){
                                this.filterPlaylistSongs(playlistsongs[i]);
                            }
                        });*/
    }

    public loadUserSpecificPlaylists(){
        return this.userPlaylists;
    }

    private filterPlaylists(playlist: PlayList){
        /*if(playlist.userId === this._userService.getUserID()){
            this.userPlaylists.push(playlist);
        }else{
            this.playlists.push(playlist);
        }*/
    }

    private filterPlaylistSongs(playlistsong: PlaylistSong){
        let plsID = playlistsong.playlistId;
        let pid;
        let puid;

        for(let i=0; i<this.playlists.length; i++){
            let p: PlayList = this.playlists[i];
            pid = p.playlistId;
            puid = p.userId;

            //If the user id and playlist id match our current playlist and the user's id then we own this playlist song
            if(plsID === pid && this._uID === puid){
                this.userPlaylistSongs.push(playlistsong);
                //console.log(playlistsong.playlistId, p.userId);
            }else{
                this.playlistsongs.push(playlistsong);
                //console.log("PLSID: " + playlistsong.playlistId + " PID: " + puid + " PUID: " + p.userId + " UID: " + this._uID);
            }
        }
        console.log(this.userPlaylistSongs.length);
    }

    public loadSongsFromPlaylist(playlist: PlayList){
        let songs: Song[];

    }

    /*
        Returns all playlists that are not owned by the current user
    */
    loadOtherUserPlaylists(){
        return this.playlists.filter(i1 => !this.userPlaylists.some(i2 => i1.playlistId === i2.playlistId));
    } 
}