import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
})
export class GoalComponent implements OnInit {
  ownedBy:"red"|"blue"|null;

  constructor() { 
    this.ownedBy = null;
  }

  ngOnInit() {}

  setRedOwned(){
    console.log("Success Red");
    this.ownedBy = "red";
  }

  setBlueOwned(){
    console.log("Success Blue");
    this.ownedBy = "blue";
  }

  setUnowned(){
    console.log("Success Unowned");
    this.ownedBy = null;
  }

}
