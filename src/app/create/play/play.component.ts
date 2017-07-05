import { Component } from '@angular/core';

import { PlayListService } from '../../playlist/playlist.service';

import { PlayList } from '../../playlist/playlist';

@Component({
    selector: 'create-play',
    templateUrl: './play.component.html',
    styleUrls: [ './play.component.css' ]
})

export class PlayComponent{
    playLists: PlayList[] = []; //Used for view with playlist selection
    playList: PlayList; //Used to hold the playlist we select

    url: string = ''; //Base string to make it so the embeded video looks "nice"

    urls: string[] = []; //Holds the youtube links of our playlist
    imgs: string[] = []; //Holds the thumbnail links to our playlists

    isPlaying: boolean = false;
    repeat: boolean = false;

    constructor(private _playlistService: PlayListService){}

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
        This method is called when we click the button to load all of the playlists, it displays them all on the screen
    */
    private loadPlayLists(): void{
        this.playLists = this._playlistService.getAllPlayLists();
    }

    /*
        This method is called when we choose the playlist from the playlist display menu
        It loads all of the links from the playlists and guides us to our page that has the player and
        the links in a list element
    */
    private playPlayList(pList: PlayList): void{
        let index = 0;
        for(let song of pList.getAllYouTubeLinks()){
            this.urls.push(song);
            this.imgs.push(pList.songs[index].imageURL);
            index++;
        }

        this.isPlaying = true;     
        this.playList = pList;
    }

    /*
        This method is called when we click add on a playlist below our viewer. It will add ALL of the songs from
        the given list into our current playlist
        @param pList: PlayList - The playlist to append to the end of our player
    */
    private appendPlayList(pList: PlayList) : void{
        let index = 0;
        for(let song of pList.getAllYouTubeLinks()){
            this.urls.push(song);
            this.imgs.push(pList.songs[index].imageURL);
            index++;
        }
    }

    /*
        This method is called when when load a new playlist from our play view (when the user clicks on the on the load button below
        the youtube player). It simply replaces the current playlist with the clicked on
        @param pList: PlayList - The playlist to load into our player
    */
    private loadNewPlayList(pList: PlayList): void{
        let index = 0;
        this.urls = [];
        this.imgs = [];

        for(let song of pList.getAllYouTubeLinks()){
            this.urls.push(song);
            this.imgs.push(pList.songs[index].imageURL);
            index++;
        }
        this.playList = pList;
    }
    /*
        This method is the core to many methods, it is called when we first start the playlist, if we have repeat on,
        or when we click the next song button. 
        The method checks if we still have songs left, if so it loads the next song into the player, it starts all songs at
        the 0 time, this keeps it from "getting stuck" when we load the same song in a row. If we have no songs left and have 
        repeat on, the method reloads the playlist and restarts the process.
    */
    private playNext(){
        if(this.urls.length > 0){
            this.url = this.urls.shift();
            this.imgs.shift();
            //this.player.loadVideoByUrl(this.url, 0);
            this.player.loadVideoById(this.url, 0);
            this.player.playVideo();
        }else{
            if(this.repeat){
                this.playPlayList(this.playList);
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

    /*
        This method is called when we load a playlist, it pulls the image from the youtube api,
        this makes it so we can make our list look "pretty." The list element is indexed in the html code
    */
    private getUrlImage(index: number, pList: PlayList): string{
        let _img = '';
        _img = pList.songs[index].imageURL;
        return _img;
    }

    /*
        I dont think this method is called...
        TODO: Potential removal 
    */
    private getAllLinks(pList: PlayList): any[]{
        return pList.getAllYouTubeLinks();
    }
}