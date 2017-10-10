/*
    What is stored:
        _user - The user that is currently logged in
        _users - A list of all the users (this will probably be removed)
        _playlists - A list of all the users playlists
        _playlist - The current playlist selected by the user
        _onVideo - The index of the current video we are on
        loggedIn - If the user is currently logged in or not
*/
import { PlayList } from '../playlist/interfaces/playlist';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

export class StorageService{
    //Used to allow dynamic updates on our playlist
    public playlistObservable: Observable<any>;
    private _playlistObserver: any;
    private _playlist: PlayList;

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
        this._playlist = this.getValue(key);
        this._playlistObserver.next(this._playlist);
    }

    /*
        This method is called when we update any information in the playlist, it allows for visual updates
        @playlist: PlayList - The playlist we updated
    */
    public updatePlaylists(playlist: PlayList){
        let playlists: PlayList[] = this.getValue('_playlists');

        this.setPlaylist('_playlist', playlist);
        for(let i=0; i<playlists.length; i++){
            if(playlists[i].playlistId === playlist.playlistId){
                playlists[i] = playlist;
                this.setValue('_playlists', playlists);
                break;
            }
        }
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
}