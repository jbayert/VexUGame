import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { VexGameManager } from './VexGameManager/vex-game-manager';
import { Field,SimpleGoal } from './VexGameManager/field.model';

@Component({
  selector: 'app-vex-game',
  templateUrl: './vex-game.page.html',
  styleUrls: ['./vex-game.page.scss'],
})
export class VexGamePage implements OnInit {

  vexGame:VexGameManager;
  vexField:Field;

  constructor(private changeDetectorRef:ChangeDetectorRef) {
    this.vexGame = new VexGameManager();

  }

  ngOnInit() {
    var subscriber = this.vexGame.getChangeSubscriber();
    subscriber.subscribe((event)=>{
      this.vexField = event
      console.log(event);
      this.changeDetectorRef.detectChanges();
    })
  }

  handleNewEvent(event){
    console.log(event);
    this.vexGame.handleEvent(event);
  }
}