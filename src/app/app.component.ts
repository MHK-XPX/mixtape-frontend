/*
  Written by: Ryan Kruse
  This component handles all logic to all other components
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
  
  /*
    This method is called everytime we type a letter into our search box. It calls .next on our subject we do this to limit the number of get 
    requests to the server (due to our debouce time on the sub.).
    @param search: string - The string the user is searching for
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

  /*
    This method is called after we pass our debounce time on our changed search string subject. Once we have passed the debounce time, we are able to call the get from our
    api letting the view update to the newest search string. This is used so that we can attempt to do the pull quickly AFTER the user is done typing
    @param search: string - The string the user is searching
  */
  private changeSearchString(search: string){
    this.searchString = search;
    this._dataShareService.changeSearchString(this.searchString);
    this._router.navigate(['./home']);
  }

  public getUser(): User{
    return this.user;
  }

  public isLoggedIn(): boolean{
    return this._storage.getValue('loggedIn') || this._storage.getValue('token');
  }

  public youtubeIsLoaded(): boolean{
    try{
      return (this.YT.playlist !== null || this.YT.playlist !== undefined);
    }catch{
      return false;
    }
    // return this.YT !== undefined && (this.YT.playlist !== null || this.YT.playlist !== undefined);
  }

  public logout(){
    this._storage.setValue("loggedIn", false);
    this._storage.removeValue("token");
    this._dataShareService.clearAllValues();
  }
}
