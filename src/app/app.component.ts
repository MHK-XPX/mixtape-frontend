import { Component } from '@angular/core';

import { StorageService } from './shared/session-storage.service';
import { UserService } from './shared/user.service';

import 'material-design-lite/material.js';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';

  constructor(private _storage: StorageService, private _userService: UserService){}

  ngAfterViewInit(){
    window.componentHandler.upgradeAllRegistered();
  }
}
