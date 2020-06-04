import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VexGamePage } from './vex-game.page';

const routes: Routes = [
  {
    path: '',
    component: VexGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VexGamePageRoutingModule {}
