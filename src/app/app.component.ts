import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {MaterializeDirective} from "angular2-materialize";

import { UserService } from './shared/services/user.service';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

// will eventually need to upgrade to RC5+ (currently at RC6):
// https://angular.io/docs/ts/latest/cookbook/rc4-to-rc5.html


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [UserService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective],
})
export class AppComponent {
  title = 'app works!';
}
