/*
    Written by: Ryan Kruse
    This service is used whenver we make an API call. All methods take object type T and produce an
    Observable<T>. The service supports GET, POST, PUT, DELETE and login validation
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { StorageService } from '../shared/session-storage.service';

import { User } from '../interfaces/user';
import { YoutubeResult } from '../interfaces/youtuberesult';
import { LastfmTrack} from '../interfaces/lastfmresult';



@Injectable()
export class ApiService{
    private _api='https://xpx-mixtape.herokuapp.com/api/'
    private _youtubeToken: string = "AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4";

    private lastFMKey: string = "1e231c3b75baee47b9c947ce5b806e0c";

    //private _api = 'http://localhost:60430/api/';

    constructor(private _http: HttpClient, private _storage: StorageService){}
    
    /*
        Called when we attempt to login, it returns a token authenticating the user
        @param cred: string - The login credentials (username and password in json format)
        @return Observable<any> - An Observable containing a token for the user
    */
    getLoginToken(cred: string): Observable<any>{
        let headers: HttpHeaders = new HttpHeaders(
            {'Content-Type': 'application/json'}
        );
        return this._http.post(this._api + 'Auth/login', cred, {headers}) as Observable<any>;
    }

    /*
        Called to validate the token given on login, if it is valid the API returns a user object without their password
        @return Observable<User> - A validated User object
    */
    validateToken(): Observable<User>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + "Auth/me", {headers}) as Observable<User>;
    }

    /*
        This will be called once the backend is working properly
        @param username: string - The username to check for duplicates in the DB
        @return: Observable<any> - An error message if the username is taken, else null 
    */
    validateUsername(username: string): Observable<any>{
        return this._http.get(this._api + "Users/Check/" + username) as Observable<any>;
    }
    
    /*
        Returns a specific entity from the api
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to pull from the API
        @return Observable<T> - An Observable containing the specific entity from the DB
    */
    getSingleEntity<T>(path: string, id: number): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + path + "/" + id, {headers}) as Observable<T>;
    }

    /*
        Returns all entities for a given endpoint (IE: Users, Playlists, etc)
        @param path: string - The relative patht to the api IE Users
        @return Observable<T> - An Observable containing an array of the specific entities from the DB
    */
    getAllEntities<T>(path: string): Observable<T[]>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + path, {headers}) as Observable<T[]>;
    }

    /*
        Adds a new entity to the DB
        @param path: string - The relative patht to the api IE Users/
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    postEntity<T>(path: string, obj: any): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.post(this._api + path, obj, {headers}) as Observable<T>;
    }

    /*
        Updates a specific entity in the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to update
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    putEntity<T>(path: string, id: number, obj: any): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.put(this._api + path + "/" + id, obj, {headers}) as Observable<T>;
    }

    /*
        Deletes a specific entity from the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to delete
        @return OBservable<T> - The object delted from the DB
    */
    deleteEntity<T>(path: string, id: number): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.delete(this._api + path + "/" + id, {headers}) as Observable<T>;
    }


    /*
        Returns any for now, will return youtube type later (once it's all parsed out)
    */
    getYoutubeResults(searchString: string, toDisplay: number): Observable<YoutubeResult[]>{
        if(!searchString || searchString.length <= 0) return; 

        let baseUrl: string = "https://www.googleapis.com/youtube/v3/search?part=snippet"
        let mResult: string = "&maxResults=" + toDisplay;
        let search: string = "&q=" + searchString;
        let endUrl: string = "&type=video&key=" + this._youtubeToken;
        
        return this._http.get(baseUrl + mResult + search + endUrl) as Observable<YoutubeResult[]>;
    }

    getLastfmResults(artist: string, song: string): Observable<LastfmTrack>{
        let baseUrl: string = "https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=" + this.lastFMKey;
        let postUrl: string = "&track=" + song + "&artist=" + artist + "&autocorrect=1&format=json";

        return this._http.get(baseUrl + postUrl) as Observable<LastfmTrack>;
    }
}



//AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4 TOKEN
// client ID: 132736446562-2bf10rb348ode6mtbfffl4pkns916e01.apps.googleusercontent.com
///Client SECRET: zXDxMcLjcQcpig0Bi4bXHMlP

/*
HOW TO SEARCH YOUTUBE API FOR A VIDEO GIVEN A SEARCH WORD:
BASE URL: https://www.googleapis.com/youtube/v3/search?part=snippet
&maxResults=<num results>
&q=<search>
&type=video
&key=AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4

LOOK AT ME: https://developers.google.com/youtube/v3/docs/search/list#examples



*/


/*


Application name	Mixtape-API
API key	1e231c3b75baee47b9c947ce5b806e0c
Shared secret	ea69e872350c66fdab63146a9a5fc5bc
Registered to	mhk-mixtape

*/