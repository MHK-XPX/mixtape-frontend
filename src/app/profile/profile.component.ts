/*
  Written by: Ryan Kruse
  This component controls the profile page. It allows the user to update/delete their current playlists
  and edit their creds.
*/
import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router} from "@angular/router";
import { Subscription } from "rxjs";

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private user: User;

  private playlists: Observable<Playlist[]>;

  private playlist: Playlist;

  private newPlaylistName: string = "";

  private firstName: string = "";
  private lastName: string = "";
  private displayName: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";

  constructor(private _apiService: ApiService, private _storage: StorageService, private _ngZone: NgZone, 
              private _route: ActivatedRoute, private _router: Router, private _modalService: NgbModal){}
  

  ngOnInit() {
    this._route.data.subscribe((data: { user: User }) => {
      this.user = data.user;
    });

    this.playlists = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId);
  }

  /*
    Called when the user selects a playlist to edit
    @param playlist: Playlist - The playlist selected by the user
    @POST - Sets this.playlist to param playlist
  */
  private playlistSelected(playlist: Playlist){
    this.playlist = playlist;
  }

  /*
    Called when the user removes a song from the playlist, it removes it from the DB
    and updates the DOM
    @param playlistSong: PlaylistSong - The playlist song to remove from the playlist
  */
  private removeSong(playlistSong: PlaylistSong){
    console.log(playlistSong);
  }

  /*
    Called when the user changes the name of a given playlist
    it opens a model and waits for the user to close it via click, click off, esc, or button press
    it then updates the playlist name on the DOM and backend DB <---soon to come
    @param content - The content placed in the modal
  */
  openModal(content){
    this._modalService.open(content).result.then((result) => {
      if(this.newPlaylistName.length > 0) //On close via the save button we check if we changed anything, if so we update it
        this.playlist.name = this.newPlaylistName;
      this.newPlaylistName = "";
    }, (reason) => { //On close via clicking away we clear anything the user might have typed
      this.newPlaylistName = "";
    });
  }

  //coming soon
  private searchSong(){
    console.log("SEARCHING");
  }

  /*
    This method is currently not working, we need to update the backend to only update values that are passed,
    the problem is that if we don't update our password, the backend will set it to null => the user can never login
    Other than that, the user updates perfectly
  */
  private updateAccount(){
    let s: Subscription;

    let newUser;

    if(this.newPassword.length > 0 && this.confirmPassword.length > 0){
      this.user.password = this.confirmPassword;
      newUser = this.user
    }else{
      newUser = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        userID: this.user.userId,
        username: this.user.username
      }
    }
    
    s = this._apiService.putEntity<User>("Users", this.user.userId, newUser).subscribe(
      d => d = d,
      err => console.log("Unable to update user", err),
      () => {
        console.log(this.user);
        this.newPassword = "";
        this.confirmPassword = "";
        s.unsubscribe();
      }
    );
  }

  /*
    Called when updating passwords returns if they match or not
    @return boolean - if the user's passwords match
  */
  private passwordsMatch(): boolean{
      return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
  }
}
