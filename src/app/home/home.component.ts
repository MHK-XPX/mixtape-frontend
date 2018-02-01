/*
    Writtne by: Ryan Kruse
    This component is the main view of the app. It controls the sidebar, loading bar, video viewer and playlist editor
*/
import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';

import { MouseoverMenuComponent } from '../mouseover-menu/mouseover-menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css', '../shared/global-style.css'],
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

    mouseOver: number = -1;

    private _success = new Subject<string>();
    successMessage: string;

    viewedPlaylist: Playlist;
    playlistRename: string = "";

    private newPlaylistName: string = "Playlist ";

    songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');

    constructor(private _apiService: ApiService) { }

    ngOnInit() {
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 2000).subscribe(() => this.successMessage = null);
    }

    triggerMessage(message: string) {
        this.successMessage = message;
        this._success.next(this.successMessage);
    }
}