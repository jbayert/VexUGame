import { Component, OnInit, Output} from '@angular/core';

type alliances = "red"|"blue"|"none";

@Component({
  selector: 'vex-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
})
export class GoalComponent implements OnInit {

  private _ownedBy:alliances;
  get ownedBy(): alliances{
    return this._ownedBy;
  }

  constructor() { 
    this._ownedBy = "none";
  }

  ngOnInit() {}

  setOwnedBy(newValue: alliances){
    this._ownedBy = newValue;
    console.log(`New value set to ${newValue}`);
  }

  setRedOwned(){
    this.setOwnedBy("red");
  }

  setBlueOwned(){
    this.setOwnedBy("blue");
  }

  setUnowned(){
    this.setOwnedBy("none");
  }

}
