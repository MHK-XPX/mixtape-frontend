/*
  Written by: Ryan Kruse
  This component handles all youtube player and current playlist events. It allows the user to delete, add, or queue a song
  from the current playlist. It also allows the user to view the video on the page.
*/

import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

import { DataShareService } from '../services/services';
import { Playlist, SongStart } from '../interfaces/interfaces';
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

  playlistRename: string = "";

  private player: YT.Player;
  videoId;

  mouseOver: number = -1;

  private repeat: boolean = false;
  private paused: boolean = false;

  constructor(private _dataShareService: DataShareService) { }

  @HostListener('window:resize') onResize() {
    if (this.player) {
      this.player.setSize(this.getScreenWidth(), this.getScreenHeight());
    }
  }

  /**
   * Subscribe to our DataShare service to get the next song to play and check if we are using the global playlist or not
   */
  ngOnInit() {
    this._dataShareService.usingGlobalPlaylist.subscribe(res => this.switchFromLocalToGlobal(res));
    this._dataShareService.nextSong.subscribe(res => this.changeSong(res));
  }

  /**
   * This method is called whenever the current song changes (from dataShareService)
   * 
   * @param {SongStart} ss The song we are changing to
   */
  public changeSong(ss: SongStart) {
    this.videoId = "";
    if (ss) {
      this.parseAndSetVideoId(ss.url);
      this.player.loadVideoById(this.videoId, ss.time);
      this.player.playVideo();
    }
  }

  /**
   * This method is called when the user switches between the global and local playlist
   * 
   * @param {boolean} onGlobal if we are on the global playlist or not
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

  /**
   * Called when the YT video changes states
   * -1 --> Not started
   * 
   * 0 --> ended
   * 
   * 1 --> playing
   * 
   * 2 --> paused
   * 
   * 3 --> loading
   * 
   * @param {any} event The event that occured due to a user's action on the youtube player
  */
  public onStateChange(event: any) {
    switch (event.data) {
      case -1:
        break;
      case 0:
        this.handleNextSong();
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

  /**
   * Called whenever a song ends and we need to move to the next song
   */
  private handleNextSong() {
    if (this.viewingGlobalPlaylist)
      this.globalPlaylist.nextSong();
    else
      this.localPlaylist.nextSong(1);
  }

  /**
   * Called when the user clikcs the pause/play button. It will pause or play the current song
   */
  public pauseClicked() {
    this.paused = !this.paused;

    if (this.paused)
      this.player.pauseVideo();
    else
      this.player.playVideo();
  }

  /**
   * Enables/Disables the repeat playlist button
   */
  public repeatClicked() {
    this.repeat = !this.repeat;
    this.localPlaylist.repeat = this.repeat;
  }

  /**
   * Called when the user moves in the playlist
   * 
   * @example
   * moveInPlaylist(1) - Moves the playlist forward one spot
   * moveInPlaylist(-1) - Moves the playlist backward one spot
   * 
   * 
   * @param {number} dir The direction to move in the playlist (-1 back, 1 forward) 
   */
  public moveInPlaylist(dir: number) {
    this.localPlaylist.nextSong(dir);
  }

  /**
   * Called when we load a video. The method parses the video ID from the youtube URL
   * 
   * @param {string} url The URL of the youtube video to load 
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

  /**
   * @ignore
   */
  public getScreenHeight(): number {
    return window.screen.height * .35;
  }

  /**
   * @ignore
   */
  public getScreenWidth(): number {
    return window.screen.width * .40;
  }
}