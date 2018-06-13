/*
  1) Make it so when the user gets connected it starts playing with the first connected's heartbeat
  2) Also fix the bug where it has an error when switching between global and user playlist
  3) Double check the heartbeat stuff!
*/
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection } from '@aspnet/signalr';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../session/session-storage.service';
import { Subscription, interval } from 'rxjs';

// import * as signalR from '@aspnet/signalr';

import { Message, Connection } from '../../interfaces/interfaces';
import { DataShareService } from '../data/data-share.service';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  placement: EventEmitter<Connection> = new EventEmitter(null); //the user's placement in the queue

  allSongs: EventEmitter<Message[]> = new EventEmitter(true); //all of the messages

  newSong: EventEmitter<Message> = new EventEmitter(true); //the newest message sent

  private s: Subscription;

  private heartbeat = interval(1000); //1 second?
  
  private HUB_URL: string = environment.messageApi + 'messagehub';

  private hubConnection;

  constructor(private _storage: StorageService, private _dataShareService: DataShareService) { }

  public setConnection(){
    if (this.hubConnection == null){
      //this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.HUB_URL).build(); //change to this when updating to signalR 2.0
      this.hubConnection = new HubConnection(this.HUB_URL);
      this.hubConnection.on('broadcastMessage', (message) => this.broadcastMessage(message));
      this.hubConnection.on('updateSong', (message) => this.broadcastSongUpdate(message));
      this.hubConnection.on('startSongAt', (u) => this.startSongAt(u)); //called on connection
      this.hubConnection.on('setUserToFirst', (u) => this.updateConnectionValue(u));
    }

    if (this.hubConnection.connection.connectionState !== 1){
      this.hubConnection.start();
    }
  }

  public stopConnection(){
    this.hubConnection.stop();
    
    try{ //Since it is very hard for us to tell if we have a heartbeat, we simply try to unsub here
      this.s.unsubscribe();
    }catch{

    }
  }

  //Sends a new updated list of songs
  public broadcastMessage(message: Message[]){
    this.allSongs.emit(message);
  }

  //Sends the newest version of a song that is updated
  public broadcastSongUpdate(message: Message){
    this.newSong.emit(message);
  }

  public startSongAt(u: Connection){
    if(u.first){
      this.s = this.heartbeat.subscribe(resp => {
        this.hubConnection.invoke("GetHeartbeat", 1);
      });
    }
    this.placement.next(u);
  }

  /*
    Called fron SR when the user gets set to the first of 
    the queue. They need to send their heartbeat so that other users know where to 
    start their videos
  */
  public updateConnectionValue(u: Connection){
    // this.placement.next(u);
    this.startSongAt(u);
  }

  //Tells api to update a song for everyone
  public invokeSongUpdate(message: Message){
    this.hubConnection.invoke('Update', message);
  }

  //Tells api to update list of songs to everyone
  public invokeListUpdate(messages: Message[]){
    this.hubConnection.invoke('ListUpdate', messages);
  }

  public invokeNextSongUpdate(messages: Message[]){
    this.hubConnection.invoke('NextSongUpdate', messages);
  }
}
