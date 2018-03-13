/*
  Written by: Ryan Kruse
  This component controls the profile page. It allows the user to update/delete their current playlists
  and edit their creds.
*/
import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { DataShareService } from '../shared/data-share.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

import { User } from '../interfaces/user';
import { Subscribable } from 'rxjs/Observable';

import { MessageType } from '../shared/messagetype.enum';
import { MessageOutput } from '../interfaces/messageoutput';

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

  usernameTaken: boolean = false;

  MessageType = MessageType;
  messageOut: MessageOutput;

  constructor(private _apiService: ApiService, private _storage: StorageService, private _ngZone: NgZone,
    private _dataShareService: DataShareService, private _modalService: NgbModal) { }


  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);

    this.displayName = this.user.username;
  }

  /*
    This method is currently not working, we need to update the backend to only update values that are passed,
    the problem is that if we don't update our password, the backend will set it to null => the user can never login
    Other than that, the user updates perfectly
  */

  //TODO: Add the toasters, add password authentication colors (green = matching)...basically match the login page
  updateAccount() {
    let s: Subscription;

    if (this.newPassword.length > 0 && this.confirmPassword.length > 0) {
      this.user.password = this.confirmPassword;
    } else {
      this.user.password = null;
    }

    s = this._apiService.putEntity<User>("Users", this.user.userId, this.user).subscribe(
      d => d = d,
      err => this.triggerMessage("", "Unable to update user", MessageType.Failure),
      () => {
        s.unsubscribe();
        this.newPassword = "";
        this.confirmPassword = "";
        this.triggerMessage("", "Information Updated Successfully", MessageType.Success);
        this.repullUser();
      }
    );
  }

  private repullUser() {
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => this.user = d,
      err => console.log(err),
      () => {
        s.unsubscribe();

        //If we have remember me checked, we need to update the saved username
        let potUN: string = this._storage.getFromLocal("savedUsername");
        if (potUN !== null && potUN.length > 0)
          this._storage.saveToLocal("savedUsername", this.user.username);

        this._dataShareService.changeUser(this.user);
      }
    )
  }

  /*
        Called after the user leaves the username box. It checks with the API to see if
        the given username has been taken or not, if so it alerts the user with the error
    */
  validateUsername() {
    if (this.displayName.length <= 0 || this.user.username === this.displayName)
      return;

    let s: Subscription;
    console.log(this.user.username);
    s = this._apiService.validateUsername(this.user.username).subscribe(
      d => d = d,
      err => this.usernameTaken = err['error']['Error']
    )
  }

  cancelUpdate() {
    this.newPassword = "";
    this.confirmPassword = "";
    this.repullUser(); //Maybe not do this here?
    this.triggerMessage("", "Update Canceled", MessageType.Notification)
  }

  /*
    Called when updating passwords returns if they match or not
    @return boolean - if the user's passwords match
  */
  passwordsMatch(): boolean {
    return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
  }

  canUpdateInfo(): boolean{
    return this.passwordsMatch() && !this.usernameTaken;
  }

  /*
    Called whenever we make a transaction with the DB
    @param message: string - The message to show to the user
    @param level: MessageType - The type of message (Success, Failure, Notification)
   */
  triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this.messageOut = out;
  }
}
