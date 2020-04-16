import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-waiter-select-table',
  templateUrl: './waiter-select-table.page.html',
  styleUrls: ['./waiter-select-table.page.scss'],
})
export class WaiterSelectTablePage implements OnInit {

  constructor(public navCtrl:NavController) {}

  ngOnInit() {
  }

  openTable(id) {
    this.navCtrl.navigateForward('waiter-select-food/'+id, {animated: false});
  }
  

}
