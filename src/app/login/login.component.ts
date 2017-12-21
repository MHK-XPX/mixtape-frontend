import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { StorageService } from '../shared/session-storage.service';
import { UserService } from '../shared/user.service';

import { User } from '../interfaces/user';

declare var window: any;

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{

    private invalidLogin: boolean = false;
    private username: string = "";
    private password: string = "not yet encrypted"; //will remove 
    private rememberMe: boolean = true;

    private createUser: boolean = false;

    private usernameTaken: boolean = false;
    private firstName: string = "";
    private lastName: string = "";
    private displayName: string = "";
    private newPassword: string = "";
    private confirmPassword: string = "";

    constructor(private _apiService: ApiService, private _storage: StorageService, private _router: Router, private _userService: UserService){}

    /*
        If we click remember me, load the last username sent into our box
    */
    ngOnInit(){
        let usrName = this._storage.getFromLocal('savedUsername');

        if(usrName)
            this.username = usrName;
    }

    ngAfterViewInit(){
        window.componentHandler.upgradeAllRegistered();
    }

    private loginClicked(){
        let s: Subscription;

        let loginCred = {
            Username: this.username,
            Password: this.password
        };

        let cred: string = JSON.stringify(loginCred);
        let user: any;

        s = this._apiService.getLoginToken(cred).subscribe(
            d => user = d,
            err => this.invalidLogin = true,
            () => {
                this._storage.setValue("token", user["token"]);
                this.validateLogin();
                s.unsubscribe();
            }
        );
    }

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

    private createUserClicked(){
        this.createUser = true;
        this.displayName = "";
        this.firstName = "";
        this.lastName = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    
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

    private passwordsMatch(): boolean{
        return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase()
                && this.newPassword.length > 0 && this.confirmPassword.length > 0;
    }

    private allFieldsFilled(): boolean{
        if(this.createUser)
            return this.passwordsMatch() && !this.usernameTaken && this.displayName.length > 0 && this.firstName.length > 0 && this.lastName.length > 0;

        return this.username.length > 0 && this.password.length > 0;
    }
}