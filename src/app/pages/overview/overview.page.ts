import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { PacketType, DevicesEnum, ServicesEnum, OrderStateEnum, OrderType, MenuType } from 'src/app/types';
import { MenuService } from 'src/app/services/menu.service';
import { UserService } from 'src/app/services/user.service';

import * as moment from 'moment';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  public moment = moment;
  public OrderStateEnum = OrderStateEnum;
  public device:string = 'pizza';
  public isShowingHistory:boolean = false;
  public orders:OrderType[] = [];
  public history:OrderType[][] = [];
  public menu: MenuType;
  public historyIndex: number = 0;
  public waitingTime: number = 0;
  public timerInterval:any;

  constructor(public navCtrl: NavController,
              public menuService: MenuService,
              public userService: UserService,
              public server: ServerService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
      this.timerInterval = setInterval(() => {
        if (!this.isShowingHistory)
          this.changedDevice();
      }, 5000);
    });
  }

  changedDevice() {
    this._getOrders().then((orders:OrderType[]) => {
      this.orders = orders;
    });
    this._getWaitingTime().then((waitingTime:number) => {
      this.waitingTime = waitingTime;
    });
  }

  private _getOrders() {
    let packet:PacketType = {
      device: DevicesEnum[this.device],
      service: ServicesEnum['service-get-orders']
    };
    return this.server.send(packet);
  }

  private _getHistory() {
    let packet:PacketType = {
      device: DevicesEnum[this.device],
      service: ServicesEnum['service-get-orders-history']
    };
    return this.server.send(packet);
  }

  private _getWaitingTime() {
    let packet:PacketType = {
      device: DevicesEnum[this.device],
      service: ServicesEnum['service-get-waiting-time']
    };
    return this.server.send(packet);
  }

  toggleHistory() {
    this.historyIndex = 0;
    console.log('Showing history', this.isShowingHistory);
    if (this.isShowingHistory) {
      this._getHistory().then((history: OrderType[][]) => {
        this.history = history;
        this.orders = this.history[this.historyIndex];
      });
    } else {
      this._getOrders().then((orders:OrderType[]) => {
        this.orders = orders;
      });
    }
  }

  historyBack() {  
    if (this.history[this.historyIndex + 1]) {
      this.historyIndex++;
      this.orders = this.history[this.historyIndex];
    }
  }

  historyFront() {
    if (this.history[this.historyIndex - 1]) {
      this.historyIndex--;
      this.orders = this.history[this.historyIndex];
    }
  }

  openRestaurantPage() {
    this.userService.get().then(user => {
      if (user.device.slug == 'main')
        this.navCtrl.navigateRoot('restaurant');
      else
        this.navCtrl.navigateRoot('waiter-select-food');
    });
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

}
