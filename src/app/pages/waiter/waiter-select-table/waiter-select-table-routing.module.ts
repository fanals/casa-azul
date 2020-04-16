import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaiterSelectTablePage } from './waiter-select-table.page';

const routes: Routes = [
  {
    path: '',
    component: WaiterSelectTablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaiterSelectTablePageRoutingModule {}
