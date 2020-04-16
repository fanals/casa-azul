import { Component, OnInit } from '@angular/core';
import { PizzaOrderType, MenuType, OrderStateEnum } from 'src/app/types';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-pizzaiolo',
  templateUrl: './pizzaiolo.page.html',
  styleUrls: ['./pizzaiolo.page.scss'],
})
export class PizzaioloPage implements OnInit {

  public OrderStateEnum = OrderStateEnum;
  public menu: MenuType;
  public orders: PizzaOrderType[];
  public isPreparing: boolean = false;

  constructor(public menuService: MenuService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
      this.orders = [{
        id: 0,
        name: "Playa 1",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }, {
          articleMenuIndex: 4
        }, {
          articleMenuIndex: 4
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Terraza 2",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 5",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Terraza 0",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }, {
        id: 0,
        name: "Playa 4",
        state: OrderStateEnum['new'],
        waiterName: "Camilo",
        articles: [{
          articleMenuIndex: 2
        }, {
          articleMenuIndex: 4
        }],
        kitchenArticles: [{
          articleMenuIndex: 12
        }, {
          articleMenuIndex: 14
        }]
      }];
    });
  }

  select(order) {
    order.state = order.state == OrderStateEnum['selected'] ? OrderStateEnum['new'] : OrderStateEnum['selected'];
  }

  prepareOrders() {
    if (this.orders.findIndex(o => o.state == OrderStateEnum['selected']) != -1)
      this.isPreparing = true;
  }

  getOrderColor(order) {
    if (this.isPreparing)
      return 'dark';
    return order.state == OrderStateEnum["selected"] ? "primary" : "";
  }

  itsReady() {
    let index;
    while ((index = this.orders.findIndex(o => o.state == OrderStateEnum['selected'])) != -1) {
      this.orders.splice(index, 1);
    }
    this.isPreparing = false;
  }

}
