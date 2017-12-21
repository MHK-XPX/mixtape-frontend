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

    getLoginToken(cred: string): Observable<any>{
        console.log("sending: ", cred);
        let headers: HttpHeaders = new HttpHeaders(
            {'Content-Type': 'application/json'}
        );
        return this._http.post(this._api + 'Auth/login', cred, {headers}) as Observable<any>;
    }

    validateToken(): Observable<User>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + "Auth/me", {headers}) as Observable<User>;
    }
    
    getSingleEntity<T>(path: string, id: number): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + path + "/" + id, {headers}) as Observable<T>;
    }

    getAllEntities<T>(path: string): Observable<T[]>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.get(this._api + path, {headers}) as Observable<T[]>;
    }

    postEntity<T>(path: string, obj: any): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        console.log("Sending", obj);
        return this._http.post(this._api + path, obj, {headers}) as Observable<T>;
    }

    deleteEntity<T>(path: string, id: number): Observable<T>{
        let headers: HttpHeaders = new HttpHeaders(
            {"Authorization": "Bearer " + this._storage.getValue("token")}
        );
        return this._http.delete(this._api + path + "/" + id, {headers}) as Observable<T>;
    }
}