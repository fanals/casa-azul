import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotaltodayPage } from './totaltoday.page';

const routes: Routes = [
  {
    path: '',
    component: TotaltodayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotaltodayPageRoutingModule {}
