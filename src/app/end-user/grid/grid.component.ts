import { Component, OnInit } from '@angular/core';

import {GridItemComponent} from '../grid-item';

@Component({
  moduleId: module.id,
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.css'],
  directives: [GridItemComponent],
})
export class GridComponent implements OnInit {

  radius = 40;
  constructor() {}

  ngOnInit() {
    console.log('got to app-grid');
  }

}
