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
    let articlePrice = this._menu.articles[article.articleMenuIndex].price;
    let ingredientsPrice = 0;
    if (article.plusIngredientIndexes) {
      for (let i = 0,max = article.plusIngredientIndexes.length;i<max;++i) {
        ingredientsPrice += this._menu.ingredients[article.plusIngredientIndexes[i]].price;
      }
      if (article.minusIngredientIndexes) {
        for (let i = 0,max = article.minusIngredientIndexes.length;i<max;++i) {
          ingredientsPrice -= this._menu.ingredients[article.minusIngredientIndexes[i]].price;
        } 
      }
    }
    if (article.half && article.half.articleMenuIndex != null) {
      ingredientsPrice /= 2;
      articlePrice = (articlePrice / 2) + (this._menu.articles[article.half.articleMenuIndex].price / 2);
      if (article.half.plusIngredientIndexes) {
        for (let i = 0,max = article.half.plusIngredientIndexes.length;i<max;++i) {
          ingredientsPrice += this._menu.ingredients[article.half.plusIngredientIndexes[i]].price / 2;
        }
        if (article.half.minusIngredientIndexes) {
          for (let i = 0,max = article.half.minusIngredientIndexes.length;i<max;++i) {
            ingredientsPrice -= this._menu.ingredients[article.half.minusIngredientIndexes[i]].price / 2;
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
