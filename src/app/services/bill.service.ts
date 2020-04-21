import { Injectable } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuType, BillType, ArticleType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private _menu: MenuType;

  constructor(public menuService:MenuService) {
    this._init();
  }

  private _init() {
    this.menuService.get().then(menu => {
      this._menu = menu;
    });
  }

  getArticlePrice(article:ArticleType) {
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
