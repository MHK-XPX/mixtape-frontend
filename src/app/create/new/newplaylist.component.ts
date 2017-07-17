import { Component, OnInit } from '@angular/core';

import {ApiService } from '../../shared/api.service';
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

export class NewPlayListComponent implements OnInit{
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

    constructor(private _apiService: ApiService, private _userService: UserService){}

    ngOnInit(): void{
        //this.playListIndex = this._playlistService.createPlayList();
    }

    private createNewPlayList(): void{
        if(!this.createNew){
           // this.playListIndex = this._playlistService.createPlayList();
            this.createNew = true;
            this.inputName = '';
           // this._playlistService.createPlayList();
            
            //this.artists = this._playlistService.getAllArtists();
            /*this._apiService.getAllEntities('api/Playlists')
                .subscribe(playlists => this.playLists = playlists,
                            error => console.log("Unable to load playlists"),
                            () => this.createPlayListAfterLoad());*/
        }
    }

    private createPlayListAfterLoad(){
        let pID = this.playLists.length + 1;

        this.playList = {
            "playlistId": pID,
            "active": true,
            "name": "Playlist " + pID.toString(),
            "userId": this._userService.getUserID(),
            "playlistSong": [],
        }
    }

    private savePlayList(): void{
       // this._playlistService.savePlayList();
       let playListSong: PlaylistSong;
       for(let i=0; i<this.songs.length; i++){
           let song: Song = this.songs[i];

            playListSong = {
                "playlistSongId": null,
                "playlistId": this.playList.playlistId,
                "songId": song.songId,
                "playlist": null,
                "song": null
            }

            this.playList.playlistSong.push(playListSong);
       }
        this.createNew = false;
    }

    private addLink(name: string, url: string): void{
        //this._playlistService.addToPlayList(name, url);
        this.inputUrl = '';
        this.inputSongName = '';
    }

    private setName(name: string): void{
        //this._playlistService.setName(this.playListIndex, name);
    }

    private getUrlImage(index: number): string{
        let _img = '';
        //_img = this._playlistService.getPlayList(this.playListIndex).songs[index].imageURL;
        return _img;
    }

    private addSongToList(song: Song){
        //console.log(song.url);
        this.songs.push(song);
    }

    private loadArtists(){
       /* this._apiService.getAllEntities('api/Artists')
            .subscribe(artists => this.artists = artists,
                        error =>  console.log("Unable to load artists"),
                        () => console.log("LOADED ALL ARTISTS"));*/
    }

    private loadAlbums(artist: Artist){
        let albums: Album[];
       /* this._apiService.getAllEntities('api/Albums')
            .subscribe(album => albums = album,
            error => console.log("Unable to load albums"),
            () => this.filterAlbums(albums, artist));*/
    }

    private filterAlbums(albums: Album[], artist: Artist){
        let id = artist.artistId;
        for(let i=0; i<albums.length; i++){
            let a = albums[i];
            if(a.artistId === id){
                artist.album.push(a);
            }
        }
    }

    private loadSongs(album: Album){
        let songs: Song[];
       /* this._apiService.getAllEntities('api/Songs')
            .subscribe(song => songs = song,
            error => console.log("Unable to load songs"),
            () => this.filterSongs(songs, album));()*/
    }

    private filterSongs(songs: Song[], album: Album){
        let id = album.albumId;
        for(let i=0; i<songs.length; i++){
            let s = songs[i];
            if(s.albumId === id){
                album.song.push(s);
            }
        }
    }
}