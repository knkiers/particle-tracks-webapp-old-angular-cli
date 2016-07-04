import { Component, OnInit } from '@angular/core';

import {AnalysisDisplayComponent} from '../analysis-display';

// helpful for integrating svg into angular 2:
// http://blog.500tech.com/svg-in-angular-2/
// also, for passing in more parameters:
// http://plnkr.co/edit/bkCqAmOuG0YcOObhXqiO?p=preview

@Component({
  moduleId: module.id,
  selector: 'app-analyze-event',
  templateUrl: 'analyze-event.component.html',
  styleUrls: ['analyze-event.component.css'],
  directives: [AnalysisDisplayComponent]
})
export class AnalyzeEventComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
