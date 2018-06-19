/*
  Written by: Ryan Kruse
  This component is used to show events by having a snackbar appear on the page with a message to notify the user of 
  the level of success of an event (IE "Playlist successfully deleted"). Interval changed how interval works which causes
  unknown side-effects to the snackbar. This will be rewritten later
*/

import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

import { Subject, Subscription, interval } from 'rxjs';

import { DataShareService } from '../services/services';

import { MessageType, MessageOutput } from '../interfaces/interfaces';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/takeWhile';

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
        transition('hide <=> show', animate('300ms')),
      ],
    )
  ]
})

export class SnackbarComponent implements OnInit {
  MessageType = MessageType;

  messageOut: MessageOutput;

  messageLevel: MessageType;

  messageToDisplay;

  private s: Subscription;
  private maxTime: number = 100;

  timer: number = this.maxTime;

  private hovering: boolean = false;
  private maxChars = 20;

  private interval = interval(30);

  constructor(private _dataShareService: DataShareService) { }

  ngOnInit() {
    this._dataShareService.message.subscribe(res => this.onMessageChange(res));
    // this.timer = this.maxTime;
  }

  /*
    This methood is called whenever the data service for the message is changed, it allows for us to display
    the snackbar messsage in the view
    @param message: MessageOutput - The message to display on screen
  */
  private onMessageChange(message: MessageOutput) {
    this.messageOut = message;

    if (this.messageOut) {
      this.timer = this.maxTime;

      let successMessage = this.messageOut.message;
      let action = this.messageOut.action;
      this.messageLevel = this.messageOut.level;

      if (successMessage.length <= 0) {
        this.messageToDisplay = action;
      } else {
        this.messageToDisplay = this.fixMessageString(successMessage) + action;
      }

      this.startTimer();
    }
  }

  /*
    This method is called once we display the message in the view. It reduces our local field timer that
    will reduce the progress bar on the snackbar. (This needs to be fixed due to the change of .interval)
  */
  private startTimer() {
    this.s = this.interval
    .takeWhile(() => this.timer > 0)
    .finally(() => {
      this.timer = this.maxTime;
      this.messageOut = null;
    })
    .subscribe(() => {
        if(!this.hovering) this.timer--;
      }
    );
  }

  /*
    This method is called when we need to reduce the size of our message string to make sure
    that the snackbar looks nice in the view
    @param message: string - The message to display (and fix)
  */
  public fixMessageString(message: string): string {
    message = message.trim();
    let tmp: string = "";

    let split: string[] = message.split(" ");

    //If our message is already smaller than the max char value or when we remove spaces it is smaller, we just return it
    if (message.length <= this.maxChars || message.length - split.length <= this.maxChars) return message + " ";

    if (split.length === 1)
      return split[0].substring(0, this.maxChars) + " ";

    //Otherwise we must loop to a while word closest to our maxChar value
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

  /*
    This method is called when the user hovers over the snackbar
    @param boolean - If we want to keep the snackbar on the screen or not
  */
  public hoverToKeepMessage(keep: boolean) {
    this.hovering = keep;
  }
}
