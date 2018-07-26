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

  /**
   * Called when we attempt to login, it returns a toekn authenticating the user
   * 
   * @param {string} cred The login credentials (username and password in json format)
   * 
   * @returns An observable containing a token for the user 
   */
  public getLoginToken(cred: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    return this._http.post(environment.api + 'Auth/login', cred, { headers }) as Observable<any>;
  }

 /**
  * Called to validate the token given on login, if it is valid the API returns a user object without their password
  * 
  * @returns A validated user object
  */
  public validateToken(): Observable<User> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.get(environment.api + "Auth/me", { headers }) as Observable<User>;
  }

  /**
   * Called when we need to validate a username 
   * @param {string} username The username to check for duplicatins in the DB
   * 
   * @returns An error message if the username is taken, else null
   */
  public validateUsername(username: string): Observable<any> {
    return this._http.get(environment.api + "Users/Check/" + username) as Observable<any>;
  }

  /**
   * Returns a specific entity from the api
   * 
   * @param {string} path the relative path to the API
   * @param {number} id The id of the ntity to pull from the API 
   * 
   * @returns An Observable containing the specific entity from the DB
   */
  public getSingleEntity<T>(path: string, id: number): Observable<T> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.get(environment.api + path + "/" + id, { headers }) as Observable<T>;
  }

  /**
   * Returns all entities for a given endpoint (IE: Users, Playlists, etc)
   * 
   * @param {string} pathThe relative path the the api
   * 
   * @returns An Observable containing an array of the specific entities from the DB 
   */
  public getAllEntities<T>(path: string): Observable<T[]> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.get(environment.api + path, { headers }) as Observable<T[]>;
  }

  /**
   * Adds a new entity to the DB
   * 
   * @param {string} path The relative path to the API
   * @param {any} obj The json object of the entity to add
   * 
   * @returns An Observable containing the new tntity added to the DB
   */
  public postEntity<T>(path: string, obj: any): Observable<T> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.post(environment.api + path, obj, { headers }) as Observable<T>;
  }

  /**
   * Updates a specific entity in the DB
   * 
   * @param {string} path The relative path to the api
   * @param {number} id The id of the entity to update
   * @param {any} obj The json object of the entity to update
   * 
   * @returns An Observable containing the new entity added to the DB
   */
  public putEntity<T>(path: string, id: number, obj: any): Observable<T> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.put(environment.api + path + "/" + id, obj, { headers }) as Observable<T>;
  }

  /**
   * Deletes a specific entity from the DB
   * 
   * @param {string} path The relative path to the api
   * @param {number} id The id of the entity to delete
   * 
   * @returns An observable containing the object removed from the DB
   */
  public deleteEntity<T>(path: string, id: number): Observable<T> {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.delete(environment.api + path + "/" + id, { headers }) as Observable<T>;
  }

  /**
   * Adds a global playlist song to the DB
   * 
   * @param {any} gpls The global playlist song to add to the DB 
   */
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

  /**
   * Called when the user searches our local DB for an artist, album, or song
   * 
   * @param {string} search The artist, album, or song to search for
   * 
   * @returns The results returned from the database that most closely matches the search string 
   */
  public getDBSearchResults(search: string): Observable<SearchResults> {
    if (!search || search.length <= 0) return;

    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    return this._http.get(environment.api + "Search/" + search, { headers }) as Observable<SearchResults>;
  }

  /**
   * Called when the user needs to get results from youtube.com
   * 
   * @param {string} searchString The string searched by the user in the search bar
   * @param {number} toDisplay The number of results to return from Youtube's API
   * 
   * @returns An Observable of an array of YoutubeResults from Youtube's API
   */
  public getYTSearchResults(searchString: string, toDisplay: number = 50): Observable<YoutubeResult[]> {
    if (!searchString || searchString.length <= 0) return;

    let baseUrl: string = "https://www.googleapis.com/youtube/v3/search?part=snippet"
    let mResult: string = "&maxResults=" + toDisplay;
    let search: string = "&q=" + searchString;
    let endUrl: string = "&type=video&key=" + environment.youtubeToken;

    return this._http.get(baseUrl + mResult + search + endUrl) as Observable<YoutubeResult[]>;
  }

  /**
   * Called whenever the user attempts to add a song directly from the youtube result page (modal)
   * It searches LastFM's database and returns the song and the correspoinding Artist and Alubm
   * 
   * @param {string} artist The artist of the song
   * @param {string} song The song the user wants to add
   * 
   * @returns An Observable of a LastfmTrack object
   */
  public getLastfmResults(artist: string, song: string): Observable<LastfmTrack> {
    let baseUrl: string = "https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=" + environment.lastFMKey;
    let postUrl: string = "&track=" + song + "&artist=" + artist + "&autocorrect=1&format=json";

    return this._http.get(baseUrl + postUrl) as Observable<LastfmTrack>;
  }
}