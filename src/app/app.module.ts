import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';

import { YoutubePlayerModule } from 'ngx-youtube-player';

//Components:
import { 
    AppComponent, GlobalPlaylistComponent, LocalPlaylistComponent, 
    LoginComponent, MouseoverMenuComponent, ProfileComponent, SearchResultsComponent, 
    SidebarComponent, SnackbarComponent, YoutubeComponent 
} from './components';

//Services:
import { ApiService, DataShareService, SessionGuard, StorageService, UserResolver, HubService, MessageService } from './services/services';

//Pipes:
import { YoutubePipe } from './pipes/pipes';

//Directives:
import { NgEnterDirective } from './directives/directives';

@NgModule({
  declarations: [
    AppComponent,
    NgEnterDirective,
    YoutubePipe,
    SidebarComponent,
    SnackbarComponent,
    LoginComponent,
    YoutubeComponent,
    SearchResultsComponent,
    MouseoverMenuComponent,
    ProfileComponent,
    GlobalPlaylistComponent,
    LocalPlaylistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressHttpClientModule,
    YoutubePlayerModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    ApiService,
    DataShareService,
    SessionGuard,
    StorageService,
    UserResolver,
    HubService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
