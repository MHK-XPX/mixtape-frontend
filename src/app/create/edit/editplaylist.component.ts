import { Component, OnInit } from '@angular/core';

import { PlayListService } from '../../playlist/playlist.service';

import { PlayList } from '../../playlist/playlist';

@Component({
    selector: 'create-editplaylist',
    templateUrl: './editplaylist.component.html',
    styleUrls: [ './editplaylist.component.css' ]
})

export class EditPlayListComponent implements OnInit{
    playLists: PlayList[];
    playList: PlayList;

    isEditing: boolean = false;

    inputUrl: string = '';
    index: number;

    constructor(private _playlistService: PlayListService){}

    ngOnInit(){}

    private loadPlayLists(): void{
        this.playLists = this._playlistService.getAllPlayLists();
    }

    private editClicked(index: number): void{
        this.isEditing = !this.isEditing;

        this.playList = this._playlistService.getPlayList(index);
        this.index = index;
        //this.playList.getAllYouTubeLinks();
    }

    private addLink(url: string){
        this._playlistService.addToPlayList(this.index, url);
        this.inputUrl = '';
    }

    private deleteClicked(index: number): void{
        this.playList.deleteYouTubeLink(index);
    }

    private getUrlImage(index: number): string{
        let _img = '';
        _img = this.playList.songs[index].imageURL;
        return _img;
    }
}

/*
    TODO:
        1) Have the edit playlist display all of the current playlists with their name in a nice looking list
            at the bottom of each element in th elist will be a button to delete the playlist or to edit that one.
        2) Have the play button start playing from the selected playlist, once we click the button we should be taken to a screen that allows us to select from a playlist
            or we can have it load the screen and have a drop down bar that lets us select the playlist and store that value somewhere in the component and use that for 
            loading (the second idea I think is better, but I could be wrong)
        3) Once everything is working, try to make it look pretty and refactor so it isn't super shitty
        4) Maybe move somethings into their own module, this will make it much, much eaiser to pass everything and setup routing...I think
*/