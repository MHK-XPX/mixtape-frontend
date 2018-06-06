/*
    Written by: Ryan Kruse
    This service will make sure that the user can only view certain pages iff they are logged in
    If they are not logged in, they will be redirected to the login/create user page.
*/

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { StorageService } from '../session/session-storage.service';

@Injectable()
export class SessionGuard implements CanActivate{
    constructor(private _router: Router, private _storage: StorageService){}

    canActivate(route: ActivatedRouteSnapshot): boolean{
        if(!this._storage.getValue('token')){ //If we do not have a valid token, we go to the login page
            this._router.navigate(['login']);
            return false;
        }

        return true; //otherwise, we continue to whatever page we wanted to go to
    }
}
