/**
 * Written by: Ryan Kruse
 * This component controls all actions on the sidebar visual. It allows the user to create a new playlist, delete a playlist
 * and play a new playlist. It allows allows them to clear their current queue. In the future it will allow them to view the global playlist
 */

import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

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

  dropDown: number = -1;
  dropDownMouseOver: number = -1;
  expandedPlaylist: Playlist;

  doneLoading: boolean = false;

  private defaultPLName: string = "New Playlist ";

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  /**
   * Get the uer and all of the user's playlists
   */
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

  /**
   * Called when the user clicks the create new playlist button. It creates a new playlist and adds it to the DB
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
      }
    );
  }

  /**
   * Called when the user clicks the expand button on a playlist
   * it shows all of songs in the given playlist (if any)
   * 
   * @param {Playlist} playlist The playlist to expand 
   * @param {number} index The index of the playlist in the user's list of playlists 
   * @param {any} event used to stop propagation on the button click
   */
  public expandPlaylist(playlist: Playlist, index: number, event: any){
    event.stopPropagation();

    this.dropDown = this.dropDown !== index ? index : -1;
    this.expandedPlaylist = playlist;
  }

  /**
   * Called when the user selects a playlist to play
   * @param {Playlist} playlist The playlist to start playing 
   */
  public selectPlaylist(playlist: Playlist) {
    this._dataShareService.changeUsingGlobalPlaylist(false);
    this._dataShareService.changeCurrentPlaylist(playlist);
  }

  /**
   * Called when the user switches to the global playlist
   */
  public selectGlobalPlaylist(){
    this._dataShareService.changeUsingGlobalPlaylist(true);    
  }

  /**
   * Called when we need to give feedback on a user action to the user
   * 
   * @example triggerMessage("", "Playlist created", MessageType.Success);
   * 
   * 
   * @param {string} message The message to show
   * @param {action} action The action taken
   * @param {MessageType} level Success, Failure, Notification 
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
