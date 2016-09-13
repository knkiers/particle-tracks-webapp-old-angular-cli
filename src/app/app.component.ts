import { Component, OnInit } from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {MaterializeDirective} from "angular2-materialize";

import { UserService } from './shared/services/user.service';
import { LoggedInGuard } from './shared/guards/logged-in.guard';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

// will eventually need to upgrade to RC5+ (currently at RC6):
// https://angular.io/docs/ts/latest/cookbook/rc4-to-rc5.html


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [UserService, LoggedInGuard],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective],
})
export class AppComponent implements OnInit{

  currentUser: any; // TODO: construct a User object(!)

  constructor(
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    // grab current user info if it exists....
    if (this.userService.isLoggedIn()){
      //this.currentUser = this.userService.getCurrentUser();
      console.log('inside ngOnInit, and the user is logged in already');
      // WORKING HERE:
      // - after creating a user object, will just get it (as above), and then
      //   will have access to the user's name, etc.
      //console.log(this.currentUser);
    } else {
      console.log('inside ngOnInit, and the user is not logged in yet');
      //console.log(this.currentUser);
    }
    // ...and sign up for the service in order to keep up with changes
    this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        console.log('inside app comp...user updated');
        console.log(this.currentUser);
      });
    /*
     if(this.isLoggedIn()) {
     //this.currentUserName = this.user.currentUser.fullName();
     console.log()
     }
     */
  }

  isLoggedIn(){
    return this.userService.isLoggedIn();
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }


}
