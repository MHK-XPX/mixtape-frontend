import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from '../shared/api.service';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [
    trigger(
      'slideState', [
        state('full', style({
          width: '20%'
        })),
        state('buttonShrink', style({
          opacity: 0,
          width: '0',
        })),
        transition('full => *', animate('200ms')),
        transition('buttonShrink => full', animate('200ms')),
      ]
    )
  ]
})
export class EditComponent implements OnInit {

  private user: User;
  private playlists: Playlist[] = [];

  selectedPlaylist: Playlist;

  selectedArtist: Artist;
  selectedAlbum: Album;
  selectedSong: number;
  deletedSong: number;

  artists: Observable<Artist[]>;
  albums: Observable<Album[]>;
  songs: Observable<Song[]>;

  constructor(private _apiService: ApiService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe((data: { user: User }) => {
      this.user = data.user;
    });

    this.artists = this._apiService.getAllEntities<Artist>("Artists");
    this.albums = this._apiService.getAllEntities<Album>("Albums");
    this.songs = this._apiService.getAllEntities<Song>("Songs");

    let s: Subscription = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId).subscribe(
      d => this.playlists = d,
      err => console.log("Unable to load playlists", err),
      () => s.unsubscribe()
    );
  }

  selectPlaylist(p: Playlist){
    if(this.selectedPlaylist === null || this.selectedPlaylist === undefined){
      this.selectedPlaylist = p;
      return;
    }

    if(this.selectedPlaylist.playlistId === p.playlistId){
      this.selectedPlaylist = null;
      return;
    }

    this.selectedPlaylist = p;
  }

  selectArtist(a: Artist){
    this.selectedAlbum = null;
    this.selectedSong = -1;

    if(this.selectedArtist === null || this.selectedArtist === undefined){
      this.selectedArtist = a;
      return;
    }

    if(this.selectedArtist.artistId === a.artistId){
      this.selectedArtist = null;
      return;
    }

    this.selectedArtist = a;
  }

  selectAlbum(alb: Album){
    this.selectedSong = -1;
    if(this.selectedAlbum === null || this.selectedAlbum === undefined){
      this.selectedAlbum = alb;
      return;
    }

    if(this.selectedAlbum.albumId === alb.albumId){
      this.selectedAlbum = null;
      return;
    }

    this.selectedAlbum = alb;
  }

  selectSong(s: Song){
    if(this.selectedSong === s.songId){
      this.selectedSong = -1;
      return;
    }
    this.selectedSong = s.songId;
  }

  selectSongToDelete(s: Song){
    if(this.deletedSong === s.songId){
      this.deletedSong = -1;
      return;
    }
    this.deletedSong = s.songId;
  }

  addSong(s: Song){
    console.log(s);
  }

  deleteSong(pls: PlaylistSong, index: number){
    console.log(pls);
  }

}
