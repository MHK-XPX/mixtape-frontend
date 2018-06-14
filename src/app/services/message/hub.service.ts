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

  /*
    This method is called when the user attempts to connect to the signalR hub.
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

  /*
    This method is called when the user disconnects from the signalR hub
  */
  public stopConnection(){
    this.hubConnection.stop();
    try{ //Since it is very hard for us to tell if we have a heartbeat, we simply try to unsub here
      this.s.unsubscribe();
    }catch{

    }

    this.placement.emit(null);
  }

  /*
    This method is called whenver we need to send a new list to all users
    @param message: Message[] - A list of messages to send to all users
  */
  public broadcastMessage(message: Message[]){
    this.allSongs.emit(message);
  }

  //Sends the newest version of a song that is updated
  public broadcastSongUpdate(message: Message){
    this.newSong.emit(message);
  }

  /*
    This method is called when the user connects to the signalR hub, it will tell them where 
    to start the song. 
    @param u: Connection - The connection to the signalR hub
  */
  public startSongAt(u: Connection){
    if(u.first){
      this.s = this.heartbeat.subscribe(resp => {
        this.hubConnection.invoke("GetHeartbeat", 1);
      });
    }
    this.placement.next(u);
  }

  /*
    This method is called from signalR to tell the user that they are now at the
    front of the queue and to start sending their heartbeat
  */
  public updateConnectionValue(u: Connection){
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

  //Tells the api to update a song and send it to everyone
  public invokeNextSongUpdate(messages: Message[]){
    this.hubConnection.invoke('NextSongUpdate', messages);
  }
}
