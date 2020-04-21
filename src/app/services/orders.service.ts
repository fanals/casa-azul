import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OrderType, MenuType, OrderStateEnum, ArticleCategoryEnum, UserType } from '../types';
import { MenuService } from './menu.service';
import { UserService } from './user.service';
import { ConsoleService } from './console.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private _user: UserType;
  private _menu: MenuType;
  private _orders: OrderType[];
  public changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(private storage: Storage,
              private userService: UserService,
              private console: ConsoleService,
              private menuService: MenuService) {
    this.menuService.get().then(menu => {
      this._menu = menu;
    });
    this.userService.get().then(user => {
      this._user = user;
    });
  }

  private _initOrders() {
    this._orders  = [];
  }

  public get() {
    return new Promise<OrderType[]>(resolve => {
      if (!this._orders) {
        this.storage.get('orders').then((orders) => {
          if (!orders) {
            this._initOrders();
            this.storage.set('orders', this._orders);
          } else {
            this._orders = orders;
          }
          resolve(this._orders);
        });
      } else {
        resolve(this._orders);
      }
    });
  }

  public save() {
    this.storage.set('orders', this._orders);
  }

  public add(order: OrderType) {
    this.console.log('Adding order', order);
    this.get().then(orders => {
      orders.push(order);
      this.save();
      this.console.log('Order added, orders are: ', this._orders);
      this.changeDetectionEmitter.emit();
      this.console.log('Change detetection emitted');
    });
  }

  public _articleToString(a) {
    return '['+a.ami+'|'+(a.half ? this._articleToString(a.half) : '')+'|'+(a.mii ? a.mii.sort().join(',') : '')+'|'+(a.pii ? a.pii.sort().join(',') : '')+']';
  }

  public _articlesAreEqual(a1, a2) {
    return this._articleToString(a1) === this._articleToString(a2);
  }

  public _separateArticles(table) {
    let articles = {'pizza': [], 'bar': [], 'kitchen': []};
    for (let i = 0, max = table.bills.length; i<max; ++i) {
      let bill = table.bills[i];
      for (let j = 0, maxj = bill.newBatch.articles.length; j<maxj; ++j) {
        let article = bill.newBatch.articles[j];
        let category = this._menu.articles[article.ami].category;
        let index = -1;
        if (category == ArticleCategoryEnum['pizza']) {
          if ((index = articles.pizza.findIndex(a => this._articlesAreEqual(a, article))) != -1) {
            articles.pizza[index].q++;
          } else {
            articles.pizza.push(article);
          }
        } else if (category == ArticleCategoryEnum['kitchen']) {
          if ((index = articles.kitchen.findIndex(a => this._articlesAreEqual(a, article))) != -1) {
            articles.kitchen[index].q++;
          } else {
            articles.kitchen.push(article);
          }
        } else {
          if ((index = articles.bar.findIndex(a => this._articlesAreEqual(a, article))) != -1) {
            articles.bar[index].q++;
          } else {
            articles.bar.push(article);
          }
        }
      }
    }
    return articles;
  }

  public createOrders(table) {
    let orders = [];
    let articles = this._separateArticles(table);
    this.console.log('separated articles', articles);
    if (articles.pizza.length) {
      orders.push({device: 'pizza', order: {
        n: table.name,
        wn: this._user.name,
        as: articles.pizza,
        oas: articles.kitchen,
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    if (articles.kitchen.length) {
      orders.push({device: 'kitchen', order: {
        n: table.name,
        wn: this._user.name,
        as: articles.kitchen,
        oas: articles.pizza,
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    if (articles.bar.length) {
      orders.push({device: 'bar', order: {
        n: table.name,
        wn: this._user.name,
        as: articles.bar,
        oas: [],
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    return orders;
  }

}
