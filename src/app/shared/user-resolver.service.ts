/*
    This service is called when we go to a new page, it makes sure we always have the newest update of 
    the user entity.
    Within each component that uses this, we can get the user info from the API
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../shared/api.service';
import { StorageService } from './session-storage.service';

import { User } from '../interfaces/user';

@Injectable()
export class UserResolver implements Resolve<any>{
    constructor(private router: Router, private apiService: ApiService, private storage: StorageService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User>{
        return this.apiService.validateToken();
    }
}