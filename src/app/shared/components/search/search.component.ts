/*
  Written by: Ryan Kruse
  This component controls the song search feature
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { ApiService } from '../../../shared/api.service';

import { User } from '../../../interfaces/user';
import { Playlist } from '../../../interfaces/playlist';
import { Artist } from '../../../interfaces/artist';
import { Album } from '../../../interfaces/album';
import { Song } from '../../../interfaces/song';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger(
      'slideState', [
        state('full', style({
          width: '20%'
        })),
        state('buttonShrink', style({
          width: '0',
          visibility: 'hidden'
        })),
        transition('full => *', animate('300ms')),
        transition('buttonShrink => full', animate('300ms')),
      ]
    )
  ]
})

export class SearchComponent implements OnInit {

  @Input() user: User; //When created, it takes a user as input (might be removed later)
  @Input() playlist: Playlist;
  
  @Output() added: EventEmitter<Song> = new EventEmitter<Song>(); //Outputs a song to add on click

  private songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');
  private albums: Observable<Album[]> = this._apiService.getAllEntities<Album>('Albums');
  private artists: Observable<Artist[]> = this._apiService.getAllEntities<Artist>('Artists');

  selectedArtist: Artist = null;
  selectedArtistIndex: number = -1;

  selectedAlbum: Album = null;
  selectedAlbumIndex: number = -1;

  selectedSong: number = -1;

  searchString: string = "";
  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }

  private selectArtist(a: Artist){
    let s: Subscription;
    let newArt: Artist;

    if(this.selectedArtistIndex === a.artistId){
      this.selectedArtistIndex = -1;
      this.selectedAlbumIndex = -1;
      this.selectedSong = -1;
      return;
    }

    s = this._apiService.getSingleEntity<Artist>("Artists", a.artistId).subscribe(
      d => this.selectedArtist = d,
      err => console.log("Unable to find album", err),
      () => {
        this.selectedArtistIndex = this.selectedArtist.artistId;
        console.log(this.selectedArtist);
        s.unsubscribe();
      }
    );
  }

  private selectAlbum(a: Album){
    let s: Subscription;
    let newAlb: Album;

    if(this.selectedAlbumIndex === a.albumId){
      this.selectedAlbumIndex = -1;
      this.selectedSong = -1;
      return;
    }

    s = this._apiService.getSingleEntity<Album>("Albums", a.albumId).subscribe(
      d => newAlb = d,
      err => console.log("Unable to find album", err),
      () => {
        this.selectedAlbum = newAlb;
        this.selectedAlbumIndex = newAlb.albumId;
        s.unsubscribe();
      }
    );

  }

  /*
    Called when we click a list item. The method changes the selected song index that is used for animation
    when we click a list item (if we havent already) it either brings up or closes a "add" button
    @param s: Song - The list item clicked
  */
  private selectSong(s: Song){
    if(this.selectedSong === s.songId){
      this.selectedSong = -1;
      return;
    }
    this.selectedSong = s.songId;
  }

  /*
    Called when the user selects a specifc song, it emits the song to any component listening to it
  */
  private addSong(s: Song){
    //Only add songs to a playlist that the user owns (don't want them to edit global PLs)
    if(this.playlist.userId === this.user.userId){
      this.added.emit(s);
    }
  }
}
