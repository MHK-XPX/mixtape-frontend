import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HubConnection } from '@aspnet/signalr';
import { environment } from '../../../environments/environment';
import { Message, GlobalPlaylistSong, Connection } from '../../interfaces/interfaces';
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

  public storedSongsSubject: Subject<Message[]> = new BehaviorSubject<Message[]>([]);
  public storedSongs: Message[] = [];

  constructor(private _http: HttpClient, private _hub: HubService, private _storage: StorageService, private _apiService: ApiService) {
    this._hub.placement.subscribe(res => this.updateConnection(res));

    this._hub.allSongs.subscribe(res => this.updateSongList(res));

    this._hub.newSong.subscribe(res => this.updateSongDetails(res));

    this._apiService.newSongPosted.subscribe(res => {
      this.getAllSongs(true);
    })
  }

  public getAllSongs(sendToAll?: boolean) {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._hub.setConnection();
    this._http.get<Message[]>(this.MESSAGE_URL, { headers }).subscribe(
      resp => {
        this.storedSongs = resp;
        if (sendToAll) this._hub.invokeListUpdate(resp);
        this.storedSongsSubject.next(this.storedSongs);
      },
      err => console.log("Unable to get all messages")
    );
  }

  public patchSong(msg: Message) {
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._http.patch<Message>(this.MESSAGE_URL, msg, { headers }).subscribe(
      resp => this._hub.invokeSongUpdate(resp),
      err => console.log("Unable to patch message")
    );
  }

  public deleteSong(msg: Message){
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );
    
    this._http.delete<Message[]>(this.MESSAGE_URL + '/' + msg.globalPlaylistSongId, { headers }).subscribe(
      resp => this._hub.invokeListUpdate(resp),
      err => console.log("unable to delete song", err)
    );
  }

  public moveToNextSongAndResetHeartbeat(){
    let headers: HttpHeaders = new HttpHeaders(
      { "Authorization": "Bearer " + this._storage.getValue("token") }
    );

    this._http.delete<Message[]>(this.MESSAGE_URL + '/' + this.storedSongs[0].globalPlaylistSongId, { headers }).subscribe(
      resp => this._hub.invokeNextSongUpdate(resp),
      err => console.log("unable to delete and move to next song", err)
    );
  }

  private updateConnection(connection: Connection) {
    this.connection = connection;
  }

  private updateSongList(msgs: Message[]){
    this.storedSongs = msgs;
    this.storedSongsSubject.next(this.storedSongs);
  }
  private updateSongDetails(msg: Message) {
    if (!msg) return;

    let index: number = this.storedSongs.findIndex(x => x.globalPlaylistSongId === msg.globalPlaylistSongId);
    this.storedSongs[index] = msg;
  }

  public disconnectFromHub() {
    this._hub.stopConnection();
    this.storedSongsSubject.next([]);
  }
}
