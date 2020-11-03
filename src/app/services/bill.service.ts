import { Injectable } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuType, BillType, ArticleType, BatchType, UserType, CondensedBillType } from '../types';
import { UserService } from './user.service';
import { ArticleService } from './article.service';
import { HelpersService } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private _user: UserType;
  private _menu: MenuType;

  constructor(public menuService:MenuService,
              public articleService:ArticleService,
              private helpers: HelpersService,
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
      date: this.helpers.getCurrentTime(),
      articles: []
    }
  }

  public getOrCreate(tableOrder, table, merge, i): BillType {
    let index = merge ? i : table.bills.findIndex((bill) => bill.uuid == tableOrder.uuid);
    // if (index == -1)
    //   console.log("The bill has been deleted or the bill has already been given to client");    
    if ((merge && !table.bills[index]) || (!merge && (tableOrder.uuid == 'new' || index == -1))) {
      table.bills.push(this.emptyNewBill({generateUUID: true, withItbis: table.withItbis, withService: table.withService}));
      return table.bills[table.bills.length-1];
    } 
    return table.bills[index];
  }

  public emptyNewBill(opts = {generateUUID: false, withService: true, withItbis: true}): BillType {
    function uuidv4() {
      return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c:any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }
    return {
      sent: false,
      uuid: opts.generateUUID ? uuidv4() : 'new',
      subtotal: 0,
      itbis: 0,
      service: 0,
      delivery: 0,
      total: 0,
      hasService: opts.withService,
      hasItbis: opts.withItbis,
      newBatch: this.emptyNewBatch(),
      name: 'Cuenta',
      batches: []
    }
  }

  public updateTotalPrice(bill) {
    bill.subtotal = this.getSubtotal(bill);
    bill.itbis = this.getItbis(bill, bill.subtotal);
    bill.service = this.getService(bill, bill.subtotal);
    bill.total = bill.subtotal + bill.itbis + bill.service;    
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
    if (!bill.hasService)
      return 0;
    if (subtotal == -1)
      subtotal = this.getSubtotal(bill);
    return Math.round(subtotal / 10);
  }

  getItbis(bill:BillType, subtotal = -1) {
    if (!bill.hasItbis)
      return 0;
    if (subtotal == -1)
      subtotal = this.getSubtotal(bill);
    return Math.round(subtotal * 18 / 100);
  }

  getSubtotal(bill:BillType) {
    let subtotal = 0;
    for (let i = 0, max = bill.newBatch.articles.length;i<max;++i) {
      subtotal += this.getArticlePrice(bill.newBatch.articles[i]) * bill.newBatch.articles[i].q;
    }
    for (let i = 0, max = bill.batches.length;i<max;++i) {
      let batch = bill.batches[i];
      for (let j = 0, maxj = batch.articles.length;j<maxj;++j) {
        subtotal += this.getArticlePrice(batch.articles[j]) * batch.articles[j].q;
      }
    }
    return subtotal;
  }

  condensed(bills:BillType[]): CondensedBillType[] {
    let index = 0;
    let condensedBills:CondensedBillType[] = [];
    for (let a = 0; a < bills.length; a++) {
      let bill = bills[a];
      condensedBills[a] = {name: bill.name, newBatch: bill.newBatch, sent: bill.sent, articles: [], service: bill.service, itbis: bill.itbis, total: bill.total};
      for (let i = 0; i < bill.batches.length; i++) {
        let batch = bill.batches[i];
        for (let j = 0; j < batch.articles.length; j++) {
          let article = batch.articles[j];
          if ((index = condensedBills[a].articles.findIndex(art => this.articleService.areEqual(art, article))) != -1) {
            condensedBills[a].articles[index].q += article.q;
          } else {
            condensedBills[a].articles.push(JSON.parse(JSON.stringify(article)));
          }
        }
      }
    }
    return condensedBills;
  }

}
