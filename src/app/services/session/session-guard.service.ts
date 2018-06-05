import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { StorageService } from '../session/session-storage.service';

@Injectable()
export class SessionGuard implements CanActivate{
    constructor(private _router: Router, private _storage: StorageService){}

    canActivate(route: ActivatedRouteSnapshot): boolean{
        if(!this._storage.getValue('token')){
            this._router.navigate(['login']);
            return false;
        }

        return true;
    }
}
