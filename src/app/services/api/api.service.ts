import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { StorageService } from '../session/session-storage.service';

import { User, YoutubeResult, LastfmTrack, SearchResults, GlobalPlaylistSong } from '../../interfaces/interfaces';

@Injectable()
export class ApiService {

    newSongPosted: EventEmitter<boolean> = new EventEmitter(false); //the user's placement in the queue

    constructor(private _http: HttpClient, private _storage: StorageService) { }

    /*
        Called when we attempt to login, it returns a token authenticating the user
        @param cred: string - The login credentials (username and password in json format)
        @return Observable<any> - An Observable containing a token for the user
    */
    public getLoginToken(cred: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders(
            { 'Content-Type': 'application/json' }
        );

        return this._http.post(environment.api + 'Auth/login', cred, { headers }) as Observable<any>;
    }

    /*
       Called to validate the token given on login, if it is valid the API returns a user object without their password
       @return Observable<User> - A validated User object
   */
    public validateToken(): Observable<User> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );

        return this._http.get(environment.api + "Auth/me", { headers }) as Observable<User>;
    }

    /*
        This will be called once the backend is working properly
        @param username: string - The username to check for duplicates in the DB
        @return: Observable<any> - An error message if the username is taken, else null 
    */
    public validateUsername(username: string): Observable<any> {
        return this._http.get(environment.api + "Users/Check/" + username) as Observable<any>;
    }

    /*
        Returns a specific entity from the api
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to pull from the API
        @return Observable<T> - An Observable containing the specific entity from the DB
    */
    public getSingleEntity<T>(path: string, id: number): Observable<T> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );
        console.log(environment.api);

        return this._http.get(environment.api + path + "/" + id, { headers }) as Observable<T>;
    }

    /*
        Returns all entities for a given endpoint (IE: Users, Playlists, etc)
        @param path: string - The relative patht to the api IE Users
        @return Observable<T> - An Observable containing an array of the specific entities from the DB
    */
    public getAllEntities<T>(path: string): Observable<T[]> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );
        console.log(environment.api);

        return this._http.get(environment.api + path, { headers }) as Observable<T[]>;
    }

    /*
        Adds a new entity to the DB
        @param path: string - The relative patht to the api IE Users/
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    public postEntity<T>(path: string, obj: any): Observable<T> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );

        return this._http.post(environment.api + path, obj, { headers }) as Observable<T>;
    }

    /*
        Updates a specific entity in the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to update
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    public putEntity<T>(path: string, id: number, obj: any): Observable<T> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );

        return this._http.put(environment.api + path + "/" + id, obj, { headers }) as Observable<T>;
    }

    /*
        Deletes a specific entity from the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to delete
        @return OBservable<T> - The object delted from the DB
    */
    public deleteEntity<T>(path: string, id: number): Observable<T> {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );

        return this._http.delete(environment.api + path + "/" + id, { headers }) as Observable<T>;
    }

    public postSong(gpls: any) {
        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );
        this._http.post<GlobalPlaylistSong>(environment.api + "GlobalPlaylistSongs", gpls, { headers }).subscribe(
            resp => resp,
            err => console.log("unable to post", err),
            () => {
                // this.getMessages(true);
                this.newSongPosted.emit(true);
                this.newSongPosted.emit(false);
            }
        );
    }

    /*
        Called when the user searches our local DB for an artist, album, or song
        @param search: string - The artist, album, or song to search for
        @return Observable<SearchResults> - The results returned from the database that most 
            closely matches the search string
    */
    public getDBSearchResults(search: string): Observable<SearchResults> {
        if (!search || search.length <= 0) return;

        let headers: HttpHeaders = new HttpHeaders(
            { "Authorization": "Bearer " + this._storage.getValue("token") }
        );

        return this._http.get(environment.api + "Search/" + search, { headers }) as Observable<SearchResults>;
    }

    /*
        Returns any for now, will return youtube type later (once it's all parsed out)
        @param searchString: string - The string searched by the user in the search bar
        @param toDisplay: number - The number of results to return from Youtube's API
        @return Observable<YoutubeResult[]> An observable of an array of YoutubeResults from Youtube's API
    */
    public getYTSearchResults(searchString: string, toDisplay: number = 50): Observable<YoutubeResult[]> {
        if (!searchString || searchString.length <= 0) return;

        let baseUrl: string = "https://www.googleapis.com/youtube/v3/search?part=snippet"
        let mResult: string = "&maxResults=" + toDisplay;
        let search: string = "&q=" + searchString;
        let endUrl: string = "&type=video&key=" + environment.youtubeToken;

        return this._http.get(baseUrl + mResult + search + endUrl) as Observable<YoutubeResult[]>;
    }

    /*
        This method is called whenver the user attempts to add a song directly from the youtube result page (The modal)
        It searches LastFM's databse and returns the song and the corresponding Artist and Album
        @param artist: string - The artist of the song
        @param song: string - The song the user wants to add
        @return Observable<LastfmTrack> - An observable of a LastfmTrack object
    */
    public getLastfmResults(artist: string, song: string): Observable<LastfmTrack> {
        let baseUrl: string = "https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=" + environment.lastFMKey;
        let postUrl: string = "&track=" + song + "&artist=" + artist + "&autocorrect=1&format=json";

        return this._http.get(baseUrl + postUrl) as Observable<LastfmTrack>;
    }
}