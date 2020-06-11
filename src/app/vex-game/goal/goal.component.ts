import { Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import { Alliance } from '../VexGameManager/game-constants.model';
import { SimpleGoal } from '../VexGameManager/field.model';

@Component({
  selector: 'vex-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
})
export class GoalComponent implements OnInit {

  _goal: SimpleGoal;
  @Input()
  set goal(newGoal: SimpleGoal){
    if(newGoal){
      this._goal = newGoal;
    }
  }

  @Output() 
  buttonPressed = new EventEmitter()

  constructor() {
    this._goal = {
      ownedBy:"none",
      position:{row:0,column:0},
      ballsScored:["none","none","none"]
    }
  }

  ngOnInit() {}

  addBall(newAlliance: "red"|"blue"){
    this.buttonPressed.emit({
      change: "add",
      alliance:newAlliance,
      position:this._goal.position,
    })
    console.log(`Value sent to add ball to ${newAlliance} to row ${this._goal.position.row}, column ${this._goal.position.column}`);
  }

  setRedOwned(){
    this.addBall("red");
  }

  setBlueOwned(){
    this.addBall("blue");
  }

  setUnowned(){
    this.buttonPressed.emit({
      change: "remove",
      position:this._goal.position,
    })
    console.log(`Value sent to remove ball from row ${this._goal.position.row}, column ${this._goal.position.column}`);
  }

}
