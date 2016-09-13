import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, Injectable } from '@angular/core';
import { AppComponent, environment } from './app/';

import { disableDeprecatedForms, provideForms } from '@angular/forms';

import {APP_ROUTER_PROVIDERS} from './app/app.routes';
import {HTTP_PROVIDERS, BrowserXhr} from '@angular/http';

import { LoggedInGuard } from './app/shared/guards/logged-in.guard';
import { UserService } from './app/shared/services/user.service';


import "angular2-materialize";

@Injectable()
class CORSBrowserXhr extends BrowserXhr {
  build() {
    let xhr = super.build();
    xhr.withCredentials = true;
    return xhr;
  }
}

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent,
  [
    HTTP_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    LoggedInGuard,
    UserService,
    disableDeprecatedForms(), // disable deprecated forms
    provideForms(), // enable new forms module
  ]).catch(err => console.error(err));
