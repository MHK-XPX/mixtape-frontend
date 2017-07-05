import { Injectable } from '@angular/core';

import { PlayList } from './playlist';

@Injectable()
export class PlayListService{
    //Contains all of our created playlists
    playlists: PlayList[] = [];

    /*
        This method creates a new playlist and appends it to its own list
        @return number - the number of playlists created thus far 
    */
    public createPlayList(): number{
        var index = this.playlists.push(new PlayList()) - 1;
        this.playlists[index].setDefaultName(index);
        return index;
    }

    /*
        This method is called when we want to add a song to our playlist
        @param index: number - the index of the playlist we want to edit
        @param url: string - the url of the song we want to add
    */
    public addToPlayList(index: number, url: string): void{
        let pList = this.playlists[index];
        pList.addYouTubeLink(url);
    }

    /*
        This method is called when we set the name of our playlist
        @param index: number - the index of the playlist we want to edit
        @param name: string - the name we want to give to the playlist
    */
    public setName(index: number, name: string){
        this.playlists[index].setName(name);
    }

    /*
        I don't think this method is called anymore
        TODO: prepare for removal!
    */
    public updatePlayList(index: number, playList: PlayList): void{
        this.playlists[index] = playList;
    }

    /*
        This method is called when we need to save our playlist locally to read data from it so we don't have to constantly 
        index into our service.
        @param index: number - the index of the playlist we want to get
        @return: PlayList = a playlist element at the given index
    */
    public getPlayList(index: number): PlayList{
        return this.playlists[index];
    }

    /*
        This method returns all playlist created thus far
        @return: PlayList[] - an array of playlist elements created thus far
    */
    public getAllPlayLists(): PlayList[]{
        return this.playlists;
    }
}