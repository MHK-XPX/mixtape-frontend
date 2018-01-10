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
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private user: User;
  private playlists: Playlist[] = [];

  constructor(private _apiService: ApiService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe((data: { user: User }) => {
      this.user = data.user;
    });

    let s: Subscription = this._apiService.getAllEntities<Playlist>('Playlists/User/' + this.user.userId).subscribe(
      d => this.playlists = d,
      err => console.log("Unable to load playlists", err),
      () => s.unsubscribe()
    );
  }

}
