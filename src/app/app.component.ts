import {Component} from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  showDropDown(): void{
    document.getElementById("dropDown").classList.toggle("show");
  }
}
