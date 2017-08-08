import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { UserService } from '../user/user.service';
import { StorageService } from '../shared/session-storage.service';

import { User } from '../user/user';
import { PlayList } from '../playlist/interfaces/playlist';
import { AlbumRating } from '../playlist/interfaces/albumrating';
import { SongRating } from '../playlist/interfaces/songrating';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{
    //init both username and password for two way binding
    private _username: string = "jshaw";
    private _password: string = "not yet encrypted"; //store this for testing purposes (we have two way binding)
    private _saveLogin: boolean;
    private _creatingAccount: boolean = false;

    private _users: User[] = [];

    constructor(private _apiService: ApiService, private _userService: UserService, private _storage: StorageService, private _router: Router){}

    ngOnInit(){
        this._apiService.getAllEntities('api/Users').subscribe(
            users => this._users = users,
            error => console.log("Could not load all users"),
            () => this._storage.setValue('_users', this._users));
    }
        
    public createNewUserView(){
        this._creatingAccount = true;
    }

    /*
        When we click create new user after filling out the form it will post it to the backend api
        All params come from the fields (might be changed)
        Once the user is posted, they are put into session storage and logged in
    */
    public createNewUser(fname: string, lname: string, uname: string, password: string){
        let newUser: User = {
            "userId": this._users.length + 1, //Set its ID to the next value
            "firstName":  fname,
            "lastName": lname,
            "username": uname,
            "password": password,
            "albumRating": [],
            "playlist": [],
            "songRating": []
        }

        this._apiService.postEntity('api/Users', newUser).subscribe(
            user => newUser = user,
            error => console.log("CANNOT CREATE USER"),
            () => {
                this._storage.setValue('_user', newUser);
                this._userService.logIn();
            });
    }
        
    /*
        This method will need to be rewritten, when it comes to validation, I have no idea what I am doing and
        what is the correct way of doing it.
        It is called after we successfully load the users from the api, it then checks to make sure we can 
        log in
    */
    private checkValidLogin(){
        let foundID: number = -1;
        let user: User;
        //Check if user is real in O(n), kinda bad...also don't know how to do proper password checks yet
        for(let i=0; i<this._users.length; i++){
            let u = this._users[i];
            if(this._username === u.username && this._password === u.password){
                foundID = u.userId;
                user = u;
                break;
            }
        }

        //If we didn't find a match, we know the user is invalid
        if(foundID === -1){
            alert("Invalid login"); //The alert is for demo purpose only
            console.log("Not a valid login");
        }else{
            this._apiService.getSingleEntity('api/Users', user.userId).subscribe(
                u => user = u,
                err => console.log("unable to login"),
                () => {
                    this._storage.setValue('loggedIn', true);
                    this._storage.setValue('_user', user);
                    this._router.navigate(['./home']);
                    this._userService.logIn();
                }
            );
        }
    }
}