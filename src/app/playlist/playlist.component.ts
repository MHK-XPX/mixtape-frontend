/*
    This components controls the editing of a playlist. It allows the user to tab throw backend entity details (the bottom 'grey' box on the screen)
    In this component the user can: Add a song or delete a song
    This component controls: The songs, and getting the entities from the backend 
*/
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { UserService } from '../user/user.service';
import { StorageService } from '../shared/session-storage.service';

import { PlayList } from '../playlist/interfaces/playlist';
import { PlaylistSong } from '../playlist/interfaces/playlistsong';
import { Artist } from '../playlist/interfaces/artist';
import { Album } from '../playlist/interfaces/album';
import { Song } from '../playlist/interfaces/song';
import 'rxjs/Rx';

@Component({
    selector: 'playlist',
    templateUrl: './playlist.component.html',
    styleUrls: [ './playlist.component.css', '../shared/globalstyle.css']
})

export class PlaylistComponent implements OnInit, OnDestroy {
    private _sub: Subscription;

    private _playlist: PlayList;

    //Global api data fields
    private _songs: Observable<Song[]>;
    private _artists: Observable<Artist[]>;
    private _albums: Observable<Album[]>;
    private _otherPlaylists: Observable<PlayList[]>;

    constructor(private _userService: UserService, private _storage: StorageService) { }

    ngOnInit() {
        this._songs = this._userService.getAllEntities('api/Songs');
        this._artists = this._userService.getAllEntities('api/Artists');
        this._albums = this._userService.getAllEntities('api/Albums');
        this._otherPlaylists = this._userService.getAllEntities('api/Playlists');

        this._sub = this._storage.playlistObservable.subscribe(newestPlaylist => {
            this._playlist = newestPlaylist;
        });
    }

    /*
        This method is called after we click the add button.
        It calls the user service and creates a new playlist song in the api and updates our _songMap
        @param song: Song - The song we want to add to our playlist
    */
    private addSong(song: Song) {
        let updatedPlaylist: PlayList;
        let s: Subscription;
        
        let pls = {
            playlistId: this._playlist.playlistId,
            songId: song.songId,
            playlist: null,
            song: null
        };

        this._userService.addPlaylistSong(pls);

        s = this._userService.getSingleEntity('api/Playlists', this._playlist.playlistId).subscribe(
            p => updatedPlaylist = p,
            err => console.log("Unable to add song"),
            () => {
                this._storage.setPlaylist('_playlist', updatedPlaylist);
                s.unsubscribe();
            }
        );
    }

    private getUrlImage(url: string): string {
        let _img = '';
        _img = this._userService.getThumbnail(url);
        return _img;
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }
}