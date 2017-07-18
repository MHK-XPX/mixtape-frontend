import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

import { PlayList } from '../playlist/playlist';
import { AlbumRating } from '../playlist/albumrating';
import { SongRating } from '../playlist/songrating';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

//Got the layout from: http://www.developerdrive.com/2013/03/how-to-create-a-beautiful-login-form/

//https://angular.io/api/common/AsyncPipe USE THIS AND
//http://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject (guide for proper setup)

export class LoginComponent implements OnInit{
    //init both username and password for two way binding
    private _username: string = "jshaw";
    private _password: string = "not yet encrypted"; //store this for testing purposes (we have two way binding)
    private _saveLogin: boolean;
    private _creatingAccount: boolean = false;

    private _users: User[] = [];
    //private _user: User;

    constructor(private _apiService: ApiService, private _userService: UserService){}

    ngOnInit(){
        this._apiService.getAllEntities('api/Users').subscribe(
            users => this._users = users,
            error => console.log("Could not load all users"),
            () => console.log('loaded all users')); //this.checkValidLogin());
    }
        
    public createNewUserView(){
        this._creatingAccount = true;
    }

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
            () => this._userService.logIn(newUser));
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
            //this._userService.logIn(user);
            this._apiService.getSingleEntity('api/Users', user.userId).subscribe(
                u => user = u,
                err => console.log("unable to login"),
                () => this._userService.logIn(user)
            );
        }
    }



/* Below is just to test that post and delete work
    public createUser(){
        console.log("Creating entity");
        let u: User = {
            userId: 5,
            firstName: "Ryan",
            lastName: "Kruse",
            password: "not yet encrypted",
            username: "rkruse",
            albumRating: [],
            playlist: [],
            songRating: []
        }

        this._apiService.postEntity('api/Users', u).subscribe(
            user => this._user = user,
            error => console.log("CANNOT CREATE USER"),
            () => console.log("User created")
        );
    }

    public deleteUser(){
        this._apiService.deleteEntity('api/Users', 5).subscribe(
            user => this._user = user,
            error => console.log("CANNOT delete USER"),
            () => console.log("User deleted")
        );
    }
    */
}