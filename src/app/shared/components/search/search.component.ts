/*
  Written by: Ryan Kruse
  This component controls the song search feature
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  @Input() user: User; //When created, it takes a user as input (might be removed later)
  
  @Output() added: EventEmitter<Song> = new EventEmitter<Song>(); //Outputs a song to add on click

  private songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');
  private albums: Observable<Album[]> = this._apiService.getAllEntities<Album>('Albums');
  private artists: Observable<Artist[]> = this._apiService.getAllEntities<Artist>('Artists');

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }

  /*
    Called when the user selects a specifc song, it emits the song to any component listening to it
  */
  private addSong(s: Song){
    this.added.emit(s);
  }

}
