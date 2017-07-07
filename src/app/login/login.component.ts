import {Component, OnInit} from '@angular/core';


import { ApiService } from '../shared/api.service';
import { User } from '../user/user';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})

//Got the layout from: http://www.developerdrive.com/2013/03/how-to-create-a-beautiful-login-form/
export class LoginComponent{
    //init both username and password for two way binding
    private _username: string = '';
    private _password: string = ''; //Maybe dont store here?
    private _saveLogin: boolean;

    private _users: User[] = [];
    private _user: User;
    constructor(private _apiService: ApiService){}

    public signIn(){
        let foundID: number = -1;

        //Load all of the users
        this._apiService.getAllEntities('api/Users').subscribe(
            data => { this._users = data},
            err => console.error(err),
            () => console.log('Done loading users')
        );

        //Check if user is real in O(n), kinda bad...also don't know how to do proper password checks yet
        for(let i=0; i<this._users.length; i++){
            let u = this._users[i];
            if(this._username === u.Username && this._password === u.Password){
                foundID = u.UserId;
                this._user = u;
                break;
            }
        }

        //If we didn't find a match, we know the user is invalid
        if(foundID === -1){
            console.log("Not a valid user");
        }else{
            console.log("FOUND THE UESR: " + this._user.FirstName);
        }
    }
}