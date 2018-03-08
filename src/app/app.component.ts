/*
  Written by: Ryan Kruse
  This component controls the core logic of the app. It holds all of the child components (sidebar, youtube, home <--which is search)
*/
import { Component, ViewChild, OnInit, HostListener} from '@angular/core';

import { Subscription } from "rxjs";

import { ApiService } from './shared/api.service';
import { DataShareService } from './shared/data-share.service';
import { StorageService } from './shared/session-storage.service';

import { YoutubeComponent } from './youtube/youtube.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { User } from './interfaces/user';
import { Playlist } from './interfaces/playlist';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './shared/global-style.css']
})

export class AppComponent implements OnInit {
  @ViewChild(YoutubeComponent) YT: YoutubeComponent;

  user: User;

  selectedPlaylist: Playlist;
  searchValue: string = "";

  searchString: string = "";

  isNavbarCollapsed = true;
  isSidebarCollapsed = false;
  showPlaylist: boolean = false;

  showProfile: boolean = false;

  private minWindowSize: number = 720;

  constructor(private _apiService: ApiService, public _storage: StorageService, private _dataShareService: DataShareService) { }

  @HostListener('window:resize') onResize() {
    this.isSidebarCollapsed = window.outerWidth <= this.minWindowSize;
  }

  /*
    On init, if the user is currently logged in (which can happen if they refresh the page), we pull the user from the API and 
    update the data-share service with the found user
  */
  ngOnInit() {
    if (this.isLoggedIn()) {
      let s: Subscription;
      let tempUser: User;

      s = this._apiService.validateToken().subscribe(
        d => tempUser = d,
        err => console.log(err),
        () => { s.unsubscribe(); 
          this.user = tempUser; 
          this._dataShareService.changeUser(this.user);
        }
      );
    }

    this._dataShareService.currentPlaylist.subscribe(res => this.selectedPlaylist = res);
  }

  /*
    Called when we select a playlist from the side bar, it updates the data-share service with the playlist
    and then shows the playlist on the DOM
    @param event: Playlist - the playlist that was selected
  */
  selectPlaylist(event: Playlist) {
    this.selectedPlaylist = event;
    this.showPlaylist = event != null;

    this.isSidebarCollapsed = window.outerWidth <= this.minWindowSize;
    
    this._dataShareService.changeCurrentPlaylist(event);
  }

  /*
    Called when we click the button to show the current playlist rather than the search (home) screen
  */
  enablePlaylist() {
    this.showPlaylist = true;
  }

  /*
    Called when the user searches for a string in the input box on the navbar. It removes the current playlist 
    from the view and shows a list of results that match the search string
  */
  search() {
    this.showPlaylist = false;
    this.searchString = this.searchValue;
  }

  getUser(): User {
    this._dataShareService.user.subscribe(res => this.user = res);
    return this.user;
  }

  isLoggedIn(): boolean {
    return this._storage.getValue('loggedIn') || this._storage.getValue('token');
  }

  logOut(){
    this._storage.setValue("loggedIn", false);
    this._storage.removeValue("token");

    this._dataShareService.clearAllValues();
  }
}
