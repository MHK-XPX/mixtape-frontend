import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';

import { CreateComponent } from './create/create.component';
import { NewPlayListComponent } from './create/new/newplaylist.component';
import { EditPlayListComponent } from './create/edit/editplaylist.component';
import { PlayComponent } from './create/play/play.component';

import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { ContactComponent } from './contact/contact.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full'},
      { path: 'newplaylist', component: NewPlayListComponent },
      { path: 'editplaylist', component: EditPlayListComponent },
      { path: 'play', component: PlayComponent }
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: 'github', component: RepoBrowserComponent,
    children: [
      { path: '', component: RepoListComponent },
      { path: ':org', component: RepoListComponent,
        children: [
          { path: '', component: RepoDetailComponent },
          { path: ':repo', component: RepoDetailComponent }
        ]
      }]
  },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent }
];

