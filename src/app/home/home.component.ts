/*
    Writtne by: Ryan Kruse
    This component is the main view of the app. It controls the sidebar, loading bar, video viewer and playlist editor
*/
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MouseoverMenuComponent } from '../mouseover-menu/mouseover-menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';
import { debounce } from 'rxjs/operator/debounce';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
    animations: [
        trigger(
            'showState', [
                state('show', style({
                    opacity: 1,
                    visibility: 'visible'
                })),
                state('hide', style({
                    opacity: 0,
                    visibility: 'hidden'
                })),
                transition('show => *', animate('200ms')),
                transition('hide => show', animate('400ms')),
            ]
        )
    ]
})

export class HomeComponent implements OnInit {
    @Input() searchString: string;
    
    playlists: Playlist[] = [];

    mouseOver: number = -1;

    private _success = new Subject<string>();
    successMessage: string;

    user: User;

    userPlaylists: Playlist[] = [];

    globalPlaylists: Playlist[] = [];

    selectedPlaylist: Playlist;

    viewedPlaylist: Playlist;
    selectedSong: number = -1;
    playlistRename: string = "";

    creatingPlaylist: boolean = false;
    private newPlaylistName: string = "Playlist ";

    private songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');;

    constructor(private _apiService: ApiService, private _storage: StorageService,
        private _route: ActivatedRoute, private _router: Router, private _modalService: NgbModal) { }

    ngOnInit() {
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 2000).subscribe(() => this.successMessage = null);
    }

    ngOnChanges(){
    }

    triggerMessage(message: string){
        this.successMessage = message;
        this._success.next(this.successMessage);
    }

    /*
        Called when the delete button is clicked. It removes the song from the DB and the local Playlist for dynamic DOM updates
        @param pls: PlaylistSong - The song to delete
        @param index: number - The index of the song in the playlist
    */
    private deleteSong(pls: PlaylistSong, index: number) {
        let s: Subscription;

        s = this._apiService.deleteEntity<PlaylistSong>("PlaylistSongs", pls.playlistSongId).subscribe(
            d => d = d,
            err => console.log("Unable to delete song", err),
            () => {
                s.unsubscribe();
                this.viewedPlaylist.playlistSong.splice(index, 1);
            }
        )
    }

    //TODO: Make the backend (or here) also delete the playlist songs else we won't be able to delete the playlist!
    private deletePlaylist() {
        let s: Subscription;

        s = this._apiService.deleteEntity<Playlist>("Playlists", this.viewedPlaylist.playlistId).subscribe(
            d => d = d,
            err => console.log("Unable to delete playlist", err),
            () => {
                this.userPlaylists = this.userPlaylists.filter(playlist => playlist.playlistId !== this.viewedPlaylist.playlistId);
                this.viewedPlaylist = null;
                s.unsubscribe();
            }
        )
    }

    /*
        This method is called after we close the modal, it changes the name in the backend and in the local user playlist array for dynamic updates
    */
    private renamePlaylist() {
        /*let s: Subscription;

        for (let i = 0; i < this.userPlaylists.length; i++) {
            if (this.userPlaylists[i].playlistId === this.viewedPlaylist.playlistId)
                this.userPlaylists[i].name = this.viewedPlaylist.name;
        }

        s = this._apiService.putEntity<Playlist>("Playlists", this.viewedPlaylist.playlistId, this.viewedPlaylist).subscribe(
            d => d = d,
            err => console.log("Unable to update playlist", err),
            () => {
                s.unsubscribe();
                this.viewPlaylist(this.viewedPlaylist);
            }
        )*/
    }

    openModal(content) {
        this._modalService.open(content).result.then((result) => {
            if (this.playlistRename.length > 0) //On close via the save button we check if we changed anything, if so we update it
                this.viewedPlaylist.name = this.playlistRename;
            this.renamePlaylist();
            this.playlistRename = "";
        }, (reason) => { //On close via clicking away we clear anything the user might have typed
            this.playlistRename = "";
        });
    }
}