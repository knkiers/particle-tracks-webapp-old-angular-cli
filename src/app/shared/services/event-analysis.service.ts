import { Injectable } from '@angular/core';

import {UnitConversionService} from './unit-conversion.service';

@Injectable()
export class EventAnalysisService {

  constructor(private unitConversionService:UnitConversionService) {}

  /*
   looks at the 'gridItemList' array and determines which have been selected for fitting a circle;
   returns a data list suitable for sending to circleFitter




   ......WORKING HERE......

  how to inject one service into another...?!? >>>inject the services into the comp
  and then import the one into the other; can't import them into each other (circular
  dependency); CREATE new unit-conversion service that has all the cm to Px type stuff
  and import that into the other two services....

   ...first: add xcm and ycm!
   ...maybe translate entire grid over and then set all of them to activated or somethingl

   >>> translate the appropriate funcionality over from the AnalyzeEvent and
   DisplayEvent services so that can form the grid and fit a circle to selected points;




   */
  gatherDataFromDots(dots: any) {
    var xArray = [];
    var yArray = [];

    for (let i in dots) {
      if (dots[i].useForFit === true) {
        xArray.push(dots[i].xcm);
        yArray.push(dots[i].ycm);
      }
    }
    var circleInputData = {
      x: xArray,
      y: yArray
    }
    return circleInputData;
  }
  



}
