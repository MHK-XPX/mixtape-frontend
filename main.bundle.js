webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".margin-top{\r\n    margin-top: 1%;\r\n}\r\n\r\n.margin-bottom{\r\n    margin-bottom: 1%;\r\n}\r\n\r\n.md-input{\r\n    max-width: 50%;\r\n    width: 50%;\r\n}\r\n\r\n.no-padding{\r\n    padding: 0;\r\n}\r\n\r\n.navbar{\r\n    background-color: #333333;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.3.0/material.grey-red.min.css\">\r\n<script src=\"/node_modules/material-design-lite/material.min.js\"></script>\r\n<link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\r\n\r\n<ng-progress [thick]=\"true\" color=\"red\" [spinner]=\"false\"></ng-progress>\r\n<nav class=\"navbar sticky-top navbar-expand-md navbar-dark\">\r\n  <a class=\"navbar-brand\">\r\n    <button type=\"button\" class=\"btn btn-success\" style=\"display: inline\" (click)=\"isSidebarCollapsed = !isSidebarCollapsed\">Show sidebar</button>\r\n    <img class=\"text-light\" src=\"favicon.ico\" width=\"30\" height=\"30\" [routerLink]=\"['/home']\"/>\r\n  </a>\r\n  <button class=\"navbar-toggler hidden-sm-up\" type=\"button\" (click)=\"isNavbarCollapsed = !isNavbarCollapsed\" aria-controls=\"navbarSupportedContent\"\r\n    [attr.aria-expanded]=\"isNavbarCollapsed\" aria-label=\"Toggle navigation\">\r\n    <span class=\"navbar-toggler-icon\"></span>\r\n  </button>\r\n\r\n  <div [ngbCollapse]=\"isNavbarCollapsed\" class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\r\n    <input class=\"nav-item form-control md-input\" [value]=\"searchValue\" (input)=\"searchValue = $event.target.value\" type=\"text\"\r\n      placeholder=\"Search...\" (ngEnter)=\"search()\" *ngIf=\"this.isLoggedIn()\"/>\r\n\r\n    <div class=\"nav-item\" *ngIf=\"this.selectedPlaylist && this.isLoggedIn()\">\r\n      <img class='icon icon-middle icon-md float-left' src=\"assets/playlist/last_song.png\" (click)='this.YT.lastSong()' />\r\n      <img class=\"icon icon-middle icon-md\" [src]=\"this.YT.paused ? 'assets/playlist/play_button.png' : 'assets/playlist/pause_button.png'\"\r\n        (click)=\"this.YT.pauseClicked()\" />\r\n      <img class='icon icon-middle icon-md' src=\"assets/playlist/next_song.png\" (click)='this.YT.nextSong()' />\r\n      <img class=\"icon icon-middle icon-md\" [src]=\"this.YT.repeat ? 'assets/playlist/repeat_song_on.png' : 'assets/playlist/repeat_song_off.png'\"\r\n        (click)=\"this.YT.repeatClicked()\" />\r\n\r\n      <button type=\"button\" class=\"btn btn-success icon-middle\" (click)=\"enablePlaylist()\" *ngIf=\"!this.showPlaylist\">Show Playlist</button>\r\n      <button type=\"button\" class=\"btn btn-success icon-middle\" (click)=\"search()\" *ngIf=\"this.showPlaylist\">Show Page</button>\r\n    </div>\r\n\r\n    <div ngbDropdown placement=\"bottom\" class=\"nav-item ml-auto\" *ngIf=\"this.isLoggedIn()\">\r\n      <img ngbDropdownToggle class=\"icon icon-middle icon-md\" src=\"assets/shared/profile_white.png\" />\r\n      <div ngbDropdownMenu>\r\n        <button class=\"dropdown-item\" [routerLink]=\"['/profile']\">Profile</button>\r\n        <button class=\"dropdown-item\" [routerLink]=\"['/login']\" (click)=\"this.logOut()\">Logout</button>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n</nav>\r\n\r\n<div class=\"main-container container-fluid\">\r\n  <div class=\"row\" *ngIf=\"!this.isLoggedIn()\">\r\n    <div class=\"col-12\">\r\n      <login></login>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\" *ngIf=\"this.isLoggedIn()\">\r\n\r\n    <div class=\"col-sm-2 shadow no-padding\" *ngIf=\"!isSidebarCollapsed\">\r\n      <app-sidebar (playlist)=\"selectPlaylist($event)\" *ngIf=\"this.getUser()\"></app-sidebar>\r\n    </div>\r\n\r\n    <div class=\"col-sm-10 margin-top margin-bottom\">\r\n      <div class=\"col-sm-6 no-padding mx-auto shadow\">\r\n        <app-youtube [playlist]=\"this.selectedPlaylist\" [showPlaylist]=\"this.showPlaylist\"></app-youtube>\r\n      </div>\r\n      <!--<router-outlet class=\"col-12 margin-top mx-auto\" *ngIf=\"!this.showPlaylist\"></router-outlet>-->\r\n      <!--Add this once we figure out how to send @Input() with router links! -->\r\n      <div class=\"col-sm-7 margin-top mx-auto\" style=\"margin-top: 5%\" *ngIf=\"!this.showPlaylist\">\r\n        <home [searchString]=\"this.searchString\"></home>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__youtube_youtube_component__ = __webpack_require__("../../../../../src/app/youtube/youtube.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This component controls the core logic of the app. It holds all of the child components (sidebar, youtube, home <--which is search)
*/





var AppComponent = (function () {
    function AppComponent(_apiService, _storage, _dataShareService) {
        this._apiService = _apiService;
        this._storage = _storage;
        this._dataShareService = _dataShareService;
        this.searchValue = "";
        this.searchString = "";
        this.isNavbarCollapsed = true;
        this.isSidebarCollapsed = false;
        this.showPlaylist = false;
        this.minWindowSize = 720;
    }
    AppComponent.prototype.onResize = function () {
        this.isSidebarCollapsed = window.outerWidth <= this.minWindowSize;
        // console.log(window.outerWidth);
    };
    /*
      On init, if the user is currently logged in (which can happen if they refresh the page), we pull the user from the API and
      update the data-share service with the found user
    */
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.isLoggedIn()) {
            var s_1;
            var tempUser_1;
            s_1 = this._apiService.validateToken().subscribe(function (d) { return tempUser_1 = d; }, function (err) { return console.log(err); }, function () {
                s_1.unsubscribe();
                _this.user = tempUser_1;
                _this._dataShareService.changeUser(_this.user);
            });
        }
        this._dataShareService.currentPlaylist.subscribe(function (res) { return _this.selectedPlaylist = res; });
    };
    /*
      Called when we select a playlist from the side bar, it updates the data-share service with the playlist
      and then shows the playlist on the DOM
      @param event: Playlist - the playlist that was selected
    */
    AppComponent.prototype.selectPlaylist = function (event) {
        this.selectedPlaylist = event;
        this.showPlaylist = event != null;
        this.isSidebarCollapsed = window.outerWidth <= this.minWindowSize;
        this._dataShareService.changeCurrentPlaylist(event);
    };
    /*
      Called when we click the button to show the current playlist rather than the search (home) screen
    */
    AppComponent.prototype.enablePlaylist = function () {
        this.showPlaylist = true;
    };
    /*
      Called when the user searches for a string in the input box on the navbar. It removes the current playlist
      from the view and shows a list of results that match the search string
    */
    AppComponent.prototype.search = function () {
        this.showPlaylist = false;
        this.searchString = this.searchValue;
    };
    AppComponent.prototype.getUser = function () {
        var _this = this;
        this._dataShareService.user.subscribe(function (res) { return _this.user = res; });
        return this.user;
    };
    AppComponent.prototype.isLoggedIn = function () {
        return this._storage.getValue('loggedIn') || this._storage.getValue('token');
    };
    AppComponent.prototype.logOut = function () {
        this._storage.setValue("loggedIn", false);
        this._storage.removeValue("token");
        this._dataShareService.clearAllValues();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4__youtube_youtube_component__["a" /* YoutubeComponent */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__youtube_youtube_component__["a" /* YoutubeComponent */])
    ], AppComponent.prototype, "YT", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AppComponent.prototype, "onResize", null);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css"), __webpack_require__("../../../../../src/app/shared/global-style.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_3__shared_session_storage_service__["a" /* StorageService */], __WEBPACK_IMPORTED_MODULE_2__shared_data_share_service__["a" /* DataShareService */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_routes__ = __webpack_require__("../../../../../src/app/app.routes.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_progressbar_core__ = __webpack_require__("../../../../@ngx-progressbar/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_progressbar_http_client__ = __webpack_require__("../../../../@ngx-progressbar/http-client/esm5/http-client.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ngx_youtube_player__ = __webpack_require__("../../../../ngx-youtube-player/modules/ngx-youtube-player.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__shared_session_guard_service__ = __webpack_require__("../../../../../src/app/shared/session-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__shared_user_resolver_service__ = __webpack_require__("../../../../../src/app/shared/user-resolver.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__shared_user_service__ = __webpack_require__("../../../../../src/app/shared/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__profile_profile_component__ = __webpack_require__("../../../../../src/app/profile/profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ng_enter_directive__ = __webpack_require__("../../../../../src/app/ng-enter.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__youtube_youtube_component__ = __webpack_require__("../../../../../src/app/youtube/youtube.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__filter_pipe_pipe__ = __webpack_require__("../../../../../src/app/filter-pipe.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__sidebar_sidebar_component__ = __webpack_require__("../../../../../src/app/sidebar/sidebar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__edit_pipe_pipe__ = __webpack_require__("../../../../../src/app/edit-pipe.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__mouseover_menu_mouseover_menu_component__ = __webpack_require__("../../../../../src/app/mouseover-menu/mouseover-menu.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__youtube_pipe__ = __webpack_require__("../../../../../src/app/youtube.pipe.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



























var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_10__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_11__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_12__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_19__profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_20__ng_enter_directive__["a" /* NgEnterDirective */],
                __WEBPACK_IMPORTED_MODULE_21__youtube_youtube_component__["a" /* YoutubeComponent */],
                __WEBPACK_IMPORTED_MODULE_22__filter_pipe_pipe__["a" /* FilterPipe */],
                __WEBPACK_IMPORTED_MODULE_23__sidebar_sidebar_component__["a" /* SidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_24__edit_pipe_pipe__["a" /* EditPipe */],
                __WEBPACK_IMPORTED_MODULE_25__mouseover_menu_mouseover_menu_component__["a" /* MouseoverMenuComponent */],
                __WEBPACK_IMPORTED_MODULE_26__youtube_pipe__["a" /* YoutubePipe */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_7__ngx_progressbar_core__["b" /* NgProgressModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_8__ngx_progressbar_http_client__["a" /* NgProgressHttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_9_ngx_youtube_player__["a" /* YoutubePlayerModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forRoot(__WEBPACK_IMPORTED_MODULE_2__app_routes__["a" /* rootRouterConfig */], { useHash: true })
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_13__shared_session_storage_service__["a" /* StorageService */],
                __WEBPACK_IMPORTED_MODULE_14__shared_session_guard_service__["a" /* SessionGuard */],
                __WEBPACK_IMPORTED_MODULE_16__shared_api_service__["a" /* ApiService */],
                __WEBPACK_IMPORTED_MODULE_18__shared_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_17__shared_data_share_service__["a" /* DataShareService */],
                __WEBPACK_IMPORTED_MODULE_15__shared_user_resolver_service__["a" /* UserResolver */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_10__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/app.routes.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return rootRouterConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_session_guard_service__ = __webpack_require__("../../../../../src/app/shared/session-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_user_resolver_service__ = __webpack_require__("../../../../../src/app/shared/user-resolver.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profile_profile_component__ = __webpack_require__("../../../../../src/app/profile/profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");





var rootRouterConfig = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', canActivate: [__WEBPACK_IMPORTED_MODULE_0__shared_session_guard_service__["a" /* SessionGuard */]], resolve: { user: __WEBPACK_IMPORTED_MODULE_1__shared_user_resolver_service__["a" /* UserResolver */] }, component: __WEBPACK_IMPORTED_MODULE_2__home_home_component__["a" /* HomeComponent */] },
    { path: 'profile', canActivate: [__WEBPACK_IMPORTED_MODULE_0__shared_session_guard_service__["a" /* SessionGuard */]], resolve: { user: __WEBPACK_IMPORTED_MODULE_1__shared_user_resolver_service__["a" /* UserResolver */] }, component: __WEBPACK_IMPORTED_MODULE_3__profile_profile_component__["a" /* ProfileComponent */] },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_4__login_login_component__["a" /* LoginComponent */] }
];


/***/ }),

/***/ "../../../../../src/app/edit-pipe.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var EditPipe = (function () {
    function EditPipe() {
    }
    EditPipe.prototype.transform = function (items, artist, album) {
        if (!items)
            return [];
        if (!artist && !album)
            return items;
        var filterId;
        if (artist && !album) {
            filterId = artist.artistId;
            return items.filter(function (it) {
                return it['artistId'] == artist.artistId;
            });
        }
        filterId = album.albumId;
        return items.filter(function (it) {
            return it['albumId'] == filterId;
        });
    };
    EditPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'editPipe'
        })
    ], EditPipe);
    return EditPipe;
}());



/***/ }),

/***/ "../../../../../src/app/filter-pipe.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FilterPipe = (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (items, searchText) {
        if (!items)
            return [];
        if (!searchText)
            return items;
        searchText = searchText.toLowerCase();
        return items.filter(function (it) {
            return it['name'].toLowerCase().includes(searchText);
        });
    };
    FilterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'filterPipe'
        })
    ], FilterPipe);
    return FilterPipe;
}());



/***/ }),

/***/ "../../../../../src/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container container-fluid shadow no-padding\">\r\n    <ngb-tabset justify=\"justified\">\r\n        <ngb-tab title=\"Our Results\">\r\n            <ng-template ngbTabContent>\r\n                <div class=\"card\">\r\n                    <div class=\"card-header\">Top Results for: {{ searchString }}</div>\r\n                </div>\r\n                <ul class=\"list-group list-group-flush\">\r\n                    <li class=\"list-group-item list-group-item-action\" (mouseover)=\"this.mouseOver = i\" (mouseout)=\"this.mouseOver = -1\" *ngFor=\"let song of songs | async | filterPipe : searchString index as i\">\r\n                        {{ song.name }}\r\n                        <app-mouseover-menu [@showState]=\"this.mouseOver === i ? 'show' : 'hide'\" [addToPL]=\"true\" [addToQ]=\"true\" [deleteFromPL]=\"false\"\r\n                            [selectedSong]=\"song\" (successMessageOutput)=\"triggerMessage($event)\"></app-mouseover-menu>\r\n                    </li>\r\n                </ul>\r\n            </ng-template>\r\n        </ngb-tab>\r\n\r\n        <ngb-tab title=\"Youtube Results\">\r\n            <ng-template ngbTabContent>\r\n                <div class=\"card\">\r\n                    <div class=\"card-header\">Top Results for: {{ searchString }}</div>\r\n                </div>\r\n                <div *ngIf=\"this.searchString.length\">\r\n                    <ul class=\"list-group list-group-flush\" *ngFor=\"let result of youtubeResults | async | youtubePipe index as i\">\r\n                        <li class=\"list-group-item list-group-item-action\" (mouseover)=\"this.mouseOver = i\" (mouseout)=\"this.mouseOver = -1\" (click)=\"selectYoutubeSong(result, content)\"\r\n                            *ngIf=\"i <= this.currentlyDisplaying\">\r\n                            {{ result.snippet.title }}\r\n                            <!--<app-mouseover-menu [@showState]=\"this.mouseOver === i ? 'show' : 'hide'\" [addToPL]=\"true\" [addToQ]=\"true\" [deleteFromPL]=\"false\" [selectedSong]=\"song\" (successMessageOutput)=\"triggerMessage($event)\"></app-mouseover-menu>-->\r\n                        </li>\r\n                    </ul>\r\n                    <button type=\"button\" class=\"btn btn-secondary no-padding mx-auto w-100\" [disabled]=\"!canShowMore()\" (click)=\"showMoreYoutube()\">Show More</button>\r\n                </div>\r\n            </ng-template>\r\n        </ngb-tab>\r\n    </ngb-tabset>\r\n    <div id=\"snackbar\" [@showState]=\"successMessage ? 'show' : 'hide'\">{{ successMessage }}</div>\r\n</div>\r\n\r\n<ng-template #content let-c=\"close\" let-d=\"dismiss\">\r\n    <div class=\"modal-header\">\r\n        <h4 class=\"modal-title\">Here's What We Found!</h4>\r\n    </div>\r\n    <div class=\"modal-body form was-validated\">\r\n\r\n        <div class=\"form-group row mx-auto\">\r\n            <label for=\"inputpotentialArtist\" class=\"col-form-label font-weight-bold\">Artist:</label>\r\n            <div class=\"form-group col-md-6\">\r\n                <input [value]=\"potentialArtist\" (input)=\"potentialArtist = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputpotentialArtist\"\r\n                    placeholder=\"Artist Name\" (focusout)=\"loadTrackFromFM()\" [disabled] = \"this.selectedArtist\" required>\r\n                <!--<small id=\"artistHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!usernameTaken && hasClickedOff\">Username is available!</small>-->\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"form-group row mx-auto\">\r\n            <label for=\"inputpotentialAlbum\" class=\"col-form-label font-weight-bold\">Album:</label>\r\n            <div class=\"form-group col-md-6\">\r\n                <input [value]=\"potentialAlbum\" (input)=\"potentialAlbum = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputpotentialAlbum\"\r\n                    placeholder=\"Album Name\" (focusout)=\"loadTrackFromFM()\" [disabled] = \"this.selectedAlbum\" required>\r\n                <!--<small id=\"artistHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!usernameTaken && hasClickedOff\">Username is available!</small>-->\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"form-group row mx-auto\">\r\n            <label for=\"inputpotentialSong\" class=\"col-form-label font-weight-bold\">Song:</label>\r\n            <div class=\"form-group col-md-6\">\r\n                <input [value]=\"potentialSong\" (input)=\"potentialSong = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputpotentialSong\"\r\n                    placeholder=\"Song Name\"  (focusout)=\"loadTrackFromFM()\" [disabled] = \"this.selectedSong\" required>\r\n                <!--<small id=\"artistHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!usernameTaken && hasClickedOff\">Username is available!</small>-->\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-success col-3\" (click)=\"c()\" [disabled]=\"potentialArtist.length <= 0 || potentialAlbum.length <= 0 || potentialSong.length <= 0 \">Looks Good!</button>\r\n    </div>\r\n</ng-template>"

/***/ }),

/***/ "../../../../../src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("../../../animations/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    Writtne by: Ryan Kruse
    
*/






var HomeComponent = (function () {
    function HomeComponent(_apiService, _modalService) {
        this._apiService = _apiService;
        this._modalService = _modalService;
        this.mouseOver = -1;
        this._success = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["a" /* Subject */]();
        this.artists = [];
        this.songs = this._apiService.getAllEntities('Songs');
        this.numToFetch = 50; //Number to pull from youtube
        this.numToDisplay = this.numToFetch / 2; //Only show half at a time
        this.currentlyDisplaying = this.numToDisplay; //How many we are currently showing
        this.youtubeResults = this._apiService.getYoutubeResults(this.searchString, this.numToFetch);
        this.potentialArtist = "";
        this.potentialAlbum = "";
        this.potentialSong = "";
        this.needToSendToDB = [false, false, false]; //Art, Alb, Song (true if we need to add it to our database);
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__["a" /* debounceTime */].call(this._success, 2000).subscribe(function () { return _this.successMessage = null; });
        var s = this._apiService.getAllEntities("Artists").subscribe(function (d) { return _this.artists = d; }, function (err) { return console.log(err); }, function () { return s.unsubscribe(); });
    };
    HomeComponent.prototype.ngOnChanges = function () {
        this.youtubeResults = this._apiService.getYoutubeResults(this.searchString, this.numToFetch);
    };
    /*
        Note: The parsing for this method is really bad and will be fixed once I learn more regex!
    */
    HomeComponent.prototype.selectYoutubeSong = function (result, content) {
        var title = result.snippet.title;
        var splitOnDash = title.split("-");
        var splitOnCol = title.split(":");
        var splitOnPar = title.split('"');
        if (splitOnDash.length >= 2) {
            this.potentialArtist = splitOnDash[0];
            this.potentialSong = splitOnDash[1];
        }
        else if (splitOnCol.length >= 2) {
            this.potentialArtist = splitOnCol[0];
            this.potentialSong = splitOnCol[1];
        }
        else if (splitOnPar.length >= 2) {
            this.potentialArtist = splitOnPar[0];
            this.potentialSong = splitOnPar[1];
        }
        this.potentialSong = this.potentialSong.replace(/\[[^\]]*?\]/g, ' ');
        this.potentialSong = this.potentialSong.replace(/ *\([^)]*\) */g, " ");
        this.potentialArtist = this.potentialArtist.trim();
        this.potentialSong = this.potentialSong.trim();
        this.potentialID = result.id.videoId;
        this.loadTrackFromFM();
        this.openModal(content);
    };
    /*
        This pulls track information from the Last.FM music API (this allows us to make sure that all of the data is standardized)
    */
    HomeComponent.prototype.loadTrackFromFM = function () {
        var _this = this;
        this.selectedArtist = null;
        this.selectedAlbum = null;
        this.selectedSong = null;
        var tracks;
        var s = this._apiService.getLastfmResults(this.potentialArtist, this.potentialSong).subscribe(function (d) { return tracks = d; }, function (err) { return console.log(err); }, function () {
            s.unsubscribe();
            _this.checkIfArtistSaved(tracks);
        });
    };
    /*
        This method takes the saved data from Last.FM and checks to see if we currently own it in our DB
    */
    HomeComponent.prototype.checkIfArtistSaved = function (track) {
        var _this = this;
        var artist;
        var album;
        var song;
        try {
            artist = track.track.album.artist;
            album = track.track.album.title;
            song = track.track.name;
        }
        catch (e) {
            return;
        }
        this.potentialAlbum = album;
        var pArt = this.artists.find(function (x) { return x.name.toLowerCase() === artist.toLowerCase(); }); //Check to see if we have artists
        if (pArt) {
            this.needToSendToDB[0] = false;
            var foundArtist_1;
            var s_1 = this._apiService.getSingleEntity("Artists/Spec", pArt.artistId).subscribe(function (d) { return foundArtist_1 = d; }, function (err) { return console.log(err); }, function () {
                s_1.unsubscribe();
                _this.selectedArtist = foundArtist_1;
                _this.checkIfSongInAlbums(foundArtist_1, album, song);
            });
        }
        else {
            this.needToSendToDB = [true, true, true];
        }
    };
    /*
        This method is called I.F.F we have the artist already in our database...if we do, we might have the proper album/song
    */
    HomeComponent.prototype.checkIfSongInAlbums = function (artist, album, song) {
        var alb;
        var s;
        for (var i = 0; i < artist.album.length; i++) {
            alb = artist.album[i];
            if (alb.name.toLowerCase() === album.toLowerCase()) {
                this.potentialAlbum = alb.name;
                //Loop through the songs of the album
                for (var j = 0; j < alb.song.length; j++) {
                    s = alb.song[j];
                    //If we find a matching song there isn't anything to add
                    if (song.toLowerCase() === s.name.toLowerCase()) {
                        this.selectedSong = s;
                        this.selectedAlbum = alb;
                        this.needToSendToDB = [false, false, false]; //We found the artist, album, and song so we dont need to create anything
                        return;
                    }
                }
                //If we reach here it is because we have the album but no song
                this.needToSendToDB = [false, false, true]; //We know thus far that we currently have the artist and album stored in the DB
                this.selectedAlbum = alb;
                return;
            }
        }
        //If we reach here it means that we have the artist, but not the album/song so we must add them to the DB
        this.needToSendToDB = [false, true, true];
    };
    /*
        This is called when the use clicks save on the modal, based on what needs to be added, it adds it to the backend.
        Note that the functions are cascading in the following manner:
            Artist -> Album -> Song
            x      -> Album -> Song
            x      -> x     -> Song
    */
    HomeComponent.prototype.addWhatsNeeded = function (artist, album, song) {
        if (this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) {
            this.addArtist();
        }
        else if (!this.needToSendToDB[0] && !this.needToSendToDB[1] && this.needToSendToDB[2]) {
            this.addSong(this.selectedArtist, this.selectedAlbum);
        }
        else if (!this.needToSendToDB[0] && this.needToSendToDB[1] && this.needToSendToDB[2]) {
            this.addAlbum(this.selectedArtist);
        }
        else {
            this.triggerMessage("This song is already in the database! Try searching for it");
        }
    };
    /*
        Adds an artist to the database and then calls addAlbum()
    */
    HomeComponent.prototype.addArtist = function () {
        var _this = this;
        var newArtist = {
            name: this.potentialArtist
        };
        var s = this._apiService.postEntity("Artists", newArtist).subscribe(function (d) { return _this.selectedArtist = d; }, function (err) { return console.log("Unable to add artist"); }, function () {
            s.unsubscribe();
            _this.addAlbum(_this.selectedArtist);
        });
    };
    /*
       Adds an album to the database and then calls addSong()
   */
    HomeComponent.prototype.addAlbum = function (artist) {
        var _this = this;
        var newAlbum = {
            artistId: artist.artistId,
            name: this.potentialAlbum
        };
        var s = this._apiService.postEntity("Albums", newAlbum).subscribe(function (d) { return _this.selectedAlbum = d; }, function (err) { return console.log("Unable to add album"); }, function () {
            s.unsubscribe();
            _this.addSong(_this.selectedArtist, _this.selectedAlbum);
        });
    };
    /*
        Adds a song to the database and then outputs a success message
    */
    HomeComponent.prototype.addSong = function (artist, album) {
        var _this = this;
        var newSong = {
            albumId: album.albumId,
            artistId: artist.artistId,
            name: this.potentialSong,
            url: "https://www.youtube.com/watch?v=" + this.potentialID
        };
        var s = this._apiService.postEntity("Songs", newSong).subscribe(function (d) { return _this.selectedSong = d; }, function (err) { return console.log("Unable to add artist"); }, function () {
            s.unsubscribe();
            //Do something here
            _this.triggerMessage("Successfully Added");
        });
    };
    HomeComponent.prototype.showMoreYoutube = function () {
        this.currentlyDisplaying *= 2;
        if (this.currentlyDisplaying > this.numToFetch)
            this.currentlyDisplaying = this.numToFetch;
    };
    HomeComponent.prototype.canShowMore = function () {
        return this.currentlyDisplaying < this.numToFetch;
    };
    HomeComponent.prototype.triggerMessage = function (message) {
        this.successMessage = message;
        this._success.next(this.successMessage);
    };
    HomeComponent.prototype.openModal = function (content) {
        var _this = this;
        this._modalService.open(content).result.then(function (result) {
            _this.addWhatsNeeded(_this.potentialArtist, _this.potentialAlbum, _this.potentialSong);
        }, function (reason) {
            _this.potentialArtist = "";
            _this.potentialAlbum = "";
            _this.potentialSong = "";
            _this.potentialID = "";
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", String)
    ], HomeComponent.prototype, "searchString", void 0);
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'home',
            styles: [__webpack_require__("../../../../../src/app/home/home.component.css"), __webpack_require__("../../../../../src/app/shared/global-style.css")],
            template: __webpack_require__("../../../../../src/app/home/home.component.html"),
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */])('showState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 1,
                        visibility: 'visible'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('hide', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 0,
                        visibility: 'hidden'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('show => *', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('200ms')),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('hide => show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('400ms')),
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/login/login.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".form-signin\r\n{\r\n    max-width: 75%;\r\n    padding: 15px;\r\n    margin: 0 auto;\r\n}\r\n.form-signin .form-signin-heading, .form-signin .checkbox\r\n{\r\n    margin-bottom: 10px;\r\n}\r\n.form-signin .checkbox\r\n{\r\n    font-weight: normal;\r\n}\r\n.form-signin .form-control\r\n{\r\n    position: relative;\r\n    font-size: 16px;\r\n    height: auto;\r\n    padding: 10px;\r\n    box-sizing: border-box;\r\n}\r\n.form-signin .form-control:focus\r\n{\r\n    z-index: 2;\r\n}\r\n.form-signin input[type=\"text\"]\r\n{\r\n    margin-bottom: -1px;\r\n    border-bottom-left-radius: 0;\r\n    border-bottom-right-radius: 0;\r\n}\r\n.form-signin input[type=\"password\"]\r\n{\r\n    margin-bottom: 10px;\r\n    border-top-left-radius: 0;\r\n    border-top-right-radius: 0;\r\n}\r\n.account-wall\r\n{\r\n    margin-top: 20px;\r\n    padding: 40px 0px 20px 0px;\r\n    background-color: #f7f7f7;\r\n    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n.login-title\r\n{\r\n    color: #555;\r\n    font-size: 18px;\r\n    font-weight: 400;\r\n    display: block;\r\n}\r\n.profile-img\r\n{\r\n    width: 96px;\r\n    height: 96px;\r\n    margin: 0 auto 10px;\r\n    display: block;\r\n    border-radius: 50%;\r\n}\r\n.need-help\r\n{\r\n    margin-top: 10px;\r\n}\r\n.new-account\r\n{\r\n    display: block;\r\n    margin-top: 10px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<ngb-alert class=\"text-center\" type=\"danger\" (close)=\"this.invalidLogin = false\" *ngIf=\"this.invalidLogin\">Invalid username/password</ngb-alert>\r\n<ngb-alert class=\"text-center\" type=\"danger\" (close)='this.displayName = \"\"; this.usernameTaken = false' *ngIf=\"this.usernameTaken\">Username is already in use</ngb-alert>\r\n\r\n<div class=\"container mx-auto\" *ngIf=\"!this._storage.getValue('loggedIn') && !this.createUser\">\r\n    <div class=\"col-6 mx-auto\">\r\n        <h1 class=\"text-center login-title\">Sign in to continue to Mixtape</h1>\r\n        <div class=\"account-wall\">\r\n            <form class=\"form-signin was-validated\">\r\n                <input [value]=\"username\" (input)=\"username = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputEmail3\" placeholder=\"Username\"\r\n                    required autofocus>\r\n                <input [value]=\"password\" (input)=\"password = $event.target.value\" type=\"password\" class=\"form-control\" id=\"inputPassword3\"\r\n                    placeholder=\"Password\" (ngEnter)=\"loginClicked($event)\" required>\r\n                <button class=\"btn btn-lg btn-primary btn-block\" type=\"button\" (click)=\"loginClicked()\" [disabled]=\"!allFieldsFilled()\">Sign In</button>\r\n                <label class=\"checkbox pull-left\">\r\n                    <input type=\"checkbox\" [checked]=\"rememberMe\" (change)=\"rememberMe = !rememberMe\"> Remember me</label>\r\n            </form>\r\n        </div>\r\n        <button class=\"btn btn-link text-center new-account mx-auto\" type=\"button\" (click)=\"createUserClicked()\">Create an account </button>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"container mx-auto\" *ngIf=\"!this._storage.getValue('loggedIn') && this.createUser\">\r\n    <div class=\"col-8 mx-auto\">\r\n        <div class=\"account-wall\">\r\n            <form class=\"was-validated\">\r\n                <div class=\"form-group row\">\r\n                    <div class=\"form-group col-md-6\">\r\n                        <label for=\"inputFirstName\" class=\"col-form-label\">First Name:</label>\r\n                        <input [value]=\"firstName\" (input)=\"firstName = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputFirstName\"\r\n                            placeholder=\"First Name\" required autofocus>\r\n                    </div>\r\n                    <div class=\"form-group col-md-6\">\r\n                        <label for=\"inputLastName\" class=\"col-form-label\">Last Name:</label>\r\n                        <input [value]=\"lastName\" (input)=\"lastName = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputLastName\" placeholder=\"Last Name\"\r\n                            required autofocus>\r\n                    </div>\r\n                </div>\r\n                <div class=\"for-group row\">\r\n                    <div class=\"form-group col-md-6\">\r\n                        <label for=\"inputUsername\" class=\"col-form-label\">Username:</label>\r\n                        <input [value]=\"displayName\" (input)=\"displayName = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputUsername\"\r\n                            placeholder=\"Username\" (focusout)=\"validateUsername()\" required>\r\n                        <small id=\"usernameHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!usernameTaken && hasClickedOff\">Username is available!</small>\r\n                    </div>\r\n                </div>\r\n                <div class=\"form-group row\">\r\n                    <div class=\"form-group col-md-6\">\r\n                        <label for=\"inputPassword\" class=\"col-form-label\">Password:</label>\r\n                        <input [value]=\"newPassword\" (input)=\"newPassword = $event.target.value\" type=\"password\" class=\"form-control\" id=\"inputPassword\"\r\n                            placeholder=\"Password\" required>\r\n                    </div>\r\n                    <div class=\"form-group col-md-6\">\r\n                        <label for=\"inputCPassword\" class=\"col-form-label\">Confirm Password:</label>\r\n                        <input [value]=\"confirmPassword\" (input)=\"confirmPassword = $event.target.value\" type=\"password\" class=\"form-control\" id=\"inputCPassword\"\r\n                            placeholder=\"Confirm Password\" required>\r\n                        <small id=\"passwordHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!passwordsMatch()\">Passwords must match</small>\r\n                    </div>\r\n                </div>\r\n                <button type=\"button\" class=\"btn btn-primary btn-block\" (click)=\"createAccount()\" [disabled]=\"!allFieldsFilled()\">Create Account</button>\r\n            </form>\r\n        </div>\r\n        <button class=\"btn btn-link text-center new-account mx-auto\" type=\"button\" (click)=\"this.createUser = !this.createUser\">Back</button>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    Written by: Ryan Kruse
    This component controls the login and signup features. It either auths. a user with the backend
    or adds them to the backend with proper account creds.
*/





var LoginComponent = (function () {
    function LoginComponent(_apiService, _storage, _router, _dataShareService) {
        this._apiService = _apiService;
        this._storage = _storage;
        this._router = _router;
        this._dataShareService = _dataShareService;
        this.invalidLogin = false;
        this.username = "";
        this.password = ""; //will remove 
        this.rememberMe = true;
        this.createUser = false;
        this.usernameTaken = false;
        this.hasClickedOff = false;
        this.firstName = "";
        this.lastName = "";
        this.displayName = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    /*
        If we click remember me, load the last username sent into our box
    */
    LoginComponent.prototype.ngOnInit = function () {
        var usrName = this._storage.getFromLocal('savedUsername');
        if (usrName)
            this.username = usrName;
    };
    /*
        Called when the user clicks login. Only able to if all the fields are filled in
        It first gets a token from the API then validates the token
    */
    LoginComponent.prototype.loginClicked = function () {
        var _this = this;
        if (!this.allFieldsFilled())
            return;
        var s;
        var loginCred = {
            Username: this.username,
            Password: this.password
        };
        var cred = JSON.stringify(loginCred);
        var user;
        s = this._apiService.getLoginToken(cred).subscribe(function (d) { return user = d; }, function (err) { _this.invalidLogin = true; _this.password = ""; }, function () {
            _this._storage.setValue("token", user["token"]);
            _this.validateLogin();
            s.unsubscribe();
        });
    };
    /*
        Called after the user attempts to login. The method validates if the token is correct
        or not. If it is, the DOM is moved to the homepage
    */
    LoginComponent.prototype.validateLogin = function () {
        var _this = this;
        var user;
        var s = this._apiService.validateToken().subscribe(function (d) { return user = d; }, function (err) { return console.log("Invalid token", err); }, function () {
            _this._storage.setValue('loggedIn', true);
            if (_this.rememberMe)
                _this._storage.saveToLocal('savedUsername', _this.username);
            else
                _this._storage.removeFromLocal('saveUsername');
            s.unsubscribe();
            _this._dataShareService.changeUser(user);
            _this._router.navigate(['./home']);
        });
    };
    /*
        Called after the user leaves the username box. It checks with the API to see if
        the given username has been taken or not, if so it alerts the user with the error
    */
    LoginComponent.prototype.validateUsername = function () {
        var _this = this;
        if (this.displayName.length <= 0)
            return;
        var s;
        console.log(this.displayName);
        s = this._apiService.validateUsername(this.displayName).subscribe(function (d) { return d = d; }, function (err) {
            if (err['error']['Error']) {
                _this.usernameTaken = true;
            }
            else {
                _this.hasClickedOff = true;
            }
        });
    };
    /*
        When the user clicks create an account, we clear all of the values
    */
    LoginComponent.prototype.createUserClicked = function () {
        this.createUser = true;
        this.displayName = "";
        this.firstName = "";
        this.lastName = "";
        this.newPassword = "";
        this.confirmPassword = "";
    };
    /*
        Called when the user creates their account. It validates that all off the fields are correct
        if not, it alerts the user of the error. If they are valid, we add them to the backend
        and then call the login method
    */
    LoginComponent.prototype.createAccount = function () {
        var _this = this;
        var s;
        var newUser = {
            FirstName: this.firstName,
            LastName: this.lastName,
            Username: this.displayName,
            Password: this.newPassword
        };
        var returnedUser;
        s = this._apiService.postEntity("Users", newUser).subscribe(function (d) { return returnedUser = d; }, function (err) {
            if (err['error']['Error']) {
                _this.usernameTaken = true;
                _this.displayName = "";
            }
        }, function () {
            s.unsubscribe();
            _this.username = _this.displayName;
            _this.password = _this.newPassword;
            _this.loginClicked();
        });
    };
    /*
        Called when entering passwords, returns if they match or not
        @return boolean - If the passwords are matching
    */
    LoginComponent.prototype.passwordsMatch = function () {
        return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase()
            && this.newPassword.length > 0 && this.confirmPassword.length > 0;
    };
    /*
        Called when disabling buttons or attempting to login/create user
        @return boolean - Returns if all the fields are filled in
    */
    LoginComponent.prototype.allFieldsFilled = function () {
        if (this.createUser)
            return this.passwordsMatch() && !this.usernameTaken && this.displayName.length > 0 && this.firstName.length > 0 && this.lastName.length > 0;
        return this.username.length > 0 && this.password.length > 0;
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'login',
            styles: [__webpack_require__("../../../../../src/app/login/login.component.css")],
            template: __webpack_require__("../../../../../src/app/login/login.component.html")
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_3__shared_session_storage_service__["a" /* StorageService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */], __WEBPACK_IMPORTED_MODULE_4__shared_data_share_service__["a" /* DataShareService */]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "../../../../../src/app/mouseover-menu/mouseover-menu.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".icon-menu{\r\n    float: right;\r\n    opacity: inherit;\r\n    width: 25%;\r\n}\r\n\r\n.img-margin{\r\n    margin-right: 1%;\r\n}\r\n\r\n.specific-height{\r\n    max-height: 25vh;\r\n    overflow-y: auto;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/mouseover-menu/mouseover-menu.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"icon-menu\">\r\n  <div *ngIf=\"deleteFromPL\">\r\n    <img class=\"icon icon-middle icon-sm float-right img-margin\" placement=\"top\" ngbTooltip=\"Remove\" src='assets/playlist/delete_song_black.png'\r\n      (click)=\"deletePlaylistSong()\" />\r\n  </div>\r\n  <div *ngIf=\"addToQ\">\r\n    <img class=\"icon icon-middle icon-sm float-right img-margin\" placement=\"top\" ngbTooltip=\"Add to queue\" src='assets/playlist/add_playlist.png'\r\n      (click)=\"addToQueue()\" />\r\n  </div>\r\n  <div ngbDropdown placement=\"top\" *ngIf=\"addToPL\">\r\n    <img ngbDropdownToggle class=\"icon icon-middle icon-sm float-right img-margin\" placement=\"left\" ngbTooltip=\"Add to a playlist\"\r\n      src='assets/playlist/add_playlist_2.png' />\r\n    <div ngbDropdownMenu aria-labelledby=\"addToPlaylists\">\r\n      <ul class=\"list-group list-group-flush specific-height\" *ngIf=\"this.playlists\">\r\n        <li class=\"list-group-item list-group-item-action\" *ngFor=\"let playlist of this.playlists index as i\" (click)=\"addToPlaylist(playlist, i)\">\r\n          {{ playlist.name }}\r\n        </li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n\r\n  <div *ngIf=\"deletePL\">\r\n    <img class=\"icon icon-middle icon-sm float-right img-margin\" placement=\"right\" ngbTooltip=\"Delete\" src=\"assets/playlist/delete_song_black.png\"\r\n      (click)=\"deletePlaylist()\" />\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/mouseover-menu/mouseover-menu.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MouseoverMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse

  This component controls the small icon menu that pops up on mouseover. It allows the user to add a song to a given playlist,
  add a song to the current playlist in the queue, or delete a song from the current playlist.

  The component makes all of the calls to the API and updates the playlists in the data share so that they are
  dynamically updated on the DOM
*/



var MouseoverMenuComponent = (function () {
    function MouseoverMenuComponent(_apiService, _dataShareService) {
        this._apiService = _apiService;
        this._dataShareService = _dataShareService;
        this.successMessageOutput = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
    }
    /*
      On Init we sync our current user, playlists, and currently playing playlist
    */
    MouseoverMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._dataShareService.user.subscribe(function (res) { return _this.user = res; });
        this._dataShareService.playlist.subscribe(function (res) { return _this.playlists = res; });
        this._dataShareService.currentPlaylist.subscribe(function (res) { return _this.currentPL = res; });
    };
    /*
      Called when we attempt to add a song to a given playlist, if successful we add the song to the given playlist, update the global lists, and output a message.
      If not successful we output a fail message.
      @param p: Playlist - The playlist to add the song to
      @param index: number - The index of the 'p' in our global array of playlists (from the DataShareService)
    */
    MouseoverMenuComponent.prototype.addToPlaylist = function (p, index) {
        var _this = this;
        var toSendPLS = {
            playlistId: p.playlistId,
            songId: this.selectedSong.songId
        };
        var actPLS;
        var s = this._apiService.postEntity("PlaylistSongs", toSendPLS).subscribe(function (d) { return actPLS = d; }, function (err) {
            _this.outputMessage("Unable to add " + _this.selectedSong.name + " to " + p.name);
        }, function () {
            actPLS.song = _this.selectedSong;
            s.unsubscribe();
            p.playlistSong.push(actPLS);
            _this.playlists[index] = p;
            _this._dataShareService.changePlaylist(_this.playlists);
            _this.outputMessage(_this.selectedSong.name + " added to " + p.name);
        });
    };
    /*
      Called when we add a song to the currently playing playlist or we want to start a new queue. If we aren't listening to a playlist
      then we create a new queue and allow the user to add songs to it (via add to queue button) and they can listen to said queue.
      If the user is currently listening to a playlist, then we append the song to the end of the list and output a success message
    */
    MouseoverMenuComponent.prototype.addToQueue = function () {
        var pls;
        var copyPL;
        if (this.currentPL === null) {
            var newPL = {
                playlistId: null,
                active: true,
                name: "Custom Queue",
                userId: this.user.userId,
                playlistSong: []
            };
            pls = this.createPlaylistSong(newPL);
            newPL.playlistSong.push(pls);
            copyPL = newPL;
        }
        else {
            pls = this.createPlaylistSong(this.currentPL);
            copyPL = {
                playlistId: this.currentPL.playlistId,
                active: this.currentPL.active,
                name: this.currentPL.name,
                userId: this.currentPL.userId,
                playlistSong: this.currentPL.playlistSong.slice()
            };
            copyPL.playlistSong.push(pls);
        }
        this._dataShareService.changeCurrentPlaylist(copyPL);
        this.outputMessage(this.selectedSong.name + " added to queue");
    };
    /*
      Called when the user attempts to delete a song from a playlist. If the user is successful then we remove the song from the playlist,
      update the global playlists, and output a success message. If not successful we output a fail message
    */
    MouseoverMenuComponent.prototype.deletePlaylistSong = function () {
        var _this = this;
        var plIndex = this.playlists.findIndex(function (pl) { return pl.playlistId === _this.currentPL.playlistId; });
        var plsIndex = this.currentPL.playlistSong.findIndex(function (pls) { return pls.playlistSongId === _this.selectedPLS.playlistSongId; });
        if (this.selectedPLS.playlistSongId === null) {
            this.currentPL.playlistSong.splice(plsIndex, 1);
            this._dataShareService.changeCurrentPlaylist(this.currentPL);
            this.outputMessage("Removed " + this.selectedSong.name + " from queue");
        }
        else {
            var s_1 = this._apiService.deleteEntity("PlaylistSongs", this.selectedPLS.playlistSongId).subscribe(function (d) { return d = d; }, function (err) { return _this.outputMessage("Unable to remove " + _this.selectedSong.name + " from " + _this.playlists[plIndex].name); }, function () {
                s_1.unsubscribe();
                _this.playlists[plIndex].playlistSong.splice(plsIndex, 1);
                _this._dataShareService.changePlaylist(_this.playlists);
                _this.outputMessage("Removed " + _this.selectedSong.name + " from " + _this.playlists[plIndex].name);
            });
        }
    };
    /*
      Called when we want to create a new playlist song to add to a playlist
      @param p: Playlist - the playlist we want to create a playlist song for
      @return PlaylistSong - A new playlist song
    */
    MouseoverMenuComponent.prototype.createPlaylistSong = function (p) {
        var pls = {
            playlistSongId: null,
            playlistId: p.playlistId,
            songId: this.selectedSong.songId,
            playlist: p,
            song: this.selectedSong
        };
        return pls;
    };
    MouseoverMenuComponent.prototype.deletePlaylist = function () {
        var _this = this;
        var plIndex = this.playlists.findIndex(function (pl) { return pl.playlistId === _this.plToDelete.playlistId; });
        var s;
        s = this._apiService.deleteEntity("Playlists", this.plToDelete.playlistId).subscribe(function (d) { return d = d; }, function (err) { return _this.outputMessage("Unable to delete playlist"); }, function () {
            s.unsubscribe();
            _this.playlists.splice(plIndex, 1);
            _this._dataShareService.changePlaylist(_this.playlists);
            _this.outputMessage("Playlist deleted!");
        });
    };
    /*
      Called whenever we finish an action, the message is emitted to all parent components
    */
    MouseoverMenuComponent.prototype.outputMessage = function (message) {
        this.successMessage = message;
        this.successMessageOutput.emit(this.successMessage);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], MouseoverMenuComponent.prototype, "addToPL", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], MouseoverMenuComponent.prototype, "addToQ", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], MouseoverMenuComponent.prototype, "deleteFromPL", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], MouseoverMenuComponent.prototype, "deletePL", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], MouseoverMenuComponent.prototype, "selectedSong", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], MouseoverMenuComponent.prototype, "selectedPLS", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], MouseoverMenuComponent.prototype, "plToDelete", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], MouseoverMenuComponent.prototype, "successMessageOutput", void 0);
    MouseoverMenuComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-mouseover-menu',
            template: __webpack_require__("../../../../../src/app/mouseover-menu/mouseover-menu.component.html"),
            styles: [__webpack_require__("../../../../../src/app/mouseover-menu/mouseover-menu.component.css"), __webpack_require__("../../../../../src/app/shared/global-style.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_2__shared_data_share_service__["a" /* DataShareService */]])
    ], MouseoverMenuComponent);
    return MouseoverMenuComponent;
}());



/***/ }),

/***/ "../../../../../src/app/ng-enter.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NgEnterDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This directive is used with any input field, it allows the user to hit enter to submit their field
*/

var NgEnterDirective = (function () {
    function NgEnterDirective(_el) {
        this._el = _el;
        this.ngEnter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.el = this._el;
    }
    NgEnterDirective.prototype.onKeyDown = function (e) {
        if ((e.which == 13 || e.keyCode == 13)) {
            this.ngEnter.emit(e);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], NgEnterDirective.prototype, "ngEnter", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostListener */])('keyup', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], NgEnterDirective.prototype, "onKeyDown", null);
    NgEnterDirective = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* Directive */])({
            selector: '[ngEnter]'
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]])
    ], NgEnterDirective);
    return NgEnterDirective;
}());



/***/ }),

/***/ "../../../../../src/app/profile/profile.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".account-wall\r\n{\r\n    margin-top: 20px;\r\n    padding: 40px 0px 20px 0px;\r\n    background-color: #f7f7f7;\r\n    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n/*.no-padding{\r\n    padding: 0;\r\n}\r\n\r\n.static-size-card{\r\n    height: 45vh;\r\n    max-height: 45vh;\r\n}\r\n\r\n.static-size-list{\r\n    height: 85%;\r\n    max-height: 85%;\r\n    overflow-y: auto; \r\n}*/", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/profile/profile.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container container-fluid\">\r\n  <div class=\"row\">\r\n    <!--User profile information-->\r\n    <div class=\"col-12 mx-auto\">\r\n      <div class=\"card account-wall\">\r\n        <div class=\"text-center font-weight-bold\">\r\n          Profile Information\r\n        </div>\r\n        <form>\r\n          <div class=\"form-group row\">\r\n            <div class=\"form-group col-md-6\">\r\n              <label for=\"inputFirstName\" class=\"col-form-label\">First Name:</label>\r\n              <input [value]=\"this.user.firstName\" (input)=\"this.user.firstName = $event.target.value\" type=\"text\" class=\"form-control\"\r\n                id=\"inputFirstName\" placeholder=\"First Name\" required autofocus>\r\n            </div>\r\n            <div class=\"form-group col-md-6\">\r\n              <label for=\"inputLastName\" class=\"col-form-label\">Last Name:</label>\r\n              <input [value]=\"this.user.lastName\" (input)=\"this.user.lastName = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputLastName\"\r\n                placeholder=\"Last Name\" required autofocus>\r\n            </div>\r\n          </div>\r\n          <div class=\"for-group row\">\r\n            <div class=\"form-group col-md-6\">\r\n              <label for=\"inputUsername\" class=\"col-form-label\">Username:</label>\r\n              <input [value]=\"this.user.username\" (input)=\"this.user.username = $event.target.value\" type=\"text\" class=\"form-control\" id=\"inputUsername\"\r\n                placeholder=\"Username\" required>\r\n            </div>\r\n          </div>\r\n          <div class=\"form-group row\">\r\n            <div class=\"form-group col-md-6\">\r\n              <label for=\"inputPassword\" class=\"col-form-label\">Update Password:</label>\r\n              <input [value]=\"newPassword\" (input)=\"newPassword = $event.target.value\" type=\"password\" class=\"form-control\" id=\"inputPassword\"\r\n                placeholder=\"Password\" required>\r\n            </div>\r\n            <div class=\"form-group col-md-6\">\r\n              <label for=\"inputCPassword\" class=\"col-form-label\">Confirm Password:</label>\r\n              <input [value]=\"confirmPassword\" (input)=\"confirmPassword = $event.target.value\" type=\"password\" class=\"form-control\" id=\"inputCPassword\"\r\n                placeholder=\"Confirm Password\" required>\r\n              <small id=\"passwordHelpBlock\" class=\"form-text text-muted\" *ngIf=\"!passwordsMatch()\">Passwords must match</small>\r\n            </div>\r\n          </div>\r\n          <!--<button type=\"button\" class=\"btn btn-primary btn-block\" (click)=\"updateAccount()\" [disabled] = \"!passwordsMatch()\">Update Info</button>-->\r\n          <button type=\"button\" class=\"btn btn-primary btn-block\" (click)=\"updateAccount()\" [disabled]=\"true\">Update Info (Coming Soon!)</button>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/profile/profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This component controls the profile page. It allows the user to update/delete their current playlists
  and edit their creds.
*/





var ProfileComponent = (function () {
    function ProfileComponent(_apiService, _storage, _ngZone, _route, _router, _modalService) {
        this._apiService = _apiService;
        this._storage = _storage;
        this._ngZone = _ngZone;
        this._route = _route;
        this._router = _router;
        this._modalService = _modalService;
        this.newPlaylistName = "";
        this.firstName = "";
        this.lastName = "";
        this.displayName = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._route.data.subscribe(function (data) {
            _this.user = data.user;
        });
        this.playlists = this._apiService.getAllEntities('Playlists/User/' + this.user.userId);
    };
    /*
      Called when the user selects a playlist to edit
      @param playlist: Playlist - The playlist selected by the user
      @POST - Sets this.playlist to param playlist
    */
    ProfileComponent.prototype.playlistSelected = function (playlist) {
        this.playlist = playlist;
    };
    /*
      Called when the user removes a song from the playlist, it removes it from the DB
      and updates the DOM
      @param playlistSong: PlaylistSong - The playlist song to remove from the playlist
    */
    ProfileComponent.prototype.removeSong = function (playlistSong) {
        console.log(playlistSong);
    };
    /*
      Called when the user changes the name of a given playlist
      it opens a model and waits for the user to close it via click, click off, esc, or button press
      it then updates the playlist name on the DOM and backend DB <---soon to come
      @param content - The content placed in the modal
    */
    ProfileComponent.prototype.openModal = function (content) {
        var _this = this;
        this._modalService.open(content).result.then(function (result) {
            if (_this.newPlaylistName.length > 0)
                _this.playlist.name = _this.newPlaylistName;
            _this.newPlaylistName = "";
        }, function (reason) {
            _this.newPlaylistName = "";
        });
    };
    /*
      This method is currently not working, we need to update the backend to only update values that are passed,
      the problem is that if we don't update our password, the backend will set it to null => the user can never login
      Other than that, the user updates perfectly
    */
    ProfileComponent.prototype.updateAccount = function () {
        var _this = this;
        var s;
        var newUser;
        if (this.newPassword.length > 0 && this.confirmPassword.length > 0) {
            this.user.password = this.confirmPassword;
            newUser = this.user;
        }
        else {
            newUser = {
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                userID: this.user.userId,
                username: this.user.username
            };
        }
        s = this._apiService.putEntity("Users", this.user.userId, newUser).subscribe(function (d) { return d = d; }, function (err) { return console.log("Unable to update user", err); }, function () {
            console.log(_this.user);
            _this.newPassword = "";
            _this.confirmPassword = "";
            s.unsubscribe();
        });
    };
    /*
      Called when updating passwords returns if they match or not
      @return boolean - if the user's passwords match
    */
    ProfileComponent.prototype.passwordsMatch = function () {
        return this.newPassword.toLocaleLowerCase() === this.confirmPassword.toLocaleLowerCase();
    };
    ProfileComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'profile',
            template: __webpack_require__("../../../../../src/app/profile/profile.component.html"),
            styles: [__webpack_require__("../../../../../src/app/profile/profile.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_4__shared_session_storage_service__["a" /* StorageService */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* NgZone */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */], __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */]])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),

/***/ "../../../../../src/app/shared/api.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    Written by: Ryan Kruse
    This service is used whenver we make an API call. All methods take object type T and produce an
    Observable<T>. The service supports GET, POST, PUT, DELETE and login validation
*/



var ApiService = (function () {
    //private _api = 'http://localhost:60430/api/';
    function ApiService(_http, _storage) {
        this._http = _http;
        this._storage = _storage;
        this._api = 'https://xpx-mixtape.herokuapp.com/api/';
        this._youtubeToken = "AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4";
        this.lastFMKey = "1e231c3b75baee47b9c947ce5b806e0c";
    }
    /*
        Called when we attempt to login, it returns a token authenticating the user
        @param cred: string - The login credentials (username and password in json format)
        @return Observable<any> - An Observable containing a token for the user
    */
    ApiService.prototype.getLoginToken = function (cred) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this._http.post(this._api + 'Auth/login', cred, { headers: headers });
    };
    /*
        Called to validate the token given on login, if it is valid the API returns a user object without their password
        @return Observable<User> - A validated User object
    */
    ApiService.prototype.validateToken = function () {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.get(this._api + "Auth/me", { headers: headers });
    };
    /*
        This will be called once the backend is working properly
        @param username: string - The username to check for duplicates in the DB
        @return: Observable<any> - An error message if the username is taken, else null
    */
    ApiService.prototype.validateUsername = function (username) {
        return this._http.get(this._api + "Users/Check/" + username);
    };
    /*
        Returns a specific entity from the api
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to pull from the API
        @return Observable<T> - An Observable containing the specific entity from the DB
    */
    ApiService.prototype.getSingleEntity = function (path, id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.get(this._api + path + "/" + id, { headers: headers });
    };
    /*
        Returns all entities for a given endpoint (IE: Users, Playlists, etc)
        @param path: string - The relative patht to the api IE Users
        @return Observable<T> - An Observable containing an array of the specific entities from the DB
    */
    ApiService.prototype.getAllEntities = function (path) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.get(this._api + path, { headers: headers });
    };
    /*
        Adds a new entity to the DB
        @param path: string - The relative patht to the api IE Users/
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    ApiService.prototype.postEntity = function (path, obj) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.post(this._api + path, obj, { headers: headers });
    };
    /*
        Updates a specific entity in the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to update
        @param obj: any - the json object of the entity to add
        @return Observable<T> - An Observable containing the new entity added to the DB
    */
    ApiService.prototype.putEntity = function (path, id, obj) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.put(this._api + path + "/" + id, obj, { headers: headers });
    };
    /*
        Deletes a specific entity from the DB
        @param path: string - The relative patht to the api IE Users/
        @param id: number - The id of the entity to delete
        @return OBservable<T> - The object delted from the DB
    */
    ApiService.prototype.deleteEntity = function (path, id) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["d" /* HttpHeaders */]({ "Authorization": "Bearer " + this._storage.getValue("token") });
        return this._http.delete(this._api + path + "/" + id, { headers: headers });
    };
    /*
        Returns any for now, will return youtube type later (once it's all parsed out)
    */
    ApiService.prototype.getYoutubeResults = function (searchString, toDisplay) {
        if (!searchString || searchString.length <= 0)
            return;
        var baseUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet";
        var mResult = "&maxResults=" + toDisplay;
        var search = "&q=" + searchString;
        var endUrl = "&type=video&key=" + this._youtubeToken;
        return this._http.get(baseUrl + mResult + search + endUrl);
    };
    ApiService.prototype.getLastfmResults = function (artist, song) {
        var baseUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=" + this.lastFMKey;
        var postUrl = "&track=" + song + "&artist=" + artist + "&autocorrect=1&format=json";
        return this._http.get(baseUrl + postUrl);
    };
    ApiService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__shared_session_storage_service__["a" /* StorageService */]])
    ], ApiService);
    return ApiService;
}());

//AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4 TOKEN
// client ID: 132736446562-2bf10rb348ode6mtbfffl4pkns916e01.apps.googleusercontent.com
///Client SECRET: zXDxMcLjcQcpig0Bi4bXHMlP
/*
HOW TO SEARCH YOUTUBE API FOR A VIDEO GIVEN A SEARCH WORD:
BASE URL: https://www.googleapis.com/youtube/v3/search?part=snippet
&maxResults=<num results>
&q=<search>
&type=video
&key=AIzaSyDYswrJ-YubO8TOqNO0_ictO1RnTh8FC-4

LOOK AT ME: https://developers.google.com/youtube/v3/docs/search/list#examples



*/
/*


Application name	Mixtape-API
API key	1e231c3b75baee47b9c947ce5b806e0c
Shared secret	ea69e872350c66fdab63146a9a5fc5bc
Registered to	mhk-mixtape

*/ 


/***/ }),

/***/ "../../../../../src/app/shared/data-share.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataShareService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This service allows components to be dynamically updated and allows them to update the current user, playlist, and all playlists in real time
*/


var DataShareService = (function () {
    function DataShareService() {
        this.userSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.user = this.userSubject.asObservable();
        this.playlists = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]([]); //starts empty
        this.playlist = this.playlists.asObservable();
        this.currentPlaylistSubject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this.currentPlaylist = this.currentPlaylistSubject.asObservable();
    }
    /*
      Called when we make edits to any playlists the user owns, it alerts all subscribers
      and gives them the new data
      @param playlist: Playlist[] - An array of new playlists
    */
    DataShareService.prototype.changePlaylist = function (playlist) {
        this.playlists.next(playlist);
    };
    /*
      Called whenever we change the current user (usually just on login and logout)
      @param user: User - the new user
    */
    DataShareService.prototype.changeUser = function (user) {
        this.userSubject.next(user);
    };
    /*
      Called whenever we change the playlist we are currently listening to
      @param playlist: Playlist - The new playlist to listen to
    */
    DataShareService.prototype.changeCurrentPlaylist = function (playlist) {
        this.currentPlaylistSubject.next(playlist);
    };
    /*
      Called when we logout, it clears the values to avoid any collisions with the next login
    */
    DataShareService.prototype.clearAllValues = function () {
        this.userSubject.next(null);
        this.playlists.next(null);
        this.currentPlaylistSubject.next(null);
    };
    DataShareService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], DataShareService);
    return DataShareService;
}());



/***/ }),

/***/ "../../../../../src/app/shared/global-style.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".margin-top{\r\n    margin-top: 3%;\r\n}\r\n\r\n.no-padding{\r\n    padding: 0;\r\n}\r\n\r\n.shadow{\r\n    box-shadow:         3px 3px 5px 6px #ccc;\r\n    -moz-box-shadow:    3px 3px 5px 6px #ccc;\r\n    -webkit-box-shadow: 3px 3px 5px 6px #ccc;\r\n}\r\n\r\n#snackbar {\r\n    min-width: 250px; /* Set a default minimum width */\r\n    margin-left: -125px; /* Divide value of min-width by 2 */\r\n    background-color: #333; /* Black background color */\r\n    color: #fff; /* White text color */\r\n    text-align: center; /* Centered text */\r\n    border-radius: 2px; /* Rounded borders */\r\n    padding: 16px; /* Padding */\r\n    position: fixed; /* Sit on top of the screen */\r\n    z-index: 1; /* Add a z-index if needed */\r\n    left: 50%; /* Center the snackbar */\r\n    bottom: 30px; /* 30px from the bottom */\r\n}\r\n\r\nimg{\r\n    width: 50px;\r\n}\r\n\r\n.img-left{\r\n    float: left;\r\n}\r\n\r\n.img-right{\r\n    float: right;\r\n}\r\n\r\nimg#playlist-img{\r\n    width: 75px;\r\n}\r\n\r\n.icon{\r\n    display: inline;\r\n}\r\n\r\n.icon:hover{\r\n    cursor: pointer;\r\n}\r\n\r\n.icon-middle{\r\n    vertical-align: middle;\r\n}\r\n\r\n.icon-ex-sm{\r\n    width: 17px;\r\n}\r\n\r\n.icon-sm{\r\n    width: 20px;\r\n}\r\n\r\n.icon-med{\r\n    width: 30px;\r\n}\r\n\r\n.icon-lrg{\r\n    width: 35px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/shared/session-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SessionGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    Written by: Ryan Kruse
    This service checks if we have a token in session storage, if so it allows us to navigate to the given page
    otherwise it redirects the user to the login page
*/



var SessionGuard = (function () {
    function SessionGuard(_router, _storage) {
        this._router = _router;
        this._storage = _storage;
    }
    /*
        Called on attempted page load, checks if there is a token in session storage if so we continue else nav away
        @param route: ActivatedRouteSnapshot - The page we are attempting to load
        @return boolean - if the user can load the page (if we have a token or not)
    */
    SessionGuard.prototype.canActivate = function (route) {
        //If our user is not logged in, then he cannot access some pages so we send them to the login screen
        if (!this._storage.getValue('token')) {
            //alert('Please login to view this page'); //We can remove this only here for testing
            //start the new naviagation
            this._router.navigate(['/login']);
            //abort the path we were going to take
            return false;
        }
        return true;
    };
    SessionGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */], __WEBPACK_IMPORTED_MODULE_2__session_storage_service__["a" /* StorageService */]])
    ], SessionGuard);
    return SessionGuard;
}());



/***/ }),

/***/ "../../../../../src/app/shared/session-storage.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StorageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_share__ = __webpack_require__("../../../../rxjs/_esm5/add/operator/share.js");
/*
    What is stored (session storage):
        onSong - The index of the song the user is current listening to
        loggedIn - If the user is currently logged in or not
        token - the auth token given to the user on login
    What is stored (local storage):
        _history - The history of songs the user has listened to
        savedUsername - The username of the user if they clicked remember me
*/


var StorageService = (function () {
    function StorageService() {
        var _this = this;
        this.playlistObservable = new __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this._playlistObserver = observer;
        }).share();
    }
    /*
        Sets the playlist to a new value and notifies all subscribers
        @param key: string - '_playlist'
        @param value: any - The value to set it to
    */
    StorageService.prototype.setPlaylist = function (key, value) {
        this.setValue(key, value);
    };
    /*
        Sets a key in session storage to a given key
        @param key: string = the key of the object
        @param value: any - the value we want to set the key to
    */
    StorageService.prototype.setValue = function (key, value) {
        if (value) {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    };
    /*
        Returns a value from session storage if it exists, returns null if it does not
        @param key: string - the object we want to get the value for
        @return any - Returns the value of the key or null if the key is not in storage
    */
    StorageService.prototype.getValue = function (key) {
        var value = sessionStorage.getItem(key);
        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value);
        }
        return null;
    };
    /*
        Returns if the key is in the session storage or not
    */
    StorageService.prototype.hasValue = function (key) {
        if (sessionStorage.getItem(key) === null) {
            return false;
        }
        return true;
    };
    /*
        Removes the key and its corresponding value from session storage
    */
    StorageService.prototype.removeValue = function (key) {
        sessionStorage.removeItem(key);
    };
    /*
        Clears the whole storage
    */
    StorageService.prototype.clearAll = function () {
        sessionStorage.clear();
    };
    StorageService.prototype.saveToLocal = function (key, value) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    };
    StorageService.prototype.getFromLocal = function (key) {
        var value = localStorage.getItem(key);
        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value);
        }
        return null;
    };
    StorageService.prototype.removeFromLocal = function (key) {
        localStorage.removeItem(key);
    };
    return StorageService;
}());



/***/ }),

/***/ "../../../../../src/app/shared/user-resolver.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    This service is called when we go to a new page, it makes sure we always have the newest update of
    the user entity.
    Within each component that uses this, we can get the user info from the API
*/




var UserResolver = (function () {
    function UserResolver(router, apiService, storage) {
        this.router = router;
        this.apiService = apiService;
        this.storage = storage;
    }
    UserResolver.prototype.resolve = function (route) {
        return this.apiService.validateToken();
    };
    UserResolver = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */], __WEBPACK_IMPORTED_MODULE_2__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_3__session_storage_service__["a" /* StorageService */]])
    ], UserResolver);
    return UserResolver;
}());



/***/ }),

/***/ "../../../../../src/app/shared/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
    This service class is used to get any user details and make API requests,
    it is created to make communication between pages much easier and only dependent
    on one service
*/



var UserService = (function () {
    function UserService(_apiService, _storage) {
        this._apiService = _apiService;
        this._storage = _storage;
        this.loggedIn = false;
    }
    /*
        Called from login.component, sets our user to our storage value and sets login to true
    */
    UserService.prototype.logIn = function (user) {
        this.user = user; //this._storage.getValue('user');
        this.loggedIn = this._storage.getValue('loggedIn');
    };
    /*
        Clear the storage to update our DOM and set values
    */
    UserService.prototype.logOut = function () {
        this.loggedIn = false;
        this.user = null;
        this._storage.removeValue('token');
        this._storage.setValue('loggedIn', this.loggedIn);
    };
    UserService.prototype.getUserID = function () {
        if (this.user)
            return this.user.userId;
        return -1;
    };
    UserService.prototype.setUser = function (user) {
        this.user = user;
    };
    UserService.prototype.getUser = function () {
        return this.user;
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_2__shared_session_storage_service__["a" /* StorageService */]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "../../../../../src/app/sidebar/sidebar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".side-bar{\r\n    height: 100vh;\r\n}\r\n\r\n.btn{\r\n    overflow-x: hidden;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/sidebar/sidebar.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"side-bar no-padding\">\r\n  <div class=\"card w-100\">\r\n    <div class=\"card-header text-center font-weight-bold\">Playlists:\r\n      <img class=\"icon icon-middle icon-sm float-right img-margin\" placement=\"left\" ngbTooltip=\"Create Playlist\" src='assets/playlist/edit.png'\r\n        (click)=\"createPlaylist()\" />\r\n    </div>\r\n    <ul class=\"list-group list-group-flush\">\r\n      <li class=\"list-group-item list-group-item-action\" (mouseover)=\"this.mouseOver = i\" (mouseout)=\"this.mouseOver = -1\" *ngFor=\"let playlist of userPlaylists index as i\"\r\n        (click)=\"selectPlaylist(playlist)\">\r\n        {{ playlist.name }}\r\n        <app-mouseover-menu [@showState]=\"this.mouseOver === i ? 'show' : 'hide'\" [addToPL]=\"false\" [addToQ]=\"false\" [deleteFromPL]=\"false\"\r\n          [deletePL]=\"true\" [selectedSong]=\"null\" [plToDelete]=\"playlist\" (successMessageOutput)=\"triggerMessage($event)\" (click)=\"$event.stopPropagation()\"></app-mouseover-menu>\r\n      </li>\r\n      <button class=\"btn btn-secondary\" (click)=\"selectPlaylist(null)\">Clear Queue</button>\r\n    </ul>\r\n  </div>\r\n  <div id=\"snackbar\" [@showState]=\"successMessage ? 'show' : 'hide'\">{{ successMessage }}</div>\r\n</div>"

/***/ }),

/***/ "../../../../../src/app/sidebar/sidebar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("../../../animations/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This component controls the playlist holder on the right side of the DOM. It allows the user to select which playlist to listen to
  and allows them to create a new playlist
*/






var SidebarComponent = (function () {
    function SidebarComponent(_apiService, _dataShareService) {
        this._apiService = _apiService;
        this._dataShareService = _dataShareService;
        this.userPlaylists = [];
        this.mouseOver = -1;
        this._success = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["a" /* Subject */]();
        this.defaultPLName = "Playlist ";
        this.playlist = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */](); //Output the playlist selected to listen to
    }
    /*
      On init we sync all of the user's playlists and the user.
    */
    SidebarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._dataShareService.playlist.subscribe(function (res) { return _this.userPlaylists = res; });
        this._dataShareService.user.subscribe(function (res) { return _this.user = res; });
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__["a" /* debounceTime */].call(this._success, 2000).subscribe(function () { return _this.successMessage = null; });
        //Incase the sync was messed up we also pull all of the user's playlists from the API as a saftey net
        var s;
        s = this._apiService.getAllEntities('Playlists/User/' + this.user.userId).subscribe(function (d) { return _this.userPlaylists = d; }, function (err) { return console.log("Unable to load playlists", err); }, function () { s.unsubscribe(); _this._dataShareService.changePlaylist(_this.userPlaylists); });
    };
    /*
      Called when the user selects a playlist to listen to. It alerts all parent components of
      the playlist
      @param p: Playlist - The playlist selected to listen to
    */
    SidebarComponent.prototype.selectPlaylist = function (p) {
        this.playlist.emit(p);
    };
    SidebarComponent.prototype.createPlaylist = function () {
        var _this = this;
        var nPL = {
            active: true,
            name: this.defaultPLName + (this.userPlaylists.length + 1),
            userId: this.user.userId,
        };
        var returnedPL;
        var s = this._apiService.postEntity("Playlists", nPL).subscribe(function (d) { return returnedPL = d; }, function (err) { return console.log(err); }, function () {
            s.unsubscribe();
            _this.userPlaylists.push(returnedPL);
            _this._dataShareService.changePlaylist(_this.userPlaylists);
            _this.triggerMessage("Playlist created!");
            _this.selectPlaylist(returnedPL);
        });
    };
    SidebarComponent.prototype.triggerMessage = function (message) {
        this.successMessage = message;
        this._success.next(this.successMessage);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Output */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */])
    ], SidebarComponent.prototype, "playlist", void 0);
    SidebarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-sidebar',
            template: __webpack_require__("../../../../../src/app/sidebar/sidebar.component.html"),
            styles: [__webpack_require__("../../../../../src/app/sidebar/sidebar.component.css"), __webpack_require__("../../../../../src/app/shared/global-style.css")],
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */])('showState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 1,
                        visibility: 'visible'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('hide', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 0,
                        visibility: 'hidden'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('show => *', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('200ms')),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('hide => show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('400ms')),
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__shared_api_service__["a" /* ApiService */], __WEBPACK_IMPORTED_MODULE_5__shared_data_share_service__["a" /* DataShareService */]])
    ], SidebarComponent);
    return SidebarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/youtube.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return YoutubePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var YoutubePipe = (function () {
    function YoutubePipe() {
    }
    YoutubePipe.prototype.transform = function (items) {
        if (!items)
            return [];
        return items['items'];
    };
    YoutubePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* Pipe */])({
            name: 'youtubePipe'
        })
    ], YoutubePipe);
    return YoutubePipe;
}());



/***/ }),

/***/ "../../../../../src/app/youtube/youtube.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".current-playlist-holder{\r\n    background: darkgrey !important;\r\n}\r\n\r\n.no-padding{\r\n    padding: 0;\r\n}\r\n\r\n.current-playlist-holder{\r\n    background: darkgrey !important;\r\n}\r\n\r\n.playlist-container{\r\n    padding: 0;\r\n    overflow-x: hidden;\r\n}\r\n\r\n.playlist-song-list{\r\n    background: lightgrey !important;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/youtube/youtube.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container container-fluid\">\r\n  <div class=\"row\">\r\n    <div class=\"col-12 no-padding\">\r\n      <youtube-player [videoId]=\"this.videoId\" [height]=\"getScreenHeight()\" [width]=\"getScreenWidth()\" (ready)=\"savePlayer($event)\"\r\n        (change)=\"onStateChange($event)\"></youtube-player>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-12 playlist-container playlist-song-list no-padding margin-top shadow\" *ngIf=\"this.playlist && this.showPlaylist\">\r\n      <div class=\"card\" *ngIf=\"this.playlist  && this.showPlaylist\">\r\n        <div class=\"card-header text-center current-playlist-holder\">\r\n          <h5 class=\"text-center\" placement=\"top\" ngbTooltip=\"Edit Playlist Name\" (click)=\"openModal(content)\">{{this.playlist.name}}</h5>\r\n        </div>\r\n        <ol class=\"list-group list-group-flush\" *ngFor=\"let pls of this.playlist.playlistSong index as i\">\r\n          <li class=\"list-group-item\" [style.background-color]=\"this.onSong === i ? '#918A8A' : '#BEBEBE'\" (mouseover)=\"this.mouseOver = i\"\r\n            (mouseout)=\"this.mouseOver = -1\">\r\n            <img class=\"d-none d-sm-none d-md-inline\" [src]=\"this.getThumbnail(pls.song.url)\" /> {{i+1}}. {{pls.song.name}}\r\n            <app-mouseover-menu [@showState]=\"this.mouseOver === i ? 'show' : 'hide'\" [addToPL]=\"true\" [addToQ]=\"true\" [deleteFromPL]=\"true\"\r\n              [selectedSong]=\"pls.song\" [selectedPLS]=\"pls\" (successMessageOutput)=\"triggerMessage($event)\"></app-mouseover-menu>\r\n          </li>\r\n        </ol>\r\n      </div>\r\n    </div>\r\n    <div id=\"snackbar\" [@showState]=\"successMessage ? 'show' : 'hide'\">{{ successMessage }}</div>\r\n  </div>\r\n</div>\r\n\r\n<ng-template #content let-c=\"close\" let-d=\"dismiss\">\r\n  <div class=\"modal-header\">\r\n    <h4 class=\"modal-title\">Change Playlist Name</h4>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <input [value]=\"playlistRename\" (input)=\"playlistRename = $event.target.value\" type=\"text\" class=\"form-control col-12\" placeholder=\"Playlist Name\"\r\n      (ngEnter)=\"c($event)\" autofocus=\"autofocus\">\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button type=\"button\" class=\"btn btn-success col-2\" (click)=\"c()\" [disabled]=\"playlistRename.length <= 0 || playlistRename === this.playlist.name\">Save</button>\r\n  </div>\r\n</ng-template>"

/***/ }),

/***/ "../../../../../src/app/youtube/youtube.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return YoutubeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_animations__ = __webpack_require__("../../../animations/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__ = __webpack_require__("../../../../rxjs/_esm5/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_session_storage_service__ = __webpack_require__("../../../../../src/app/shared/session-storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_data_share_service__ = __webpack_require__("../../../../../src/app/shared/data-share.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_api_service__ = __webpack_require__("../../../../../src/app/shared/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
  Written by: Ryan Kruse
  This component controls the embded youtube player and the currently playing playlist.
*/








var YoutubeComponent = (function () {
    function YoutubeComponent(_storage, _dataShareService, _modalService, _apiService) {
        this._storage = _storage;
        this._dataShareService = _dataShareService;
        this._modalService = _modalService;
        this._apiService = _apiService;
        this.url = "";
        this._success = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["a" /* Subject */]();
        this.mouseOver = -1;
        this.onSong = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : -1;
        this.repeat = false;
        this.paused = false;
        this.playlistRename = "";
    }
    YoutubeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.lastPlaylist = this.playlist;
        this._dataShareService.currentPlaylist.subscribe(function (res) { return _this.playlist = res; });
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        __WEBPACK_IMPORTED_MODULE_3_rxjs_operator_debounceTime__["a" /* debounceTime */].call(this._success, 2000).subscribe(function () { return _this.successMessage = null; });
    };
    /*
      This is called on load or when we select a new playlist to view
    */
    YoutubeComponent.prototype.ngOnChanges = function () {
        //If we do not have a playlist selected, there is nothing to do
        if (!this.playlist || !this.showPlaylist)
            return;
        //If our lastplayist we watched is equal to the current one, then we continue playing where we left off
        if (this.lastPlaylist === this.playlist || (this.lastPlaylist && (this.lastPlaylist.playlistId === this.playlist.playlistId))) {
            this.onSong = this._storage.getValue('onSong') ? this._storage.getValue('onSong') : 0;
        }
        else {
            this.onSong = -1;
            this.lastPlaylist = this.playlist;
            this.nextSong();
        }
    };
    YoutubeComponent.prototype.savePlayer = function (player) {
        this.player = player;
        this.player.setSize(this.getScreenWidth(), this.getScreenHeight());
    };
    /*
      Called when soemthing changes our player state (ie we pause the video or it ends)
      -1 - not started
      0 - ended
      1 - playing
      2 - paused
      3 - loading
    */
    YoutubeComponent.prototype.onStateChange = function (event) {
        switch (event.data) {
            case -1:
                break;
            case 0:
                this.nextSong();
                break;
            case 1:
                this.paused = false;
                break;
            case 2:
                this.paused = true;
                break;
            case 3:
                break;
            default:
                console.log("DEFAULT");
        }
    };
    /*
      If the user clicks the next button we move to the next song, if repeat is
      enabled we restart the playlist (if on the last song)
    */
    YoutubeComponent.prototype.nextSong = function () {
        if (this.onSong + 1 >= this.playlist.playlistSong.length) {
            if (this.repeat)
                this.onSong = 0;
            else
                return;
        }
        else {
            this.onSong++;
        }
        this.playVideo();
    };
    /*
      If the user clicks the last button we move to the last song, if repeat is
      enabled we move to the last song (if on the first song)
    */
    YoutubeComponent.prototype.lastSong = function () {
        if (this.onSong - 1 < 0) {
            this.onSong = this.playlist.playlistSong.length - 1;
        }
        else {
            this.onSong--;
        }
        this.playVideo();
    };
    /*
      This method is called when we move to a new song or load a new playlist
      it sets what song we are on in the session storage and loads then plays the video
    */
    YoutubeComponent.prototype.playVideo = function () {
        this._storage.setValue('onSong', this.onSong);
        this.parseId(this.playlist.playlistSong[this.onSong].song.url);
        this.player.loadVideoById(this.videoId, 0);
        this.player.playVideo();
    };
    YoutubeComponent.prototype.repeatClicked = function () {
        this.repeat = !this.repeat;
    };
    YoutubeComponent.prototype.pauseClicked = function () {
        this.paused = !this.paused;
        if (this.paused)
            this.player.pauseVideo();
        else
            this.player.playVideo();
    };
    YoutubeComponent.prototype.triggerMessage = function (message) {
        this.successMessage = message;
        this._success.next(this.successMessage);
    };
    YoutubeComponent.prototype.openModal = function (content) {
        var _this = this;
        this._modalService.open(content).result.then(function (result) {
            if (_this.playlistRename.length > 0)
                _this.playlist.name = _this.playlistRename;
            _this.renamePlaylist();
            _this.playlistRename = "";
        }, function (reason) {
            _this.playlistRename = "";
        });
    };
    YoutubeComponent.prototype.renamePlaylist = function () {
        var _this = this;
        var s = this._apiService.putEntity("Playlists", this.playlist.playlistId, this.playlist).subscribe(function (d) { return d = d; }, function (err) { return _this.triggerMessage("Unable to change name of playlist"); }, function () {
            s.unsubscribe();
            _this.triggerMessage("Playlist name updated!");
        });
    };
    /*
      This method is called when we load a video, it parses the video ID from the youtube link
      @Input url: string - The url to parse
      @POST: sets this.videoId to the parsed string
    */
    YoutubeComponent.prototype.parseId = function (url) {
        if (url !== '') {
            var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if (fixedUrl !== undefined) {
                this.videoId = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                this.videoId = this.videoId[0];
            }
            else {
                this.videoId = url;
            }
        }
    };
    /*
      This method is called everytime we display a song on the DOM, it requests the thumbnail saved via youtube's api
      and returns the source string to load the image from
      @Input url: string - The video url to get the thumbnail for
      @Output string - The thumbnail source link from the youtube api
    */
    YoutubeComponent.prototype.getThumbnail = function (url) {
        var prefixImgUrl = "https://img.youtube.com/vi/";
        var suffixImgUrl = "/default.jpg";
        var ID;
        var imgURL = '';
        //Pull the video ID from the link so we can embed the video
        if (url !== '') {
            var fixedUrl = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            if (fixedUrl !== undefined) {
                ID = fixedUrl[2].split(/[^0-9a-z_\-]/i);
                ID = ID[0];
            }
            else {
                ID = url;
            }
            imgURL = prefixImgUrl + ID + suffixImgUrl;
        }
        return imgURL;
    };
    YoutubeComponent.prototype.getScreenHeight = function () {
        return window.screen.height * .35;
    };
    YoutubeComponent.prototype.getScreenWidth = function () {
        return window.screen.width * .45;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], YoutubeComponent.prototype, "playlist", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Boolean)
    ], YoutubeComponent.prototype, "showPlaylist", void 0);
    YoutubeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-youtube',
            template: __webpack_require__("../../../../../src/app/youtube/youtube.component.html"),
            styles: [__webpack_require__("../../../../../src/app/youtube/youtube.component.css"), __webpack_require__("../../../../../src/app/shared/global-style.css")],
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["j" /* trigger */])('showState', [
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 1,
                        visibility: 'visible'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["g" /* state */])('hide', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["h" /* style */])({
                        opacity: 0,
                        visibility: 'hidden'
                    })),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('show => *', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('200ms')),
                    Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["i" /* transition */])('hide => show', Object(__WEBPACK_IMPORTED_MODULE_1__angular_animations__["e" /* animate */])('400ms')),
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__shared_session_storage_service__["a" /* StorageService */], __WEBPACK_IMPORTED_MODULE_6__shared_data_share_service__["a" /* DataShareService */], __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */], __WEBPACK_IMPORTED_MODULE_7__shared_api_service__["a" /* ApiService */]])
    ], YoutubeComponent);
    return YoutubeComponent;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map