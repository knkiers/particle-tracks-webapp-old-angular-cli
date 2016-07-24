import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {GridItemComponent} from '../grid-item';
import {CircleItemComponent} from '../circle-item';
import {EventComponent} from '../event';

import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

import {Event} from '../../shared/models/event';

@Component({
  moduleId: module.id,
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.css'],
  providers: [EventDisplayService, UnitConversionService, EventAnalysisService],
  directives: [
    ROUTER_DIRECTIVES,
    GridItemComponent,
    CircleItemComponent,
    EventComponent
  ],
})
export class AnalysisDisplayComponent implements OnInit {

  //@Input() event: Event;
  //@Input() numberEventsRequested: any;

  private event: Event;
  private eventJSON: any;
  private numberEventsRequested = 0;
  private svgRegion: any;

  private dots: any;
  private circles = [];
  private boundaries: any;

  constructor(
    private unitConversionService:UnitConversionService,
    private eventAnalysisService:EventAnalysisService,
    private eventDisplayService:EventDisplayService) {}

  ngOnInit() {
    this.unitConversionService.getGrid().subscribe(
      dots => {
        this.dots = dots;
      },
      err => console.log("ERROR", err),
      () => console.log("Grid fetched"));
    this.unitConversionService.getBoundaries().subscribe(
      boundaries => {
        this.boundaries = boundaries;
      },
      err => console.log("ERROR", err),
      () => console.log("Boundaries fetched"));
  }

  fetchNewEvent() {
    this.event = null;//forces a redraw of the event when the new one comes in
    this.eventDisplayService.getEvent()
      .subscribe(
        event => {
          this.eventJSON = event;
          console.log(JSON.parse(this.eventJSON));
          //console.log(JSON.parse(this.event));
          this.event = JSON.parse(this.eventJSON);
          console.log(this.event);
          //this.numberEventsRequested++;
        }
      );
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

  addCircle(){
    var dataDict = this.eventAnalysisService.fitCircleToData(this.dots, this.circles, this.boundaries);
    var circleInputData = this.eventAnalysisService.gatherDataFromDots(this.dots);
    console.log(dataDict);
  }

  clearDotsForFit(){
    this.eventAnalysisService.clearDotsForFit(this.dots);
  }

}
