import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { BrowserXhr, HttpModule } from '@angular/http';

import { HomeComponent } from './home/home.component';

import { NgProgressModule, NgProgressCustomBrowserXhr } from 'ng2-progressbar'; //https://github.com/MurhafSousli/ngx-progressbar
import { UserService } from './user/user.service';

import { LoginComponent } from './login/login.component';

import { CreateEntityComponent } from './create/create.component';
import { CreateNewSongComponent } from './create/song/newsong.component';

import { ApiService } from './shared/api.service';
import { StorageService } from './shared/session-storage.service';
import { SessionGuard } from './shared/session-guard.service';

import { PlaylistComponent } from './playlist/playlist.component';
import { YoutubePlayerModule } from './youtube/youtube-player.module';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlaylistComponent,
    LoginComponent,
    CreateEntityComponent,
    CreateNewSongComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    YoutubePlayerModule,
    HttpModule,
    NgProgressModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    UserService,
    ApiService,
    StorageService,
    SessionGuard,
    { provide: BrowserXhr, useClass: NgProgressCustomBrowserXhr }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
