
/*
    What is stored (session storage):
        onSong - The index of the song the user is current listening to 
        loggedIn - If the user is currently logged in or not
        token - the auth token given to the user on login
    What is stored (local storage):
        _history - The history of songs the user has listened to 
        savedUsername - The username of the user if they clicked remember me
*/

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

export class StorageService{
    //Used to allow dynamic updates on our playlist
    public playlistObservable: Observable<any>;
    private _playlistObserver: any;
    constructor(){
        this.playlistObservable = new Observable(observer => {
            this._playlistObserver = observer;
        }).share();
    }

    /*
        Sets the playlist to a new value and notifies all subscribers
        @param key: string - '_playlist'
        @param value: any - The value to set it to 
    */
    public setPlaylist(key: string, value: any){
        this.setValue(key, value);
    }

    /*
        Sets a key in session storage to a given key
        @param key: string = the key of the object
        @param value: any - the value we want to set the key to
    */
    public setValue(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    /*
        Returns a value from session storage if it exists, returns null if it does not
        @param key: string - the object we want to get the value for
        @return any - Returns the value of the key or null if the key is not in storage
    */
    public getValue(key: string): any{
        let value: string = sessionStorage.getItem(key);

        if(value && value != "undefined" && value != "null"){
            return JSON.parse(value);
        }

        return null;
    }

    /*
        Returns if the key is in the session storage or not
    */
    public hasValue(key: string): boolean{
        if(sessionStorage.getItem(key) === null){
            return false;
        }
        return true;
    }

    /*
        Removes the key and its corresponding value from session storage
    */
    public removeValue(key: string): void{
        sessionStorage.removeItem(key);
    }

    /*
        Clears the whole storage
    */
    public clearAll(): void{
        sessionStorage.clear();
    }

    public saveToLocal(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    public getFromLocal(key: string): any{
        let value = localStorage.getItem(key);

        if(value && value != "undefined" && value != "null"){
            return JSON.parse(value);
        }

        return null;
    }

    public removeFromLocal(key: string): void{
        localStorage.removeItem(key);
    }
}