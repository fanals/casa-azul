import { Component, OnInit, NgZone } from '@angular/core';
import { OrderType, MenuType, OrderStateEnum, UserType } from 'src/app/types';
import { MenuService } from 'src/app/services/menu.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ConsoleService } from 'src/app/services/console.service';
import { UserService } from 'src/app/services/user.service';

import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public moment = moment;
  public OrderStateEnum = OrderStateEnum;
  public menu: MenuType;
  public user: UserType;
  public orders: OrderType[];
  public isPreparing: boolean = false;
  public isShowingHistory: boolean = false;
  public historyIndex: number = 0;
  public history: OrderType[][];

  constructor(public menuService: MenuService,
              public zone: NgZone,
              public userService:UserService,
              public console: ConsoleService,
              public ordersService: OrdersService) {}

  ngOnInit() {
    console.log("Get menu from orders");
    this.menuService.get().then(menu => {
      this.menu = menu;
    });
    this.userService.get().then(user => {
      this.user = user;
    });
    this.ordersService.get().then(orders => {
      this.console.log('Orders are', orders);
      this.orders = orders;
      this.ordersService.setReadyIn(this.orders);
      this.isPreparing = this.orders[0] && this.orders[0].state == OrderStateEnum['preparing'];
    });
    this.ordersService.changeDetectionEmitter.subscribe(() => {
      this.zone.run(() => { 
        setTimeout(() => {
          this.ordersService.get().then(orders => {
            this.orders = orders;
          });
        }, 0);
      });
    }, (err) => {
      this.console.log('Error on change detection emitter', err);
    });
  }

  select(order) {
    if (order.state == OrderStateEnum['ready'])
      return;
    if (this.isPreparing) {
      this.isPreparing = false;
      this.orders.forEach(order => {
        if (order.state == OrderStateEnum['preparing']) {
          order.state = OrderStateEnum['selected'];
        }
      });
    }
    order.state = order.state == OrderStateEnum['selected'] ? OrderStateEnum['new'] : OrderStateEnum['selected'];
  }

  prepareOrders() {
    let hasSelectedOrders = false;
    this.orders.forEach(order => {
      if (order.state == OrderStateEnum['selected']) {
        hasSelectedOrders = true;
        order.state = OrderStateEnum['preparing'];
        order.startingPreparingAt = moment();
      }
    });
    if (hasSelectedOrders) {
      this.isPreparing = true; 
      this.orders.sort((a, b) => b.state - a.state);      
      this.ordersService.setReadyIn(this.orders);
      this.ordersService.save();
    }
  }

  toggleHistory() {
    this.historyIndex = 0;
    this.isShowingHistory = !this.isShowingHistory;
    if (this.isShowingHistory) {
      this.ordersService.getHistory().then(history => {
        this.history = history;
        this.orders = this.history[this.historyIndex];
      });
    } else {
      this.ordersService.get().then(orders => {
        this.orders = orders;
      });
    }
  }

  getOrderColor(order) {
    if (this.isPreparing)
      return 'dark';
    return order.state == OrderStateEnum["selected"] ? "primary" : "";
  }

  itsReady() {
    this.isPreparing = false;
    this.orders = this.ordersService.saveHistory(this.orders);
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

}
