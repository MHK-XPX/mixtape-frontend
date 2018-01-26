import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { DataShareService } from '../shared/data-share.service';

import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { Song } from '../interfaces/song';
import { PlaylistSong } from '../interfaces/playlistsong';

@Component({
  selector: 'app-mouseover-menu',
  templateUrl: './mouseover-menu.component.html',
  styleUrls: ['./mouseover-menu.component.css']
})
export class MouseoverMenuComponent implements OnInit {

  @Input() addToPL: boolean;
  @Input() addToQ: boolean;
  @Input() deleteFromPL: boolean;

  @Input() selectedSong: Song;

  user: User;
  playlists: Playlist[];
  currentPL: Playlist;

  successMessage: string;
  @Output() successMessageOutput: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);
    this._dataShareService.playlist.subscribe(res => this.playlists = res);
    this._dataShareService.currentPlaylist.subscribe(res => this.currentPL = res);
  }

  addToPlaylist(p: Playlist, index: number) {
    let pls = this.createPlaylistSong(p);

    p.playlistSong.push(pls);
    this.playlists[index] = p;

    this._dataShareService.changePlaylist(this.playlists);
    this.successMessage = this.selectedSong.name + " added to " + p.name;

    this.outputMessage();
  }

  addToQueue(){
    let pls: PlaylistSong;
    let copyPL: Playlist;

    if(this.currentPL === null){
      let newPL: Playlist = {
        playlistId: null,
        active: true,
        name: "Custom Queue",
        userId: this.user.userId,
        playlistSong: []
      };

      pls = this.createPlaylistSong(newPL);
      newPL.playlistSong.push(pls);
      copyPL = newPL;
    }else{
      pls = this.createPlaylistSong(this.currentPL);
      copyPL = {
        playlistId: this.currentPL.playlistId,
        active: this.currentPL.active,
        name: this.currentPL.name,
        userId: this.currentPL.userId,
        playlistSong: this.currentPL.playlistSong.slice()
      }
      copyPL.playlistSong.push(pls);
    }

    this._dataShareService.changeCurrentPlaylist(copyPL);
    this.successMessage = this.selectedSong.name + " added to queue";
    this.outputMessage();
  }


  createPlaylistSong(p: Playlist): PlaylistSong{
    let pls: PlaylistSong = {
      playlistSongId: null,
      playlistId: p.playlistId,
      songId: this.selectedSong.songId,
      playlist: p,
      song: this.selectedSong
    };

    return pls;
  }

  outputMessage(){
    this.successMessageOutput.emit(this.successMessage);
  }

}
