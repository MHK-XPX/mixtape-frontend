/*
  Written by: Ryan Kruse
  This component controls the embded youtube player and the currently playing playlist. It allows the user to play, pause, skip and repeat songs
*/
import { Component, OnInit, NgZone, Input } from '@angular/core';

import { StorageService } from '../shared/session-storage.service';

import { Playlist } from '../interfaces/playlist';
import { Song } from '../interfaces/song';

declare var window: any;

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})

export class YoutubeComponent implements OnInit {

  @Input() playlist: Playlist;

  private lastPlaylist: Playlist;

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

  constructor(private _storage: StorageService, private _ngZone: NgZone) { }

  ngOnInit() {
    window.onresize = (e) => {
      this._ngZone.run(() => {
        //this._width = window.innerWidth * this._widthScaler;
        this._height = window.innerHeight * this._heightScaler;

        if(this.player)
          this.player.setSize(this._width, this._height);
      });
    }

    this.lastPlaylist = this.playlist;
  }

  /*
    This is called on load or when we select a new playlist to view
  */
  ngOnChanges(){
    //If we do not have a playlist selected, there is nothing to do
    if(!this.playlist)
      return;

    //If our lastplayist we watched is equal to the current one, then we continue playing where we left off
    if(this.lastPlaylist === this.playlist){
      this.onSong = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : -1;
    }else{ //otherwise we start from the beginning
      this.onSong = -1;
      this.lastPlaylist = this.playlist;
    }

    this.nextSong();
  }

  private savePlayer(player){
    this.player = player;
    this.player.setSize(this._width, this._height);
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

  /*
    If the user clicks the next button we move to the next song, if repeat is 
    enabled we restart the playlist (if on the last song)
  */
  private nextSong(){
    if(this.onSong + 1>= this.playlist.playlistSong.length){
      if(this.repeat)
        this.onSong = 0;
      else
        return;
    }else{
      this.onSong++;
    }

    this.playVideo()
  }

  /*
    If the user clicks the last button we move to the last song, if repeat is 
    enabled we move to the last song (if on the first song)
  */
  private lastSong(){
    if(this.onSong - 1 < 0){
      this.onSong = this.playlist.playlistSong.length - 1;
    }else{
      this.onSong--;
    }

    this.playVideo();
  }

  /*
    This method is called when we move to a new song or load a new playlist
    it sets what song we are on in the session storage and loads then plays the video
  */
  private playVideo(){
    this._storage.setValue('onSong', this.onSong);
    this.parseId(this.playlist.playlistSong[this.onSong].song.url);
    this.player.loadVideoById(this.videoId, 0);
    this.player.playVideo();

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

  /*
    This method is called when we load a video, it parses the video ID from the youtube link
    @Input url: string - The url to parse
    @POST: sets this.videoId to the parsed string
  */
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

  /*
    This method is called everytime we display a song on the DOM, it requests the thumbnail saved via youtube's api
    and returns the source string to load the image from
    @Input url: string - The video url to get the thumbnail for
    @Output string - The thumbnail source link from the youtube api
  */
  private getThumbnail(url: string): string{ 
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
