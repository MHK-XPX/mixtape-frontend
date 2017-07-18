import {Component} from '@angular/core';
import { UserService } from './user/user.service';
import { StorageService } from './shared/session-storage.service';
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  constructor(private _userService: UserService, private _storage: StorageService){}

  showDropDown(): void{
    document.getElementById("dropDown").classList.toggle("show");
  }

  logOut(){
    this._userService.logOut();
  }
}
