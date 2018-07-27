/*
  Written by: Ryan Kruse
  This component handles all logic to all other components
*/

/*
  TODO:
    FIXES:
      1) Make it more clear when something is hidden
      2) Make the back button on add song work (Fix)
      3) Controls dont exist on global playlist => cannot toggle queue (Fix)
      4) Adding a song to queue starts it over (Fix)
      5) Mouse hover toaster gets clipped on top song (Fix)
      6) Have search results have the artist name in them *DONE*

    FEATURES:
      1) Make it so you can share playlist with other users (selected)
      2) Make it so you can see playlists shared with you
        --It should show who made it (IE who made the playlist)
        --Should also have the option to remove yourself from the shared playlist
*/
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';


import { LoginComponent, SidebarComponent, SnackbarComponent, GlobalPlaylistComponent } from './components';
import { YoutubeComponent } from './youtube/youtube.component';

import { User, Playlist } from './interfaces/interfaces';
import { ApiService, DataShareService, StorageService } from './services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './global-style.css']
})

export class AppComponent implements OnInit {
  @ViewChild(YoutubeComponent) YT: YoutubeComponent;

  isNavbarCollapsed = true;

  user: User;

  searchString = "";
  searchStringChanged: Subject<string> = new Subject<string>(); //This is used so that we can do a debouceTime on the search string (we don't want to send a ton of get requests on each letter typed)

  currentPlaylist: Playlist;

  viewingGlobalPlaylists: boolean;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _storage: StorageService, private _router: Router) { }

  ngOnInit() {
    if(this.isLoggedIn()){
      let s: Subscription;
      let tempUser: User;

      s = this._apiService.validateToken().subscribe(
        d => tempUser = d,
        err => console.log(err),
        () => {
          s.unsubscribe();
          this.user = tempUser;
          this._dataShareService.changeUser(this.user);
        }
      );
    }
    this._dataShareService.user.subscribe(res => this.user = res);
    this._dataShareService.currentPlaylist.subscribe(res => this.currentPlaylist = res);

    let j: Subscription = this.searchStringChanged.debounceTime(250).subscribe(res => this.changeSearchString(res)); //Setup our debounce time so that we can reduce our # of requests

    this._dataShareService.usingGlobalPlaylist.subscribe(res => this.viewingGlobalPlaylists = res);
  }

  /**
   * Called everytime we type a letter into our search box It calls .next on our subject. This is done to limit the number of get 
   * requests to the server (due to our debounce time on the sub.)
   * 
   * @param {string} search The string the user is searching for 
   */
  public typedSearch(search: string){
    if(this.searchString.length && !search.length){
      this.searchString = "";
      this.searchStringChanged.next(this.searchString);
    }
    if(!search.length) return;

    this.searchString = search;
    this.searchStringChanged.next(this.searchString);
  }

  /**
   * Called after we pass our decounce time on our changed search string subject. Once we have passed the debounce time, we are able to call the get from our api
   * letting the view update to the newest search string. This is used so that we can attempt to do the pull quickly AFTER the user is done typing
   * 
   * @param {string} search The string the user is searching 
   */
  private changeSearchString(search: string){
    this.searchString = search;
    this._dataShareService.changeSearchString(this.searchString);
    this._router.navigate(['./home']);
  }

  /**
   * @returns The current user
   */
  public getUser(): User{
    return this.user;
  }

  /**
   * @returns If the user is logged in or not
   */
  public isLoggedIn(): boolean{
    return this._storage.getValue('loggedIn') || this._storage.getValue('token');
  }

  /**
   * @returns If the youtube player has loaded or not
   */
  public youtubeIsLoaded(): boolean{
    try{
      return (this.YT.playlist !== null || this.YT.playlist !== undefined);
    }catch{
      return false;
    }
    // return this.YT !== undefined && (this.YT.playlist !== null || this.YT.playlist !== undefined);
  }

  /**
   * Clears all user values from storage on logout
   */
  public logout(){
    this._storage.setValue("loggedIn", false);
    this._storage.removeValue("token");
    this._dataShareService.clearAllValues();
  }
}
