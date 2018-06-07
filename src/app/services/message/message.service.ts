import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HubConnection } from '@aspnet/signalr';
import { environment } from '../../../environments/environment';
import { Message, GlobalPlaylistSong } from '../../interfaces/interfaces';
import { Subject, BehaviorSubject } from 'rxjs';
import { HubService } from '../message/hub.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  isLoading: EventEmitter<boolean> = new EventEmitter(true);

  private MESSAGE_URL = environment.api + 'messages';

  public storedSongsSubject: Subject<Message[]> = new BehaviorSubject<Message[]>([]);
  public storedSongs: Message[] = []; //Holds a list of all song
  
  public lastUpdated: Subject<Message> = new BehaviorSubject<Message>(null); //Holds the last updated song (NOT USED??)

  constructor(private _http: HttpClient, private _hub: HubService) {
    this._hub.allMessages.subscribe(
      message => {
        this.storedSongs = message;
        this.storedSongsSubject.next(this.storedSongs);
      }
    );

    this._hub.newMessage.subscribe(
      msg => this.updateSpecificSong(msg)
    );
  }


  /*
    This will return a list of all G-PL songs from the database, if the sendToAll param is true, then we will send the updated list to everyone
  */
  public getMessages(sendToAll?: boolean) {
    let headers: HttpHeaders = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );

    this._hub.setConnection();
    this.isLoading.emit(true);
    this._http.get<Message[]>(this.MESSAGE_URL, { headers }).subscribe(
      resp => {
        this.isLoading.emit(false);
        this.storedSongs = resp;
        this.storedSongsSubject.next(this.storedSongs);
        // this.messageSubject.next(resp);
        if(sendToAll) this._hub.invokeListUpdate(resp);
      },
      err => console.log("UNABLE TO GET MESSAGES")
    );
  }


  public patchMessage(message: Message) {
    let headers: HttpHeaders = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );
    this.isLoading.emit(true);
    this._http.patch<Message>(this.MESSAGE_URL, message, { headers }).subscribe(
      resp => {
        this.isLoading.emit(false);
        this._hub.invokeSongUpdate(resp);
      },
      err => console.log("Unable to patch message")
    );
  }

  public postSong(gpls: any){
    let headers: HttpHeaders = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );
    this.isLoading.emit(true);
    this._http.post<GlobalPlaylistSong>(environment.api + "GlobalPlaylistSongs", gpls, { headers }).subscribe(
      resp => this.isLoading.emit(false),
      err => console.log("unable to post", err),
      () => {
        this.getMessages(true);
      }
    );
  }

  public deleteMessage(message: Message){
    let headers: HttpHeaders = new HttpHeaders(
      { 'Content-Type': 'application/json' }
    );
    this.isLoading.emit(true);
    this._http.delete<Message[]>(this.MESSAGE_URL + '/' + message.globalPlaylistSongId, { headers }).subscribe(
      resp => {
        this.isLoading.emit(false);
        this._hub.invokeListUpdate(resp);
        // this.getMessages();
      },
      err => console.log("error on delete", err)
    );
  }

  private updateSpecificSong(msg: Message){
    let index: number = this.storedSongs.findIndex(x => x.globalPlaylistSongId === msg.globalPlaylistSongId);
    console.log(msg);
    this.storedSongs[index] = msg;
  }

}
