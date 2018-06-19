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

  /*
    This method is called when the user clicks a local playlist. It sets it to the view
    and it sets the current song to the first song in the playlist
    @param playlist: Playlist - The playlist to set the view to
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

  /*
    This method is called when the user clicks a song on the playlist,
    it skips to that song and starts to play it
    @param index: number - The index of the song in the playlist
    @param url: string - The url of the song to play
  */
  public playGivenVideo(index: number, url: string) {
    this.onSong = index;

    this.setCurrentSong(url);
  }

  /*
    This method is called when the user clicks a song from the search results
    to preview. It will start playing it on the youtube player
    @param song: Song - The song to preview
  */
  public playPreviewSong(song: Song) {
    this.previewSong = song;

    if (!this.previewSong) return;

    this.setCurrentSong(this.previewSong.url);
  }

  /*
    This method is called when the user tries to move to or back to a song
    @dir: number - The direction to move in the playlist (1) forward (-1) back
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

  /*
    This method is called whenever the user clicks save current playlist or save to new playlist
  */
  public savePlaylist(newPlaylist: boolean) {
    if (newPlaylist || !this.playlist.playlistId) { //If we are saving it to a new playlist OR we are trying to save our current custom queue
      this.addNewPlaylist();
    } else {
      this.updatePlaylist();
    }
  }

  /*
    This method is called when the user attempts to save the current playlist (or queue) to a new playlist.
    The method creates a new playlist and adds it to the DB, once added, it calls addSongToNewPlaylist
    and will add all the songs to the new playlist
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

  /*
    This method is called when the user saves an already saved playlist (IE they are patching it)
  */
  private updatePlaylist() {
    let allNotAdded = this.playlist.playlistSong.filter(s => !s.playlistSongId); //Get all of the songs that they added but didn't save to the playlist (queued songs)

    this.addSongsToNewPlaylist(null, allNotAdded);
  }

  /*
    This method is called whenever the user creates or saves songs to a playlist.
    @newPlaylist: Playlist - The new playlist to add songs to
    @songsToAdd: PlaylistSong[] - An array of songs to add to the given playlist
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

  /*
    This method is called when the user wants to sort their playlist in a given way
    @param sortType: number - The way the user wants to sort
      1) sortType = 0: Alpha
      2) sortType = 1: Random

      TODO: Change each of these below to methods
  */
  /*public sortPlaylist(sortType: number){
    switch(sortType){
      case 0:
        this.playlist.playlistSong.sort();
        break;
      case 1:
        let len: number = this.playlist.playlistSong.length - 1;
        for(let i=0; i<this.playlist.playlistSong.length; i++){
          let r = Math.floor(Math.random() * len);
          let pls: PlaylistSong = this.playlist.playlistSong[i];

          this.playlist.playlistSong[i] = this.playlist.playlistSong[r];
          this.playlist.playlistSong[r] = pls;
        }
        break;
      default:
        break;
    }
  }*/

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

  /*
    This method will create a new SongStart object, it sets the URL and has
    our video start playing the song
    @param url: string - The url of the song to set to
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

  /*
    This method is called everytime we display a song on the DOM, it requests the thumbnail saved via youtube's api
    and returns the source string to load the image from
    @Input url: string - The video url to get the thumbnail for
    @Output string - The thumbnail source link from the youtube api
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
