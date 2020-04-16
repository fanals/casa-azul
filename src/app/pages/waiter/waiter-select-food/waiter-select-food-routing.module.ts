import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaiterSelectFoodPage } from './waiter-select-food.page';

const routes: Routes = [
  {
    path: '',
    component: WaiterSelectFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaiterSelectFoodPageRoutingModule {}
