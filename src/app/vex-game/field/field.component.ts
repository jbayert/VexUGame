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
  newEventOutput:EventEmitter<any> = new EventEmitter<any>() 

  constructor() { 
  }

  ngOnInit() {}

  newEvent(event){
    this.newEventOutput.emit(event);
    console.log(this.goals);
  }

}
