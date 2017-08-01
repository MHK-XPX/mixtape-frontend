import { Component, OnInit, NgZone } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../user/user.service';
import { StorageService } from '../../shared/session-storage.service';

import { PlayList } from '../../playlist/playlist';
import { PlaylistSong } from '../../playlist/playlistsong';
import { Artist } from '../../playlist/artist';
import { Album } from '../../playlist/album';
import { Song } from '../../playlist/song';

import 'rxjs/Rx';

@Component({
    selector: 'create-editplaylist',
    templateUrl: './editplaylist.component.html',
    styleUrls: [ './editplaylist.component.css' ]
})

export class EditPlayListComponent implements OnInit{
    playlist: PlayList;

    private _userPlaylist: Observable<PlayList[]>;
    private _userSongs: Song[] = [];

    //Global api data fields
    private _songs: Observable<Song[]>;
    private _artists: Observable<Artist[]>;
    private _albums: Observable<Album[]>;
    private _otherPlaylists: Observable<PlayList[]>;

    private tabInView: string = 'songs';
    isEditing: boolean = false;

    inputUrl: string = '';
    index: number;

    constructor(private _userService: UserService, private _storage: StorageService){}

    ngOnInit(){
        this._songs = this._userService.getAllEntities('api/Songs');
        this._artists = this._userService.getAllEntities('api/Artists');
        this._albums = this._userService.getAllEntities('api/Albums');
        this._otherPlaylists = this._userService.getAllEntities('api/Playlists');
    }

    //Below is pretty dirty, working on a fix using AsyncPipe
    private editClicked(playlist: PlayList): void{
        this.isEditing = !this.isEditing;
        //this.playlist = playlist;

        let pls: PlaylistSong;
        this._userService.getSingleEntity('api/Playlists', playlist.playlistId).subscribe(
            p => this.playlist = p,
            err => console.log(("Unable to load playlist")),
            () => {
                for(let i=0; i<this.playlist.playlistSong.length; i++){
                    pls = this.playlist.playlistSong[i];
                    this._userSongs.push(pls.song);
                }
            }
        );
    }

    private deletePlaylist(playlist: PlayList): void{
        this._userService.removePlaylist(playlist, playlist.playlistId, 0);   
    }
    
    /*
        This method is called after we click the add button.
        It calls the user service and creates a new playlist song in the api and updates our _songMap
        @param song: Song - The song we want to add to our playlist
    */
    private addSong(song: Song){
        this._userSongs.push(song);
        let pls = {
            playlistId: this.playlist.playlistId,
            songId: song.songId,
            playlist: null,
            song: null
        };

        this._userService.addSong(pls);
    }

    /*
        This method is called when we click delete on a song in our playlist
        it calls user service and removes the playlist song from the api and updates _songMap
        @param song: Song - the song we want to delete
    */
    private deleteClicked(song: Song, index: number): void{
        this._userSongs.splice(index, 1);
        this._userService.removeSong(song, this.playlist, index);
    }

    private backClicked(){
        this.isEditing = false;
        this._userSongs = [];
    }

     /*
        Called when we click on a tab, controls what we see in the view
    */
    private openTab(tabName: string){
        this.tabInView = tabName;
    }

    private getUrlImage(url: string): string{
        let _img = '';
        _img = this._userService.getThumbnail(url);
        return _img;
    }
}