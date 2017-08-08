import { Routes } from '@angular/router';
import { SessionGuard } from './shared/session-guard.service';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';

import { CreateComponent } from './playlist/create/create.component';
import { NewPlayListComponent } from './playlist/create/new/newplaylist.component';
import { EditPlayListComponent } from './playlist/create/edit/editplaylist.component';
import { PlayComponent } from './playlist/play/play.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'listen', canActivate: [ SessionGuard ], component: PlayComponent },
  { path: 'create', canActivate: [ SessionGuard ], component: CreateComponent,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full'},
      { path: 'newplaylist', component: NewPlayListComponent },
      { path: 'editplaylist', component: EditPlayListComponent },
    ]
  },
  { path: 'login', component: LoginComponent }
];