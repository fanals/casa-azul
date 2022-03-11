import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ArticleType, MenuType, ArticleMenuType, ArticleCategoryEnum } from 'src/app/types';
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
  public pizzas: number[];
  public ArticleCategoryEnum = ArticleCategoryEnum;

  constructor(public navParams: NavParams,
              public modalController: ModalController,
              public menuService:MenuService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
      this.article = this.navParams.get('article');
      this.articleMenu = this.menu.articles[this.article.ami];
      console.log(this.article);
      console.log(this.articleMenu);
      this.canModifyIngredients = this.articleMenu.ingredientCategoryIndex != -1;
      if (this.canModifyIngredients) {
        this.ingredientIndexes = this.menu.ingredientsCategories[this.articleMenu.ingredientCategoryIndex].ingredientIndexes;
      }
      if (this.articleMenu.deviceCategory == ArticleCategoryEnum['pizza']) {
        if (!this.article.half) {
          this.article.half = {q: 1, ami: null, questionsAnswers: [], moving: false};
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
