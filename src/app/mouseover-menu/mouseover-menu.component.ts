/*
  Written by: Ryan Kruse
  This component is used by any component that wants to have mouse-over actions IE add to playlist, delete from playlist, or add to queue.
  It handles almost all of our api calls and triggers the snackbar messages
*/

/*
******TODO******
Make the Z-index of the mouse over menu to be higher than everything else so that when the user
attempts to mouse over something that would get covered by other elements it wont
*/


import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService, DataShareService, MessageService } from '../services/services';
import { User, Playlist, PlaylistSong, Song, MessageType, MessageOutput, GlobalPlaylistSong } from '../interfaces/interfaces';

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

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _msgService: MessageService) { }

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

  public addToGlobalPlaylist(event){
    event.stopPropagation();
    let gpls = {
      songId: this.selectedSong.songId,
      userId: this.user.userId,
      votes: 0,
      isStatic: false
    }

    this._msgService.postSong(gpls);
  }

  /*
    Called when we want to add a song to our queue, this does NOT add it to the playlist forever, just until it is cleared
    @param event - The click event, used to stop propagation
  */
  public addToQueue(event) {
    event.stopPropagation();
    let pls: PlaylistSong;
    let copyPL: Playlist;

    //If we currently do not have a playlist, we must create fake one called custom queue
    if (this.currentPL === null) {
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
    } else { //If we do have a playlist create a new song to add to it and append it to the end (DOES NOT CALL API)
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

  /*
    This method is called when we want to delete a playlist song.
  */
  public deletePlaylistSong(event) {
    event.stopPropagation();
    let plIndex: number = this.playlists.findIndex(pl => pl.playlistId === this.currentPL.playlistId);
    let plsIndex: number = this.currentPL.playlistSong.findIndex(pls => pls.playlistSongId === this.selectedPLS.playlistSongId);

    //If the song does not have a playlist ID then we know it is a queued song so we just need to remove it from the list (DOES NOT CALL API)
    if (this.selectedPLS.playlistSongId === null) {
      plsIndex = this.currentPL.playlistSong.findIndex(pls => pls.songId === this.selectedPLS.songId);
      this.currentPL.playlistSong.splice(plsIndex, 1);
      this._dataShareService.changeCurrentPlaylist(this.currentPL);
      this.outputMessage(this.selectedSong.name, "removed from queue", MessageType.Success);
    } else { //If it does have a playlist ID attached, then we need to remove it from the Database
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

  /*
    This method is called when the user attempts to delete a playlist. It will remove it from the api and update our view
  */
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

  /*
    This method is called everytime we need to create a playlist song to add to a playlist OR queue
    @param p: Playlist - The playlist we want to add the song to
    @return PlaylistSong - a new playlist song entity
  */
  private createPlaylistSong(p: Playlist): PlaylistSong {
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

  /*
    Used to trigger snackbar events
  */
  public outputMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }
}
