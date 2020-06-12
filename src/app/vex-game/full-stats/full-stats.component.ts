import { Component, OnInit, Input } from '@angular/core';
import { Stats } from '../VexGameManager/stats.model';

@Component({
  selector: 'app-full-stats',
  templateUrl: './full-stats.component.html',
  styleUrls: ['./full-stats.component.scss'],
})
export class FullStatsComponent implements OnInit {

  @Input()
  gameStats:Stats;

  constructor() {
   }

  ngOnInit() {}

}
