import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ArticleType, MenuType, ArticleMenuType } from 'src/app/types';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit {

  public ingredientIndexes: number[];
  public article:ArticleType;
  public articleMenu:ArticleMenuType;
  public menu:MenuType;
  public canModifyIngredients: boolean = false;
  public canBeHalf: boolean = false;
  public pizzas: number[];

  constructor(public navParams: NavParams,
              public modalController: ModalController,
              public menuService:MenuService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
      this.article = this.navParams.get('article');
      this.articleMenu = this.menu.articles[this.article.articleMenuIndex];
      this.canModifyIngredients = this.articleMenu.ingredientCategoryIndex != -1;
      this.canBeHalf = this.articleMenu.canBeHalf;
      if (this.canModifyIngredients) {
        this.ingredientIndexes = this.menu.ingredientsCategories[this.articleMenu.ingredientCategoryIndex].ingredientIndexes;
      }
      if (this.canBeHalf) {
        if (!this.article.half) {
          this.article.half = {articleMenuIndex: null};
        }
        this.pizzas = this.menuService.getPizzas();
      }
    });
  }

  ok() {
    this.modalController.dismiss({article: this.article});
  }

  delete() {
    this.modalController.dismiss({delete: true});
  }

}
