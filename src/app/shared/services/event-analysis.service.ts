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
  fitCircleToData(dots, boundaries) {
    var circleInputData = this.gatherDataFromDots(dots);
    var dotIndices = circleInputData.dotIndices;

    var circleDatacm = this.circleFitter(circleInputData);
    var error = false;
    var errorMessage = '';
    var dataDict;
    var circleDataPx;
    if (circleDatacm.error) {
      errorMessage = circleDatacm.errorMessage;
      error = true;
    } else {
      circleDataPx = this.unitConversionService.translateCircleDatatoPixels(circleDatacm, boundaries, dotIndices);
    }
    dataDict = {
      circle:      circleDataPx,
      error:        error,
      errorMessage: errorMessage
    };
    return dataDict;
  }

  /*
   * @name circleFitter
   * @input data has two lists: data.x and data.y
   * @returns (x0, y0) and r (in cm) for the best-fit circle
   * ADD SOME ERROR CHECKING!!!!  Need to check for colinear points, and that N >= 3.
   *
   */
  circleFitter(data) {
    var xBar = this.mean(data.x);
    var yBar = this.mean(data.y);
    var uList = [];
    var vList = [];
    var nMax = data.x.length;
    var i;
    var circleData;

    if (nMax < 3 ) {
      circleData = {xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose at least three points.'
      };
      return circleData;
    }

    for (i=0; i < nMax; i++) {
      uList.push(data.x[i] - xBar);
      vList.push(data.y[i] - yBar);
    }

    var Suu =  this.SCalculator([uList, uList]);
    var Svv =  this.SCalculator([vList, vList]);
    var Suv =  this.SCalculator([uList, vList]);
    var Suuu = this.SCalculator([uList, uList, uList]);
    var Svvv = this.SCalculator([vList, vList, vList]);
    var Suvv = this.SCalculator([uList, vList, vList]);
    var Svuu = this.SCalculator([vList, uList, uList]);

    var mInv = this.inverseTwoByTwo([[Suu, Suv], [Suv, Svv]]);
    if (mInv.error) {
      circleData = {xc: 0, yc: 0, r: 0,
        error: true,
        errorMessage: 'You must choose non-colinear points.'
      };
    } else {
      var inverseMatrix = mInv.inverse;
      var coeffs = [(Suuu+Suvv)/2, (Svvv+Svuu)/2];
      var uc = inverseMatrix[0][0]*coeffs[0]+inverseMatrix[0][1]*coeffs[1];
      var vc = inverseMatrix[1][0]*coeffs[0]+inverseMatrix[1][1]*coeffs[1];
      var xc = uc + xBar;
      var yc = vc + yBar;
      var r = Math.sqrt(uc*uc + vc*vc + (Suu+Svv)/nMax);
      circleData = {xc: xc, yc: yc, r: r, error: false, errorMessage: ''};
    }
    return circleData;
  }

  mean(list) {
    var total = 0;
    var i;
    for (i=0; i<list.length; i++) {
      total += list[i];
    }
    return total/list.length;
  }

  /*
   * listOfLists could be [uList, uList, vList], for example
   *
   */
  SCalculator(listOfLists) {
    var numLists = listOfLists.length;
    var i, j;
    var sublistLengths = listOfLists[0].length; //they'd better be the same length!
    var total = 0;
    var product;
    for (j=0; j < sublistLengths; j++){
      product = 1;
      for (i=0; i < numLists; i++){
        product = product*listOfLists[i][j];
      }
      total += product;
    }
    return total;
  }

  /*
   * MUST CHECK FIRST that the matrix is invertible!!!
   *
   */
  inverseTwoByTwo(matrix) {
    var a,b,c,d;
    var eps = 0.000000001;
    var error = false;
    var returnObject;
    a = matrix[0][0];
    b = matrix[0][1];
    c = matrix[1][0];
    d = matrix[1][1];
    var det = a*d - b*c;
    if (Math.abs(det) < eps) {
      returnObject = {
        error: true,
        inverse: 0
      };
      return returnObject;
    } else {
      var inverse = [[d/det, -b/det],[-c/det, a/det]];
      returnObject = {
        error: false,
        inverse: inverse
      };
      return returnObject;
    }

  }





  gatherDataFromDots(dots: any) {
    var xArray = [];
    var yArray = [];
    var dotIndices = [];

    for (let i in dots) {
      //console.log(dots[i]);
      if (dots[i].useForFit === true) {
        xArray.push(dots[i].xcm);
        yArray.push(dots[i].ycm);
        dotIndices.push(+i);//'+' converts string to number
      }
    }
    var circleInputData = {
      x: xArray,
      y: yArray,
      dotIndices: dotIndices
    }
    return circleInputData;
  }

  computeTangentAngle(axisLocation, circle) {
    var theta;
    var PI = Math.acos(-1);
    var phi = Math.atan2(axisLocation.y-circle.yc, axisLocation.x-circle.xc);
    if (!circle.CW) {
      theta = (phi+PI/2+2*PI) % (2*PI);
    } else {
      theta = (phi+3*PI/2+2*PI) % (2*PI);
    }
    return theta;
  }


  /*
  clearDotsForFit(dots) {
    var i;
    for (i=0; i<dots.length; i++) {
      dots[i].useForFit = false;
    }
  }
  */


}
