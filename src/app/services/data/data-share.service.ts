import { Injectable, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { User, Playlist, Song, MessageType, MessageOutput } from '../../interfaces/interfaces';

@Injectable()
export class DataShareService{
    
    public user: Subject<User> = new BehaviorSubject<User>(null);

    public playlists: Subject<Playlist[]> = new BehaviorSubject<Playlist[]>([]);
    public currentPlaylist: Subject<Playlist> = new BehaviorSubject<Playlist>(null);

    public searchString: Subject<string> = new BehaviorSubject<string>(null);

    public previewSong: Subject<Song> = new BehaviorSubject<Song>(null);

    public message: Subject<MessageOutput> = new BehaviorSubject<MessageOutput>(null);

    constructor() {}

    public changePlaylists(playlists: Playlist[]){
        this.playlists.next(playlists);
    }

    public changeCurrentPlaylist(playlist: Playlist){
        this.currentPlaylist.next(playlist);
    }

    public changeSearchString(search: string){
        this.searchString.next(search);
    }

    public changePreviewSong(song: Song){
        this.previewSong.next(song);
    }

    public changeUser(user: User){
        this.user.next(user);
    }

    public changeMessage(message: MessageOutput){
        this.message.next(message);
    }

    public clearAllValues(){
        this.user.next(null);
        this.playlists.next(null);
        this.currentPlaylist.next(null);
        this.message.next(null);
    }

}