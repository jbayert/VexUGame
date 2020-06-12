import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Stats } from '../VexGameManager/stats.model';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
})
export class ScoreBoardComponent implements OnInit {
  @Output()
  newEvent = new EventEmitter()

  @Input()
  gameStats:Stats;
  
  private _blueWinPoint:boolean = false;
  get blueWinPoint():boolean{
    return this._blueWinPoint;
  };

  set blueWinPoint(newData:boolean){
    this._blueWinPoint = newData;
    this.newEvent.emit({
      change:"updateWinPoint",
      alliance:"blue",
      set:newData,
    })
  }

  private _redWinPoint:boolean = false;
  get redWinPoint():boolean{
    return this._redWinPoint;
  };

  set redWinPoint(newData:boolean){
    this._redWinPoint = newData;
    this.newEvent.emit({
      change:"updateWinPoint",
      alliance:"red",
      set:newData,
    })
  }

  constructor() { 
  }

  ngOnInit() {}

  AutoWinnerChanged(ev: any) {
    this.newEvent.emit({
      change: "setAutoWinner",
      alliance: ev.detail.value,
    })
  }
}
