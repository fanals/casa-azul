import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaiterSelectTablePageRoutingModule } from './waiter-select-table-routing.module';

import { WaiterSelectTablePage } from './waiter-select-table.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaiterSelectTablePageRoutingModule
  ],
  declarations: [WaiterSelectTablePage]
})
export class WaiterSelectTablePageModule {}
