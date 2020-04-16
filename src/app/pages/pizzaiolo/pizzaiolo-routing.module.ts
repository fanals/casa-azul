import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PizzaioloPage } from './pizzaiolo.page';

const routes: Routes = [
  {
    path: '',
    component: PizzaioloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PizzaioloPageRoutingModule {}
