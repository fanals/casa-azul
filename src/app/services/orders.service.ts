import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OrderType, MenuType, OrderStateEnum, ArticleCategoryEnum, UserType } from '../types';
import { MenuService } from './menu.service';
import { UserService } from './user.service';
import { ConsoleService } from './console.service';
import { ArticleService } from './article.service';

import * as moment from 'moment';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private _user: UserType;
  private _menu: MenuType;
  private _orders: OrderType[];
  private _history: OrderType[][];
  public changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(private storage: Storage,
              private userService: UserService,
              private console: ConsoleService,
              private sound: SoundService,
              private articleService: ArticleService,
              private menuService: MenuService) {
    this.menuService.get().then(menu => {
      this._menu = menu;
    });
    this.userService.get().then(user => {
      this._user = user;
    });
    this.get().then(() => {});
    this.getHistory().then(() => {});
  }

  private _initOrders() {
    this._orders  = [];
  }

  private _initHistory() {
    this._history = [];
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

  public getHistory() {
    return new Promise<OrderType[][]>(resolve => {
      if (!this._history) {
        this.storage.get('ordershistory').then((history) => {
          if (!history) {
            this._initHistory();
            this.storage.set('ordershistory', this._history);
          } else {
            this._history = history;
          }
          resolve(this._history);
        });
      } else {
        resolve(this._history);
      }
    });
  }

  public save() {
    this.storage.set('orders', this._orders);
    this.storage.set('ordershistory', this._history);
  }

  public add(order: OrderType) {
    order.receivedAt = moment();
    this.console.log('Adding order', order);
    this.sound.play(this._user.device.slug);
    this.get().then(orders => {
      orders.push(order);
      this.setReadyIn(orders);
      this.save();
      this.console.log('Order added, orders are: ', this._orders);
      this.changeDetectionEmitter.emit();
      this.console.log('Change detetection emitted');
    });
  }

  public saveHistory(orders: OrderType[]) {
    orders.forEach(order => {
      if (order.state == OrderStateEnum['preparing']) {
        order.state = OrderStateEnum['ready'];
        order.readyIn = 0;
      }
    });
    let history = orders.filter(o => o.state == OrderStateEnum['ready']);
    this._history.unshift(history);
    this._orders = orders.filter(o => o.state != OrderStateEnum['ready']);
    this.save();
    return this._orders;
  }

  public setReadyIn(orders) {
    let state = OrderStateEnum['preparing'];
    let config = {
      'pizza': {
        timeToCook: 4,
        timeToPrepare: 0.5,
        nbArticlesMax: 10
      }, 'kitchen': {
        timeToCook: 5,
        timeToPrepare: 2,
        nbArticlesMax: 4
      }, 'bar': {
        timeToCook: 1,
        timeToPrepare: 0.5,
        nbArticlesMax: 6
      }
    };
    let onGoing = {index: 0, nbArticles: 0, minutes: 0};
    let readyIn = 0;
    orders.forEach((order:OrderType, index) => {
      if (onGoing.nbArticles + order.nbArticles <= config[this._user.device.slug].nbArticlesMax && (order.state == state || !index)) {
        onGoing.nbArticles = onGoing.nbArticles + order.nbArticles; 
      } else {
        onGoing.index = index;
        onGoing.nbArticles = order.nbArticles;
        onGoing.minutes = readyIn;
      }
      readyIn = onGoing.nbArticles * config[this._user.device.slug].timeToPrepare + config[this._user.device.slug].timeToCook + onGoing.minutes - (order.state == OrderStateEnum['preparing'] ? moment().diff(moment(order.startingPreparingAt), 'minutes') : 0);
      if (readyIn < 0)
        readyIn = 0;
      for (let i = onGoing.index; i <= index; i++) {
        orders[i].readyIn = readyIn;
      }
      state = order.state;
    });
  }

  public _separateArticles(articles) {
    let separatedArticles = {'pizza': [], 'bar': [], 'kitchen': []};
    for (let i = 0, max = articles.length; i<max; ++i) {
      let article = articles[i];
      let deviceCategory = this._menu.articles[article.ami].deviceCategory;
      let index = -1;
      if (deviceCategory == ArticleCategoryEnum['pizza']) {
        if ((index = separatedArticles.pizza.findIndex(a => this.articleService.areEqual(a, article))) != -1) {
          separatedArticles.pizza[index].q++;
        } else {
          separatedArticles.pizza.push(JSON.parse(JSON.stringify(article)));
        }
      } else if (deviceCategory == ArticleCategoryEnum['kitchen']) {
        if ((index = separatedArticles.kitchen.findIndex(a => this.articleService.areEqual(a, article))) != -1) {
          separatedArticles.kitchen[index].q++;
        } else {
          separatedArticles.kitchen.push(JSON.parse(JSON.stringify(article)));
        }
      } else {
        if ((index = separatedArticles.bar.findIndex(a => this.articleService.areEqual(a, article))) != -1) {
          separatedArticles.bar[index].q++;
        } else {
          separatedArticles.bar.push(JSON.parse(JSON.stringify(article)));
        }
      } 
    }
    return separatedArticles;
  }

  public createOrders(userName, tableName, articles) {
    let orders = [];
    articles = this._separateArticles(articles);
    this.console.log('separated articles', articles);
    if (articles.pizza.length) {
      let order: OrderType = {
        name: tableName,
        waiterName: userName,
        articles: articles.pizza,
        otherArticles: articles.kitchen,
        otherArticlesOpened: false,
        state: OrderStateEnum['new'],
        nbArticles: articles.pizza.reduce((q, a) => q+a.q, 0)
      }
      orders.push({device: 'pizza', order: order});
    }
    if (articles.kitchen.length) {
      let order: OrderType = {
        name: tableName,
        waiterName: userName,
        articles: articles.kitchen,
        otherArticles: articles.pizza,
        otherArticlesOpened: false,
        state: OrderStateEnum['new'],
        nbArticles: articles.kitchen.reduce((q, a) => q+a.q, 0)
      };
      orders.push({device: 'kitchen', order: order});
    }
    if (articles.bar.length) {
      let order: OrderType = {
        name: tableName,
        waiterName: userName,
        articles: articles.bar,
        otherArticles: [],
        otherArticlesOpened: false,
        state: OrderStateEnum['new'],
        nbArticles: articles.bar.reduce((q, a) => q+a.q, 0)
      };
      orders.push({device: 'bar', order: order});
    }
    return orders;
  }

  public getEstimatedWaitingTime() {
    return new Promise(resolve => {
      this.get().then(orders => {
        if (!orders.length) {
          resolve(0);
        } else {
          this.setReadyIn(orders);
          resolve(Math.ceil((orders[orders.length-1].readyIn + 5) / 5) * 5);
        }
      });
    });
  }

}
