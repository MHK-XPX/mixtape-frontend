import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

/*
    Supports:
        GET, PUT, POST, DELETE
*/
@Injectable()
export class ApiService{
    private _api = "http://localhost:49742/"; //This will change once we have a dedicated host
    private _headers = new Headers({ "Content-Type": 'application/json' });
    private _options = new RequestOptions({ headers: this._headers });

    constructor(private _http: Http){}

    /*
        Allows the user to get a single entity from the api
        @param path: string - the path in the api to the entity (I.E User, Playlist, Song, Artist, etc)
        @param obj: Object - the type of entity we want to fetch
        @param id: number - the id of the entity
        @return - a json string containing entity information

        api/<entity>/id
    */
    getSingleEntity(path: string, id: number){
        //let body = JSON.stringify(obj);
        //console.log("Sending ", body);
        return this._http.post(this._api + path + id, this._options).map((res: Response) => res.json());
    }

    /*
        Allows the user to get all specific types of entities from the api
        @param path: string - the path in the api to the entity (I.E User, Playlist, Song, Artist, etc)
        @return - a json string containing entity information

        api/<entity>
    */
    getAllEntities(path: string){
        return this._http.post(this._api + path, this._options).map((res: Response) => res.json());
    }

    /*
        Allows the user to update a single entity from the api
        @param path: string - the path in the api to the entity (I.E User, Playlist, Song, Artist, etc)
        @param obj: Object - the type of entity we want to fetch
        @param id: number - the id of the entity
        @return - a json string containing entity information

        api/<entity>/id
    */
    putEntity(path: string, obj: Object, id: number){
        let body = JSON.stringify(obj);
        return this._http.put(this._api + path + id, body, this._options).map((res: Response) => res.json());
    }

    /*
        Allows the user to add a single entity to the api
        @param path: string - the path in the api to the entity (I.E User, Playlist, Song, Artist, etc)
        @param obj: Object - the type of entity we want to fetch
        @return - a json string containing entity information

        api/<entity>
    */
    postEntity(path: string, obj: Object){
        let body = JSON.stringify(obj);
        return this._http.put(this._api + path, body, this._options).map((res: Response) => res.json());
    }

    /*
        Allows the user to delete a single entity to the api
        @param path: string - the path in the api to the entity (I.E User, Playlist, Song, Artist, etc)
        @return - a json string containing entity information

        api/<entity>/id
    */
    deleteEntity(path: string, id: number){
        return this._http.put(this._api + path + id, this._options).map((res: Response) => res.json());
    }
}