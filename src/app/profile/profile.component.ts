/*
  Written by: Ryan Kruse
  This component allows for the user to change any of their profile information. If the information is valid, then it will
  be updated in the backend
*/
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageType, User, MessageOutput } from '../interfaces/interfaces';
import { ApiService, DataShareService, StorageService } from '../services/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../global-style.css']
})

export class ProfileComponent implements OnInit {
  MessageType = MessageType;
  user: User;

  username: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  usernameTaken: boolean;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService) { }

  ngOnInit() {
    this._dataShareService.user.subscribe(res => this.user = res);
    this.username = this.user.username;
  }

  /**
   * Called once the user clicks the update button. It can be clicked IFF:
   *    1) The username is not taken
   *    2) The passwords match
   *    3) All changed fields are non-empty
   */
  public updateAccount() {
    let s: Subscription;

    if (this.newPassword.length > 0 && this.confirmPassword.length > 0) {
      this.user.password = this.confirmPassword;
    } else {
      this.user.password = null; //Set to null if the user didn't change them so that the api knows to not change the value
    }

    s = this._apiService.putEntity<User>("Users", this.user.userId, this.user).subscribe(
      d => d = d,
      err => this.triggerMessage("", "Unable to update profile", MessageType.Failure),
      () => {
        s.unsubscribe();
        this.resetValues();
        this.triggerMessage("", "Profile Successfully Updated!", MessageType.Success);
      }
    );
  }

  /**
   * Called if the user attempts to change their username, it checks to make sure that
   * the given username is not already in use in the DB.
   */
  public validateUsername() {
    //It won't be taken if there is no username entered (or if we enter our own)
    if (this.username.length <= 0 || this.user.username === this.username) {
      this.usernameTaken = false;
      return;
    }

    let s: Subscription;
    s = this._apiService.validateUsername(this.user.username).subscribe(
      d => d = d,
      err => this.usernameTaken = err['error']['Error'],
      () => {
        s.unsubscribe();
        this.usernameTaken = false;
      }
    );
  }

  /**
   * Called everytime we make a change to the user. It repulls their information from the api
   * so that we can ensure the integrity of their data
   */
  private repullUser() {
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => this.user = d,
      err => console.log(err),
      () => {
        s.unsubscribe();

        //Check to see if the user had remember me checked, if so we can find their username saved (we need to update it to the potential new one from the DB)
        let userNameFromLocal: string = this._storage.getFromLocal("savedUsername");
        if (userNameFromLocal !== null && userNameFromLocal.length > 0)
          this._storage.saveToLocal("savedUsername", this.user.username);

        this._dataShareService.changeUser(this.user);
      }
    );
  }

  /**
   * Called if the user clicks the cancel button. It will set all of their values to the last entry in the database
   * @param {boolean} isCanceling If the user is canceling, meaning they don't want to update we notify that we reset their values
   * otherwise we don't say anything 
   */
  public resetValues(isCanceling: boolean = true) {
    this.newPassword = "";
    this.confirmPassword = "";
    this.repullUser(); //Repull the user to cancel all of our local changes
    if (isCanceling) this.triggerMessage("", "Update Canceled", MessageType.Notification);

  }

  /**
   * Called when udating passwords returns if they match or not
   * @returns If the user's passwords match
   */
  public passwordsMatch(): boolean {
    return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
  }

  /**
   * Called when trying to click submit, returns true iff the first/last name fields are filled
   * @returns If the first AND last name fields are non-empty
   */
  public firstAndLastNameFilled(): boolean {
    return this.user.firstName.length > 0 && this.user.lastName.length > 0;
  }

  /**
   * Called when trying to click submit, returns true iff the names are filled, the passwords match, and the username isn't taken
   */
  public canUpdateInfo(): boolean {
    return this.firstAndLastNameFilled() && this.passwordsMatch() && !this.usernameTaken && this.user.username.length > 0;
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
  public triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }

}
