import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';

import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { MessageType } from '../shared/messagetype.enum';
import { MessageOutput } from '../interfaces/messageoutput';
import { IfObservable } from 'rxjs/observable/IfObservable';

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
        transition('show => *', animate('200ms')),
        transition('hide => show', animate('400ms')),
      ]
    )
  ]
})
export class SnackbarComponent implements OnInit {
  MessageType = MessageType;

  @Input() messageOut: MessageOutput;

  private _success = new Subject<MessageOutput>();

  successMessage: string;
  messageLevel: MessageType = MessageType.Notification;

  private hovering: boolean = false;
  constructor() { }

  ngOnInit() {
    //this._success.subscribe((out) => this.messageOut = out);
  }

  ngAfterViewInit(){
    debounceTime.call(this._success, 2000).subscribe(() => {
      if(!this.hovering) 
        this.messageOut = null
    });
  }

  ngOnChanges() {
    if (this.messageOut) {
      this.successMessage = this.messageOut.message;
      this.messageLevel = this.messageOut.level;

      this._success.next(this.messageOut);
    }
  }

  hoverToKeepMessage(keep: boolean) {
    this.hovering = keep;
    this._success.next(this.messageOut);
  }

}