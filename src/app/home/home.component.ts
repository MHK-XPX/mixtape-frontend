/*
    Writtne by: Ryan Kruse
    This component is the main view of the app. It controls the sidebar, loading bar, video viewer and playlist editor
*/
import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',
    animations: [
        trigger(
            'slideState', [
                state('full', style({
                    width: '20%'
                })),
                state('shrink', style({
                    width: '0',
                    visibility: 'hidden'
                })),
                transition('full => *', animate('300ms')),
                transition('shrink => full', animate('300ms')),
            ]
        )
    ]
})

export class HomeComponent implements OnInit {
    user: User;

    userPlaylists: Playlist[] = [];

    globalPlaylists: Playlist[] = [];

    selectedPlaylist: Playlist;

    viewedPlaylist: Playlist;
    selectedSong: number = -1;
    playlistRename: string = "";

    creatingPlaylist: boolean = false;
    private newPlaylistName: string = "Playlist ";

    constructor(private _apiService: ApiService, private _storage: StorageService,
        private _route: ActivatedRoute, private _router: Router, private _modalService: NgbModal) { }

    ngOnInit() {
        this._route.data.subscribe((data: { user: User }) => {
            this.user = data.user;
        });

        let uPL: Observable<Playlist[]> = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId);
        let gPL: Observable<Playlist[]> = this._apiService.getAllEntities<Playlist>('Playlists');

        Observable.forkJoin([uPL, gPL]).subscribe(results => {
            //results[0] --> User playlsits
            //results[1] --> Global playlists

            for (let i = 0; i < results[0].length; i++) {
                this.userPlaylists.push(results[0][i]);
            }

            this.globalPlaylists = results[1].filter(x => x.userId !== this.user.userId); //filter out our playlists b/c we don't need to see doubles
        });
    }

    /*
        Called when we click on a playlist to view it (or edit it)
        @param p: Playlist - The playlist to view
        @POST: Sets this.creatingPlaylist to input p
    */
    private viewPlaylist(p: Playlist) {
        this.creatingPlaylist = false;

        let s: Subscription = this._apiService.getSingleEntity<Playlist>("Playlists", p.playlistId).subscribe(
            data => this.viewedPlaylist = data,
            err => console.log("Unable to load playlist", err),
            () => s.unsubscribe()
        );
    }

    /*
        Called when we add a song from the search component, it adds the song to the playlist in the DB
        @event - The song to add given from the search component
    */
    private addSong(event) {
        let s: Subscription;
        let song: Song = event;

        let sentPLS = {
            playlistId: this.viewedPlaylist.playlistId,
            songId: song.songId
        }

        let returnedPLS: PlaylistSong;
        s = this._apiService.postEntity<PlaylistSong>("PlaylistSongs", sentPLS).subscribe(
            d => returnedPLS = d,
            err => console.log("Unable to add song", err),
            () => {
                s.unsubscribe();
                this.viewPlaylist(this.viewedPlaylist);
            }
        )
    }

    /*
        Called when we click a list item, this method allows us to control the animations (same as the one in search component)
        @param s: Song - The clicked song
    */
    private selectSong(s: Song) {
        if (this.selectedSong === s.songId) {
            this.selectedSong = -1;
            return;
        }
        this.selectedSong = s.songId;
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
        let s: Subscription;

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
        )
    }

    /*
       event[0] --> The playlist to edit
       event[1] --> The playlist to play
       event[2] --> The newly created playlist
   */
    getSelectedPlaylists(event: Playlist[]) {
        if (event[0] !== null) {
            this.viewPlaylist(event[0]);
            this.creatingPlaylist = false;
        }

        if (event[1] !== null)
            this.selectedPlaylist = event[1];

        if (event[2] !== null) {
            this.creatingPlaylist = true;
            this.userPlaylists.push(event[2]);
        }
    }

    isUserPlaylist(): boolean {
        return (this.userPlaylists.some(x => x.playlistId == this.viewedPlaylist.playlistId));
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