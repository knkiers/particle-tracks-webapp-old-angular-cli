import { Component, OnInit, Input } from '@angular/core';
import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';
//import {EventAnalysisService} from '../../shared/services/event-analysis.service';
import {Event} from '../../shared/models/event';


@Component({
  moduleId: module.id,
  selector: '[app-event]',
  templateUrl: 'event.component.html',
  styleUrls: ['event.component.css'],
  //providers: [UnitConversionService],
})
export class EventComponent implements OnInit {

  @Input() event: Event;
  @Input() dots: any;

  private boundaries: any;
  private interactionRegion: any;
  private interactionLocation: any;
  private display;


  private bFieldStrength = 50;
  private bFieldDirection = 'in';

  constructor(private unitConversionService:UnitConversionService,
              private eventDisplayService:EventDisplayService) {}

  ngOnInit() {
    this.unitConversionService.getInteractionRegion().subscribe(
      interactionRegion => {
        this.interactionRegion = interactionRegion;
        this.unitConversionService.getBoundaries().subscribe(
          boundaries => {
            this.boundaries = boundaries;
            console.log('boundaries:');
            console.log(this.boundaries);
            this.initializeEvent();
          },
          err => console.log("ERROR", err),
          () => console.log("Boundaries fetched"));
      },
      err => console.log("ERROR", err),
      () => console.log("Interaction region fetched"));
  }

  initializeEvent() {
    this.interactionLocation = {
      x: Math.random() * (this.interactionRegion.xmax - this.interactionRegion.xmin) + this.interactionRegion.xmin,
      y: Math.random() * (this.interactionRegion.ymax - this.interactionRegion.ymin) + this.interactionRegion.ymin
    }

    console.log('interaction location!');
    console.log(this.interactionLocation);

    this.display = this.eventDisplayService.getStringEventDisplay(
      this.bFieldStrength,
      this.bFieldDirection,
      this.dots,
      this.boundaries,
      this.interactionLocation,
      this.event);

    console.log(this.display);

  }


}
