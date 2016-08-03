import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';

/*
This service deals with everything having to do with initialization, constants, units,
conversion between units, etc.
*/

const BOUNDARIES = { // very important that the x and y directions preserve the aspect ratio!!!
  xmin: -5, // cm; boundaries of the display region
  xmax: 5,  // cm
  ymin: -5, // cm
  ymax: 5,  // cm
  numGridPointsX: 41, // the number of grid points in the x direction; must be at least 2
  numGridPointsY: 41,
  height: 500,
  width: 500,
  heightDisplay: 400, // heightDisplay = yminPx - ymaxPx
  widthDisplay: 400, // widthDisplay = xmaxPx - xminPx
  xminPx: 50, // boundaries of the display region in pixels
  xmaxPx: 450, // pixels
  yminPx: 450, // pixels; yminPx is at the bottom of the plot region
  ymaxPx: 50, // pixels
  deltaR: 0.1 // cm; radial distance from a track within which a "dot" in the grid will be activated
};

const INTERACTION_REGION = {// this is the region within which the interaction point can occur
  xmin: -1,
  xmax: 1,
  ymin: -1,
  ymax: 1
}

const DOTS = [
  {
    id: 1,
    activated: true,
    useForFit: false,
    x: '110',
    y: '200',
    xcm: '1.10',
    ycm: '2.00'
  },
  {
    id: 2,
    activated: false,
    useForFit: false,
    x: '200',
    y: '300',
    xcm: '2.00',
    ycm: '3.00'
  },
  {
    id: 3,
    activated: true,
    useForFit: false,
    x: '250',
    y: '300',
    xcm: '2.50',
    ycm: '3.00',
  },
  {
    id: 4,
    activated: true,
    useForFit: false,
    x: '300',
    y: '300',
    xcm: '3.00',
    ycm: '3.00'
  },
  {
    id: 5,
    activated: true,
    useForFit: false,
    x: '350',
    y: '300',
    xcm: '3.50',
    ycm: '3.00'
  },
  {
    id: 6,
    activated: true,
    useForFit: false,
    x: '375',
    y: '250',
    xcm: '3.75',
    ycm: '2.50'
  }


];



@Injectable()
export class UnitConversionService {

  constructor() {}

  initializeGrid(boundaries) {

    var deltaX = (boundaries.xmax-boundaries.xmin)/(boundaries.numGridPointsX-1);
    var deltaY = (boundaries.ymax-boundaries.ymin)/(boundaries.numGridPointsY-1);

    var grid = [];

    var x, y;
    var i, j, coordsPx;
    var index = 0;
    for (j=0; j<boundaries.numGridPointsY; j++) {
      for (i=0; i<boundaries.numGridPointsX; i++) {
        x = boundaries.xmin + i*deltaX;
        y = boundaries.ymin + j*deltaY;
        coordsPx = this.translatecmtoPixels(x, y, boundaries);
        grid.push(
          {
            id:     index,
            activated: false,
            x:         coordsPx.x,
            y:         coordsPx.y,
            xcm:       x,
            ycm:       y,
            useForFit: false,
          }
        );
        index++;
      }
    }
    return grid;
  }


  getGrid(){
    var grid = this.initializeGrid(BOUNDARIES);
    /*
    console.log(grid[55]);
    grid[55].activated = true;
    grid[22].activated = true;
    grid[147].activated = true;
    grid[251].activated = true;
    grid[201].activated = true;
    */
    var promise = Promise.resolve(grid);// Observable.just(DOTS);
    //var promise = Promise.resolve(DOTS);// Observable.just(DOTS);
    return Observable.fromPromise(promise);
  }

  getBoundaries(){
    var promise = Promise.resolve(BOUNDARIES);
    return Observable.fromPromise(promise);
  }

  getInteractionRegion(){
    var promise = Promise.resolve(INTERACTION_REGION);
    return Observable.fromPromise(promise);
  }

  translateCircleDatatoPixels(circleDatacm, boundaries) {
    var center = this.translatecmtoPixels(circleDatacm.xc, circleDatacm.yc, boundaries);
    var r = this.translateRadiuscmtoPixels(circleDatacm.r, boundaries);
    var circleDataPx = {
      xcPx: center.x,
      ycPx: center.y,
      rPx:  r,
      xc:   circleDatacm.xc,
      yc:   circleDatacm.yc,
      r:    circleDatacm.r,
      CW:   true,
      incoming: true,
      hovered: false
    };
    return circleDataPx;
  }

  translatecmtoPixels(x, y, boundaries) {
    var xPx = boundaries.xminPx +
      (x-boundaries.xmin)*(boundaries.xmaxPx-boundaries.xminPx)/
      (boundaries.xmax-boundaries.xmin);

    var yPx = boundaries.yminPx -
      (y-boundaries.ymin)*(boundaries.yminPx-boundaries.ymaxPx)/
      (boundaries.ymax-boundaries.ymin);

    var pixelCoordsString = {'x': xPx.toString(), 'y': yPx.toString()};
    return pixelCoordsString;
  }

  translateRadiuscmtoPixels(r, boundaries) {//assume aspect ratio is 1!!!
    return r*(boundaries.xmaxPx-boundaries.xminPx)/(boundaries.xmax-boundaries.xmin);
  }









}
