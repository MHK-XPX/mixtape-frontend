/*
  Written by: Ryan Kruse
  This service controls our connection to the signalR hub on the api
*/
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection } from '@aspnet/signalr';
import { Subscription, interval } from 'rxjs';

// import * as signalR from '@aspnet/signalr';

import { Message, Connection } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  placement: EventEmitter<Connection> = new EventEmitter(null); //the user's placement in the queue

  allSongs: EventEmitter<Message[]> = new EventEmitter(true); //all of the songs

  newSong: EventEmitter<Message> = new EventEmitter(true); //the newest song sent

  private s: Subscription;

  private heartbeat = interval(1000); //1 second heartbeat
  
  private HUB_URL: string = environment.messageApi + 'messagehub';

  private hubConnection;

  constructor() { }

  /**
   * Called when the user attempts to connect to the signalR hub
   */
  public setConnection(){
    if (this.hubConnection == null){
      //this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.HUB_URL).build(); //change to this when updating to signalR 2.0
      this.hubConnection = new HubConnection(this.HUB_URL);
      this.hubConnection.on('broadcastMessage', (message) => this.broadcastMessage(message)); //Sent to all users
      this.hubConnection.on('updateSong', (message) => this.broadcastSongUpdate(message)); //Sent to all users
      this.hubConnection.on('startSongAt', (u) => this.startSongAt(u)); //called on connection
      this.hubConnection.on('setUserToFirst', (u) => this.updateConnectionValue(u)); //Called when the user moves to the front of the placement queue
    }

    if (this.hubConnection.connection.connectionState !== 1){
      this.hubConnection.start();
    }
  }

  /**
   * Called when the user disconnects from the signalR hub
   */
  public stopConnection(){
    this.hubConnection.stop();
    try{ //Since it is very hard for us to tell if we have a heartbeat, we simply try to unsub here
      this.s.unsubscribe();
    }catch{

    }

    this.placement.emit(null);
  }

  /**
   * Called whenever we need to send a new list to all users
   * 
   * @param {Message} message A list of messages to send to all users 
   */
  public broadcastMessage(message: Message[]){
    this.allSongs.emit(message);
  }

  /**
   * Called when a song is updated in signalR
   * 
   * @param {Message} message The new song to send out
   */
  public broadcastSongUpdate(message: Message){
    this.newSong.emit(message);
  }

  /**
   * Called when the user connects to the singalR hub, it will tell them where to start the song
   * 
   * @param {Connection} u The connection to the signalR hub 
   */
  public startSongAt(u: Connection){
    if(u.first){
      this.s = this.heartbeat.subscribe(resp => {
        this.hubConnection.invoke("GetHeartbeat", 1);
      });
    }
    this.placement.next(u);
  }

  /**
   * Called from signalR to tell the user that they are not at the front of the 
   * queue and to start sending their heartbeat
   * 
   * @param {Connection} u The connection to SignalR 
   */
  public updateConnectionValue(u: Connection){
    this.startSongAt(u);
  }

  /**
   * Tells the api to update a song for everyone
   * 
   * @param {Message} message The song to send to everyone 
   */
  public invokeSongUpdate(message: Message){
    this.hubConnection.invoke('Update', message);
  }


  /**
   * Tells the api to update a list of songs to everyone
   * 
   * @param {Message} messages A list of songs to send to everyone 
   */
  public invokeListUpdate(messages: Message[]){
    this.hubConnection.invoke('ListUpdate', messages);
  }

  //Tells the api to update a song and send it to everyone
  public invokeNextSongUpdate(messages: Message[]){
    this.hubConnection.invoke('NextSongUpdate', messages);
  }
}
