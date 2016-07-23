import { Component, OnInit } from '@angular/core';

import {AnalysisDisplayComponent} from '../analysis-display';

import {EventDisplayService} from '../../shared/services/event-display.service';
import {UnitConversionService} from '../../shared/services/unit-conversion.service';
import {EventAnalysisService} from '../../shared/services/event-analysis.service';

import {Event} from '../../shared/models/event';

// helpful for integrating svg into angular 2:
// http://blog.500tech.com/svg-in-angular-2/
// also, for passing in more parameters:
// http://plnkr.co/edit/bkCqAmOuG0YcOObhXqiO?p=preview

@Component({
  moduleId: module.id,
  selector: 'app-analyze-event',
  templateUrl: 'analyze-event.component.html',
  styleUrls: ['analyze-event.component.css'],
  providers: [UnitConversionService, EventDisplayService, EventAnalysisService ],
  directives: [AnalysisDisplayComponent]
})
export class AnalyzeEventComponent implements OnInit {

  private eventJSON: any;
  private event: Event;

  private someText = "X<sup>+</sup> &rarr;  &pi;<sup>+</sup> + &pi;<sup>+</sup> + Y<sup>-</sup>";

  constructor(private eventDisplayService: EventDisplayService) { }

  ngOnInit() {
    this.eventDisplayService.getEvent()
      .subscribe(
      event => {
        this.eventJSON = event;
        console.log(JSON.parse(this.eventJSON));
        //console.log(JSON.parse(this.event));
        this.event = JSON.parse(this.eventJSON);
        console.log(this.event);
      }
    );
  }

}
