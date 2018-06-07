/*
  TODO:
    1) Hash out the rest of the signalR stuff, it is written very poorly and greatly needs to be refactored
    2) Add the youtube part of it (without controls)
    3) Figure out logic on how to start the next video 
    4) Finish the UI
*/

import { Component, OnInit } from '@angular/core';

import { MessageService, StorageService } from '../services/services';

import { Message, VotedOn } from '../interfaces/interfaces';

@Component({
  selector: 'app-global-youtube',
  templateUrl: './global-youtube.component.html',
  styleUrls: ['./global-youtube.component.css', '../global-style.css']
})

export class GlobalYoutubeComponent implements OnInit {

  private messages: Message[] = [];
  private hasVotedOn: VotedOn[] = this._storage.getValue("votedOn") || [];

  private maxVotes: number = 3;

  constructor(private _msgService: MessageService, private _storage: StorageService) { }

  ngOnInit() {
    this._msgService.getMessages();

    if (!this.hasVotedOn.length) {
      this._storage.setValue("votedOn", new Array());
    }
  }

  public upVote(msg: Message) {
    msg.votes++;
    this.voteOn(msg.globalPlaylistSongId);
    if (msg.votes >= this.maxVotes) {
      msg.isStatic = true;
      msg.votes = this.maxVotes;
    } else {
      msg.isStatic = false;
    }

    this._msgService.patchMessage(msg);
  }

  public downVote(msg: Message) {
    msg.votes--;
    this.voteOn(msg.globalPlaylistSongId);

    if (msg.votes <= -this.maxVotes) {
      this._msgService.deleteMessage(msg);
      return;
    }

    this._msgService.patchMessage(msg);
  }

  private checkHasVotedOn(id: number): boolean {
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

  private createNewVote(id): VotedOn {
    let newVote: VotedOn = {
      globalPlaylistSongId: id,
      voted: false
    };

    return newVote;
  }

  private voteOn(id: number) {
    let index = this.hasVotedOn.findIndex(x => x.globalPlaylistSongId === id);

    this.hasVotedOn[index].voted = true;

    this._storage.setValue("votedOn", this.hasVotedOn);
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

  /*
   This method is called so we can set the youtube player to 65% of our current height
  */
  public getScreenHeight(): number {
    return window.screen.height * .35;
  }

  /*
    This method is called so we can set the youtube player to 45% of our width
  */
  public getScreenWidth(): number {
    return window.screen.width * .40;
  }

}
