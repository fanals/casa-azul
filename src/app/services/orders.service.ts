import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OrderType, MenuType, OrderStateEnum, ArticleCategoryEnum, UserType } from '../types';
import { MenuService } from './menu.service';
import { UserService } from './user.service';
import { ConsoleService } from './console.service';
import { ArticleService } from './article.service';

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
              private articleService: ArticleService,
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
      orders.push({device: 'pizza', order: {
        n: tableName,
        wn: userName,
        as: articles.pizza,
        oas: articles.kitchen,
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    if (articles.kitchen.length) {
      orders.push({device: 'kitchen', order: {
        n: tableName,
        wn: userName,
        as: articles.kitchen,
        oas: articles.pizza,
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    if (articles.bar.length) {
      orders.push({device: 'bar', order: {
        n: tableName,
        wn: userName,
        as: articles.bar,
        oas: [],
        oaso: false,
        st: OrderStateEnum['new']
      }});
    }
    return orders;
  }

}
