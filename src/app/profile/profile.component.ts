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

  /*
    This method is called once the user clicks the update button. It can be clicked IFF:
      1) The username is not taken (if changed)
      2) The passwords match (if changed)
      3) All changed fields are non-empty (excluding passwords)
  */
  public updateAccount() {
    let s: Subscription;

    if(this.newPassword.length > 0 && this.confirmPassword.length > 0){
      this.user.password = this.confirmPassword;
    }else{
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

  /*
    This method is called if the user attempts to change their username, it checks to make sure that 
    the given username is not already in use in the DB.
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

  /*
    This method is called everytime we make changes to the user. It repulls their information from the api
    so that we can ensure the integrity of their data
  */
  private repullUser(){
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => this.user = d,
      err => console.log(err),
      () => {
        s.unsubscribe();

        //Check to see if the user had remember me checked, if so we can find their username saved (we need to update it to the potential new one from the DB)
        let userNameFromLocal: string = this._storage.getFromLocal("savedUsername");
        if(userNameFromLocal !== null && userNameFromLocal.length > 0)
          this._storage.saveToLocal("savedUsername", this.user.username);

        this._dataShareService.changeUser(this.user);
      }
    );
  }

  /*
    This method is called if the user clicks the cancel button. It will set all of their values to the last entry in the database
    @param isCanceling: boolean - (Default = true) if the user is canceling, meaning they don't want to update we let them notify that we reset their values
      otherwise we don't say anyting
  */
  public resetValues(isCanceling: boolean = true){
    this.newPassword = "";
    this.confirmPassword = "";
    this.repullUser(); //Repull the user to cancel all of our local changes
    if(isCanceling) this.triggerMessage("", "Update Canceled", MessageType.Notification);

  }

  /*
    Called when updating passwords returns if they match or not
    @return boolean - if the user's passwords match
  */
  public passwordsMatch(): boolean {
    return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
  }

  /*
    Called when trying to click submit, returns true iff the first/last name fields are filled
    @return boolean - If the first AND last name fields are non-empty
  */
  public firstAndLastNameFilled(): boolean{
    return this.user.firstName.length > 0 && this.user.lastName.length > 0;
  }

  /*
    Called when trying to click submit, returns true iff the names are filled, the passwords match, and the username isnt taken
  */
  public canUpdateInfo(): boolean{
    return this.firstAndLastNameFilled() && this.passwordsMatch() && !this.usernameTaken && this.user.username.length > 0;
  }

  /*
    Used to trigger snackbar events
  */
  public triggerMessage(message: string, action: string, level: MessageType){
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }

}
