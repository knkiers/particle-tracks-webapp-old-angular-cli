import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const RADIUS_ACTIVATED = 4;//px
const RADIUS_NOT_ACTIVATED = 0.5;
const STROKE_WIDTH_USED_FOR_FIT = 2;
const STROKE_WIDTH_NOT_USED_FOR_FIT = 0;

@Component({
  moduleId: module.id,
  selector: '[app-grid-item]',//apparently the square brackets are necessary b/c this is css styling(?)
  templateUrl: 'grid-item.component.html',
  styleUrls: ['grid-item.component.css']
})
export class GridItemComponent implements OnInit {

  @Input() params: any;
  @Output() dotSelected = new EventEmitter();

  constructor() {}

  ngOnInit() {
    //console.log('got to app-grid-item');
    //console.log(this.params);
  }

  findRadius(){
    return this.params.activated ? RADIUS_ACTIVATED : RADIUS_NOT_ACTIVATED;
  }

  findStrokeWidth(){
    return this.params.useForFit ? STROKE_WIDTH_USED_FOR_FIT : STROKE_WIDTH_NOT_USED_FOR_FIT;
  }

  checkDot(){
    console.log('moused!');
    if (this.params.activated) {
      this.dotSelected.emit(this.params);
    }
  }

}
