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

  @Input() user: User;
  
  @Output() toAdd: EventEmitter<Song> = new EventEmitter<Song>();

  private songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');
  private albums: Observable<Album[]> = this._apiService.getAllEntities<Album>('Albums');
  private artists: Observable<Artist[]> = this._apiService.getAllEntities<Artist>('Artists');

  constructor(private _apiService: ApiService) { }

  ngOnInit() {
  }

}
