import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';

import { Subject, Subscription, Observable, interval } from 'rxjs';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { DataShareService } from '../services/services';

import { MessageType, MessageOutput } from '../interfaces/interfaces';

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

  private onMessageChange(message: MessageOutput){
    // console.log("message changed to: ", message);
    this.messageOut = message;

    if(this.messageOut){      
      // if(this.s && !this.s.closed) this.s.unsubscribe();

      this.timer = this.maxTime;

      let successMessage = this.messageOut.message;
      let action = this.messageOut.action;
       this.messageLevel = this.messageOut.level;

      if(successMessage.length <= 0){
        this.messageToDisplay = action;
      }else{
        this.messageToDisplay = this.fixMessageString(successMessage) + action;
      }

      this.startTimer();
    }
  }

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

  private startTimer() {
    // console.log("timer started!");
    try {
      this.s.unsubscribe();
    } catch (e) {

    }


    this.s = this.interval.subscribe(x => { //250, -10
      if (!this.hovering) this.timer--;

      if (this.timer <= 0) {
        // this.messageOut = null;
        this.s.unsubscribe();
        // console.log("timer done, unsub!");
        this.timer = this.maxTime;
        this.messageOut = null;
      }
    });
  }

  public hoverToKeepMessage(keep: boolean) {
    this.hovering = keep;
  }

}
