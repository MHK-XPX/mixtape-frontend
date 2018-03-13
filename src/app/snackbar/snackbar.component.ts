/*
  Written by: Ryan Kruse
  This component is used to display messages to the user (toasters) when the perform a tranaction with the database.
  For example:
    When the user clicks the new playlist button, if it is sucessful, the screen will show a green box saying "Playlist Created!"
*/
import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';

import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { MessageType } from '../shared/messagetype.enum';
import { MessageOutput } from '../interfaces/messageoutput';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  animations: [
    trigger(
      'showState', [
        state('show', style({
          opacity: 1,
          visibility: 'visible'
        })),
        state('hide', style({
          opacity: 0,
          visibility: 'hidden'
        })),
        transition('hide <=> show', animate('400ms')),
      ],
    )
  ]
})
export class SnackbarComponent implements OnInit {
  MessageType = MessageType;

  @Input() messageOut: MessageOutput;

  messageLevel: MessageType = MessageType.Notification;

  messageToDisplay;

  private maxTime: number = 100;

  timer: number = this.maxTime;

  private hovering: boolean = false;
  private maxChars = 20;

  constructor() { }

  ngOnInit() {
    //this._success.subscribe((out) => this.messageOut = out);

  }

  ngOnChanges() {
    if (this.messageOut) {
      this.timer = this.maxTime;

      let successMessage = this.messageOut.message;
      let action = this.messageOut.action;
      this.messageLevel = this.messageOut.level;

      //Some messages don't have a message (I.E. Information Updated), but rather just an action, if so, we should only display that
      if (successMessage.length <= 0) {
        this.messageToDisplay = action;
      } else {
        this.messageToDisplay = this.getGoodMessageString(successMessage) + action;
      }

      this.startTimer(); //Start the timer for the toaster
    }
  }

  /*
    This method is called to see if the user is hovering over the toaster,
    if the are, we leave it there until they leave
  */
  hoverToKeepMessage(keep: boolean) {
    this.hovering = keep;
  }

  private startTimer() {
    let s: Subscription = Observable.interval(20).subscribe(x => {
      if (!this.hovering)
        this.timer--;

      if (this.timer < 0) {
        this.messageOut = null;
        s.unsubscribe(); //Must unsub or the interval will increase in time
      }
    });
  }

  /*
    This method is called everytime we need to display a message AND action.
    The method will split the message into words and return the words UP TO
    our max char value (I did it this way, because I didn't want to return half a word)
    @param message: string - The message to split
    @return string - The message with the words split to the maxChar value (whole words only)
  */
  private getGoodMessageString(message: string): string {
    message = message.trim();
    let tmp: string = "";

    let split: string[] = message.split(" ");

    //If our message is already smaller than maxChar or when we remove the spaces it is smaller we can just return it
    if (message.length <= this.maxChars || message.length - split.length <= this.maxChars)
      return message + " ";

    //If we only have one word, we can return it to the maxChar value
    if (split.length == 1)
      return split[0].substring(0, this.maxChars) + " ";

    //Otherwise we must loop to a whole word closest to our maxChar value
    let count: number = 0;
    let cutOff: number = 0;

    for (let i = 0; i < split.length; i++) {
      count += split[i].length;

      if (count > this.maxChars) {
        cutOff = i - 1;
        break;
      }

      cutOff++;
    }

    //Setup the message to return
    for (let i = 0; i < cutOff; i++) {
      if (i + 1 !== cutOff)
        tmp += split[i] + " ";
      else
        tmp += split[i] + "...";
    }

    return tmp;
  }

}
