/*
  Written by: Ryan Kruse
  This component handles the search bar. It searches our local database for the string and youtube.
  If the user clicks a youtube result, it will attempt to add it to our database iff it isn't already in there

  Note: 
    This component is very crazy right now, it will be refactored later! --Ryan Kruse
*/
import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

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

  //UI Fields:
  showArtistList: boolean = true;
  showAlbumList: boolean = true;
  showSongList: boolean = true;

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

  /*
    This method is called whenever our search string is changed
    @param search: string - The new word or phrase to search
  */
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

  /*
    This method is called when the user clicks a youtube result. It splits the title of the video on: '-', ':', '
    @param result: items - The result returned from the YOUTUBE API
    @param content - Used to open our modal
  */
  public selectYoutubeSong(result: items, content) {
    //Parse out the title with regex:
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

    //Open the model for the user so they can correct any errors
    this.openModal(content);
  }

  /*
    This method is called after the youtube video title has been parsed
  */
  private openModal(content) {
    //Clear all of our values to make sure they don't appear twice (or trigger events early)
    this.lastFMArtist = "";
    this.lastFMAlbum = "";
    this.lastFMSong = "";

    this.finalArtist = null;
    this.finalAlbum = null;
    this.finalSong = null;
    this.finalArtistInDB = false;
    this.finalAlbumInDB = false;
    this.finalSongInDB = false;

    this._modalService.open(content).result.then((result) => { //On close via save
      this.addNeededEntitiesToDB(); //When we save, we attempt to add all needed entities to the DB
      this.currentStep = 1;
    }, (reason) => { //on close via click off
      this.currentStep = 1;
    });
  }

  /*
    This method is called when the user clicks an artist from the DB results
    It changes our search to the given value and updates the view
    @param search: string - the new string to search
  */
  public createNewSearch(search: string) {
    this._dataShareService.changeSearchString(search);
  }
  
  /*
    This method is called when the user clicks on a song from the DB results
    It changes the current video to the given song so that the user can preview it
    @param song: Song - The song to preview
    @side-effects - Changes the youtube video to the provided song
  */
  public previewSong(song: Song) {
    this._dataShareService.changePreviewSong(song);
  }

  /*
    This method is called when the user clicks the show more button under the youtube tab
    It brings more results to the view iff we aren't already at the max view size
  */
  public showMoreYoutube() {
    this.currentNumberResultsShowing *= 2;

    if (!this.canShowMore()) this.currentNumberResultsShowing = this.maxNumResultsToFetch;
  }

  /*
    This method is called to check if we can display more search results to the screen
    @return boolean - If the number of result showing is less than the max number of results
  */
  public canShowMore(): boolean {
    return this.currentNumberResultsShowing < this.maxNumResultsToFetch;
  }

  /*
    This method is called to enable/disable the buttons in our create song modal. It is called per step and will return if
    at that step we can move on.
    @return boolean - If we meet the requirements of step n to continue to step n+1
  */
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

  /*
    This method is called everytime we move to a new step. It takes the dir given and moves us +/- 1 steps. Each time this is called,
    we perform a different action based on the step we are given
  */
  public doActionOnStepChange(dir: number) {
    this.currentStep += dir;
    switch (this.currentStep) {
      case 1: //Called when the modal is opened, displays the parsed youtube title
        this.modalHeader = "Is this the correct artist and song?";
        break;
      case 2: //This step resets lastFM values and attempts to load the album for the given artist and song
        this.modalHeader = "Is this the correct album?"
        this.lastFMArtist = "";
        this.lastFMAlbum = "";
        this.lastFMSong = "";
        this.loadLastFMTrack();
        break;
      case 3: //Called after the user confirms the last FM, it checks our local DB to see if we have any of the three (artist, album, song) in our DB
        this.modalHeader = "Does everything look right?"
        this.updateSearch(this.lastFMArtist);
        this.finalizeData();
        break;
      default:
        break;
    }
  }

  /*
    This method is called on our second step, it attempts to load the album given an artist and album
  */
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

  /*
    This method is called after the lastFM api returns a result (can be 200 or err)
  */
  private validateLastFMData() {
    //If it cannot find the artist, album, or track, we simply set the artist and song to what we guessed in the last step
    if (!this.lastFMResults.track || !this.lastFMResults.track.album || !this.lastFMResults.track.artist) {
      this.lastFMArtist = this.guessedArtist;
      this.lastFMSong = this.guessedSong;
    } else { //if we do find them, then we fill out our fields with those values
      this.lastFMArtist = this.lastFMResults.track.artist.name;
      this.lastFMAlbum = this.lastFMResults.track.album.title;
      this.lastFMSong = this.lastFMResults.track.name;
    }
  }

  /*
    This method is called on the third step. It calls our local DB to get search results that would work with the guessedArtist
    The reason for this is because it greatly reduces the amount we must look on the client side!
  */
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

  /*
    This method is called after our api returns our search results from finalizeData();
    It has three core checks, each one following the other iff the last check returned true:
      First: It checks to see if we have the artist in our local database
      Second: It checks to see if the artist has the given album
      Third: It checks to see if the album has the given song
    If all three checks are true, then we do nothing
    If one of the checks fails, then we must add everything below that check
      IE: Artist->Album->Song || Album->Song || Song
  */
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

  /*
    This method is called at the very end, it checks what needs to be added to the database and calls the appropriate method to do so
  */
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

/*
  The next three methods cascade and add their respective entity to the database
*/
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

  /*
    Used to trigger snackbar events
  */
  private triggerMessage(message: string, action: string, level: MessageType) {
    let out: MessageOutput = {
      message: message,
      action: action,
      level: level
    };

    this._dataShareService.changeMessage(out);
  }
}
