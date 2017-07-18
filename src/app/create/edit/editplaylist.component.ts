import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { UserService } from '../../user/user.service';

import { PlayList } from '../../playlist/playlist';
import { PlaylistSong } from '../../playlist/playlistsong';
import { Song } from '../../playlist/song'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';

@Component({
    selector: 'create-editplaylist',
    templateUrl: './editplaylist.component.html',
    styleUrls: [ './editplaylist.component.css' ]
})

export class EditPlayListComponent implements OnInit{
    playlists: PlayList[] = [];

    playlistSongs: Song[] = [];

    isEditing: boolean = false;
    playlistToEdit: number = -1;

    inputUrl: string = '';
    index: number;

    constructor(private _userService: UserService){}

    ngOnInit(){
        this.playlists = this._userService.getPlayLists();
    }

    //Below is pretty dirty, working on a fix using AsyncPipe
    private editClicked(playlist: PlayList, index: number): void{
        this.isEditing = !this.isEditing;
        this.playlistToEdit = playlist.playlistId;
    }

    //Not implemented
    private addLink(url: string){
        this.inputUrl = '';
    }

    //Not implemented
    private deleteClicked(index: number): void{
        
    }

    private backClicked(){
        this.isEditing = false;
    }

    private getUrlImage(index: number, url: string): string{
        let _img = '';
        _img = this._userService.getThumbnail(url);
        return _img;
    }
}