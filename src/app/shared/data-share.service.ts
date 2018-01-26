import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';

@Injectable()
export class DataShareService {
  
  private userSubject = new BehaviorSubject<User>(null);
  user = this.userSubject.asObservable();

  private playlists = new BehaviorSubject<Playlist[]>([]); //starts empty
  playlist = this.playlists.asObservable();

  private currentPlaylistSubject = new BehaviorSubject<Playlist>(null);
  currentPlaylist = this.currentPlaylistSubject.asObservable();

  constructor() { }

  changePlaylist(playlist: Playlist[]){
    this.playlists.next(playlist);
  }

  changeUser(user: User){
    this.userSubject.next(user);
  }

  changeCurrentPlaylist(playlist: Playlist){
    this.currentPlaylistSubject.next(playlist);
  }
}