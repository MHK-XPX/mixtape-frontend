/*
  Written by: Ryan Kruse
  This service allows components to be dynamically updated and allows them to update the current user, playlist, and all playlists in real time

  NTOES FOR MYSELF: https://stackoverflow.com/questions/43348463/what-is-the-difference-between-subject-and-behaviorsubject
*/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { Song } from '../interfaces/song';

@Injectable()
export class DataShareService {
  
  public user: Subject<User> = new BehaviorSubject<User>(null);

  public playlists: Subject<Playlist[]> = new BehaviorSubject<Playlist[]>([]);
  public currentPlaylist: Subject<Playlist> = new BehaviorSubject<Playlist>(null);

  public searchString: Subject<string> = new BehaviorSubject<string>(null);

  public previewSong: Subject<Song> = new BehaviorSubject<Song>(null);

  constructor() { }

  /*
    Called when we make edits to any playlists the user owns, it alerts all subscribers
    and gives them the new data
    @param playlist: Playlist[] - An array of new playlists
  */
  changePlaylists(playlists: Playlist[]){
    //this.playlistsSubject.next(playlist);
    this.playlists.next(playlists);
  }

  /*
    Called whenever we change the current user (usually just on login and logout)
    @param user: User - the new user
  */
  changeUser(user: User){
    this.user.next(user);
    //this.user.next(user);
  }

  /*
    Called whenever we change the playlist we are currently listening to
    @param playlist: Playlist - The new playlist to listen to
  */
  changeCurrentPlaylist(playlist: Playlist){
    //this.currentPlaylistSubject.next(playlist);
    this.currentPlaylist.next(playlist);
  }

  /*
    Called whenever we search for a new string on the search bar
  */
  changeSearchString(search: string){
    //this.searchStringSubject.next(search);
    this.searchString.next(search);
  }

  changePreviewSong(song: Song){
    //this.previewSongSubject.next(song);
    this.previewSong.next(song);
  }

  /*
    Called when we logout, it clears the values to avoid any collisions with the next login
  */
  clearAllValues(){
    /*this.userSubject.next(null);
    this.playlistsSubject.next(null);
    this.currentPlaylistSubject.next(null);
    this.searchStringSubject.next(null);
    this.previewSongSubject.next(null);
    */
   this.user.next(null);
   this.playlists.next(null);
   this.currentPlaylist.next(null);
   this.searchString.next(null);
   this.previewSong.next(null);
  }
}