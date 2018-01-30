/*
  Written by: Ryan Kruse
  This component controls the playlist holder on the right side of the DOM. It allows the user to select which playlist to listen to
  and allows them to create a new playlist
*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';
import { DataShareService } from '../shared/data-share.service';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../shared/global-style.css']
})
export class SidebarComponent implements OnInit{

  user: User;
  userPlaylists: Playlist[] = []

  @Output() playlist: EventEmitter<Playlist> = new EventEmitter<Playlist>(); //Output the playlist selected to listen to
  
  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  /*
    On init we sync all of the user's playlists and the user.
  */
  ngOnInit(){
    this._dataShareService.playlist.subscribe(res => this.userPlaylists = res);

    this._dataShareService.user.subscribe(res => this.user = res);

    //Incase the sync was messed up we also pull all of the user's playlists from the API as a saftey net
    let s: Subscription;
    s = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId).subscribe(
      d => this.userPlaylists = d,
      err => console.log("Unable to load playlists", err),
      () => { s.unsubscribe(); this._dataShareService.changePlaylist(this.userPlaylists); }
    )
  }

  /*
    Called when the user selects a playlist to listen to. It alerts all parent components of
    the playlist
    @param p: Playlist - The playlist selected to listen to
  */
  selectPlaylist(p: Playlist){
    this.playlist.emit(p);
  }
}
