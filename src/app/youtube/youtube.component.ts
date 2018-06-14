/*
  Written by: Ryan Kruse
  This component handles all youtube player and current playlist events. It allows the user to delete, add, or queue a song
  from the current playlist. It also allows the user to view the video on the page.
*/

import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService, DataShareService, StorageService } from '../services/services';
import { Playlist, Song, SongStart } from '../interfaces/interfaces';
import { LocalPlaylistComponent } from '../local-playlist/local-playlist.component';
import { GlobalPlaylistComponent } from '../global-playlist/global-playlist.component';

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
  @ViewChild(LocalPlaylistComponent) localPlaylist;
  @ViewChild(GlobalPlaylistComponent) globalPlaylist;

  viewingGlobalPlaylist: boolean;

  playlist: Playlist;
  previewSong: Song;

  playlistRename: string = "";

  private lastPlaylistID: number;

  private player: YT.Player;
  private url: string = "";
  videoId;

  mouseOver: number = -1;

  private repeat: boolean = false;
  private paused: boolean = false;

  currentSongURL: string = "";

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService, private _modalService: NgbModal) { }

  @HostListener('window:resize') onResize() {
    if (this.player) {
      this.player.setSize(this.getScreenWidth(), this.getScreenHeight());
    }
  }

  ngOnInit() {
    this._dataShareService.usingGlobalPlaylist.subscribe(res => this.switchFromLocalToGlobal(res));
    this._dataShareService.nextSong.subscribe(res => this.changeSong(res));
  }

  /*
    This method is called whenever the current song changes (from dataShareService)
    @param ss: SongStart - The song we are changing to
  */
  public changeSong(ss: SongStart) {
    this.videoId = "";
    if (ss) {
      this.parseAndSetVideoId(ss.url);
      this.player.loadVideoById(this.videoId, ss.time);
      this.player.playVideo();
    }
  }

  /*
    This method is called when the user switches between the global and local playlist
    @param onGlobal: boolean - if we are on the global playlist or not
  */
  private switchFromLocalToGlobal(onGlobal: boolean) {
    this.viewingGlobalPlaylist = onGlobal;

    if (this.viewingGlobalPlaylist) {
      this.pauseClicked();
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
        if (this.viewingGlobalPlaylist) {
          this.globalPlaylist.nextSong();
        } else {
          this.localPlaylist.nextSong(1);
        }
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
    This method is called when the user clicks the pause button, it will pause
    or play
  */
  public pauseClicked() {
    this.paused = !this.paused;

    if (this.paused)
      this.player.pauseVideo();
    else
      this.player.playVideo();
  }

  /*
    This method is called whenever the user clicks repeat
  */
  public repeatClicked(){
    this.repeat = !this.repeat;
    this.localPlaylist.repeat = this.repeat;
  }

  /*
    This method is called when the user moves in the 
    playlist
    @param dir: number - The direction to move in the playlist
  */
  public moveInPlaylist(dir: number) {
    this.localPlaylist.nextSong(dir);
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