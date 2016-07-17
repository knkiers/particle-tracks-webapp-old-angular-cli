import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '[app-circle-item]',//apparently the square brackets are necessary b/c this is css styling(?)
  templateUrl: 'circle-item.component.html',
  styleUrls: ['circle-item.component.css']
})
export class CircleItemComponent implements OnInit {

  @Input() params: any;

  constructor() {}

  ngOnInit() {
    console.log('got to app-circle-item!');
  }

}
