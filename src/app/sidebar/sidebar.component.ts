/*
  Written by: Ryan Kruse
  This component controls all actions on the sidebar visual. It allows the user to create a new playlist, delete a playlist
  and play a new playlist. It allows allows them to clear their current queue. In the future it will allow them to view the global 
  playlist
*/

import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';

import { ApiService, DataShareService } from '../services/services';
import { Playlist, User, MessageType, MessageOutput } from '../interfaces/interfaces';

import { Subscription } from 'rxjs';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../global-style.css'],
  animations: [
    trigger(
      'showState', [
        state('show', style({
          opacity: 1,
          visibility: 'visible'
        })),
        state('hide', style({
          opacity: 0,
          visibility: 'hidden'
        })),
        transition('show => *', animate('200ms')),
        transition('hide => show', animate('400ms')),
      ])
  ]
})

export class SidebarComponent implements OnInit {
  MessageType = MessageType;

  user: User;
  userPlaylists: Playlist[] = []

  mouseOver: number = -1;

  doneLoading: boolean = false;

  private defaultPLName: string = "New Playlist ";

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  ngOnInit() {
    this._dataShareService.playlists.subscribe(res => this.userPlaylists = res);
    this._dataShareService.user.subscribe(res => this.user = res);

    let s: Subscription;
    s = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId).subscribe(
      d => this.userPlaylists = d,
      err => console.log("Unable to load playlists", err),
      () => {
        s.unsubscribe();
        this._dataShareService.changePlaylists(this.userPlaylists);
        this.doneLoading = true;
      }
    );
  }

  /*
    This method is called when the user clicks the new playlist button. It will create a new playlist
    and add it to the database
  */
  public createPlaylist() {
    let nPL = {
      active: true,
      name: this.defaultPLName + (this.userPlaylists.length + 1),
      userId: this.user.userId
    };

    let returnedPL: Playlist;
    let s: Subscription = this._apiService.postEntity<Playlist>("Playlists", nPL).subscribe(
      d => returnedPL = d,
      err => this.triggerMessage("", "Unable to create new playlist", MessageType.Failure),
      () => {
        s.unsubscribe();
        this.userPlaylists.push(returnedPL);
        this._dataShareService.changePlaylists(this.userPlaylists);
        this.triggerMessage("", "Playlist created!", MessageType.Success);

        //this.selectPlaylist(returnedPL); //Add this if we want to auto swap to the new PL
      }
    );
  }

  /*
    This method is called when the user clicks a playlist to play. It updates the datashare subject so that
    all subscribers know that the user wants to play the given playlist
    @param playlist: Playlist - The playlist the user wants to play
  */
  public selectPlaylist(playlist: Playlist) {
    this._dataShareService.changeUsingGlobalPlaylist(false);    
    this._dataShareService.changeCurrentPlaylist(playlist);
  }

  public selectGlobalPlaylist(){
    this._dataShareService.changeUsingGlobalPlaylist(true);    
  }

  /*
    This method handles snackbar event triggers
  */
  private triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }
}
