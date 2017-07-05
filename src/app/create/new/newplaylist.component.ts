import { Component, OnInit } from '@angular/core';

import { PlayListService } from '../../playlist/playlist.service';

import { PlayList } from '../../playlist/playlist';

@Component({
    selector: 'create-newplaylist',
    templateUrl: './newplaylist.component.html',
    styleUrls: [ './newplaylist.component.css' ]
})

export class NewPlayListComponent implements OnInit{
    playListIndex: number; //Used to allow default naming of Playlist n for unnamed playlists
    urls: any[]; //all of the urls in the playlist

    playLists: PlayList[];

    inputUrl: string = '';
    inputName: string = '';

    createNew: boolean = false; //If we are currently creating a playlist

    constructor(private _playlistService: PlayListService){}

    ngOnInit(): void{
        //this.playListIndex = this._playlistService.createPlayList();
    }

    private createNewPlayList(): void{
        if(!this.createNew){
            this.playListIndex = this._playlistService.createPlayList();
            this.createNew = true;
            this.inputName = '';
        }
    }

    private savePlayList(): void{
        this.urls = [];
        this.createNew = false;
    }

    private getUrls(): any[]{
        this.urls   = this._playlistService.getPlayList(this.playListIndex).getAllYouTubeLinks();
        return this.urls;
    }

    private addLink(url: string): void{
        this._playlistService.addToPlayList(this.playListIndex, url);
        this.getUrls();
        this.inputUrl = '';
    }

    private setName(name: string): void{
        this._playlistService.setName(this.playListIndex, name);
    }

    private getUrlImage(index: number): string{
        let _img = '';
        _img = this._playlistService.getPlayList(this.playListIndex).songs[index].imageURL;
        return _img;
    }
}