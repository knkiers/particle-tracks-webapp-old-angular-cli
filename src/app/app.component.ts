import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {MaterializeDirective} from "angular2-materialize";

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective]
})
export class AppComponent {
  title = 'app works!';
}
