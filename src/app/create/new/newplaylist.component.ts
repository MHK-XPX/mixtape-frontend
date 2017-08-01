import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../user/user.service';

import { PlayList } from '../../playlist/playlist';
import { PlaylistSong } from '../../playlist/playlistsong';
import { Artist } from '../../playlist/artist';
import { Album } from '../../playlist/album';
import { Song } from '../../playlist/song';

@Component({
    selector: 'create-newplaylist',
    templateUrl: './newplaylist.component.html',
    styleUrls: [ './newplaylist.component.css' ]
})

export class NewPlayListComponent implements OnInit{
    //User fields
    private _playlistName: string = 'New Playlist';
    private _playlistSongs: Song[] = [];
    
    //Global api data fields
    private _songs: Observable<Song[]>;
    private _artists: Observable<Artist[]>;
    private _albums: Observable<Album[]>;
    private _otherPlaylists: Observable<PlayList[]>;

    //Page logic
    private tabInView: string = 'songs';
    createNew: boolean = false; //If we are currently creating a playlist

    //Embeded video fields
    player: YT.Player;
    url: string = ''; //Base string to make it so the embeded video looks "nice"
    private videoId;

    constructor(private _userService: UserService, private _router: Router){}

    /*
        Loads up all the data we need for creating a playlist...might be changed in the future
    */
    ngOnInit(){
        this._songs = this._userService.getAllEntities('api/Songs');
        this._artists = this._userService.getAllEntities('api/Artists');
        this._albums = this._userService.getAllEntities('api/Albums');
        this._otherPlaylists = this._userService.getAllEntities('api/Playlists');
    }

    //NOT IMPLEMENTED YET
    private savePlayList(): void{       
       //Create a new playlist
       let newPlaylist = {
           "active": true,
           "name": this._playlistName,
           "userId": this._userService.getUserID()
       };
        this._userService.addPlaylist(newPlaylist, this._playlistSongs, 0, null);
        this._router.navigate(['./home']);
    }

    //NOT IMPLEMENTED YET
    private addLink(name: string, url: string): void{
        
    }

    /*
        Called when we click "add" on a song element, adds it to our new playlist
    */
    private addSong(song: Song){
        this._playlistSongs.push(song);
    }

    /*
        Called when we click "remove" on a song element removes it from our new playlist
    */
    private removeSong(index: number){
        this._playlistSongs.splice(index, 1);
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


    //Youtube player methods below
    savePlayer(player){
        var sw, sh;
        sw = window.screen.width;
        sh = window.screen.height;

        this.player = player;

        this.player.setSize(.45 * sw, .45 * sh);
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
        
    }

    private playSong(song: Song){
        this.url = song.url;
        this.parseId(this.url);
        this.player.loadVideoById(this.videoId, 0);
        this.player.playVideo();
    }

     private parseId(url: string){
        if(url !== ''){
            var fixedUrl = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if(fixedUrl !== undefined){
                this.videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                this.videoId = this.videoId[0];
            }else{
                this.videoId = url;
            }
        }
    }
}