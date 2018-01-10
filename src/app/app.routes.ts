/*
  Standard routing service
*/
import { Routes } from '@angular/router';
import { SessionGuard } from './shared/session-guard.service';
import { UserResolver } from './shared/user-resolver.service'

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';

import { LoginComponent } from './login/login.component'; 

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', canActivate: [ SessionGuard ], resolve: { user: UserResolver }, component: HomeComponent },
  { path: 'edit', canActivate: [ SessionGuard ], resolve: { user: UserResolver }, component: EditComponent },
  { path: 'profile', canActivate: [ SessionGuard ], resolve: { user: UserResolver }, component: ProfileComponent },
  { path: 'login', component: LoginComponent }
];