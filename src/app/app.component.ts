import { Component, ViewChild, OnInit, NgZone, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from './shared/api.service';
import { DataShareService } from './shared/data-share.service';
import { StorageService } from './shared/session-storage.service';
import { UserService } from './shared/user.service';

import { YoutubeComponent } from './youtube/youtube.component';
import { HomeComponent } from './home/home.component';

import { User } from './interfaces/user';
import { Playlist } from './interfaces/playlist';
import { PlaylistSong } from './interfaces/playlistsong';
import { Artist } from './interfaces/artist';
import { Album } from './interfaces/album';
import { Song } from './interfaces/song';
import { SidebarComponent } from './sidebar/sidebar.component';

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
  showPlaylist: boolean = false;

  private onSong: number = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : -1;


  constructor(private _apiService: ApiService, public _storage: StorageService, private _dataShareService: DataShareService, private _userService: UserService) { }

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

  ngAfterViewInit() {
  }

  selectPlaylist(event: Playlist) {
    this.selectedPlaylist = event;
    this.showPlaylist = true;

    this._dataShareService.changeCurrentPlaylist(event);
  }

  enablePlaylist() {
    this.showPlaylist = true;
  }

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
