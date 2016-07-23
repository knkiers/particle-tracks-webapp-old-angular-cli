import { Injectable } from '@angular/core';

import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {EventUrl} from './urls';
import {Event} from '../models/event';
import {UnitConversionService} from './unit-conversion.service';

@Injectable()
export class EventDisplayService {

  constructor(
    private http:Http,
    private unitConversionService:UnitConversionService) {}

  getEvent(): Observable<Event> {
    return this.http
      .get(EventUrl)
      .map(response => response.json());
  }

//  getEvent() {
//    console.log(EventUrl);
//    this.http
//      .get(EventUrl)
//      .map((response:Response) => response.json());
//  }
  getStringEventDisplay(bFieldStrength, bFieldDirection,
                        //dots,
                        boundaries, interactionLocation,
                        event){

    var inChargedString = '';
    var inNeutralString = '';
    var outChargedString = '';
    var outNeutralString = '';
    var particleDirection;
    var px, py, pathParams;
    px = event.parent.energy_momentum[1];
    py = event.parent.energy_momentum[2];
    console.log(px);

    /*
    for (var i=0; i<dots.length; i++) {
      dots[i].useForFit = false;
      dots[i].activated = false;
    }
    */

    if (event.parent.charge != 0) {
      particleDirection = this.inOut(bFieldDirection, event.parent.charge);
      pathParams = this.curvedPathParams(bFieldStrength, /*dots,*/ boundaries, interactionLocation,
        px, py, particleDirection, 'incoming');
      inChargedString += pathParams.string;
    } else {
      inNeutralString += this.straightPathParams(boundaries, interactionLocation, px, py, 'incoming');
    }
    var i, dP;
    for (i=0; i<event.decay_products.length; i++) {
      dP = event.decay_products[i];
      px = dP.energy_momentum[1];
      py = dP.energy_momentum[2];
      if (dP.charge != 0) {
        particleDirection = this.inOut(bFieldDirection, dP.charge);
        pathParams = this.curvedPathParams(bFieldStrength, /*dots,*/ boundaries, interactionLocation,
          px, py, particleDirection, 'outgoing');
        outChargedString += pathParams.string;
      } else {
        outNeutralString += this.straightPathParams(boundaries, interactionLocation, px, py, 'outgoing');
      }
    }

    var dString = {'inCharged': inChargedString, 'inNeutral': inNeutralString,
      'outCharged': outChargedString, 'outNeutral': outNeutralString};
    return dString;

  }

  inOut(bFieldDirection, charge){
    if ((charge == 1 && bFieldDirection == 'in') || (charge == -1 && bFieldDirection == 'out')){
      return 'ccw';
    } else {
      return 'cw';
    }
  }

  /**
   * @desc - direction is 'cw' or 'ccw', depending on the particle direction
   *       - inout is 'incoming' or 'outgoing'
   *       - (x0, y0) is the center of the circle
   *       - phi0 the angle from (x0, y0) to the interaction point, measured
   *         positive relative to the +x axis
   */
  curvedPathParams(b_field, /*dots,*/ boundaries,
                   interactionLocation, px, py,
                   direction, inout) {
    var p = Math.sqrt(px*px+py*py);
    var r = p/(0.3*b_field);
    var phi0, x0, y0, phiBorder;
    var PI = Math.acos(-1);
    var returnString, returnDict;

    if (direction == 'ccw') {
      phi0 = Math.atan2(-px, py); // phi0 = tan((-px)/py)
    } else {
      phi0 = Math.atan2(px, -py); // phi0 = tan(px/(-py))
    }
    x0 = interactionLocation.x - r*Math.cos(phi0);
    y0 = interactionLocation.y - r*Math.sin(phi0);

    phiBorder = this.boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout);

    returnString = this.arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout);
    //dots = activateDots(dots, x0, y0, r, phi0, phiBorder, boundaries, direction, inout);

    returnDict = {
      string: returnString,
      //dots: dots
    };
    return returnDict;

  }

  /**
   * @desc determines the string that will create the arc in SVG
   * @inputs - r is the radius of the circle
   *         - boundaries contains the boundaries of the region
   *         - (x0, y0) is the center of the circle
   *         - phi0 is the angle between (x0, y0) and the interactionLocation
   *         - direction is 'cw' or 'ccw', depending on the particle direction
   *         - inout is 'incoming' or 'outgoing'
   * @returns string
   */
  arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout) {
    var PI = Math.acos(-1);

    var largeArcFlag = '0';
    var sweepFlag;
    var absDeltaPhi = Math.abs(phi0 - phiBorder);

    if (direction == 'ccw') {
      sweepFlag = '0';
    } else {
      sweepFlag = '1';
    }

    if (inout == 'incoming') {
      var xFinal = x0 + r*Math.cos(phi0);
      var yFinal = y0 + r*Math.sin(phi0);
      var xInitial = x0 + r*Math.cos(phiBorder);
      var yInitial = y0 + r*Math.sin(phiBorder);
    } else {
      var xInitial = x0 + r*Math.cos(phi0);
      var yInitial = y0 + r*Math.sin(phi0);
      var xFinal = x0 + r*Math.cos(phiBorder);
      var yFinal = y0 + r*Math.sin(phiBorder);
    }

    if (absDeltaPhi > PI) {
      largeArcFlag = '1';
    }

    var pixelFinal = this.unitConversionService.translatecmtoPixels(xFinal, yFinal, boundaries);
    var pixelInitial = this.unitConversionService.translatecmtoPixels(xInitial, yInitial, boundaries);
    var rPixels = this.unitConversionService.translateRadiuscmtoPixels(r, boundaries);
    var arrayToStringify = ['M', pixelInitial.x, pixelInitial.y, 'A', rPixels.toString(), rPixels.toString(),
      '0', largeArcFlag, sweepFlag, pixelFinal.x, pixelFinal.y];
    var arcString = this.stringifyArray(arrayToStringify);
    return arcString;
  }

  straightPathString(xInteraction, yInteraction, xEdge, yEdge, boundaries, inout) {

    var pixelEdge = this.unitConversionService.translatecmtoPixels(xEdge, yEdge, boundaries);
    var pixelInteraction = this.unitConversionService.translatecmtoPixels(xInteraction, yInteraction, boundaries);

    var arrayToStringify = ['M', pixelInteraction.x, pixelInteraction.y, 'L', pixelEdge.x, pixelEdge.y];
    var lineString = this.stringifyArray(arrayToStringify);
    return lineString;
  }

  straightPathParams(boundaries, interactionLocation, px, py, inout) {
    // find x and y for intersection with boundary
    // call straightPathString and then return returnString
    var returnString, edgeCoords;

    edgeCoords = this.boundaryIntersectionStraight(interactionLocation.x,
      interactionLocation.y,
      px, py, boundaries, inout);

    returnString = this.straightPathString(interactionLocation.x,
      interactionLocation.y,
      edgeCoords.x,
      edgeCoords.y, boundaries, inout);
    return returnString;

  }

  /**
   * @desc determines the first angle at which the circle in question intersects
   *       with a boundary; if there is no intersection by |Delta phi| = 3 pi/2, then
   *       a value is put in by hand to correspond to |Delta phi| = 3 pi/2
   * @inputs - r is the radius of the circle
   *         - boundaries contains the boundaries of the region
   *         - (x0, y0) is the center of the circle
   *         - direction is 'cw' or 'ccw'; gives the physical direction being traveled by the particle
   *         - inout is 'incoming' or 'outgoing'
   * @note for an incoming particle, travels backward along the route until a boundary is reached;
   *       for an outgoing particle, travels forward along the route until a boundary is reached
   * @returns phi value
   */
  boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout) {
    var phi;
    var PI = Math.acos(-1);
    var deltaPhiMax = 3*PI/2;
    var phiStep = 0.01; //radians
    var signStep;
    var x, y;
    x = x0 + r*Math.cos(phi0); // this is the interaction point
    y = y0 + r*Math.sin(phi0);
    if (!this.isInsideBoundingBox(x, y, boundaries)){
      return phi0;// hopefully this doesn't happen(!)
    }

    var inside = true;
    phi = phi0;
    var deltaPhi = 0;
    if ((direction == 'ccw' && inout == 'incoming') || (direction == 'cw' && inout == 'outgoing')) {
      signStep = -1;
    } else {
      signStep = 1;
    }

    while (inside == true && Math.abs(deltaPhi) < deltaPhiMax) {
      deltaPhi += signStep*phiStep;
      phi = phi0 + deltaPhi;
      x = x0 + r*Math.cos(phi);
      y = y0 + r*Math.sin(phi);
      inside = this.isInsideBoundingBox(x, y, boundaries);
    }
    // phi now corresponds to a point slightly outside the bounding box, so reset it
    phi = phi - signStep*phiStep;
    return phi;
  }


  boundaryIntersectionStraight(xInteraction, yInteraction, px, py, boundaries, inout) {

    var unitX = px/Math.sqrt(px*px+py*py);
    var unitY = py/Math.sqrt(px*px+py*py);
    var edgeCoords;
    var nStep = 0.01; //cm
    var signStep;
    var x, y;
    if (!this.isInsideBoundingBox(xInteraction, yInteraction, boundaries)){
      edgeCoords = {'x': xInteraction, 'y': yInteraction};
      return edgeCoords;// hopefully this doesn't happen(!)
    }
    var inside = true;
    if (inout == 'incoming'){
      signStep = -1;
    } else {
      signStep = 1;
    }
    x = xInteraction;
    y = yInteraction;
    while (inside == true) {
      x += unitX*signStep*nStep;
      y += unitY*signStep*nStep;
      inside = this.isInsideBoundingBox(x, y, boundaries);
    }
    // (x,y) now corresponds to a point slightly outside the bounding box, so reset it
    x -= unitX*signStep*nStep;
    y -= unitY*signStep*nStep;
    edgeCoords = {'x': x, 'y': y};
    return edgeCoords;
  }

  stringifyArray(array) {
    var returnString = '';
    var i;
    for (i=0; i<array.length; i++) {
      returnString += array[i]+' ';
    }
    return returnString;
  }

  /**
   * @desc determines whether or not a given coordinate is inside the bounding region
   * @inputs - (x, y) are the coordinates of the point in question (in cm)
   *         - boundaries contains the boundaries of the region
   * @returns boolean
   */
  isInsideBoundingBox(x, y, boundaries) {
    if (x < boundaries.xmax &&
      x > boundaries.xmin &&
      y < boundaries.ymax &&
      y > boundaries.ymin) {
      return true;
    } else {
      return false;
    }
  }





}
