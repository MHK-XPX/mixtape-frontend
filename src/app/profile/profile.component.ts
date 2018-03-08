/*
  Written by: Ryan Kruse
  This component controls the profile page. It allows the user to update/delete their current playlists
  and edit their creds.
*/
import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { DataShareService } from '../shared/data-share.service';


import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';
import { Subscribable } from 'rxjs/Observable';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../shared/global-style.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  private firstName: string = "";
  private lastName: string = "";
  private displayName: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  constructor(private _apiService: ApiService, private _storage: StorageService, private _ngZone: NgZone, 
               private _dataShareService: DataShareService, private _modalService: NgbModal){}
  

  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);
  }

  /*
    This method is currently not working, we need to update the backend to only update values that are passed,
    the problem is that if we don't update our password, the backend will set it to null => the user can never login
    Other than that, the user updates perfectly
  */

  //TODO: Add the toasters, add password authentication colors (green = matching)...basically match the login page
  updateAccount(){
    let s: Subscription;

    if(this.newPassword.length > 0 && this.confirmPassword.length > 0){
      this.user.password = this.confirmPassword;
    }else{
      this.user.password = null;
    }

    s = this._apiService.putEntity<User>("Users", this.user.userId, this.user).subscribe(
      d => d = d,
      err => console.log("Unable to update user", err),
      () => {
        s.unsubscribe();
        this.newPassword = "";
        this.confirmPassword = "";
        this.repullUser();
      }
    );
  }

  private repullUser(){
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => this.user = d,
      err => console.log(err),
      () =>{
        s.unsubscribe();
        this._dataShareService.changeUser(this.user);
      }
    )
  }
  /*
    Called when updating passwords returns if they match or not
    @return boolean - if the user's passwords match
  */
  passwordsMatch(): boolean{
      return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
  }
}
