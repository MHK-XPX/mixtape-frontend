/*
  Written by: Ryan Kruse
  This component is used during the login period. It allows the user to login to an already existing account or to create a new one
  It also handles putting the token (and if chosen) the username into session storage 
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ApiService, StorageService, DataShareService } from '../services/services';

import { User } from '../interfaces/interfaces';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  invalidLogin: boolean = false;
  private username: string = "";
  private password: string = ""; //will remove 
  private rememberMe: boolean = true;

  createUser: boolean = false;

  usernameTaken: boolean = false;
  private hasClickedOff: boolean = false;

  private firstName: string = "";
  private lastName: string = "";
  private displayName: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";

  constructor(private _apiService: ApiService, public _storage: StorageService, private _router: Router, private _dataShareService: DataShareService) { }

  /**
   * If we click remember me, load the last username used to login
   */
  ngOnInit() {
    let usrName = this._storage.getFromLocal('savedUsername');

    if (usrName)
      this.username = usrName;
  }

  /**
   * Called when the user clicks login. Only able to if all the fields are filled in.
   * First we get an auth. token from the API then validates the token
   */
  private loginClicked() {
    if (!this.allFieldsFilled())
      return;

    let s: Subscription;

    let loginCred = {
      Username: this.username,
      Password: this.password
    };

    let cred: string = JSON.stringify(loginCred);
    let user: any;

    s = this._apiService.getLoginToken(cred).subscribe(
      d => user = d,
      err => { this.invalidLogin = true; this.password = "" },
      () => {
        this._storage.setValue("token", user["token"]);
        this.validateLogin();
        s.unsubscribe();
      }
    );
  }

  /**
   * Called after we get the token from logining in. The method validates if the token is corrent or not.
   * If it is correct, we move to the home page
   */
  private validateLogin() {
    let user: User;
    let s: Subscription = this._apiService.validateToken().subscribe(
      d => user = d,
      err => console.log("Invalid token", err),
      () => {
        this._storage.setValue('loggedIn', true);

        if (this.rememberMe)
          this._storage.saveToLocal('savedUsername', this.username);
        else
          this._storage.removeFromLocal('saveUsername');

        s.unsubscribe();

        this.setAllStorageValues();

        this._dataShareService.changeUser(user);
        this._router.navigate(['./home']);
      }
    );
  }

  /**
   * Called when the user clicks off of the username box. It checks with the API to see if the given
   * username has been taken. If it has, it alerts the user with the error
   */
  private validateUsername() {
    if (this.displayName.length <= 0)
      return;

    let s: Subscription;
    s = this._apiService.validateUsername(this.displayName).subscribe(
      d => d = d,
      err => {
        if (err['error']['Error']) {
          this.usernameTaken = true;
        } else {
          this.hasClickedOff = true;
        }
      }
    )
  }

  /**
   * When the user clicks create an accout, we clear all of the values
   */
  private createUserClicked() {
    this.createUser = true;
    this.displayName = "";
    this.firstName = "";
    this.lastName = "";
    this.newPassword = "";
    this.confirmPassword = "";
  }

  /**
   * Called when the user creates their account. It validates that all of the fields are correct.
   * If they are not correct, it alerts the user of the error. If they are valid, we add them to the
   * backend and call the login method
   */
  private createAccount() {
    let s: Subscription;

    let newUser = {
      FirstName: this.firstName,
      LastName: this.lastName,
      Username: this.displayName,
      Password: this.newPassword
    }

    let returnedUser: User;
    s = this._apiService.postEntity<User>("Users", newUser).subscribe(
      d => returnedUser = d,
      err => {
        if (err['error']['Error']) {
          this.usernameTaken = true;
          this.displayName = "";
        }
      },
      () => {
        s.unsubscribe();
        this.username = this.displayName;
        this.password = this.newPassword;
        this.loginClicked();
      }
    );
  }

  /**
   * Sets all of the storage values for the app
   */
  private setAllStorageValues() {
    this._storage.setValue("onSong", 0);
    this._storage.setValue("onPlaylist", null);
  }

  /**
   * @returns If the passwords are matching
   */
  private passwordsMatch(): boolean {
    return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase()
      && this.newPassword.length > 0 && this.confirmPassword.length > 0;
  }

  /**
   * @returns If all fields are filled in
   */
  private allFieldsFilled(): boolean {
    if (this.createUser)
      return this.passwordsMatch() && !this.usernameTaken && this.displayName.length > 0 && this.firstName.length > 0 && this.lastName.length > 0;

    return this.username.length > 0 && this.password.length > 0;
  }
}
