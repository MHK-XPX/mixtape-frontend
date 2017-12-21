import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//import { TooltipModule } from 'ngx-bootstrap/tooltip';
//import { ModalModule } from 'ngx-bootstrap/modal';
//import { AlertModule } from 'ngx-bootstrap';

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
import { UserService } from './shared/user.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
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
    UserResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
