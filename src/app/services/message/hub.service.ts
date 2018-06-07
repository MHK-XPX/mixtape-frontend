import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection } from '@aspnet/signalr';

import * as signalR from '@aspnet/signalr';

import { Message } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  allMessages: EventEmitter<Message> = new EventEmitter(true);

  newMessage: EventEmitter<Message> = new EventEmitter(true);
  
  private HUB_URL: string = environment.messageApi + 'messagehub';

  private hubConnection;

  constructor() { }

  public setConnection(){
    if (this.hubConnection == null){
      //this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.HUB_URL).build(); //change to this when updating to signalR 2.0
      this.hubConnection = new HubConnection(this.HUB_URL);
      this.hubConnection.on('broadcastMessage', (message) => this.broadcastMessage(message));
      this.hubConnection.on('updateSong', (message) => this.broadcastSongUpdate(message));
    }

    if (this.hubConnection.connection.connectionState !== 1){
      this.hubConnection.start();
    }
  }

  //Sends a new updated list of songs
  public broadcastMessage(message: Message){
    this.allMessages.emit(message);
  }

  //Sends the newest version of a song that is updated
  public broadcastSongUpdate(message: Message){
    this.newMessage.emit(message);
  }

  //Tells api to update a song for everyone
  public invokeSongUpdate(message: Message){
    this.hubConnection.invoke('Update', message);
  }

  //Tells api to update list of songs to everyone
  public invokeListUpdate(message: Message[]){
    this.hubConnection.invoke('ListUpdate', message);
  }
}
