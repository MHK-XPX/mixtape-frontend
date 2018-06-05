/*
******TODO******
Make the Z-index of the mouse over menu to be higher than everything else so that when the user
attempts to mouse over something that would get covered by other elements it wont


ALSO:
  Fix the weird scaling bug with the youtube component, the user's probably dont want to have to scroll their YT video
*/


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService, DataShareService } from '../services/services';
import { User, Playlist, PlaylistSong, Song, MessageType, MessageOutput } from '../interfaces/interfaces';

@Component({
  selector: 'app-mouseover-menu',
  templateUrl: './mouseover-menu.component.html',
  styleUrls: ['./mouseover-menu.component.css', '../global-style.css']
})
export class MouseoverMenuComponent implements OnInit {
  MessageType = MessageType;

  //Takes input of 4 bools to indicate which icon to show (add to playlist, add to queue, delete from playlist, or delete playlist)
  @Input() addToPL: boolean;
  @Input() addToQ: boolean;
  @Input() deleteFromPL: boolean;
  @Input() deletePL: boolean;

  //The current song and playlist song we are acting on
  @Input() selectedSong: Song;
  @Input() selectedPLS: PlaylistSong;

  @Input() plToDelete: Playlist; //The playlist (if any) that we want to delete

  user: User;
  playlists: Playlist[];
  currentPL: Playlist;

  messageLevel: MessageType = MessageType.Notification;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);
    this._dataShareService.playlists.subscribe(res => this.playlists = res);
    this._dataShareService.currentPlaylist.subscribe(res => this.currentPL = res);
  }

  /*
      Called when we attempt to add a song to a given playlist, if successful we add the song to the given playlist, update the global lists, and output a message.
      If not successful we output a fail message.
      @param p: Playlist - The playlist to add the song to
      @param index: number - The index of the 'p' in our global array of playlists (from the DataShareService)
    */
  public addToPlaylist(p: Playlist, index: number, event) {
    event.stopPropagation();
    let toSendPLS = {
      playlistId: p.playlistId,
      songId: this.selectedSong.songId
    }
    let actPLS: PlaylistSong;

    let s: Subscription = this._apiService.postEntity<PlaylistSong>("PlaylistSongs", toSendPLS).subscribe(
      d => actPLS = d,
      err => {
        this.outputMessage("", "Unable to add " + this.selectedSong.name + " to " + p.name, MessageType.Failure);
      },
      () => {
        actPLS.song = this.selectedSong;
        s.unsubscribe();
        p.playlistSong.push(actPLS);
        this.playlists[index] = p;
        this._dataShareService.changePlaylists(this.playlists);
        this.outputMessage(this.selectedSong.name, "added to playlist", MessageType.Success);
      }
    );
  }

  public addToQueue(event){
    event.stopPropagation();
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
      };

      copyPL.playlistSong.push(pls);
    }

    this._dataShareService.changeCurrentPlaylist(copyPL);

    let out: MessageOutput = {
      message: this.selectedSong.name,
      action: "added to queue",
      level: MessageType.Success

    };

    this._dataShareService.changeMessage(out);
  }

  public deletePlaylistSong(event){
    event.stopPropagation();
    let plIndex: number = this.playlists.findIndex(pl => pl.playlistId === this.currentPL.playlistId);
    let plsIndex: number = this.currentPL.playlistSong.findIndex(pls => pls.playlistSongId === this.selectedPLS.playlistSongId);

    if(this.selectedPLS.playlistSongId === null){
      plsIndex = this.currentPL.playlistSong.findIndex(pls => pls.songId === this.selectedPLS.songId);
      this.currentPL.playlistSong.splice(plsIndex, 1);
      this._dataShareService.changeCurrentPlaylist(this.currentPL);
      this.outputMessage(this.selectedSong.name, "removed from queue", MessageType.Success);
    }else{
      let s: Subscription = this._apiService.deleteEntity<PlaylistSong>("PlaylistSongs", this.selectedPLS.playlistSongId).subscribe(
        d => d = d,
        err => this.outputMessage("", "unable to remove " + this.selectedSong.name + " from " + this.playlists[plIndex].name, MessageType.Failure),
        () => {
          s.unsubscribe();
          this.playlists[plIndex].playlistSong.splice(plsIndex, 1);
          this._dataShareService.changePlaylists(this.playlists);
          this.outputMessage(this.selectedSong.name, "removed from playlist", MessageType.Success);
        }
      );
    }
  }

  public deletePlaylist() {
    let plIndex: number = this.playlists.findIndex(pl => pl.playlistId === this.plToDelete.playlistId);
    let s: Subscription;

    s = this._apiService.deleteEntity<Playlist>("Playlists", this.plToDelete.playlistId).subscribe(
      d => d = d,
      err => this.outputMessage("", "Unable to delete playlist", MessageType.Failure),
      () => {
        s.unsubscribe();
        this.playlists.splice(plIndex, 1);
        this._dataShareService.changePlaylists(this.playlists);
        this.outputMessage("", "Playlist deleted!", MessageType.Success);
      }
    );
  }

  private createPlaylistSong(p: Playlist): PlaylistSong{
    let pls: PlaylistSong = {
      playlistSongId: null,
      playlistId: p.playlistId,
      songId: this.selectedSong.songId,
      playlist: null,
      song: this.selectedSong
    };

    return pls;
  }


  public cancelDropdown(event) {
    event.stopPropagation();
  }

  public outputMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }
}
