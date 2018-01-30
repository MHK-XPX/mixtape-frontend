import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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

  @Output() playlist: EventEmitter<Playlist> = new EventEmitter<Playlist>();
  /*@Input() user: User;
  @Input() userPlaylists: Playlist[];
  @Input() globalPlaylists: Playlist[];

  @Output() playlists: EventEmitter<Playlist[]> = new EventEmitter<Playlist[]>(); //[0] the playlist to view/edit, [1] the playlist to listen to, [2] the newly created playlist

  private editPlaylist: Playlist;
  private playPlaylist: Playlist;
  private createdPlaylist: Playlist;
*/
  
  constructor(private _apiService: ApiService, private _dataShareService: DataShareService) { }

  ngOnInit(){
    this._dataShareService.playlist.subscribe(res => this.userPlaylists = res);

    this._dataShareService.user.subscribe(res => this.user = res);

    let s: Subscription;
    s = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId).subscribe(
      d => this.userPlaylists = d,
      err => console.log("Unable to load playlists", err),
      () => { s.unsubscribe(); this._dataShareService.changePlaylist(this.userPlaylists); }
    )
  }

  ngOnChanges(){

  }

  ngAfterViewInit(){
 
  }

  selectPlaylist(p: Playlist){
    this.playlist.emit(p);
  }
  
  /*viewPlaylist(p: Playlist) {
    this.createdPlaylist = null;
    this.editPlaylist = p;
    this.emitPlaylists();
  }

  selectPlaylist(p: Playlist) {
    let s: Subscription = this._apiService.getSingleEntity<Playlist>("Playlists", p.playlistId).subscribe(
      data => this.playPlaylist = data,
      err => console.log("Unable to load playlist", err),
      () => {
        s.unsubscribe();
        this.emitPlaylists();
      }
    );
  }

  newPlaylist() {
    let s: Subscription;
    let name = "Playlist: " + (this.userPlaylists.length + 1);

    let p = {
      active: true,
      name: name,
      userId: this.user.userId,
    };

    //POST the playlist to the backend
    s = this._apiService.postEntity<Playlist>("Playlists", p).subscribe(
      d => this.createdPlaylist = d,
      err => console.log("Unable to create playlist", err),
      () => {
        s.unsubscribe();
        this.emitPlaylists();
      }
    );
  }

  private emitPlaylists() {
    let returnedPlaylists: Playlist[] = [];

    this.editPlaylist ? returnedPlaylists.push(this.editPlaylist) : returnedPlaylists.push(null);
    this.playPlaylist ? returnedPlaylists.push(this.playPlaylist) : returnedPlaylists.push(null);
    this.createdPlaylist ? returnedPlaylists.push(this.createdPlaylist) : returnedPlaylists.push(null);

    this.playlists.emit(returnedPlaylists);
  }
*/
}
