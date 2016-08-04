import { Component, OnInit, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import {MaterializeDirective} from "angular2-materialize";

import {GridItemComponent} from '../grid-item';
import {CircleItemComponent} from '../circle-item';
import {EventComponent} from '../event';
import {CircleTableComponent} from '../circle-table';
import {AxisComponent} from '../axis';

import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

import { CircleBindingService } from '../circle-binding.service';

import {Event} from '../../shared/models/event';

@Component({
  moduleId: module.id,
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.css'],
  providers: [
    EventDisplayService,
    UnitConversionService,
    EventAnalysisService,
    CircleBindingService],
  directives: [
    ROUTER_DIRECTIVES,
    GridItemComponent,
    CircleItemComponent,
    EventComponent,
    CircleTableComponent,
    AxisComponent,
    MaterializeDirective
  ],
})
export class AnalysisDisplayComponent implements OnInit {

  //@Input() event: Event;
  //@Input() numberEventsRequested: any;

  subscription: Subscription;
  circleSubscription: Subscription;

  private event: Event;
  private eventJSON: any;
  private numberEventsRequested = 0;
  private svgRegion: any;

  private dots: any;
  private circles = [];
  private numberCircles = 0;
  private boundaries: any;
  private interactionRegion: any;
  private interactionLocation: any;
  private eventDisplay: any;

  private editModeOn = false;
  private revealEvent = false;
  private colourModeOn = true;
  private showAxes = false;

  private bFieldStrength = 50;
  private bFieldDirection = 'in';

  constructor(
    private unitConversionService:UnitConversionService,
    private eventAnalysisService:EventAnalysisService,
    private circleBindingService:CircleBindingService,
    private eventDisplayService:EventDisplayService) {
    this.subscription = eventDisplayService.gridActivationAnnounced$.subscribe(
      gridIndices => {
        this.activateDots(gridIndices);
      });
    this.circleSubscription = circleBindingService.circleUpdated$.subscribe(
      updateData=> {
        this.editCircleProperty(updateData);
        this.updateCircleTangentAngles();
      }
    );

  }

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
    this.unitConversionService.getInteractionRegion().subscribe(
      interactionRegion => {
        this.interactionRegion = interactionRegion;
      });

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
          this.resetCircles();
          this.initializeEvent();
        }
      );
  }

  initializeEvent() {
    this.interactionLocation = {
      x: Math.random() * (this.interactionRegion.xmax - this.interactionRegion.xmin) + this.interactionRegion.xmin,
      y: Math.random() * (this.interactionRegion.ymax - this.interactionRegion.ymin) + this.interactionRegion.ymin
    }

    console.log('interaction location!');
    console.log(this.interactionLocation);

    this.eventDisplay = this.eventDisplayService.getStringEventDisplay(
      this.bFieldStrength,
      this.bFieldDirection,
      this.dots,
      this.boundaries,
      this.interactionLocation,
      this.event);

    console.log(this.eventDisplay);
  }

  /*
    this method is called after an array of activatedDots is received
    via the subscription service (following the generation of a new event)
   */
  activateDots(gridIndices) {
    if (this.dots !== undefined) {// in principle possible(?) that dots has not yet been initialized....
      for (let i in this.dots) {
        this.dots[i].activated = false; // first deactivate all dots
        this.dots[i].useForFit = false; // reset this property as well....
      }
      for (let i of gridIndices) { // now activate the ones indicated in gridIndices
        this.dots[i].activated = true;
      }
    }
  }

  resetCircles(){
    this.circles = [];
  }

  clearDotsForFit(){
    var i;
    for (i=0; i<this.dots.length; i++) {
      this.dots[i].useForFit = false;
    }
    //this.eventAnalysisService.clearDotsForFit(this.dots);
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

  deselectDot(id: any){
    console.log('inside deselectDot');
    console.log(id);
    var index = null;
    for (let i in this.dots){
      if ((this.dots[i].id === id) && (this.dots[i].activated)){
        index = i;//use this dot for the fit
      }
    }
    if (index !== null) {
      this.dots[index].useForFit = false;
    }
  }

  dotSelected(params: any) {
    console.log('parent sensed mouse event!');
    console.log(params);
    this.selectDot(params.id)
  }

  dotDeselected(params: any) {
    console.log('parent sensed mouse event!');
    console.log(params);
    this.deselectDot(params.id)
  }

  addCircle(){
    /*
     dataDict = {
     circle:      circleDataPx,
     error:        error,
     errorMessage: errorMessage
     };
     */
    var dataDict = this.eventAnalysisService.fitCircleToData(this.dots, this.boundaries);
    //var circleInputData = this.eventAnalysisService.gatherDataFromDots(this.dots);
    console.log(dataDict);
    if (!dataDict.error){
      this.circles.push(dataDict.circle);
      this.clearDotsForFit();
      this.numberCircles = this.circles.length;
      console.log(this.numberCircles);
      if (this.numberCircles >= 2) {
        this.showAxes = true;
        this.updateCircleTangentAngles();
      }
    }

  }

  // ACTUALLY: should define some actions that can occur for the circle:
  // 'hover', 'unhover', 'delete', 'toggleRotationDirection', 'toggleIncomingOutgoing'


  hoverCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = true;
    }
  }

  unhoverCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].hovered = false;
    }
  }

  deleteCircle(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles.splice(i,1);
      this.numberCircles = this.circles.length;
      console.log(this.numberCircles);
      if (this.numberCircles < 2) {
        this.showAxes = false;
        this.updateCircleTangentAngles();
      }
    }
  }

  toggleCircleRotationDirection(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].CW = !this.circles[i].CW;
    }
  }

  updateCircleTangentAngles() {
    if (!this.showAxes) {
      for (let i in this.circles) {
        this.circles[i].theta = null;
      }
    } else {
      for (let i in this.circles) {
        var theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, this.circles[i]);
        this.circles[i].theta = theta;
      }
    }
  }

  /*
  addCircleTangentAngles() {
    for (let i in this.circles) {
      var theta = this.eventAnalysisService.computeTangentAngle(this.interactionLocation, this.circles[i]);
      this.circles[i].theta = theta;
    }
  }
  */

  toggleParticleIncomingOutgoing(i: number) {
    if (this.circles[i]!==undefined) {// in case the circle was deleted in the meantime, or something
      this.circles[i].incoming = !this.circles[i].incoming;
    }
  }

  editCircleProperty(updateData) {

    console.log('inside component');
    console.log(updateData);

    var i = updateData.index;
    var command = updateData.command;
    if (this.circles[i] !== undefined) {
      switch (command) {
        case "hover":
          this.hoverCircle(i);
          break;
        case "unhover":
          this.unhoverCircle(i);
          break;
        case "delete":
          this.deleteCircle(i);
          break;
        case "toggleRotationDirection":
          this.toggleCircleRotationDirection(i);
          break;
        case "toggleIncomingOutgoing":
          this.toggleParticleIncomingOutgoing(i);
          break;
      }
    }
  }

  turnOnEditMode(){
    console.log('inside toggle edit mode fn');
    if (!this.editModeOn) {
      console.log('got here');
      this.editModeOn = true;
    }
  }

  showEvent(){
    this.revealEvent = true;
  }

  hideEvent(){
    this.revealEvent = false;
  }

  /*
  toggleColourMode(){
    this.colourModeOn =!this.colourModeOn;
  }
  */

}
