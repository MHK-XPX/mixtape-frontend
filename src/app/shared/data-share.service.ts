/*
  Written by: Ryan Kruse
  This service allows components to be dynamically updated and allows them to update the current user, playlist, and all playlists in real time
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';

@Injectable()
export class DataShareService {
  
  private userSubject = new BehaviorSubject<User>(null);
  user = this.userSubject.asObservable();

  private playlistsSubject = new BehaviorSubject<Playlist[]>([]); //starts empty
  playlists = this.playlistsSubject.asObservable();

  private currentPlaylistSubject = new BehaviorSubject<Playlist>(null);
  currentPlaylist = this.currentPlaylistSubject.asObservable();

  constructor() { }

  /*
    Called when we make edits to any playlists the user owns, it alerts all subscribers
    and gives them the new data
    @param playlist: Playlist[] - An array of new playlists
  */
  changePlaylist(playlist: Playlist[]){
    this.playlistsSubject.next(playlist);
  }

  /*
    Called whenever we change the current user (usually just on login and logout)
    @param user: User - the new user
  */
  changeUser(user: User){
    this.userSubject.next(user);
  }

  /*
    Called whenever we change the playlist we are currently listening to
    @param playlist: Playlist - The new playlist to listen to
  */
  changeCurrentPlaylist(playlist: Playlist){
    this.currentPlaylistSubject.next(playlist);
  }

  /*
    Called when we logout, it clears the values to avoid any collisions with the next login
  */
  clearAllValues(){
    this.userSubject.next(null);
    this.playlistsSubject.next(null);
    this.currentPlaylistSubject.next(null);
  }
}