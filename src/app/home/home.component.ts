/*
    Writtne by: Ryan Kruse
    
*/
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs";

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../shared/api.service';
import { DataShareService } from '../shared/data-share.service';

import { MouseoverMenuComponent } from '../mouseover-menu/mouseover-menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

import { YoutubeResult, items } from '../interfaces/youtuberesult';
import { LastfmTrack } from '../interfaces/lastfmresult';

import { MessageType } from '../shared/messagetype.enum';
import { MessageOutput } from '../interfaces/messageoutput';

@Component({
    selector: 'home',
    styleUrls: ['./home.component.css', '../shared/global-style.css'],
    templateUrl: './home.component.html',
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

export class HomeComponent implements OnInit {
    MessageType = MessageType;
    searchString: string;

    mouseOver: number = -1;

    private _success = new Subject<MessageOutput>();
    messageOut: MessageOutput;

    artists: Artist[] = [];

    songs: Observable<Song[]> = this._apiService.getAllEntities<Song>('Songs');

    private numToFetch: number = 50; //Number to pull from youtube
    private numToDisplay: number = this.numToFetch / 2; //Only show half at a time
    currentlyDisplaying: number = this.numToDisplay; //How many we are currently showing

    youtubeResults: Observable<YoutubeResult[]> = this._apiService.getYoutubeResults(this.searchString, this.numToFetch);

    potentialArtist: string = "";
    potentialAlbum: string = "";
    potentialSong: string = "";
    private potentialID: string; //Video ID

    selectedArtist: Artist;
    selectedAlbum: Album;
    selectedSong: Song;

    private needToSendToDB: boolean[] = [false, false, false]; //Art, Alb, Song (true if we need to add it to our database);

    constructor(private _apiService: ApiService, private _modalService: NgbModal, private _dataShareService: DataShareService) { }

    ngOnInit() {
        let s: Subscription = this._apiService.getAllEntities<Artist>("Artists").subscribe(
            d => this.artists = d,
            err => console.log(err),
            () => s.unsubscribe()
        );

        this._dataShareService.searchString.subscribe(res => this.updateSearch(res));

    }

    private updateSearch(search: string){
        this.searchString = search;

        if(this.searchString !== null && this.searchString.length > 0){
            this.youtubeResults = this._apiService.getYoutubeResults(this.searchString, this.numToFetch);
        }
    }
    
    /*
        Note: The parsing for this method is really bad and will be fixed once I learn more regex!
    */
    selectYoutubeSong(result: items, content) {
        let title: string = result.snippet.title;

        let splitOnDash: string[] = title.split("-");
        let splitOnCol: string[] = title.split(":");
        let splitOnPar: string[] = title.split('"');

        if (splitOnDash.length >= 2) {
            this.potentialArtist = splitOnDash[0];
            this.potentialSong = splitOnDash[1];
        } else if (splitOnCol.length >= 2) {
            this.potentialArtist = splitOnCol[0];
            this.potentialSong = splitOnCol[1];
        } else if (splitOnPar.length >= 2) {
            this.potentialArtist = splitOnPar[0];
            this.potentialSong = splitOnPar[1];
        }

        this.potentialSong = this.potentialSong.replace(/\[[^\]]*?\]/g, ' ');
        this.potentialSong = this.potentialSong.replace(/ *\([^)]*\) */g, " ");

        this.potentialArtist = this.potentialArtist.trim();
        this.potentialSong = this.potentialSong.trim();

        this.potentialID = result.id.videoId;

        this.loadTrackFromFM();
        this.openModal(content);
    }

    /*
        This pulls track information from the Last.FM music API (this allows us to make sure that all of the data is standardized)
    */
    loadTrackFromFM() {
        this.selectedArtist = null;
        this.selectedAlbum = null;
        this.selectedSong = null;

        let tracks: LastfmTrack;
        let s: Subscription = this._apiService.getLastfmResults(this.potentialArtist, this.potentialSong).subscribe(
            d => tracks = d,
            err => console.log(err),
            () => {
                s.unsubscribe();
                this.checkIfArtistSaved(tracks);
            }
        )
    }

    /*
        This method takes the saved data from Last.FM and checks to see if we currently own it in our DB
        @param track: LastfmTrack - the lastfm object returned from loadTrackFromFM() 
    */
    checkIfArtistSaved(track: LastfmTrack) {
        let artist: string;
        let album: string;
        let song: string;

        try {
            artist = track.track.album.artist;
            album = track.track.album.title;
            song = track.track.name;
        } catch (e) {
            return;
        }

        this.potentialAlbum = album;
        let pArt: Artist = this.artists.find(x => x.name.toLowerCase() === artist.toLowerCase()); //Check to see if we have artists

        if (pArt) { //If we already have the artist in our database, pull its information
            this.needToSendToDB[0] = false;
            let foundArtist: Artist;

            let s: Subscription = this._apiService.getSingleEntity<Artist>("Artists/Spec", pArt.artistId).subscribe(
                d => foundArtist = d,
                err => console.log(err),
                () => {
                    s.unsubscribe();
                    this.selectedArtist = foundArtist;
                    this.checkIfSongInAlbums(foundArtist, album, song);
                }
            )
        } else { //We don't have the artist => we don't have the song or album so we need to make new ones!
            this.needToSendToDB = [true, true, true];
        }
    }


    /*
        This method is called I.F.F we have the artist already in our database...if we do, we might have the proper album/song
        @param artist: Artist - The artist object pulled from OUR DB
        @param album: string - The name of the album given by the user or lastfm
        @param song: string - The name of the song given by the user or lastfm
    */
    checkIfSongInAlbums(artist: Artist, album: string, song: string) {
        let alb: Album;
        let s: Song;
        for (let i = 0; i < artist.album.length; i++) {
            alb = artist.album[i];


            if (alb.name.toLowerCase() === album.toLowerCase()) { //If we currently own the album
                this.potentialAlbum = alb.name;
                //Loop through the songs of the album
                for (let j = 0; j < alb.song.length; j++) {
                    s = alb.song[j];

                    //If we find a matching song there isn't anything to add
                    if (song.toLowerCase() === s.name.toLowerCase()) {
                        this.selectedSong = s;
                        this.selectedAlbum = alb;
                        this.needToSendToDB = [false, false, false]; //We found the artist, album, and song so we dont need to create anything
                        return;
                    }

                }

                //If we reach here it is because we have the album but no song
                this.needToSendToDB = [false, false, true]; //We know thus far that we currently have the artist and album stored in the DB
                this.selectedAlbum = alb;
                return;
            }
        }

        //If we reach here it means that we have the artist, but not the album/song so we must add them to the DB
        this.needToSendToDB = [false, true, true];
    }


    /*
        This is called when the use clicks save on the modal, based on what needs to be added, it adds it to the backend.
        Note that the functions are cascading in the following manner:
            Artist -> Album -> Song
            x      -> Album -> Song
            x      -> x     -> Song

        @param artist: string - the name of the artist to add
        @param album: string - the name of the album to add
        @param song: string -  the name of the song to add
    */
    private addWhatsNeeded(artist: string, album: string, song: string) {
        if (this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add everything
            this.addArtist();
        } else if (!this.needToSendToDB[0] && !this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add only a song
            this.addSong(this.selectedArtist, this.selectedAlbum);
        } else if (!this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add an album and song
            this.addAlbum(this.selectedArtist);
        } else {
            this.triggerMessage("", "This song is already in the database! Try searching for it!", MessageType.Notification);
        }

    }

    /*
        Adds an artist to the database and then calls addAlbum()
    */
    private addArtist() {
        let newArtist = {
            name: this.potentialArtist
        };

        let s: Subscription = this._apiService.postEntity<Artist>("Artists", newArtist).subscribe(
            d => this.selectedArtist = d,
            err => console.log("Unable to add artist"),
            () => {
                s.unsubscribe();
                this.addAlbum(this.selectedArtist);
            }
        );
    }

    /*
       Adds an album to the database and then calls addSong()
       @param artist: Artist - The artist in the DB to attach the album to (I.E. The owner of the album)
   */
    private addAlbum(artist: Artist) {
        let newAlbum = {
            artistId: artist.artistId,
            name: this.potentialAlbum
        };

        let s: Subscription = this._apiService.postEntity<Album>("Albums", newAlbum).subscribe(
            d => this.selectedAlbum = d,
            err => console.log("Unable to add album"),
            () => {
                s.unsubscribe();
                this.addSong(this.selectedArtist, this.selectedAlbum);
            }
        );
    }

    /*
        Adds a song to the database and then outputs a success message
        @param artist: Artist - The artist in the DB that owns the song
        @param album: Album - The album the song is attached to
    */
    private addSong(artist: Artist, album: Album) {
        let newSong = {
            albumId: album.albumId,
            artistId: artist.artistId,
            name: this.potentialSong,
            url: "https://www.youtube.com/watch?v=" + this.potentialID
        };

        let s: Subscription = this._apiService.postEntity<Song>("Songs", newSong).subscribe(
            d => this.selectedSong = d,
            err => console.log("Unable to add artist"),
            () => {
                s.unsubscribe();
                this.triggerMessage("", "Successfully Added", MessageType.Success);
            }
        );
    }

    /*
        This method is called when a user clicks the "show more" button at the bottom of our youtube list
        if the list isn't displaying all of the results, it will load more, otherwise the button will be disabled
    */
    showMoreYoutube() {
        this.currentlyDisplaying *= 2;

        if (this.currentlyDisplaying > this.numToFetch) this.currentlyDisplaying = this.numToFetch;
    }

    /*
        This method is called to check to see if we should enable or disable the show more button
        @return boolean - If we are showing all of the results from youtube or not
    */
    canShowMore(): boolean {
        return this.currentlyDisplaying < this.numToFetch;
    }

    /*
        This method is called whenever our modal is closed. If it is closed via save, it will check to see
        if we need to add any information to our database.
        If it is closed via cancel or clicking off, it resets the field values
    */
    openModal(content) {
        this._modalService.open(content).result.then((result) => {
            this.addWhatsNeeded(this.potentialArtist, this.potentialAlbum, this.potentialSong);
        }, (reason) => { //On close via clicking away we clear anything the user might have typed
            this.potentialArtist = "";
            this.potentialAlbum = "";
            this.potentialSong = "";
            this.potentialID = "";
        });
    }

    /*
        Called whenever we make a transaction with the DB
        @param message: string - The message to show to the user
        @param level: MessageType - The type of message (Success, Failure, Notification)
    */
    triggerMessage(message: string, action: string, level: MessageType) {
        let out: MessageOutput = {
            message: message,
            action: action,
            level: level
        };

        this.messageOut = out;
    }
}