import { Component, OnInit, Output } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Subscription, Subject } from "rxjs";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DataShareService, StorageService, ApiService } from '../services/services';
import { Playlist, Song, MessageType, MessageOutput, SongStart } from '../interfaces/interfaces';

@Component({
  selector: 'app-local-playlist',
  templateUrl: './local-playlist.component.html',
  styleUrls: ['./local-playlist.component.css', '../global-style.css'],
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
  public playlist: Playlist;
  previewSong: Song;

  playlistRename: string = "";

  private lastPlaylistID: number;

  mouseOver: number = -1;

  private onSong: number = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : 0;
  private repeat: boolean = false;
  private paused: boolean = false;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService, private _modalService: NgbModal) { }

  ngOnInit() {
    this._dataShareService.currentPlaylist.subscribe(res => this.setPlaylist(res));
  }

  public setPlaylist(playlist: Playlist) {
    this.playlist = playlist;

    let ss: SongStart;

    if (this.playlist && this.playlist.playlistSong.length) {
      // ss = {
      //   url: this.playlist.playlistSong[0].song.url,
      //   time: 0
      // };

      // this.onSong = 0;
      //this._dataShareService.nextSong.next(ss);

      this.setCurrentSong(this.playlist.playlistSong[0].song.url);
    }

  }

  public nextSong(dir: number) {
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

}
