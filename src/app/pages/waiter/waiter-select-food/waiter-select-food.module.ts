import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaiterSelectFoodPageRoutingModule } from './waiter-select-food-routing.module';

import { WaiterSelectFoodPage } from './waiter-select-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaiterSelectFoodPageRoutingModule
  ],
  declarations: [WaiterSelectFoodPage]
})
export class WaiterSelectFoodPageModule {}
