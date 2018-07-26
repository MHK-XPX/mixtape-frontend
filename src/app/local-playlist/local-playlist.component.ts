/*
  Written by: Ryan Kruse

  This component is used to control the local playlist. It allows the user to 
  move up and down in the playlist, remove a song from the playlist and view a playlist
*/

import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { Subscription } from "rxjs";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DataShareService, StorageService, ApiService } from '../services/services';
import { Playlist, Song, MessageType, MessageOutput, SongStart, PlaylistSong } from '../interfaces/interfaces';

import { SortEvent } from '../directives/sortable-list.directive';

@Component({
  selector: 'app-local-playlist',
  templateUrl: './local-playlist.component.html',
  styleUrls: ['./local-playlist.component.css', './local-playlist.component.scss', '../global-style.css'],
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

export class LocalPlaylistComponent implements OnInit {
  private alive: boolean = true;

  public playlist: Playlist;
  private lastPlaylistID: number;

  previewSong: Song;

  playlistRename: string = "";

  mouseOver: number = -1;
  dragging: boolean = false;

  helpMouseover: boolean = false;

  private onSong: number = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : 0;
  private repeat: boolean = false;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService, private _modalService: NgbModal) { }

  ngOnInit() {
    this._dataShareService.currentPlaylist
      .takeWhile(() => this.alive)
      .subscribe(res => this.setPlaylist(res));

    this._dataShareService.previewSong
      .takeWhile(() => this.alive)
      .subscribe(res => this.playPreviewSong(res));
  }

  /**
   * Called when the user clicks a local playlist. It sets it to the view and it sets the current
   * song to the first song in the playlist
   * 
   * @param {Playlist} playlist The playlist to set the view to 
   */
  public setPlaylist(playlist: Playlist) {
    this.playlist = playlist;

    if (this.playlist && this.playlist.playlistSong.length) {
      if (this.lastPlaylistID === null || this.lastPlaylistID !== this.playlist.playlistId) {
        this.onSong = 0;
        this.setCurrentSong(this.playlist.playlistSong[0].song.url);
        this.lastPlaylistID = this.playlist.playlistId;
      }
    }
  }

  /**
   * Called when the user clicks a song in the playlist, it skips to
   * that song and starts to play it
   * 
   * @param {number} index The index of the song in the playlist
   * @param {string} url The url of the song to play
   */
  public playGivenVideo(index: number, url: string) {
    this.onSong = index;

    this.setCurrentSong(url);
  }

  /**
   * Called when the user clicks a song from the search results to preivew
   * It will start playing it on the youtube player
   * 
   * @param {Song} song The song to preview
   */
  public playPreviewSong(song: Song) {
    this.previewSong = song;

    if (!this.previewSong) return;

    this.setCurrentSong(this.previewSong.url);
  }

  /**
   * Called when the user tries to move to or back to a song
   * 
   * @param {number} dir The direction to move in the playlist (1) foreard (-1) back 
   */
  public nextSong(dir: number) {
    //This is called after we preview a song and it ends (or we click the next button on a song)
    if (this.previewSong) {
      this.previewSong = null;
      dir = 0;
    }

    this.onSong += dir;

    if (this.onSong >= this.playlist.playlistSong.length) {
      if (this.repeat) {
        this.onSong = 0;
      } else {
        return;
      }
    } else if (this.onSong < 0) {
      this.onSong = this.playlist.playlistSong.length - 1;
    }

    this.setCurrentSong(this.playlist.playlistSong[this.onSong].song.url);
  }

  /**
   * Called whenever the user clicks save current playlist or save to new playlist
   * 
   * @param {boolean} newPlaylist If we are saving to a new playlist or not
   */
  public savePlaylist(newPlaylist: boolean) {
    if (newPlaylist || !this.playlist.playlistId) { //If we are saving it to a new playlist OR we are trying to save our current custom queue
      this.addNewPlaylist();
    } else {
      this.updatePlaylist();
    }
  }

  /**
   * Called when the user attempts to save the current playlist (or queue) to a new playlist.
   * The method create a new playlist and adds it to the DB, once added, it calls addSongToNewPlaylist
   * and will add all the songs to the new playlist
   */
  private addNewPlaylist() {
    let userPlaylists: Playlist[];
    this._dataShareService.playlists.subscribe(res => userPlaylists = res);

    let nPL = {
      active: true,
      name: "New Playlist " + (userPlaylists.length + 1),
      userId: this.playlist.userId
    };

    let returnedPL: Playlist;
    let s: Subscription = this._apiService.postEntity<Playlist>("Playlists", nPL).subscribe(
      d => returnedPL = d,
      err => this.triggerMessage("", "Unable to create a new playlist", MessageType.Failure),
      () => {
        s.unsubscribe();
        userPlaylists.push(returnedPL);
        this._dataShareService.changePlaylists(userPlaylists);

        this.addSongsToNewPlaylist(returnedPL, this.playlist.playlistSong);

        if (this.playlist.playlistSong.length <= 0)
          this.triggerMessage("", "New Playlist Saved!", MessageType.Success);
      }
    );
  }

  /**
   * Called when the user saves an already saved playlist (patching it)
   */
  private updatePlaylist() {
    let allNotAdded = this.playlist.playlistSong.filter(s => !s.playlistSongId); //Get all of the songs that they added but didn't save to the playlist (queued songs)

    this.addSongsToNewPlaylist(null, allNotAdded);
  }

  /**
   * Called whenever the user creates or saves songs to a playlist
   * 
   * @param {Playlist} newPlaylist The new playlist to add songs to 
   * @param {PlaylistSong} songsToAdd An array of songs to add to the given playlist
   */
  private addSongsToNewPlaylist(newPlaylist: Playlist, songsToAdd: PlaylistSong[]) {
    let playlist: Playlist = newPlaylist ? newPlaylist : this.playlist;

    let userPlaylists: Playlist[];

    this._dataShareService.playlists.subscribe(res => userPlaylists = res);

    let index: number = userPlaylists.findIndex(p => p.playlistId === playlist.playlistId);

    for (let i = 0; i < songsToAdd.length; i++) {
      let pls: PlaylistSong = songsToAdd[i];

      let toSendPLS = {
        playlistId: playlist.playlistId,
        songId: pls.songId
      };

      let actPLS: PlaylistSong;

      let s: Subscription = this._apiService.postEntity<PlaylistSong>("PlaylistSongs", toSendPLS).subscribe(
        d => actPLS = d,
        err => this.triggerMessage("", "Unable to save playlist", MessageType.Failure),
        () => {
          s.unsubscribe();
          actPLS.song = pls.song;
          playlist.playlistSong[i] = actPLS;

          if (i === songsToAdd.length - 1) {
            userPlaylists[index] = playlist;
            this._dataShareService.changePlaylists(userPlaylists);
            this.triggerMessage("", "Playlist Saved!", MessageType.Success);
          }
        }
      );
    }
  }

  /**
   * Called whenever the user drags a song in the playlist to reorder it
   * 
   * @param {SortEvent} event The event occured when sorting 
   */
  sort(event: SortEvent) {
    this.mouseOver = -1;
    const current = this.playlist.playlistSong[event.currentIndex];
    const swapWith = this.playlist.playlistSong[event.newIndex];

    this.playlist.playlistSong[event.newIndex] = current;
    this.playlist.playlistSong[event.currentIndex] = swapWith;

    if (event.currentIndex === this.onSong)
      this.onSong = event.newIndex;
    else if (event.newIndex == this.onSong)
      this.onSong = event.currentIndex;
  }

  /**
   * Called when we set the current song to the given url. It will start playing it in the player
   * 
   * @param {string} url The url of the song to start playing
   */
  private setCurrentSong(url: string) {
    if (!url) return;

    let ss: SongStart;

    ss = {
      url: url,
      time: 0
    };

    this._dataShareService.nextSong.next(ss);
  }

  /**
   * @ignore
   */
  openModal(content) {
    this._modalService.open(content).result.then((result) => {
      if (this.playlistRename.length > 0)
        this.playlist.name = this.playlistRename;
      this.renamePlaylist();
      this.playlistRename = "";
    }, (reason) => {
      this.playlistRename = "";
    });
  }

  /**
   * Called when the user clicks the playlist name to rename it
   */
  private renamePlaylist() {
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

  /**
   * Called everytime we display a song on the DOM, it requests the video's thumbnail from youtube's api
   * and returns the url for the image
   * 
   * @param {strinng} url The URL of the youtube video
   * @returns The url of the video's thumbnail 
   */
  public getThumbnail(url: string): string {
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

  /**
   * Called when we need to give feedback on a user action to the user
   * 
   * @example triggerMessage("", "Playlist created", MessageType.Success);
   * 
   * 
   * @param {string} message The message to show
   * @param {action} action The action taken
   * @param {MessageType} level Success, Failure, Notification 
   */
  private triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
