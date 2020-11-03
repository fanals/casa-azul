import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { ServicesEnum, PacketType, DevicesEnum } from 'src/app/types';

@Component({
  selector: 'app-waiter-select-table',
  templateUrl: './waiter-select-table.page.html',
  styleUrls: ['./waiter-select-table.page.scss'],
})
export class WaiterSelectTablePage implements OnInit {

  public openedTables = [];

  constructor(public navCtrl:NavController,
              public modalController: ModalController,
              public server:ServerService) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.server.send({
      service: ServicesEnum['service-get-opened-tables'],
      device: DevicesEnum['main']
    }).then((openedTables: []) => {
      console.log('Opened tabled are', openedTables);
      this.openedTables = openedTables;
    });
  }

  openTable(tableId) {
    this.modalController.dismiss({tableId: tableId});
    //this.navCtrl.navigateForward('waiter-select-food/'+id, {animated: false});
  }
  

}
