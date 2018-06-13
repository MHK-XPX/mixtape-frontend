/*
  TODO:
    1) Hash out the rest of the signalR stuff, it is written very poorly and greatly needs to be refactored
    2) Add the youtube part of it (without controls)
    3) Figure out logic on how to start the next video 
    4) Finish the UI
*/

import { Component, OnInit } from '@angular/core';

import { DataShareService, MessageService, StorageService } from '../services/services';

import { Message, VotedOn, SongStart } from '../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-playlist',
  templateUrl: './global-playlist.component.html',
  styleUrls: ['./global-playlist.component.css', '../global-style.css']
})

export class GlobalPlaylistComponent implements OnInit { //songUrl += "?controls=0&showinfo=0";
  private s: Subscription;

  private hasVotedOn: VotedOn[] = this._storage.getValue("votedOn") || [];

  private maxVotes: number = 3;

  onSong: number = 0;

  private lastPlayedID: number = null;
  constructor(private _msgService: MessageService, private _storage: StorageService, private _dataShareService: DataShareService) { }

  ngOnInit() {
    this.s = this._msgService.storedSongsSubject.subscribe(resp => this.getFirstSongURL(resp));
    this._msgService.getAllSongs();

    if (!this.hasVotedOn.length) {
      this._storage.setValue("votedOn", new Array());
    }
  }

  public checkHasVotedOn(id: number): boolean {
    this.hasVotedOn = this._storage.getValue("votedOn") || [];

    if (!this.hasVotedOn.length) {
      this.hasVotedOn.push(this.createNewVote(id));

      this._storage.setValue("votedOn", this.hasVotedOn);

      return false;
    } else {
      let index: number = this.hasVotedOn.findIndex(x => x.globalPlaylistSongId === id);

      if (index >= 0) {
        return this.hasVotedOn[index].voted;
      } else {
        this.hasVotedOn.push(this.createNewVote(id));
        this._storage.setValue("votedOn", this.hasVotedOn);
        return false;
      }
    }
  }

  public upVote(msg: Message){
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;
    msg.votes++;

    if(msg.votes >= 3){
      msg.isStatic = true;
      msg.votes = 3;
    }

    this._msgService.patchSong(msg);
  }

  public downVote(msg: Message){
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;
    msg.votes--;

    if(msg.votes <= -3){
      this._msgService.deleteSong(msg);
    }else{
      this._msgService.patchSong(msg);
    }
  }

  private createNewVote(id): VotedOn {
    let newVote: VotedOn = {
      globalPlaylistSongId: id,
      voted: false
    };

    return newVote;
  }

  public getVoteIndex(id: number): number{
    return this.hasVotedOn.findIndex(x => x.globalPlaylistSongId === id);    
  }

  public nextSong() {
    if (!this._msgService.connection.first) return;

    if(this._msgService.storedSongs.length < 1) return;

    this._msgService.moveToNextSongAndResetHeartbeat();
  }

  private getFirstSongURL(messages: Message[]){
    if (!messages || !messages.length) return;
    this.onSong = 0;

    if(this.lastPlayedID === null || this.lastPlayedID !== messages[0].globalPlaylistSongId){
      let ss: SongStart = {
        url: messages[0].song.url,
        time: this._msgService.connection && this.lastPlayedID === null ? this._msgService.connection.time : 0
      };
      
      this.lastPlayedID = messages[0].globalPlaylistSongId;
      this._dataShareService.nextSong.next(ss);
    }
  }

  /*
    This method is called everytime we display a song on the DOM, it requests the thumbnail saved via youtube's api
    and returns the source string to load the image from
    @Input url: string - The video url to get the thumbnail for
    @Output string - The thumbnail source link from the youtube api
  */
  private getThumbnail(url: string): string {
    var prefixImgUrl: string = "https://img.youtube.com/vi/";
    var suffixImgUrl: string = "/default.jpg";
    var ID;
    var imgURL: string = '';
    //Pull the video ID from the link so we can embed the video
    if (url !== '') {
      var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (fixedUrl !== undefined) {
        ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      } else {
        ID = url;
      }
      imgURL = prefixImgUrl + ID + suffixImgUrl;
    }
    return imgURL;
  }

  ngOnDestroy() {
    this._msgService.disconnectFromHub();
    this.s.unsubscribe();
  }
}
