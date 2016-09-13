// logged-in.guard.ts
// see: https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.lqhxl5wku
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private user: UserService) {}

  canActivate() {
    return this.user.isLoggedIn();
  }
}
