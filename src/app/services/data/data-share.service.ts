/*
    Written by: Ryan Kruse
    This service is used to share data accross components. Any component that wants to use data from this service must subscribe to the subject they would
    like to keep track up. Each time a different component calls change__(value) it will emit the next value and notify all components subscribed.
*/
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { User, Playlist, Song, MessageOutput, SongStart } from '../../interfaces/interfaces';

@Injectable()
export class DataShareService {

  public user: Subject<User> = new BehaviorSubject<User>(null);

  public playlists: Subject<Playlist[]> = new BehaviorSubject<Playlist[]>([]);
  public currentPlaylist: Subject<Playlist> = new BehaviorSubject<Playlist>(null);
  public currentSong: Subject<Song> = new BehaviorSubject<Song>(null);
  public currentTime: number;

  public nextSong: Subject<SongStart> = new BehaviorSubject<SongStart>(null);

  public searchString: Subject<string> = new BehaviorSubject<string>(null);

  public previewSong: Subject<Song> = new BehaviorSubject<Song>(null);

  public message: Subject<MessageOutput> = new BehaviorSubject<MessageOutput>(null);

  public usingGlobalPlaylist: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * Called whenever the user makes a change to any of their playlists
   * 
   * @param {Playlist} playlists A new list of user playlists 
   */
  public changePlaylists(playlists: Playlist[]) {
    this.playlists.next(playlists);
  }

  /**
   * Called whenever the user switches their current playlist
   * 
   * @param {Playlist} playlist The new playlist
   */
  public changeCurrentPlaylist(playlist: Playlist) {
    this.currentPlaylist.next(playlist);
  }

  /**
   * Called whenever the user switches the current song
   * 
   * @param {Song} song The new song
   */
  public changeCurrentSong(song: Song) {
    this.currentSong.next(song);
  }

  /**
   * Called whenever the user changes their search string
   * 
   * @param {string} search A new search string 
   */
  public changeSearchString(search: string) {
    this.searchString.next(search);
  }

  /**
   * Called whenever the user changes the song they are (or want to) preview
   * 
   * @param {Song} song A new song to preview 
   */
  public changePreviewSong(song: Song) {
    this.previewSong.next(song);
  }

  /**
   * Called whenever the user makes changes to their profile or sings in/out
   * 
   * @param {User} user A new user 
   */
  public changeUser(user: User) {
    this.user.next(user);
  }

  /**
   * Called whenever a component would like to change the message on a snackbar
   * 
   * @param {MessageOutput} message The message to output (entity) 
   */
  public changeMessage(message: MessageOutput) {
    this.message.next(message);
  }

  /**
   * Called whenever the user wants to switch between the global and their playlists
   * 
   * @param {boolean} switchTo The value to switch to 
   */
  public changeUsingGlobalPlaylist(switchTo: boolean) {
    this.usingGlobalPlaylist.next(switchTo);
  }

  /**
   * Sets the current time of the song currently playing (used with global playlist)
   * 
   * @param {number} time The time to set the song to 
   */
  public setCurrentTime(time: number) {
    this.currentTime = time;
  }

  /**
   * Called when we logout, it clears all values on our subjects so that if we were to log back in, we wouldn't
   * have any unwanted side effects
   */
  public clearAllValues() {
    this.user.next(null);
    this.playlists.next(null);
    this.currentPlaylist.next(null);
    this.searchString.next(null);
    this.previewSong.next(null);
    this.message.next(null);
    this.nextSong.next(null);
    this.currentSong.next(null);
  }
}