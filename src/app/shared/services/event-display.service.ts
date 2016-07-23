import { Injectable } from '@angular/core';

import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {EventUrl} from './urls';
import {Event} from '../models/event';



@Injectable()
export class EventDisplayService {

  constructor(private http:Http) {}

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

}
