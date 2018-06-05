/*
  Note: 
    This component is very crazy right now, it will be refactored later! --Ryan Kruse
*/
import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style, sequence } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

import { MouseoverMenuComponent } from '../components';
import { ApiService, DataShareService } from '../services/services';
import { Artist, Album, MessageType, SearchResults, Song, YoutubeResult, LastfmTrack, MessageOutput } from '../interfaces/interfaces';
import { items } from '../interfaces/non-local/youtuberesult';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css', '../global-style.css'],
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

export class SearchResultsComponent implements OnInit {
  MessageType = MessageType;
  mouseOver: number = -1;

  searchString: string = "";

  searchResults: SearchResults;

  //Youtube Search Fields:
  youtubeResults: Observable<YoutubeResult[]>;
  lastFMResults: LastfmTrack;

  maxNumResultsToFetch: number = 50;
  currentNumberResultsShowing: number = 25;

  guessedArtist: string;
  guessedSong: string;

  songId: string;

  //Last FM Fields:
  lastFMArtist: string = "";
  lastFMAlbum: string = "";
  lastFMSong: string = "";

  //Final Step Fields:
  finalArtist: Artist;
  finalAlbum: Album;
  finalSong: Song;
  finalArtistInDB: boolean = false;
  finalAlbumInDB: boolean = false;
  finalSongInDB: boolean = false;

  //Modal Fields:
  modalHeader: string = "Is this the correct song and artist?";
  currentStep: number = 1;

  constructor(private _apiService: ApiService, private _dataShareService: DataShareService, private _modalService: NgbModal) { }

  ngOnInit() {
    this._dataShareService.searchString.subscribe(res => this.updateSearch(res));
  }

  private updateSearch(search: string) {
    this.searchString = search;

    if (this.searchString !== null && this.searchString.length > 0) {
      this.youtubeResults = this._apiService.getYTSearchResults(this.searchString, this.maxNumResultsToFetch);
      let s: Subscription = this._apiService.getDBSearchResults(this.searchString).subscribe(
        d => this.searchResults = d,
        err => console.log("UNABLE TO FIND", err),
        () => s.unsubscribe()
      );
    } else {
      this.searchResults = null;
    }
  }

  public selectYoutubeSong(result: items, content) {
    let title: string = result.snippet.title;

    let splitOnDash: string[] = title.split("-");
    let splitOnCol: string[] = title.split(":");
    let splitOnPar: string[] = title.split('"');

    if (splitOnDash.length >= 2) {
      this.guessedArtist = splitOnDash[0];
      this.guessedSong = splitOnDash[1];
    } else if (splitOnCol.length >= 2) {
      this.guessedArtist = splitOnCol[0];
      this.guessedSong = splitOnCol[1];
    } else if (splitOnPar.length >= 2) {
      this.guessedArtist = splitOnPar[0];
      this.guessedSong = splitOnPar[1];
    }

    this.guessedSong = this.guessedSong.replace(/\[[^\]]*?\]/g, ' ');
    this.guessedSong = this.guessedSong.replace(/ *\([^)]*\) */g, " ");

    this.guessedArtist = this.guessedArtist.trim();
    this.guessedSong = this.guessedSong.trim();

    this.songId = result.id.videoId;

    this.openModal(content);
  }

  private openModal(content) {
    this.lastFMArtist = "";
    this.lastFMAlbum = "";
    this.lastFMSong = "";

    this.finalArtist = null;
    this.finalAlbum = null;
    this.finalSong = null;
    this.finalArtistInDB = false;
    this.finalAlbumInDB = false;
    this.finalSongInDB = false;

    this._modalService.open(content).result.then((result) => {
      this.addNeededEntitiesToDB();
      this.currentStep = 1;
    }, (reason) => {
      this.currentStep = 1;
    });
  }

  public createNewSearch(search: string) {
    this._dataShareService.changeSearchString(search);
  }

  public previewSong(song: Song) {
    this._dataShareService.changePreviewSong(song);
  }

  public showMoreYoutube() {
    this.currentNumberResultsShowing *= 2;

    if (this.currentNumberResultsShowing > this.maxNumResultsToFetch) this.currentNumberResultsShowing = this.maxNumResultsToFetch;
  }

  public canShowMore(): boolean {
    return this.currentNumberResultsShowing < this.maxNumResultsToFetch;
  }

  public canMoveToNewStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.guessedArtist.length > 0 && this.guessedSong.length > 0;
      case 2:
        return this.lastFMArtist.length > 0 && this.lastFMAlbum.length > 0 && this.lastFMSong.length > 0;
      case 3:
        return (this.finalArtist !== null && this.finalAlbum !== null && this.finalSong !== null) || this.lastFMArtist.length > 0 && this.lastFMAlbum.length > 0 && this.lastFMSong.length > 0;
      default:
        return false;
    }
  }

  public doActionOnStepChange(dir: number) {
    this.currentStep += dir;
    switch (this.currentStep) {
      case 1:
        this.modalHeader = "Is this the correct artist and song?";
        break;
      case 2:
        this.modalHeader = "Is this the correct album?"
        this.lastFMArtist = "";
        this.lastFMAlbum = "";
        this.lastFMSong = "";
        this.loadLastFMTrack();
        break;
      case 3:
        this.modalHeader = "Does everything look right?"
        this.updateSearch(this.lastFMArtist);
        this.finalizeData();
        break;
      default:
        break;
    }
  }

  private loadLastFMTrack() {
    let track: LastfmTrack;
    let s: Subscription = this._apiService.getLastfmResults(this.guessedArtist, this.guessedSong).subscribe(
      d => this.lastFMResults = d,
      err => console.log(err),
      () => {
        s.unsubscribe();
        this.validateLastFMData();
      }
    );
  }

  private validateLastFMData() {
    if (!this.lastFMResults.track || !this.lastFMResults.track.album || !this.lastFMResults.track.artist) {
      this.lastFMArtist = this.guessedArtist;
      this.lastFMSong = this.guessedSong;
    } else {
      this.lastFMArtist = this.lastFMResults.track.artist.name;
      this.lastFMAlbum = this.lastFMResults.track.album.title;
      this.lastFMSong = this.lastFMResults.track.name;
    }
  }

  private finalizeData() {
    this.lastFMArtist = this.lastFMArtist.trim();
    this.lastFMAlbum = this.lastFMAlbum.trim();
    this.lastFMSong = this.lastFMSong.trim();

    //Check to see if we have the artist in the DB:
    let s: Subscription = this._apiService.getDBSearchResults(this.lastFMArtist).subscribe(
      d => this.searchResults = d,
      err => console.log("error", err),
      () => {
        s.unsubscribe();
        this.checkInDatabase();
      }
    );
  }

  private checkInDatabase() {
    let potentialArtist: Artist = this.searchResults.artists.find(x => x.name.toLowerCase() === this.lastFMArtist.toLocaleLowerCase());

    if (potentialArtist) {
      this.finalArtistInDB = true;
      this.finalArtist = potentialArtist;

      let potentialAlbum: Album = this.searchResults.albums.find(x => x.name.toLowerCase() === this.lastFMAlbum.toLocaleLowerCase());

      if (potentialAlbum) {
        this.finalAlbumInDB = true;
        this.finalAlbum = potentialAlbum;

        let potentialSong: Song = this.searchResults.songs.find(x => x.name.toLowerCase() === this.lastFMSong.toLocaleLowerCase());

        if (potentialSong) {
          this.finalSongInDB = true;
          this.finalSong = potentialSong;
        }
      }
    }
  }

  public addNeededEntitiesToDB() {
    if (!this.finalArtistInDB) {
      this.createNewArtist();
    } else if (!this.finalAlbumInDB) {
      this.createNewAlbum(this.finalArtist);
    } else if (!this.finalSongInDB) {
      this.createNewSong(this.finalArtist, this.finalAlbum);
    } else {
      this.triggerMessage("", "Song already in database", MessageType.Notification);
    }
  }

  private createNewArtist() {
    let artist = {
      name: this.lastFMArtist
    };

    let s: Subscription = this._apiService.postEntity<Artist>("Artists", artist).subscribe(
      d => this.finalArtist = d,
      err => console.log("unable to create artist"),
      () => {
        s.unsubscribe();
        this.createNewAlbum(this.finalArtist);
      }
    );
  }

  private createNewAlbum(artist: Artist) {
    let album = {
      artistId: artist.artistId,
      name: this.lastFMAlbum
    };

    let s: Subscription = this._apiService.postEntity<Album>("Albums", album).subscribe(
      d => this.finalAlbum = d,
      err => console.log("unable to create album"),
      () => {
        s.unsubscribe();
        this.createNewSong(this.finalArtist, this.finalAlbum);
      }
    );
  }

  private createNewSong(artist: Artist, album: Album) {
    let song = {
      albumId: album.albumId,
      artistId: artist.artistId,
      name: this.lastFMSong,
      url: "https://www.youtube.come/watch?v=" + this.songId
    };

    let s: Subscription = this._apiService.postEntity<Song>("Songs", song).subscribe(
      d => this.finalSong = d,
      err => console.log("unable to create song"),
      () => {
        s.unsubscribe();
        this.triggerMessage("", "Successfully Added!", MessageType.Success);
        this._dataShareService.changeSearchString(this.finalArtist.name);
        this.finalArtistInDB = false;
        this.finalAlbumInDB = false;
        this.finalSongInDB = false;
        this.finalArtist = null;
        this.finalAlbum = null;
        this.finalSong = null;
      }
    );
  }

  private triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }
}
