/*
    Written by: Ryan Kruse
    This service checks if we have a token in session storage, if so it allows us to navigate to the given page
    otherwise it redirects the user to the login page
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { StorageService } from './session-storage.service';

@Injectable()
export class SessionGuard implements CanActivate{
    
    constructor(private _router: Router, private _storage: StorageService){}

    /*
        Called on attempted page load, checks if there is a token in session storage if so we continue else nav away
        @param route: ActivatedRouteSnapshot - The page we are attempting to load
        @return boolean - if the user can load the page (if we have a token or not)
    */
    canActivate(route: ActivatedRouteSnapshot): boolean{
        //If our user is not logged in, then he cannot access some pages so we send them to the login screen
        if(!this._storage.getValue('token')){
            //alert('Please login to view this page'); //We can remove this only here for testing
            //start the new naviagation
            this._router.navigate(['/login']);
            //abort the path we were going to take
            return false;
        }
        return true;
    }
}