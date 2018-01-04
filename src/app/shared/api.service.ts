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

@Injectable()
export class ApiService{
    private _api='https://xpx-mixtape.herokuapp.com/api/'
    //private _api = 'http://localhost:60430/api/';

    constructor(private _http: HttpClient, private _storage: StorageService){}
    
    /*
        Called when we attempt to login, it returns a token authenticating the user
        @param cred: string - The login credentials (username and password in json format)
        @return Observable<any> - An Observable containing a token for the user
    */
    getLoginToken(cred: string): Observable<any>{
        console.log("sending: ", cred);
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
        console.log("Sending", obj);
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
        console.log("Sending", obj);
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
}