import { Component, OnInit, NgZone } from '@angular/core';
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
    styleUrls: [ './newplaylist.component.css', '../shared/playliststyle.css' ]
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
    private _tabInView: string = 'songs';

    //Embeded video fields
    private _player: YT.Player;
    private _url: string = ''; //Base string to make it so the embeded video looks "nice"
    private _videoId;
    private _width: number = window.innerWidth * .45;
    private _height: number = window.innerHeight * .45;

    //Bound img fields:
    private _deleteButton: string = "app/assets/playlist/delete_song_white.png"; //temp (still debating on hardcoding values in ts rather than html)

    constructor(private _userService: UserService, private _router: Router, private _ngZone: NgZone){}

    /*
        Loads up all the data we need for creating a playlist...might be changed in the future
    */
    ngOnInit(){
        this._songs = this._userService.getAllEntities('api/Songs');
        this._artists = this._userService.getAllEntities('api/Artists');
        this._albums = this._userService.getAllEntities('api/Albums');
        this._otherPlaylists = this._userService.getAllEntities('api/Playlists');

        //This is called whenever we resize the window, keeps the video ratio accurate 
        window.onresize = (e) => {
            this._ngZone.run(() => {
                this._width = window.innerWidth * .45;
                this._height = window.innerHeight * .45;
                this._player.setSize(this._width, this._height);
            });
        }
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

    private getSongs(p: PlayList){
        //console.log(p.playlistId);
        return this._userService.getSingleEntity('api/Playlists', p.playlistId);
    }

    /*
        Called when we click on a tab, controls what we see in the view
    */
    private openTab(tabName: string){
        this._tabInView = tabName;
    }

    private getUrlImage(url: string): string{
        let _img = '';
        _img = this._userService.getThumbnail(url);
        return _img;
    }


    //Youtube player methods below
    private savePlayer(player){
        this._player = player;
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
        this._url = song.url;
        this.parseId(this._url);
        this._player.loadVideoById(this._videoId, 0);
        this._player.playVideo();
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
}