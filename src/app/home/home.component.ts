import { Component, OnInit, NgZone } from '@angular/core';
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

declare var window: any;
declare const $: any;

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

    private player: YT.Player;
    private url: string =  "";
    private videoId;

    private _widthScaler: number = .48;
    private _heightScaler: number = .48;
    private _width: number = window.innerWidth * this._widthScaler;
    private _height: number = window.innerHeight * this._heightScaler;

    private onSong: number = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : -1;
    private repeat: boolean = false;
    private paused: boolean = false;

    private searchString: string = "";

    private songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');
    private albums: Observable<Album[]> = this._apiService.getAllEntities<Album>('Albums');
    private artists: Observable<Artist[]> = this._apiService.getAllEntities<Artist>('Artists');

    constructor(private _apiService: ApiService, private _storage: StorageService, private _ngZone: NgZone, private _route: ActivatedRoute, private _router: Router){}

    ngOnInit(){
        this._route.data.subscribe((data: { user: User }) => {
            this.user = data.user;
        });

        window.onresize = (e) => {
            this._ngZone.run(() => {
                //this._width = window.innerWidth * this._widthScaler;
                this._height = window.innerHeight * this._heightScaler;
                this.player.setSize(this._width, this._height);
            });
        }

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

    ngAfterViewInit(){
        window.componentHandler.upgradeAllRegistered();
    }

    private savePlayer(player){
        this.player = player;
    }

    /*
    Called when soemthing changes our player state (ie we pause the video or it ends)
    -1 - not started
    0 - ended
    1 - playing
    2 - paused
    3 - loading
    */
    private onStateChange(event){
        switch(event.data){
            case -1:
                break;
            case 0:
                this.nextSong();
                break;
            case 1:
                this.paused = false;
                break;
            case 2:
                this.paused = true;
                break;
            case 3:
                break;
            default:
                console.log("DEFAULT");
        }
    }

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

    private selectPlaylist(p: Playlist, which: string){
        this.onSong = -1;
        if(which === "user"){
            this.selectedPlaylist = p;
            this.nextSong();
        }else{
            let s: Subscription = this._apiService.getSingleEntity<Playlist>("Playlists", p.playlistId).subscribe(
                data => this.selectedPlaylist = data,
                err => console.log("Unable to load playlist", err),
                () => {s.unsubscribe(); this.nextSong();}
            );
        }
    }

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

    private getArtistAlbums(artist: Artist){
        console.log(artist);
    }

    private lastSong(){
        if(this.onSong - 1 < 0){
            this.onSong = this.selectedPlaylist.playlistSong.length - 1
        }else{
            this.onSong--;
        }

        this.playVideo();
    }

    private nextSong(){
        if(this.onSong + 1 >= this.selectedPlaylist.playlistSong.length){
            if(this.repeat)
                this.onSong = 0;
            else
                return;
        }else{
            this.onSong++
        }

        this.playVideo();
    }

    private playVideo(){
        this._storage.setValue('onSong', this.onSong);
        this.parseId(this.selectedPlaylist.playlistSong[this.onSong].song.url);
        this.player.loadVideoById(this.videoId, 0);
        this.player.playVideo();
    }

    private getProgress(){
        var start = this.player.getCurrentTime();
        var end = this.player.getDuration();

        console.log((start/end) * 100);
    }

    private repeatClicked(){
        this.repeat = !this.repeat;
    }

    private pauseClicked(){
        this.paused = !this.paused;

        if(this.paused)
            this.player.pauseVideo();
        else
            this.player.playVideo();
    }

    private parseId(url: string){
        if(url !== ''){
            var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(fixedUrl !== undefined){
                this.videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                this.videoId = this.videoId[0];
            }else{
                this.videoId = url;
            }
        }
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
}