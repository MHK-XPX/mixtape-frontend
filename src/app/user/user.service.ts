import { User } from './user';

export class UserService{
    loggedIn: boolean = false;

    protected _user: User;

    public getUserName(){
        return this._user.username;
    }

    public logIn(user: User){
        this.loggedIn = true;
        this._user = user;
        console.log("User: " + this._user.username + " signed in");
    }

    public logOut(){
        this.loggedIn = false;
        console.log("User: " + this._user.username + " signed out");
        this._user = null;
    }
}