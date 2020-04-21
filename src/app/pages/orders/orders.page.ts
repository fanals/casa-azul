import { Component, OnInit, NgZone } from '@angular/core';
import { OrderType, MenuType, OrderStateEnum, UserType } from 'src/app/types';
import { MenuService } from 'src/app/services/menu.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ConsoleService } from 'src/app/services/console.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public OrderStateEnum = OrderStateEnum;
  public menu: MenuType;
  public user: UserType;
  public orders: OrderType[];
  public isPreparing: boolean = false;

  constructor(public menuService: MenuService,
              public zone: NgZone,
              public userService:UserService,
              public console: ConsoleService,
              public ordersService: OrdersService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
    });
    this.userService.get().then(user => {
      this.user = user;
    });
    this.ordersService.get().then(orders => {
      this.console.log('Orders are', orders);
      this.orders = orders;
      // this.orders = [{
      //   n: "Playa 1",
      //   st: OrderStateEnum['new'],
      //   wn: "Camilo",
      //   kaso: false,
      //   as: [{
      //     q: 1,
      //     ami: 2,
      //     pii: [2]
      //   }, {
      //     q: 1,
      //     ami: 4
      //   }, {
      //     q: 1,
      //     ami: 4
      //   }],
      //   kas: [{
      //     q: 1,
      //     ami: 12
      //   }, {
      //     q: 1,
      //     ami: 14
      //   }]
      // }];
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
    order.st = order.st == OrderStateEnum['selected'] ? OrderStateEnum['new'] : OrderStateEnum['selected'];
  }

  prepareOrders() {
    if (this.orders.findIndex(o => o.st == OrderStateEnum['selected']) != -1)
      this.isPreparing = true;
  }

  getOrderColor(order) {
    if (this.isPreparing)
      return 'dark';
    return order.st == OrderStateEnum["selected"] ? "primary" : "";
  }

  itsReady() {
    let index;
    while ((index = this.orders.findIndex(o => o.st == OrderStateEnum['selected'])) != -1) {
      this.orders.splice(index, 1);
    }
    this.isPreparing = false;
  }

}
