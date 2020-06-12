import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SimpleGoal } from '../VexGameManager/field.model';

@Component({
  selector: 'vex-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit {

  goalOwnedBy = "blue";
  ballsScoredGoal1 = ["blue","blue","none"];
  myPosition = {
    row:0,
    column:0
  }

  @Input()
  goals:SimpleGoal[][];

  @Output()
  newEvent:EventEmitter<any> = new EventEmitter<any>() 

  constructor() { 
  }

  ngOnInit() {}

  handleNewEvent(event){
    this.newEvent.emit(event);
    console.log(this.goals);
  }

}
