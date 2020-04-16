import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PizzaioloPageRoutingModule } from './pizzaiolo-routing.module';

import { PizzaioloPage } from './pizzaiolo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzaioloPageRoutingModule
  ],
  declarations: [PizzaioloPage]
})
export class PizzaioloPageModule {}
