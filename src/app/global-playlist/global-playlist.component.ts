/*
  Written by: Ryan Kruse
  This component controls the logic for the global playlist. It allows a user to vote on songs.
*/

import { Component, OnInit } from '@angular/core';

import { DataShareService, MessageService, StorageService } from '../services/services';

import { Message, VotedOn, SongStart, Connection } from '../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-playlist',
  templateUrl: './global-playlist.component.html',
  styleUrls: ['./global-playlist.component.css', '../global-style.css']
})

export class GlobalPlaylistComponent implements OnInit {
  private alive: boolean = true;

  private hasVotedOn: VotedOn[] = this._storage.getValue("votedOn") || [];

  private maxVotes: number = 3;

  onSong: number = 0;

  private lastPlayedID: number = null;

  constructor(public _msgService: MessageService, private _storage: StorageService, private _dataShareService: DataShareService) { }

  ngOnInit() {
    this._msgService.setConnection();

    this._msgService.storedSongsSubject
      .takeWhile(() => this.alive)
      .subscribe(resp => this.getFirstSongURL(resp));

    this._msgService.connectionSubject
      .takeWhile(() => this.alive)
      .subscribe(resp => this._msgService.getAllSongs());

    if (!this.hasVotedOn.length) {
      this._storage.setValue("votedOn", new Array());
    }
  }

  /*
    This method is called whenever a song is added or removed from the global playlist
    It will get the first song in the playlist and start playing it for the user
    @param messages: Message[] - The list of songs in the global playlist
  */
  private getFirstSongURL(messages: Message[]) {
    if (!messages || !messages.length || this._msgService.connection === null || this._msgService.connection === undefined) return;
    this.onSong = 0;

    if (this.lastPlayedID === null || this.lastPlayedID !== messages[0].globalPlaylistSongId) {
      let ss: SongStart = {
        url: messages[0].song.url,
        time: this._msgService.connection && this.lastPlayedID === null ? this._msgService.connection.time : 0
      };

      this.lastPlayedID = messages[0].globalPlaylistSongId;
      this._dataShareService.nextSong.next(ss);
    }
  }

  /*
    This method is called to see if we have voted on a song or not
    If we haven't voted then it allows us to vote up or down on a song
    @param id: number - The id of the song to check
    @return boolean - if we have voted on the given song or not
  */
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

  /*
    This method is called when the user clicks the upvote button
    It adds +1 to the votes, if the votes are >= 3 then we
    set its value to static meaning that it will stay on the playlist 
    until it is played
    @param msg: Message - The song we are voting up
  */
  public upVote(msg: Message) {
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;
    msg.votes++;

    if (msg.votes >= this.maxVotes) {
      msg.isStatic = true;
      msg.votes = this.maxVotes;
    }

    this._msgService.patchSong(msg);
  }

  /*
    This method is called when the user clicks the downvote button
    It adds -1 to the votes, if the votes are <= -3 then it removes it
    from the list, otherwise it goes down a value
    @param msg: Message - The song we are voting down
  */
  public downVote(msg: Message) {
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;
    msg.votes--;

    if (msg.votes <= -this.maxVotes) {
      this._msgService.deleteSong(msg);
    } else {
      this._msgService.patchSong(msg);
    }
  }

  /*
    This method is called when we need to add a new vote item to our list
    (IE when a song is added or when we havent voted on a song)
    @param id: number - The id of the globalPlaylistSongID
    @return VotedOn - A new vote object
  */
  private createNewVote(id: number): VotedOn {
    let newVote: VotedOn = {
      globalPlaylistSongId: id,
      voted: false
    };

    return newVote;
  }

  /*
    This method returns the index of a song in our hasVotedOn boolean array
  */
  public getVoteIndex(id: number): number {
    return this.hasVotedOn.findIndex(x => x.globalPlaylistSongId === id);
  }

  /*
    This method is called when the person in the front of the queue (on the api) finishes 
    their song, it will move everyone to the next song on the global playlist
  */
  public nextSong() {
    if (!this._msgService.connection.first) return;

    if (this._msgService.storedSongs.length < 1) return;

    this._msgService.moveToNextSongAndResetHeartbeat();
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
    this.alive = false;
  }
}
