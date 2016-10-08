import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import {EventAnalysisService} from '../../shared/services/event-analysis.service';


@Component({
  moduleId: module.id,
  selector: 'app-list-saved-events',
  templateUrl: 'list-saved-events.component.html',
  styleUrls: ['list-saved-events.component.css']
})
export class ListSavedEventsComponent implements OnInit {

  @Input() eventList: any;
  @Input() modalID: string;
  @Output() onFinished = new EventEmitter<string>();

  constructor(private eventAnalysisService:EventAnalysisService) {}

  //date: Date;
  ngOnInit() {
    console.log(this.eventList);
    /*for (var event of this.eventList) {
      console.log(event.created);
      //this.date = new Date(event.created);
      console.log(this.date);
    }
    */


  }

  // WORKING HERE!!!!!!
  // actually, this method should go in analysis-display...;
  // can just pass the event id in the closeModal event emitter!
  /*
  getEvent(id) {
    // get the event; then close the modal....
    console.log('about to get event #....');
    console.log(id);
    this.closeModal(this.modalID);

    this.eventAnalysisService.getAnalyzedEvent(id).subscribe(
      eventData => {
        console.log(eventData);
      },
      err => console.log("ERROR", err),
      () => console.log("event fetched"));

  }
  */

  closeModalFetchEvent(eventID) {
    /*
     This emits an event that the parent component listens for; then the parent uses
     the modalID to close the modal.
     Note: The parent component must declare the following in order to close
     the modal programmatically:
     declare var $: any;
     */
    console.log('about to emit the close signal');
    this.onFinished.emit(eventID);
  }



}
