/*
    Written by: Ryan Kruse
    This service is called whenever we attempt to load a page. It makes sure that we have the most updated value of the user when we go to the page
    *Note: This may be taken out later
*/

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';
import { StorageService } from '../session/session-storage.service';


import { User } from '../../interfaces/interfaces';

@Injectable()
export class UserResolver implements Resolve<any>{
    constructor(private router: Router, private apiService: ApiService, private storage: StorageService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.apiService.validateToken();
    }
}