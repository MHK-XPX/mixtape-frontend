/*
  This component is 'the core' of the appilication. 
  The user can do the following in this component: Add a playlist or delete a playlist (Eventually name a playlist)
  This component controls:
    The top and left menus, the youtube player, and the visuals of the whole application
*/
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { Observable } from 'rxjs/Observable';

import { UserService } from './user/user.service';
import { StorageService } from './shared/session-storage.service';

import { PlayList } from './playlist/interfaces/playlist';
import { Song } from './playlist/interfaces/song'

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './shared/globalstyle.css']
})

export class AppComponent implements OnInit, OnDestroy {
  //Used to control the session storage subscription
  private _sub: Subscription;

  //Youtube control fields 
  private _playlist: PlayList = this._storage.getValue('_playlist');
  private _playlistName: string;
  private _songs: Song[] = [];
  private _videoId;
  private _url: string;
  private _onVideo: number = this._storage.getValue('_onVideo') ? this._storage.getValue('_onVideo') : 0;

  //Visual control fields 
  private _displayUserPlaylists: boolean = false;
  private _displayGlobalPlaylists: boolean = false;
  private _displayHistory: boolean = false;
  private _repeat: boolean = false;
  private _paused: boolean = false;
  private _playlistImgPath: string = "/app/assets/playlist";

  private _globalPlaylists: Observable<PlayList[]>;

  //Youtube fields
  private _player: YT.Player;
  private _width: number = window.innerWidth * .55;
  private _height: number = window.innerHeight * .55;

  constructor(private _userService: UserService, private _storage: StorageService, private _router: Router, private _ngZone: NgZone) { }

  ngOnInit() {
    this._globalPlaylists = this._userService.getAllEntities('api/Playlists');

    //This allows the youtube player resize when we resize the screen
    window.onresize = (e) => {
      this._ngZone.run(() => {
        this._width = window.innerWidth * .55;
        this._height = window.innerHeight * .55;
        this._player.setSize(this._width, this._height);
      });
    }

    //Updates our playlist whenever it is updated here or other components
    this._sub = this._storage.playlistObservable.subscribe(newestPlaylist => {
      this._playlist = newestPlaylist;
    });
  }

  /*
    This method is called when we click a list on the left menu of the screen, it shows/hides the list
    @param toEnable: string - Which list to enable (user, global, or history)
  */
  private showPlaylists(toEnable: string) {
    switch (toEnable) {
      case 'user':
        this._displayUserPlaylists = !this._displayUserPlaylists;
        break;
      case 'global':
        this._displayGlobalPlaylists = !this._displayGlobalPlaylists;
        break;
      case 'history':
        this._displayHistory = !this._displayHistory;
        break;
      default:
        console.log("Invalid");
    }
  }

  /*
    This method is called when we click the trashcan on a playlist, it deletes the playlist from the backend DB
    @param playlist: PlayList - The playlist to be removed
  */
  private deletePlaylist(playlist: PlayList): void {
    let p: PlayList[] = this._storage.getValue('_playlists');

    //Update the UI and storage
    for (let i = 0; i < p.length; i++) {
      if (p[i].playlistId === this._playlist.playlistId) {
        p.splice(i, 1);
        break;
      }
    }
    this._storage.setValue('_playlists', p);

    //Update current playlist and remove it from the database
    this._userService.removePlaylist(this._playlist, this._playlist.playlistId, 0);
    this._storage.setPlaylist('_playlist', null);

    //Go home
    this._router.navigate(['./home']);
  }

  /*
    Called when we select a playlist from the left side of the menu. We load it from the backend and display it on the screen
    @param playlist: PlayList - The playlist to load
    *If the playlist is null, then that means we are creating a new playlist *
  */
  private playlistSelected(playlist: PlayList) {
    //Show to menu to add songs
    this._router.navigate(['./playlist']);

    //If we want to create a new playlist, move to the page and return
    if (playlist === null) {
      //this._router.navigate(['./playlist/newplaylist']);
      this._storage.setPlaylist('_playlist', {});
      this._playlistName = 'New Playlist ' + this._storage.getValue('_playlists').length;

      let newPlaylist = {
        "active": true,
        "name": this._playlistName,
        "userId": this._userService.getUserID(),
        "playlistSong": []
      }

      this._playlist = this._userService.addPlaylist(newPlaylist);
      return;
    }

    //If we selected an already made playlist, load it
    let s: Subscription;
    let p: PlayList;

    s = this._userService.getSingleEntity('api/Playlists', playlist.playlistId).subscribe(
      data => p = data,
      err => console.log("Unable to load playlist"),
      () => {
        this._storage.setPlaylist('_playlist', p);
        this._playlistName = p.name;
        this.loadSongs(); //Need this so we can actually load songs on init (the html is too slow)
        this.startPlaylist();
        s.unsubscribe();
      }
    );
  }

  /*
    Called from html, this loads the songs from the current playlist into an array and returns it
  */
  private loadSongs(): Song[] {
    this._songs = []

    if (!this._playlist || this._playlist === {}) {
      return;
    }

    for (let i = 0; i < this._playlist.playlistSong.length; i++) {
      this._songs.push(this._playlist.playlistSong[i].song);
    }

    return this._songs;
  }

  /*
    Called when we click the trashcan on a song, it removes the song and updates the DB and UI
    @param song: Song - The song to remove
    @param index: number - The index of the song to remove (used for UI update)
  */
  private removeSong(song: Song, index: number): void {
    //Remove it from DB
    this._userService.removePlaylistSong(song, this._playlist, index);
    //Update it in session storage for easy visual update
    this._playlist.playlistSong.splice(index, 1);
    this._storage.setPlaylist('_playlist', this._playlist);
  }

  /*
    This is called once we fully loaded the selected playlist from the backend, it resets our video count
    sets our url and video ID and starts playing the playlist
  */
  private startPlaylist() {
    this._onVideo = 0;
    this._url = this._songs[0].url;
    this.parseId(this._url);

    if (this._player) this.playNext();
  }

  /*
    Called when we first load a playlist or when a song is done playing
  */
  private playNext() {
    //Used to keep our index if we refresh
    this._storage.setValue('_onVideo', this._onVideo);
    this._onVideo++;
    //If we havent reached the end we move to the next video
    if (this._onVideo <= this._songs.length && this._songs.length) {
      this._url = this._songs[this._onVideo - 1].url;
      this.parseId(this._url);
      this._player.loadVideoById(this._videoId, 0);
      this._player.playVideo();
    } else { //Otherwise if we are repeating, we start from the top
      if (this._repeat) {
        this._onVideo = 0;
        this.playNext();
      }
    }
  }

  /*
    Called when we click the back button on a song, moves our playing video back one
  */
  private playLast() {
    this._onVideo--;

    if (this._onVideo <= 0) {
      this._onVideo = this._songs.length;
    }

    this._url = this._songs[this._onVideo - 1].url;
    this.parseId(this._url);
    this._player.loadVideoById(this._videoId, 0);
    this._player.playVideo();
  }

  /*
    Called when we click the play or pause button, it pauses/plays the video
  */
  private pauseVideo() {
    if (this._paused) {
      this._player.playVideo();
    } else {
      this._player.pauseVideo();
    }
  }

  /*
    This is called every frame to update our progress bar for the song, it returns what % we are to done
    @return: number - The 'percent' of the video that is completed
  */
  private songProgress(): number {
    if (this._playlist && this._player) {
      let songLength = this._player.getDuration();
      let currentTime = this._player.getCurrentTime();
      return Math.ceil((currentTime / songLength) * 100);
    }
    return 0;
  }

  /*Not implemented yet!*/
  private editName() {
    
  }

  /*
    Gets the ID of the URL so we can use it in the embeded video player
  */
  private parseId(url: string) {
    if (url !== '') {
      var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (fixedUrl !== undefined) {
        this._videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
        this._videoId = this._videoId[0];
      } else {
        this._videoId = url;
      }
    }
  }

  /*
    This method is called when we load a playlist, it pulls the image from the youtube api,
    this makes it so we can make our list look "pretty." 
  */
  private getUrlImage(url: string): string {
    let _img = '';
    _img = this._userService.getThumbnail(url);
    return _img;
  }

  /*
    This method is a callback from the youtube iframe API, it is called once we have loaded the api.
    Its purpose is to create our player (which allows us to access the api) and it starts playing the
    next song on our playlist.
  */
  savePlayer(player) {
    this._player = player;
    this.playNext();
  }

  /*
    Called when soemthing changes our player state (ie we pause the video or it ends)
    -1 - not started
    0 - ended
    1 - playing
    2 - paused
    3 - loading
  */
  onStateChange(event) {
    switch (event.data) {
      case -1:
        break;
      case 0:
        this.addToHistory(this._songs[this._onVideo - 1]);
        this.playNext();
        break;
      case 1:
        this._paused = false;
        break;
      case 2:
        this._paused = true;
        break;
      case 3:
        break;
      default:
        console.log("DEFAULT");
    }
  }

  /*
    Uses '_history' to get array of songs that we listened all the way through
  */
  addToHistory(song: Song){
    let hist: Song[] = JSON.parse(localStorage.getItem('_history'));

    if(!hist){
      hist = [];
      hist.push(song);
      localStorage.setItem('_history', JSON.stringify(hist));
      return;
    }

    for(let i=0; i<hist.length; i++){
      let hs = hist[i];
      if(hs.songId === song.songId) return;
    }

    hist.push(song);
    localStorage.setItem('_history', JSON.stringify(hist));
  }

  getHistory(): Song[]{
    let hist: Song[] = JSON.parse(localStorage.getItem('_history'));

    return hist;
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
