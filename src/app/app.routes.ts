import { Routes } from '@angular/router';

import { AppComponent, ProfileComponent, SearchResultsComponent, LoginComponent } from './components';

import { SessionGuard, UserResolver } from './services/services';

export const rootRouterConfig: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', canActivate: [ SessionGuard ], resolve: { user: UserResolver }, component: SearchResultsComponent},
    { path: 'profile', canActivate: [ SessionGuard ], resolve: { user: UserResolver }, component: ProfileComponent },
    { path: 'login', component: LoginComponent }
];