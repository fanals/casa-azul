import { Injectable } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuType, BillType, ArticleType, BatchType, UserType } from '../types';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private _user: UserType;
  private _menu: MenuType;

  constructor(public menuService:MenuService,
              public userService:UserService) {
    this._init();
  }

  private _init() {
    this.menuService.get().then(menu => {
      this._menu = menu;
    });
    this.userService.get().then(user => {
      this._user = user;
    });
  }

  public emptyNewBatch():BatchType {
    return {
      waiterName: this._user.name,
      date: 'Now',
      articles: []
    }
  }

  public getOrCreate(tableOrder, bills, merge, i): BillType {
    let index = merge ? i : bills.findIndex((bill) => bill.uuid == tableOrder.uuid);
    // if (index == -1)
    //   console.log("The bill has been deleted or the bill has already been given to client");
    if ((merge && !bills[index]) || (!merge && (tableOrder.uuid == 'new' || index == -1))) {
      bills.push(this.emptyNewBill({generateUUID: true}));
      return bills[bills.length-1];
    } 
    return bills[index];
  }

  public emptyNewBill(opts = {generateUUID: false}) {
    function uuidv4() {
      return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c:any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
    return {
      uuid: opts.generateUUID ? uuidv4() : 'new',
      service: true,
      itbis: true,
      newBatch: this.emptyNewBatch(),
      name: 'Principal',
      batches: []
    }
  }

  public getArticlePrice(article:ArticleType) {
    let articlePrice = this._menu.articles[article.ami].price;
    let ingredientsPrice = 0;
    if (article.pii) {
      for (let i = 0,max = article.pii.length;i<max;++i) {
        ingredientsPrice += this._menu.ingredients[article.pii[i]].price;
      }
      if (article.mii) {
        for (let i = 0,max = article.mii.length;i<max;++i) {
          ingredientsPrice -= this._menu.ingredients[article.mii[i]].price;
        } 
      }
    }
    if (article.half && article.half.ami != null) {
      ingredientsPrice /= 2;
      articlePrice = (articlePrice / 2) + (this._menu.articles[article.half.ami].price / 2);
      if (article.half.pii) {
        for (let i = 0,max = article.half.pii.length;i<max;++i) {
          ingredientsPrice += this._menu.ingredients[article.half.pii[i]].price / 2;
        }
        if (article.half.mii) {
          for (let i = 0,max = article.half.mii.length;i<max;++i) {
            ingredientsPrice -= this._menu.ingredients[article.half.mii[i]].price / 2;
          } 
        }
      }
    }
    if (ingredientsPrice < 0)
      ingredientsPrice = 0;
    return articlePrice + ingredientsPrice;
  }

  getService(bill:BillType, subtotal = -1) {
    if (!bill.service)
      return 0;
    if (subtotal == -1)
      subtotal = this.getSubtotal(bill);
    return Math.round(subtotal / 10);
  }

  getItbis(bill:BillType, subtotal = -1) {
    if (!bill.itbis)
      return 0;
    if (subtotal == -1)
      subtotal = this.getSubtotal(bill);
    return Math.round(subtotal * 18 / 100);
  }

  getSubtotal(bill:BillType) {
    let subtotal = 0;
    for (let i = 0, max = bill.newBatch.articles.length;i<max;++i) {
      subtotal += this.getArticlePrice(bill.newBatch.articles[i]);
    }
    for (let i = 0, max = bill.batches.length;i<max;++i) {
      let batch = bill.batches[i];
      for (let j = 0, maxj = batch.articles.length;j<maxj;++j) {
        subtotal += this.getArticlePrice(batch.articles[j]);
      }
    }
    return subtotal;
  }

  getTotal(bill) {
    let subtotal = this.getSubtotal(bill);
    return subtotal + this.getItbis(bill, subtotal) + this.getService(bill, subtotal);
  }
}
