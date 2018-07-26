/*
  Written by: Ryan Kruse
  This component controls the logic for the global playlist. It allows a user to vote on songs.
*/

import { Component, OnInit } from '@angular/core';

import { DataShareService, MessageService, StorageService } from '../services/services';

import { Message, VotedOn, SongStart } from '../interfaces/interfaces';

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

  /**
  * Connects the user to the signalR hub, gets the first song (currently playing), and gets all of the songs in the global playlist
  */
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

  /**
   * Called whenever a song is added or removed from the global playlist
   * It will get the first song in the playlist and start playing it for the user
   * 
   * @param {Message[]} messages The list of song in the global playlist 
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

  /**
   * Called to see if the uer has voted on a song or not. If the user has not voted
   * on the song it allows them to vote up or down on it
   * 
   * @param {number} id The id of the song to check
   * @returns If the user has voted on the given song or not
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

  /**
   * Called when the user clicks the upvote button. It adds +1 to the votes, if there are >= 3 votes
   * then we set its value to static => making it stay on the playlist until it is played
   * 
   * @param {Message} msg The song the user is voting up  
   */
  public upVote(msg: Message) {
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;

    msg.votes++;

    if (msg.votes >= this.maxVotes) {
      msg.isStatic = true;
      msg.votes = this.maxVotes;
    }

    this._storage.setValue("votedOn", this.hasVotedOn);
    this._msgService.patchSong(msg);
  }

  /**
   * Called when the user clicks the downvote button. It adds -1 to the votes, if there are <= -3 votes
   * then we remove it from the global playlist
   * 
   * @param {Message} msg The song the user is down voting 
   */
  public downVote(msg: Message) {
    let index: number = this.getVoteIndex(msg.globalPlaylistSongId);
    this.hasVotedOn[index].voted = true;
    msg.votes--;

    this._storage.setValue("votedOn", this.hasVotedOn);

    if (msg.votes <= -this.maxVotes) {
      this._msgService.deleteSong(msg);
    } else {
      this._msgService.patchSong(msg);
    }
  }

  /**
   * Called when we need to a a new vote item to our list (when a song is added 
   * or when we haven't voted on a song)
   * 
   * @param {number} id The id of the globalPlaylistSongID
   * @returns A new vote object 
   */
  private createNewVote(id: number): VotedOn {
    let newVote: VotedOn = {
      globalPlaylistSongId: id,
      voted: false
    };

    return newVote;
  }

  /**
   * Gets the index of a song in our hasVotedOn boolean array
   * @param {number} id The id of the globalPlaylistSong to get 
   * @returns The index of the global PlaylistSong in the hasVotedOn boolean array 
   */
  public getVoteIndex(id: number): number {
    return this.hasVotedOn.findIndex(x => x.globalPlaylistSongId === id);
  }

  /**
   * Called when the first person in the queue (on signalR) finishes their song
   * it will mvoe everyone connected to the next song in the global playlist
   */
  public nextSong() {
    if (!this._msgService.connection.first) return;

    if (this._msgService.storedSongs.length < 1) return;

    this._msgService.moveToNextSongAndResetHeartbeat();
  }

  /**
   * Called everytime we display a song on the DOM, it requests the video's thumbnail from youtube's api
   * and returns the url for the image
   * 
   * @param {strinng} url The URL of the youtube video
   * @returns The url of the video's thumbnail 
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

  /**
   * When we leave the page, disconnect from the hub
   */
  ngOnDestroy() {
    this._msgService.disconnectFromHub();
    this.alive = false;
  }
}
