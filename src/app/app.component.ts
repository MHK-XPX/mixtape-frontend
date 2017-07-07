import {Component} from '@angular/core';
import { UserService } from './user/user.service';
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  constructor(private _userService: UserService){}

  showDropDown(): void{
    document.getElementById("dropDown").classList.toggle("show");
  }

  logOut(){
    this._userService.logOut();
  }
}
