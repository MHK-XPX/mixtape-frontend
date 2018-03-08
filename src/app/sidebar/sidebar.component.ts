/*
  Written by: Ryan Kruse
  This component controls the playlist holder on the right side of the DOM. It allows the user to select which playlist to listen to
  and allows them to create a new playlist
*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Subscription } from "rxjs";
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { ApiService } from '../shared/api.service';
import { DataShareService } from '../shared/data-share.service';

import { MouseoverMenuComponent } from '../mouseover-menu/mouseover-menu.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';

import { MessageType } from '../shared/messagetype.enum';
import { MessageOutput } from '../interfaces/messageoutput';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../shared/global-style.css'],
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
      ]
    )
  ]
})
export class SidebarComponent implements OnInit {
  MessageType = MessageType;

  user: User;
  userPlaylists: Playlist[] = []

  mouseOver: number = -1;
  messageOut: MessageOutput;

  private defaultPLName: string = "Playlist ";

  @Output() playlist: EventEmitter<Playlist> = new EventEmitter<Playlist>(); //Output the playlist selected to listen to

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  /*
    On init we sync all of the user's playlists and the user.
  */
  ngOnInit() {
    this._dataShareService.playlists.subscribe(res => this.userPlaylists = res);

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
  selectPlaylist(p: Playlist) {
    this.playlist.emit(p);
  }

  /*
    Called when the user clicks the create playlist button.
    The method creates a new playlist object (that is empty) and 
    adds it to our backend
  */
  createPlaylist() {
    let nPL = {
      active: true,
      name: this.defaultPLName + (this.userPlaylists.length + 1),
      userId: this.user.userId,
    }

    let returnedPL: Playlist;
    let s: Subscription = this._apiService.postEntity<Playlist>("Playlists", nPL).subscribe(
      d => returnedPL = d,
      err => console.log(err),
      () => {
        s.unsubscribe();
        this.userPlaylists.push(returnedPL);
        this._dataShareService.changePlaylist(this.userPlaylists);
        this.triggerMessage("Playlist created!", MessageType.Success);

        this.selectPlaylist(returnedPL);
      }
    );
  }

  /*
    Called whenever we make a transaction with the DB
    @param message: string - The message to show to the user
    @param level: MessageType - The type of message (Success, Failure, Notification)
   */
  triggerMessage(message: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      level: level
    };

    this.messageOut = out;
  }
}
