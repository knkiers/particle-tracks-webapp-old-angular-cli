import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {GridItemComponent} from '../grid-item';

import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';

@Component({
  moduleId: module.id,
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.css'],
  providers: [EventDisplayService, UnitConversionService],
  directives: [
    ROUTER_DIRECTIVES,
    GridItemComponent,
  ],
})
export class AnalysisDisplayComponent implements OnInit {


  dots: any;

  constructor(private unitConversionService:UnitConversionService) {}

  ngOnInit() {
    this.unitConversionService.getGrid().subscribe(
      dots => {
        this.dots = dots;
        //console.log(this.dots);
        //console.log('got here!!!!');
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Grid fetched"));
  }

  selectDot(id: any){
    console.log('inside selectDot');
    console.log(id);
    var index = null;
    for (let i in this.dots){
      if ((this.dots[i].id === id) && (this.dots[i].activated)){
        index = i;//use this dot for the fit
      }
    }
    if (index !== null) {
      this.dots[index].useForFit = true;
    }
  }

  dotSelected(params: any) {
    console.log('parent sensed mouse event!');
    console.log(params);
    this.selectDot(params.id)
  }

}
