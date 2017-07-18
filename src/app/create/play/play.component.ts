import { Component } from '@angular/core';

import { UserService } from '../../user/user.service';

import { PlayList } from '../../playlist/playlist';
import { Song } from '../../playlist/song'

@Component({
    selector: 'create-play',
    templateUrl: './play.component.html',
    styleUrls: [ './play.component.css' ]
})

export class PlayComponent{
    //playLists: PlayList[] = []; //Used for view with playlist selection

    playlist: PlayList; //Used to hold the playlist we select

    songs: Song[] = [];
    url: string = ''; //Base string to make it so the embeded video looks "nice"
    private videoId;

    urls: string[] = []; //Holds the youtube links of our playlist
    imgs: string[] = []; //Holds the thumbnail links to our playlists

    isPlaying: boolean = false;
    repeat: boolean = false;

    constructor(private _userService: UserService){}

    player: YT.Player;

    /*
        This method is a callback from the youtube iframe API, it is called once we have loaded the api.
        Its purpose is to create our player (which allows us to access the api) and it starts playing the
        next song on our playlist.
    */
    savePlayer(player){
        this.player=player;
        console.log("Player instance", player);
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
        This method is called when we choose the playlist from the playlist display menu
        It loads all of the links from the playlists and guides us to our page that has the player and
        the links in a list element
    */
    private playPlayList(pList: PlayList): void{
        let s = this._userService.getSongs(pList.playlistId);
        
        //Arrays are pass by reference...so lets only take the values (otherwise its pretty annoying to program around)
        for(let i=0; i<s.length; i++){
            this.songs.push(s[i])
        }

        this.url = this.songs[0].url;

        this.parseId(this.url);

        this.isPlaying = true;

        this.playlist = pList;
    }

    /*
        This method is called when we click add on a playlist below our viewer. It will add ALL of the songs from
        the given list into our current playlist
        @param pList: PlayList - The playlist to append to the end of our player
    */
    private appendPlayList(pList: PlayList) : void{
        let s = this._userService.getSongs(pList.playlistId);

        for(let i=0; i<s.length; i++){
            this.songs.push(s[i]);
        }
    }

    /*
        This method is called when when load a new playlist from our play view (when the user clicks on the on the load button below
        the youtube player). It simply replaces the current playlist with the clicked on
        @param pList: PlayList - The playlist to load into our player
    */
    private loadNewPlayList(pList: PlayList): void{
        let s = this._userService.getSongs(pList.playlistId);
        this.songs = [];

        for(let i=0; i<s.length; i++){
            this.songs.push(s[i]);
        }
        this.playlist = pList;
        
        //Do we want auto-play always on???
        this.playNext();
    }
    /*
        This method is the core to many methods, it is called when we first start the playlist, if we have repeat on,
        or when we click the next song button. 
        The method checks if we still have songs left, if so it loads the next song into the player, it starts all songs at
        the 0 time, this keeps it from "getting stuck" when we load the same song in a row. If we have no songs left and have 
        repeat on, the method reloads the playlist and restarts the process.
    */
    private playNext(){
        if(this.songs.length > 0){
            this.url = this.songs.shift().url;
            this.parseId(this.url);
            this.player.loadVideoById(this.videoId, 0);
            this.player.playVideo();
        }else{
            if(this.repeat){
                this.playPlayList(this.playlist);
                this.playNext();
            }
        }
    }
    
    /*
        This method is called when the repeat button is pressed, it negates its value.
    */
    private repeatPlaylist(){
        this.repeat = !this.repeat;
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