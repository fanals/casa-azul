import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotaltodayPageRoutingModule } from './totaltoday-routing.module';

import { TotaltodayPage } from './totaltoday.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TotaltodayPageRoutingModule
  ],
  declarations: [TotaltodayPage]
})
export class TotaltodayPageModule {}
