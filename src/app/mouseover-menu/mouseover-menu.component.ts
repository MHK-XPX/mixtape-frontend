/*
  Written by: Ryan Kruse

  This component controls the small icon menu that pops up on mouseover. It allows the user to add a song to a given playlist,
  add a song to the current playlist in the queue, or delete a song from the current playlist.

  The component makes all of the calls to the API and updates the playlists in the data share so that they are 
  dynamically updated on the DOM
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../shared/api.service';
import { DataShareService } from '../shared/data-share.service';

import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { Song } from '../interfaces/song';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mouseover-menu',
  templateUrl: './mouseover-menu.component.html',
  styleUrls: ['./mouseover-menu.component.css', '../shared/global-style.css']
})

export class MouseoverMenuComponent implements OnInit {

  //Takes input of three bools to indicate which icon to show (add to playlist, add to queue, or delete from playlist)
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

  //The component outputs a message if the action either failed or completed
  successMessage: string;
  @Output() successMessageOutput: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  /*
    On Init we sync our current user, playlists, and currently playing playlist
  */
  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);
    this._dataShareService.playlist.subscribe(res => this.playlists = res);
    this._dataShareService.currentPlaylist.subscribe(res => this.currentPL = res);
  }

  /*
    Called when we attempt to add a song to a given playlist, if successful we add the song to the given playlist, update the global lists, and output a message.
    If not successful we output a fail message.
    @param p: Playlist - The playlist to add the song to
    @param index: number - The index of the 'p' in our global array of playlists (from the DataShareService)
  */
  addToPlaylist(p: Playlist, index: number) {
    let toSendPLS = {
      playlistId: p.playlistId,
      songId: this.selectedSong.songId
    }
    let actPLS: PlaylistSong;

    let s: Subscription = this._apiService.postEntity<PlaylistSong>("PlaylistSongs", toSendPLS).subscribe(
      d => actPLS = d,
      err => {
        this.outputMessage("Unable to add " + this.selectedSong.name + " to " + p.name);
      },
      () => {
        actPLS.song = this.selectedSong;
        s.unsubscribe();
        p.playlistSong.push(actPLS);
        this.playlists[index] = p;
        this._dataShareService.changePlaylist(this.playlists);
        this.outputMessage(this.selectedSong.name + " added to " + p.name);
      }
    );
  }

  /*
    Called when we add a song to the currently playing playlist or we want to start a new queue. If we aren't listening to a playlist
    then we create a new queue and allow the user to add songs to it (via add to queue button) and they can listen to said queue.
    If the user is currently listening to a playlist, then we append the song to the end of the list and output a success message
  */
  addToQueue() {
    let pls: PlaylistSong;
    let copyPL: Playlist;

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
    } else {
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
    this.outputMessage(this.selectedSong.name + " added to queue");
  }

  /*
    Called when the user attempts to delete a song from a playlist. If the user is successful then we remove the song from the playlist,
    update the global playlists, and output a success message. If not successful we output a fail message
  */
  deletePlaylistSong() {
    let plIndex: number = this.playlists.findIndex(pl => pl.playlistId === this.currentPL.playlistId);
    let plsIndex: number = this.currentPL.playlistSong.findIndex(pls => pls.playlistSongId === this.selectedPLS.playlistSongId);

    if (this.selectedPLS.playlistSongId === null) { //If the ID is null, we know it was added to queue not to the playlist...so we simply remove it
      this.currentPL.playlistSong.splice(plsIndex, 1);
      this._dataShareService.changeCurrentPlaylist(this.currentPL);
      this.outputMessage("Removed " + this.selectedSong.name + " from queue");
    } else {
      let s: Subscription = this._apiService.deleteEntity<PlaylistSong>("PlaylistSongs", this.selectedPLS.playlistSongId).subscribe(
        d => d = d,
        err => this.outputMessage("Unable to remove " + this.selectedSong.name + " from " + this.playlists[plIndex].name),
        () => {
          s.unsubscribe();
          this.playlists[plIndex].playlistSong.splice(plsIndex, 1);
          this._dataShareService.changePlaylist(this.playlists);
          this.outputMessage("Removed " + this.selectedSong.name + " from " + this.playlists[plIndex].name);
        }
      )
    }
  }

  /*
    Called when we want to create a new playlist song to add to a playlist
    @param p: Playlist - the playlist we want to create a playlist song for
    @return PlaylistSong - A new playlist song
  */
  createPlaylistSong(p: Playlist): PlaylistSong {
    let pls: PlaylistSong = {
      playlistSongId: null,
      playlistId: p.playlistId,
      songId: this.selectedSong.songId,
      playlist: p,
      song: this.selectedSong
    };

    return pls;
  }

  deletePlaylist() {
    let plIndex: number = this.playlists.findIndex(pl => pl.playlistId === this.plToDelete.playlistId);
    let s: Subscription;

    s = this._apiService.deleteEntity<Playlist>("Playlists", this.plToDelete.playlistId).subscribe(
      d => d = d,
      err => this.outputMessage("Unable to delete playlist"),
      () => {
        s.unsubscribe();
        this.playlists.splice(plIndex, 1);
        this._dataShareService.changePlaylist(this.playlists);
        this.outputMessage("Playlist deleted!");
      }
    );
  }

  /*
    Called whenever we finish an action, the message is emitted to all parent components
  */
  outputMessage(message: string) {
    this.successMessage = message;
    this.successMessageOutput.emit(this.successMessage);
  }

}
