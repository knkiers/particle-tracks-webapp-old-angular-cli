import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
//import localStorage from 'localStorage';

// useful authentication resource:
// https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.swnprx2cf

import {EventTypeUrl} from './urls';
import {LoginUrl} from './urls';

@Injectable()
export class UserService {

  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(username, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // WORKING HERE...need to find the right api endpt for logging in....
    return this.http
      .post(
        LoginUrl,
        JSON.stringify({ username, password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log('inside user service');
        console.log(res);
        localStorage.setItem('auth_token', res.token);
        this.loggedIn = true;
        console.log(localStorage.getItem('auth_token'));
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

}
