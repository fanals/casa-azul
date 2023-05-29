import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { ServicesEnum, PacketType, DevicesEnum } from 'src/app/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-waiter-select-table',
  templateUrl: './waiter-select-table.page.html',
  styleUrls: ['./waiter-select-table.page.scss'],
})
export class WaiterSelectTablePage implements OnInit {

  public openedTables = [];
  private onResumeSubscription: Subscription = null;

  constructor(public navCtrl:NavController,
              public platform: Platform,
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
    if (!this.onResumeSubscription) {
      this.onResumeSubscription = this.platform.resume.subscribe(() => {
        window.location.href = "";
      });
    }
  }

  openTable(tableId) {
    this.modalController.dismiss({tableId: tableId});
    //this.navCtrl.navigateForward('waiter-select-food/'+id, {animated: false});
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
  }
  
}
