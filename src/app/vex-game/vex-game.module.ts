import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VexGamePageRoutingModule } from './vex-game-routing.module';

import { VexGamePage } from './vex-game.page';


import { GoalComponent } from './goal/goal.component';
import { FieldComponent } from './field/field.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { FullStatsComponent } from './full-stats/full-stats.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VexGamePageRoutingModule
  ],
  declarations: [
    VexGamePage,
    GoalComponent,
    FieldComponent,
    ScoreBoardComponent,
    FullStatsComponent,
  ]
})
export class VexGamePageModule {}
