import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';

import { HomeComponent } from './home/home.component';

import { UserService } from './user/user.service';

import { LoginComponent } from './login/login.component';

import { ApiService } from './shared/api.service';
import { StorageService } from './shared/session-storage.service';
import { SessionGuard } from './shared/session-guard.service';

import { CreateComponent } from './playlist/create/create.component';
import { NewPlayListComponent } from './playlist/create/new/newplaylist.component';
import { EditPlayListComponent } from './playlist/create/edit/editplaylist.component';
import { PlayComponent } from './playlist/play/play.component';
import { YoutubePlayerModule } from './youtube/youtube-player.module';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateComponent,
    NewPlayListComponent,
    EditPlayListComponent,
    PlayComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    YoutubePlayerModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    UserService,
    ApiService,
    StorageService,
    SessionGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
