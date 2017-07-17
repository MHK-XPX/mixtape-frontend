import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { GithubService } from './github/shared/github.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpModule } from '@angular/http';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

import { UserService } from './user/user.service';

import { LoginComponent } from './login/login.component';

import { ApiService } from './shared/api.service';

import { CreateComponent } from './create/create.component';
import { NewPlayListComponent } from './create/new/newplaylist.component';
import { EditPlayListComponent } from './create/edit/editplaylist.component';
import { PlayComponent } from './create/play/play.component';
import { PlayListService } from './playlist/playlist.service';
import { YoutubePlayerModule } from './youtube/youtube-player.module';

import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ContactComponent } from './contact/contact.component';
 
import { SafePipe } from './youtube/youtube.pipe';
@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    RepoBrowserComponent,
    RepoListComponent,
    RepoDetailComponent,
    HomeComponent,
    CreateComponent,
    NewPlayListComponent,
    EditPlayListComponent,
    PlayComponent,
    SafePipe,
    ContactComponent,
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
    GithubService,
    UserService,
    PlayListService,
    ApiService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
