/*
    Written by: Ryan Kruse
    This component controls the login and signup features. It either auths. a user with the backend
    or adds them to the backend with proper account creds.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { UserService } from '../shared/user.service';

import { User } from '../interfaces/user';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{
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

    constructor(private _apiService: ApiService, public _storage: StorageService,private _router: Router, private _userService: UserService){}

    /*
        If we click remember me, load the last username sent into our box
    */
    ngOnInit(){
        let usrName = this._storage.getFromLocal('savedUsername');

        if(usrName)
            this.username = usrName;
    }

    /*
        Called when the user clicks login. Only able to if all the fields are filled in
        It first gets a token from the API then validates the token
    */
    private loginClicked(){
        if(!this.allFieldsFilled())
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
            err => {this.invalidLogin = true; this.password = ""},
            () => {
                this._storage.setValue("token", user["token"]);
                this.validateLogin();
                s.unsubscribe();
            }
        );
    }

    /*
        Called after the user attempts to login. The method validates if the token is correct
        or not. If it is, the DOM is moved to the homepage
    */
    private validateLogin(){
        let user: User;
        let s: Subscription = this._apiService.validateToken().subscribe(
            d => user = d,
            err => console.log("Invalid token", err),
            () => {
                this._storage.setValue('loggedIn', true);

                if(this.rememberMe)
                    this._storage.saveToLocal('savedUsername', this.username);
                else
                    this._storage.removeFromLocal('saveUsername');

                s.unsubscribe();

                this._userService.logIn(user);
                this._router.navigate(['./home']);
            }
        );
    }

    /*
        Called after the user leaves the username box. It checks with the API to see if
        the given username has been taken or not, if so it alerts the user with the error
    */
    private validateUsername(){
        if(this.displayName.length <= 0)
            return;

        let s: Subscription;
        console.log(this.displayName);
        s = this._apiService.validateUsername(this.displayName).subscribe(
            d => d = d,
            err => {
                if(err['error']['Error']){
                    this.usernameTaken = true;
                }else{
                    this.hasClickedOff = true;
                }   
            }
        )
    }

    /*
        When the user clicks create an account, we clear all of the values
    */
    private createUserClicked(){
        this.createUser = true;
        this.displayName = "";
        this.firstName = "";
        this.lastName = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    
    /*
        Called when the user creates their account. It validates that all off the fields are correct
        if not, it alerts the user of the error. If they are valid, we add them to the backend
        and then call the login method
    */
    private createAccount(){
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
                if(err['error']['Error']){
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
    
    /*
        Called when entering passwords, returns if they match or not
        @return boolean - If the passwords are matching
    */
    private passwordsMatch(): boolean{
        return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase()
                && this.newPassword.length > 0 && this.confirmPassword.length > 0;
    }

    /*
        Called when disabling buttons or attempting to login/create user
        @return boolean - Returns if all the fields are filled in
    */
    private allFieldsFilled(): boolean{
        if(this.createUser)
            return this.passwordsMatch() && !this.usernameTaken && this.displayName.length > 0 && this.firstName.length > 0 && this.lastName.length > 0;

        return this.username.length > 0 && this.password.length > 0;
    }
}