import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { UserService } from '../../user/user.service';

import { PlayList } from '../../playlist/playlist';
import { PlaylistSong } from '../../playlist/playlistsong';
import { Artist } from '../../playlist/artist';
import { Album } from '../../playlist/album';
import { Song } from '../../playlist/song';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';

@Component({
    selector: 'create-editplaylist',
    templateUrl: './editplaylist.component.html',
    styleUrls: [ './editplaylist.component.css' ]
})

export class EditPlayListComponent implements OnInit{
    playlist: PlayList;
    playlists: PlayList[] = [];

    playlistSongs: Song[] = [];

    //Global api data fields
    private _songs: Song[] = [];
    private _artists: Artist[] = [];
    private _albums: Album[] = [];

    private tabInView: string = 'songs';
    isEditing: boolean = false;
    playlistToEdit: number = -1;

    inputUrl: string = '';
    index: number;

    constructor(private _userService: UserService){}

    ngOnInit(){
        this.playlists = this._userService.getPlayLists();

        this._userService.getAllEntity('api/Songs').subscribe(
            s => this._songs = s,
            err => console.log("unable to load songs")
        );

        this._userService.getAllEntity('api/Artists').subscribe(
            a => this._artists = a,
            err => console.log("unable to load songs")
        );

        this._userService.getAllEntity('api/Albums').subscribe(
            a => this._albums = a,
            err => console.log("unable to load all albums")
        );
    }

    //Below is pretty dirty, working on a fix using AsyncPipe
    private editClicked(playlist: PlayList, index: number): void{
        this.isEditing = !this.isEditing;
        this.playlistToEdit = playlist.playlistId;
        this.playlist = playlist;
    }

    /*
        This method is called after we click the add button.
        It calls the user service and creates a new playlist song in the api and updates our _songMap
        @param song: Song - The song we want to add to our playlist
    */
    private addSong(song: Song){
        let pls = {
            playlistId: this.playlist.playlistId,
            songId: song.songId,
            playlist: null,
            song: null
        };
        this._userService.addSong(pls);
        //this._userService.postEntity('api/PlaylistSongs', pls);
    }

    /*
        This method is called when we click delete on a song in our playlist
        it calls user service and removes the playlist song from the api and updates _songMap
        @param song: Song - the song we want to delete
    */
    private deleteClicked(song: Song): void{
        this._userService.deleteSong(song, this.playlist.playlistId);
    }

    private backClicked(){
        this.isEditing = false;
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