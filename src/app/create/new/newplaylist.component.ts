import { Component } from '@angular/core';

import { UserService } from '../../user/user.service';

import { PlayList } from '../../playlist/playlist';
import { PlaylistSong } from '../../playlist/playlistsong';
import { Artist } from '../../playlist/artist';
import { Album } from '../../playlist/album';
import { Song } from '../../playlist/song';

@Component({
    selector: 'create-newplaylist',
    templateUrl: './newplaylist.component.html',
    styleUrls: [ './newplaylist.component.css' ]
})

export class NewPlayListComponent{
    playListIndex: number; //Used to allow default naming of Playlist n for unnamed playlists
    urls: any[]; //all of the urls in the playlist

    playLists: PlayList[];
    playList: PlayList;
    artists: Artist[];
    songs: Song[] = [];

    inputSongName: string = '';
    inputUrl: string = '';
    inputName: string = '';

    createNew: boolean = false; //If we are currently creating a playlist

    constructor(private _userService: UserService){}

    //NOT IMPLEMENTED YET
    private createNewPlayList(): void{
        
    }

    //NOT IMPLEMENTED YET
    private savePlayList(): void{
       
    }

    //NOT IMPLEMENTED YET
    private addLink(name: string, url: string): void{
        this.inputUrl = '';
        this.inputSongName = '';
    }

    //NOT IMPLEMENTED YET
    private setName(name: string): void{
    }

    private addSongToList(song: Song){
        this.songs.push(song);
    }
}