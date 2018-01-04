import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { StorageService } from './session-storage.service';

@Injectable()
export class SessionGuard implements CanActivate{
    
    constructor(private _router: Router, private _storage: StorageService){

    }

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