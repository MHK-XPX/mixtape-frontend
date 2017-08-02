import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../user/user.service';
import { StorageService } from '../../shared/session-storage.service';

import { PlayList } from '../../playlist/playlist';
import { Song } from '../../playlist/song'

@Component({
    selector: 'create-play',
    templateUrl: './play.component.html',
    styleUrls: [ './play.component.css' ]
})

export class PlayComponent implements OnInit{
    private _playlist: PlayList; //Used to hold the playlist we select
    private _playlists: PlayList[] = [];
    private _publicPlaylists: Observable<any[]>;

    private _songs: Song[] = [];
    private _url: string = ''; //Base string to make it so the embeded video looks "nice"
    private _videoId;
    private _onVideo: number = 0;

    private _isPlaying: boolean = false;
    private _repeat: boolean = false;

    private _player: YT.Player;

    constructor(private _userService: UserService, private _storage: StorageService){}

    ngOnInit(){
        let s: Subscription;
        let playlists: PlayList[] = this._storage.getValue('_playlists');

        for(let i=0; i<playlists.length; i++){
            let p = playlists[i];
            s = this._userService.getSingleEntity('api/Playlists', p.playlistId).subscribe(
                data => this._playlists.push(data),
                err => console.log("Unable to load playlists"),
            );
        }

        this._publicPlaylists = this._userService.getAllEntities('api/Playlists');
    }

    /*
        This method is a callback from the youtube iframe API, it is called once we have loaded the api.
        Its purpose is to create our player (which allows us to access the api) and it starts playing the
        next song on our playlist.
    */
    savePlayer(player){
        var sw, sh;
        sw = window.screen.width;
        sh = window.screen.height;

        this._player = player;

        this._player.setSize(.45 * sw, .45 * sh);
        this.playNext();
    }

    /*
        Called when soemthing changes our player state (ie we pause the video or it ends)
        -1 - not started
        0 - ended
        1 - playing
        2 - paused
        3 - loading
    */
    onStateChange(event){
        console.log("player state:", event.data);
        switch(event.data){
            case -1:
                console.log("Not started");
                break;
            case 0:
                console.log("Ended");
                this.playNext();
                break;
            case 1:
                console.log("Playing");
                break;
            case 2:
                console.log("Paused");
                break;
            case 3:
                console.log("Loading");
                break;
            default:
                console.log("DEFAULT");
        }
    }

    /*
        This method is called when we initially select a playlist, append a playlist, or load a new playlist.
        If we are initially selecting a playlist, then we do not need to call playNext since it is already
        called when we load the youtube player
        @param playlist: PlayList - The playlist we want to play
        @param firstLoad: boolean - If we are loading a playlist for the very first time
    */
    private playPlaylist(playlist: PlayList, firstLoad: boolean = true): void{
        this._songs = []
        this._playlist = playlist;
        this._onVideo = 0;
        
        for(let i=0; i<this._playlist.playlistSong.length; i++){
            this._songs.push(this._playlist.playlistSong[i].song);
        }

        this._url = this._songs[0].url;
        this.parseId(this._url);
        this._isPlaying = true;

        if(!firstLoad){
            this.playNext();
        }
    }

    /*
        This method is called when we click add on a playlist below our viewer. It will add ALL of the songs from
        the given list into our current playlist
        @param playlist: PlayList - The playlist to append to the end of our player
    */
    private appendPlayList(playlist: PlayList) : void{
        for(let i=0; i<playlist.playlistSong.length; i++){
            this._songs.push(playlist.playlistSong[i].song);
        }
    }

    /*
        This method is the core to many methods, it is called when we first start the playlist, if we have repeat on,
        or when we click the next song button. 
        The method checks if we still have songs left, if so it loads the next song into the player, it starts all songs at
        the 0 time, this keeps it from "getting stuck" when we load the same song in a row. If we have no songs left and have 
        repeat on, the method reloads the playlist and restarts the process.
    */
    private playNext(){
        this._onVideo++;
        if(this._onVideo <= this._songs.length){
            this._url = this._songs[this._onVideo - 1].url;
            this.parseId(this._url);
            this._player.loadVideoById(this._videoId, 0);
            this._player.playVideo();
        }else{
            if(this._repeat){
                this._onVideo = 0;
                this.playNext();
            }
        }
    }
    
    /*
        This method is called when the repeat button is pressed, it negates its value.
    */
    private repeatPlaylist(){
        this._repeat = !this._repeat;
    }

    private parseId(url: string){
        if(url !== ''){
            var fixedUrl = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(fixedUrl !== undefined){
                this._videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                this._videoId = this._videoId[0];
            }else{
                this._videoId = url;
            }
        }
    }

    /*
        This method is called when we load a playlist, it pulls the image from the youtube api,
        this makes it so we can make our list look "pretty." 
    */
    private getUrlImage(url: string): string{
        let _img = '';
       _img = this._userService.getThumbnail(url);
       return _img;
    }
}