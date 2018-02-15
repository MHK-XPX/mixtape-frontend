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

import { MouseoverMenuComponent } from '../mouseover-menu/mouseover-menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { User } from '../interfaces/user';
import { Playlist } from '../interfaces/playlist';
import { PlaylistSong } from '../interfaces/playlistsong';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';
import { Song } from '../interfaces/song';

import { YoutubeResult, items } from '../interfaces/youtuberesult';
import { LastfmTrack } from '../interfaces/lastfmresult';

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
    @Input() searchString: string;

    mouseOver: number = -1;

    private _success = new Subject<string>();
    successMessage: string;

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

    constructor(private _apiService: ApiService, private _modalService: NgbModal) { }

    ngOnInit() {
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 2000).subscribe(() => this.successMessage = null);

        let s: Subscription = this._apiService.getAllEntities<Artist>("Artists").subscribe(
            d => this.artists = d,
            err => console.log(err),
            () => s.unsubscribe()
        );
    }

    ngOnChanges() {
        this.youtubeResults = this._apiService.getYoutubeResults(this.searchString, this.numToFetch);
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
    */
    checkIfArtistSaved(track: LastfmTrack) {
        let artist: string;
        let album: string;
        let song: string;

        try {
            artist = track.track.album.artist;
            album = track.track.album.title;
            song = track.track.name;
        }catch(e){
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
    */
    private addWhatsNeeded(artist: string, album: string, song: string) {
        if (this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add everything
            this.addArtist();
        } else if (!this.needToSendToDB[0] && !this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add only a song
            this.addSong(this.selectedArtist, this.selectedAlbum);
        } else if (!this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) { //We need to add an album and song
            this.addAlbum(this.selectedArtist);
        } else {
            this.triggerMessage("This song is already in the database! Try searching for it");
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
                //Do something here
                this.triggerMessage("Successfully Added");
            }
        );
    }

    showMoreYoutube() {
        this.currentlyDisplaying *= 2;

        if (this.currentlyDisplaying > this.numToFetch) this.currentlyDisplaying = this.numToFetch;
    }

    canShowMore(): boolean {
        return this.currentlyDisplaying < this.numToFetch;
    }

    triggerMessage(message: string) {
        this.successMessage = message;
        this._success.next(this.successMessage);
    }

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
}