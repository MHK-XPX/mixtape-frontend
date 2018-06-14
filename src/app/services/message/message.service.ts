/*
  TODO:
    Fix the song start on connection thing, it isn't working
      we are getting the values, but we are not actually starting the song at the given value
*/

/*
  Written by: Ryan Kruse
  This service is used to handle all of the information sent to and from the hub service
  It holds all of the songs, the most recent song, and our connection object
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message, Connection } from '../../interfaces/interfaces';
import { Subject, BehaviorSubject } from 'rxjs';
import { HubService } from '../message/hub.service';
import { StorageService } from '../session/session-storage.service';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private MESSAGE_URL = environment.api + 'messages';

  public connection: Connection; //Given when we connect to the hub
  public connectionSubject: Subject<Connection> = new BehaviorSubject<Connection>(null);

  public storedSongsSubject: Subject<Message[]> = new BehaviorSubject<Message[]>([]);
  public storedSongs: Message[] = [];

  constructor(private _http: HttpClient, private _hub: HubService, private _storage: StorageService, private _apiService: ApiService) {
    this._hub.placement.subscribe(res => this.updateConnection(res));

    this._hub.allSongs.subscribe(res => this.updateSongList(res));

    this._hub.newSong.subscribe(res => this.updateSongDetails(res));

    this._apiService.newSongPosted.subscribe(res => this.getAllSongs(true));
  }

  public setConnection(){
    this._hub.setConnection();
  }

  /*
    This method is called whenever the list of all songs is updated
    @param sendToAll: boolean - If we should send the updated song list to all users
  */
  public getAllSongs(sendToAll?: boolean) {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._http.get<Message[]>(this.MESSAGE_URL, { headers }).subscribe(
      resp => {
        this.storedSongs = resp;
        if (sendToAll) this._hub.invokeListUpdate(resp);
        this.storedSongsSubject.next(this.storedSongs);
      },
      err => console.log("Unable to get all messages")
    );
  }

  /*
    This method is called when the user votes on a song. It calls the patch method on the api
    @msg: Message - The message with patched values
  */
  public patchSong(msg: Message) {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._http.patch<Message>(this.MESSAGE_URL, msg, { headers }).subscribe(
      resp => this._hub.invokeSongUpdate(resp),
      err => console.log("Unable to patch message")
    );
  }

  /*
    This method is called when we delete a song from the list
    @param msg: Message - The song to remove from the list
  */
  public deleteSong(msg: Message){
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );
    
    this._http.delete<Message[]>(this.MESSAGE_URL + '/' + msg.globalPlaylistSongId, { headers }).subscribe(
      resp => this._hub.invokeListUpdate(resp),
      err => console.log("unable to delete song", err)
    );
  }

  /*
    This method is called when we finish a song and need to remove it from the list.
    It removes it and resets the persons heartbeat back to 0
  */
  public moveToNextSongAndResetHeartbeat(){
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._http.delete<Message[]>(this.MESSAGE_URL + '/' + this.storedSongs[0].globalPlaylistSongId, { headers }).subscribe(
      resp => this._hub.invokeNextSongUpdate(resp),
      err => console.log("unable to delete and move to next song", err)
    );
  }

  /*
    This method is called when the users connection gets updated or set
    @param connection: Connection - The connection to set our to
  */
  private updateConnection(connection: Connection) {
    this.connection = connection;
    this.connectionSubject.next(this.connection);
  }

  /*
    This method is called is whenever the list of songs is updated
    @param msgs: Message[] - The list of songs to set 
  */
  private updateSongList(msgs: Message[]){
    this.storedSongs = msgs;
    this.storedSongsSubject.next(this.storedSongs);
  }

  /*
    This methods is called whenever a song is updated, it updates the song at its given index
    in the list of all songs
    @param msg: Message - The updated song
  */
  private updateSongDetails(msg: Message) {
    if (!msg) return;

    let index: number = this.storedSongs.findIndex(x => x.globalPlaylistSongId === msg.globalPlaylistSongId);
    this.storedSongs[index] = msg;
  }

  /*
    This method is called when we discconnect from the hub, it stops the connection and
    clears our list of songs
  */
  public disconnectFromHub() {
    this._hub.stopConnection();
    this.storedSongsSubject.next([]);
  }
}
