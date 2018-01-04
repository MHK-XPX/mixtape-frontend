/*
    Writtne by: Ryan Kruse
    This component is the main view of the app. It controls the sidebar, loading bar, video viewer and playlist editor
*/
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router} from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit{
    private user: User;

    private userPlaylists: Playlist[] = [];

    private globalPlaylists: Playlist[] = [];

    private selectedPlaylist: Playlist;
    private viewedPlaylist: Playlist;

    private creatingPlaylist: boolean = false;
    private newPlaylistName: string = "Playlist ";

    constructor(private _apiService: ApiService, private _storage: StorageService, private _route: ActivatedRoute, private _router: Router){}

    ngOnInit(){
        this._route.data.subscribe((data: { user: User }) => {
            this.user = data.user;
        });

        let uPL: Observable<Playlist[]> = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId);
        let gPL: Observable<Playlist[]> = this._apiService.getAllEntities<Playlist>('Playlists');

        Observable.forkJoin([uPL, gPL]).subscribe(results => {
            //results[0] --> User playlsits
            //results[1] --> Global playlists

            for(let i=0; i<results[0].length; i++){
                this.userPlaylists.push(results[0][i]);
            }
            
            this.globalPlaylists = results[1].filter(x => x.userId !== this.user.userId); //filter out our playlists b/c we don't need to see doubles
        });
    }

    /*
        Called when we click on a playlist to view it (or edit it)
        @param p: Playlist - The playlist to view
        @param which: string - A string indicating if it is a user playist ("user") or global playlist ("global")
        @POST: Sets this.creatingPlaylist to input p
    */
    private viewPlaylist(p: Playlist, which: string){
        this.creatingPlaylist = false;

        if(which === "user"){
            this.viewedPlaylist = p;
        }else{
            let s: Subscription = this._apiService.getSingleEntity<Playlist>("Playlists", p.playlistId).subscribe(
                data => this.viewedPlaylist = data,
                err => console.log("Unable to load playlist", err),
                () => s.unsubscribe()
            );
        }
    }

    /*
        Called when the user selects a playlist to play
        @param p: Playlist - The playlist to play
        @param which: string - A string indicating if it is a user playist ("user") or global playlist ("global")
        @POST: Sets this.selectedPlaylist to p
    */
    private selectPlaylist(p: Playlist, which: string){
        if(which === "user"){
            this.selectedPlaylist = p;
        }else{
            let s: Subscription = this._apiService.getSingleEntity<Playlist>("Playlists", p.playlistId).subscribe(
                data => this.selectedPlaylist = data,
                err => console.log("Unable to load playlist", err),
                () => s.unsubscribe()
            );
        }
    }

    /*
        Called when the user creates a new playlist. It creates the playlist and adds it to the backend DB
    */
    private newPlaylist(){
        let s: Subscription;
        this.creatingPlaylist = true;
        this.newPlaylistName += this.userPlaylists.length+1;

        let p = {
            active: true,
            name: this.newPlaylistName,
            userId: this.user.userId,
        };

        //POST HERE
        let np: Playlist;
        s = this._apiService.postEntity<Playlist>("Playlists", p).subscribe(
            d => np = d,
            err => console.log("Unable to create playlist", err),
            () => {
                this.userPlaylists.push(np);
                console.log("created", np);
                s.unsubscribe();
            }
        );
    }

    /*
        Called when we add a song from the search component, it adds the song to the playlist in the DB
        @event - The song to add given from the search component
    */
    private addSong(event){
        console.log(event);
    }

    //TODO: Make the backend (or here) also delete the playlist songs else we won't be able to delete the playlist!
    private deletePlaylist(){
        let s: Subscription;

        s = this._apiService.deleteEntity("Playlists", this.viewedPlaylist.playlistId).subscribe(
            d => d = d,
            err => console.log("Unable to delete playlist", err),
            () => {
                this.userPlaylists = this.userPlaylists.filter(playlist => playlist.playlistId !== this.viewedPlaylist.playlistId);
                this.viewedPlaylist = null;
                s.unsubscribe();
            }
        )
    }
}