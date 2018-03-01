import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';

import { YoutubePlayerModule } from 'ngx-youtube-player';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'


import { StorageService } from './shared/session-storage.service';
import { SessionGuard } from './shared/session-guard.service'
import { UserResolver } from './shared/user-resolver.service';
import { ApiService } from './shared/api.service';
import { DataShareService } from './shared/data-share.service';
import { UserService } from './shared/user.service';
import { ProfileComponent } from './profile/profile.component';
import { NgEnterDirective } from './ng-enter.directive';
import { YoutubeComponent } from './youtube/youtube.component';
import { FilterPipe } from './filter-pipe.pipe';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EditPipe } from './edit-pipe.pipe';
import { MouseoverMenuComponent } from './mouseover-menu/mouseover-menu.component';
import { YoutubePipe } from './youtube.pipe';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    NgEnterDirective,
    YoutubeComponent,
    FilterPipe,
    SidebarComponent,
    EditPipe,
    MouseoverMenuComponent,
    YoutubePipe,
    SnackbarComponent
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
    StorageService,
    SessionGuard,
    ApiService,
    UserService,
    DataShareService,
    UserResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
