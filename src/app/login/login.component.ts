import {Component, OnInit} from '@angular/core';


import { ApiService } from '../shared/api.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

//Got the layout from: http://www.developerdrive.com/2013/03/how-to-create-a-beautiful-login-form/
export class LoginComponent{
    //init both username and password for two way binding
    private _username: string = "jshaw";
    private _password: string = "not yet encrypted"; //store this for testing purpose (we have two way binding)
    private _saveLogin: boolean;

    private _users: User[];
    //private _user: User;

    constructor(private _apiService: ApiService, private _userService: UserService){}

    /*
        This method is called when we click the sign in button, it pulls all of the user names from the api
    */
    public signIn(){
        this._apiService.getAllEntities('api/Users')
            .subscribe(users => this._users = users,
                        error => console.log("ERROR WHEN LOADING"),
                        () => this.checkValidLogin());
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
            this._userService.logIn(user);
        }
    }

    /*
        Used to get the username of the current user via our service
    */
    private getUsername(){
        return this._userService.getUserName();
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