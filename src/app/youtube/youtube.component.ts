/*
  Written by: Ryan Kruse
  This component handles all youtube player and current playlist events. It allows the user to delete, add, or queue a song
  from the current playlist. It also allows the user to view the video on the page.
*/

import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Subscription, Subject } from "rxjs";

import { debounceTime } from 'rxjs/operator/debounceTime';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApiService, DataShareService, StorageService } from '../services/services';
import { Playlist, PlaylistSong, Song, MessageType, MessageOutput } from '../interfaces/interfaces';
import { MouseoverMenuComponent, SnackbarComponent } from '../components';

@Component({
  selector: 'youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css', '../global-style.css'],
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

export class YoutubeComponent implements OnInit {
  playlist: Playlist;
  previewSong: Song;

  playlistRename: string = "";

  private lastPlaylistID: number;

  private player: YT.Player;
  private url: string = "";
  videoId;


  mouseOver: number = -1;

  private onSong: number = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : -1;
  private repeat: boolean = false;
  private paused: boolean = false;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService, private _modalService: NgbModal) { }

  @HostListener('window:resize') onResize(){
    if(this.player){
      this.player.setSize(this.getScreenWidth(), this.getScreenHeight());
    }
  }

  ngOnInit() {
    this._dataShareService.currentPlaylist.subscribe(res => this.setPlaylist(res));
    this._dataShareService.previewSong.subscribe(res => this.tryToPreviewSong(res));
  }

  /*
    This method is called whenver the current playlist is updated, it auto plays it iff 
    it isn't the last playlist played
    @param playlist: Playlist - The new playlist to play
  */
  private setPlaylist(playlist: Playlist) {
    this.playlist = playlist;

    if (!this.playlist) return;

    if (this.lastPlaylistID === this.playlist.playlistId || (this.lastPlaylistID && (this.lastPlaylistID === this.playlist.playlistId))) {
      this.onSong = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : 0;
    } else {
      this.clearPreviewSong();
      this.onSong = -1;
      this.lastPlaylistID = this.playlist.playlistId;
      this.changeSong(1);
    }
  }

  public savePlayer(player) {
    this.player = player;
    this.player.setSize(this.getScreenWidth(), this.getScreenHeight());
  }

  /*
    Called when the YT video changes states
    -1 --> Not started
    0 --> ended
    1 --> playing
    2 --> paused
    3 --> loading
  */
  public onStateChange(event) {
    switch (event.data) {
      case -1:
        break;
      case 0:
        if(this.previewSong){
          this.clearPreviewSong();
        }
        if(this.playlist) this.changeSong(1);
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
    This method is called when the user clicks the next/last song of button.
    It moves our currently playing (onSong) value in a given direction
    @param dir: number - the direction to move in our playlist
  */
  private changeSong(dir: number){
    this.onSong += dir;

    if(this.onSong >= this.playlist.playlistSong.length){
      if(this.repeat) this.onSong = 0; else return;
    }else if(this.onSong < 0)
      this.onSong = this.playlist.playlistSong.length - 1;
    
    this.playVideo();
  }

  /*
    This method is called when we want to play a specific video or the next video. This is decided by if the songURl param
    is given or not. If it is not given then we play the video at the onSong index; otherwise, we play the video with
    the given url
    @param? songUrl: string - The video url to play
  */
  private playVideo(songUrl?: string) {
    if (songUrl) {
      this.parseAndSetVideoId(songUrl);
    } else {
      this._storage.setValue('onSong', this.onSong);
      this.parseAndSetVideoId(this.playlist.playlistSong[this.onSong].song.url);
    }

    this.player.loadVideoById(this.videoId, 0);
    this.player.playVideo();
  }

  /*
    This method is called when the user wants to play a song at a specific index (IE when the user clicks on a specific song in the playlist)
    @param songUrl: string - The song url we want to play
    @param index?: number - The index in the playlist we want to move to
  */
  private playGivenVideo(songUrl: string, index?: number) {
    if(index){
      this.onSong = index;
      this.playVideo();
      return;
    }
    
    this.parseAndSetVideoId(songUrl);
    this.player.loadVideoById(this.videoId, 0);
    this.player.playVideo();
  }

  /*
    This method is called when we try to preview a song (when the user clicks a song on the search component)
    @param song: Song - The song we want to preview
  */
  private tryToPreviewSong(song: Song) {
    if ((!this.previewSong && song) || this.previewSong && song && song.songId !== this.previewSong.songId) {
      this.previewSong = song;
      this.playVideo(this.previewSong.url);
    }else{
      this.previewSong = null;
    }
  }

  public pauseClicked(){
    this.paused = !this.paused;

    if(this.paused)
      this.player.pauseVideo();
    else
      this.player.playVideo();
  }

  public repeatClicked(){
    this.repeat = !this.repeat;
  }

  private clearPreviewSong(){
    this._dataShareService.changePreviewSong(null);
  }

  openModal(content){
    this._modalService.open(content).result.then((result) => {
      if(this.playlistRename.length > 0)
        this.playlist.name = this.playlistRename;
      this.renamePlaylist();
      this.playlistRename = "";
    }, (reason) => {
      this.playlistRename = "";
    });
  }

  private renamePlaylist(){
    if (!this.playlist.playlistId) return; //The user shouldnt be allowed to rename a queue

    let s: Subscription = this._apiService.putEntity<Playlist>("Playlists", this.playlist.playlistId, this.playlist).subscribe(
      d => d = d,
      err => this.triggerMessage("", "Unable to change name of playlist", MessageType.Failure),
      () => {
        s.unsubscribe();
        this.triggerMessage("", "Playlist name updated!", MessageType.Success);
      }
    );
  }
  
  /*
   This method is called when we load a video, it parses the video ID from the youtube link
   @Input url: string - The url to parse
   @POST: sets this.videoId to the parsed string
 */
  private parseAndSetVideoId(url: string) {
    if (url !== '') {
      var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (fixedUrl !== undefined) {
        this.videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
        this.videoId = this.videoId[0];
      } else {
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
  private getThumbnail(url: string): string {
    var prefixImgUrl: string = "https://img.youtube.com/vi/";
    var suffixImgUrl: string = "/default.jpg";
    var ID;
    var imgURL: string = '';
    //Pull the video ID from the link so we can embed the video
    if (url !== '') {
      var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (fixedUrl !== undefined) {
        ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      } else {
        ID = url;
      }
      imgURL = prefixImgUrl + ID + suffixImgUrl;
    }
    return imgURL;
  }

  private triggerMessage(message: string, action: string, level: MessageType){
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }

  /*
    This method is called so we can set the youtube player to 65% of our current height
  */
  public getScreenHeight(): number {
    return window.screen.height * .35;
  }

  /*
    This method is called so we can set the youtube player to 45% of our width
  */
  public getScreenWidth(): number {
    return window.screen.width * .40;
  }
}