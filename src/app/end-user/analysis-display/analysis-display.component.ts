import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {GridItemComponent} from '../grid-item';

@Component({
  moduleId: module.id,
  selector: 'app-analysis-display',
  templateUrl: 'analysis-display.component.html',
  styleUrls: ['analysis-display.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    GridItemComponent,
  ],
})
export class AnalysisDisplayComponent implements OnInit {

  gridItemList = [
    {
      id: 1,
      activated: true,
      useForFit: true,
      x: '100',
      y: '200'
    },
    {
      id: 2,
      activated: false,
      useForFit: false,
      x: '200',
      y: '300'
    },
    {
      id: 3,
      activated: true,
      useForFit: false,
      x: '250',
      y: '300'
    }


  ];

  constructor() {}

  ngOnInit() {
  }

  selectDot(id: any){
    var index = null;
    for (let i in this.gridItemList){
      if ((this.gridItemList[i].id === id) && (this.gridItemList[i].activated)){
        index = i;//use this dot for the fit
      }
    }
    if (index !== null) {
      this.gridItemList[index].useForFit = true;
    }
  }

  dotSelected(params: any) {
    console.log('parent sensed mouse event!');
    console.log(params);
    this.selectDot(params.id)
  }

}
