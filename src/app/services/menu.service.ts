import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuType, IngredientMenuType, ArticleCategoryEnum } from '../types';
import { CajipadService } from './cajipad.service';
import { ActionsheetService } from './action-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public _menu: MenuType;
  private _ingredients: IngredientMenuType[] = [
    // Pizza
    {name: 'Aceitunas', price: 50},
    {name: 'Ají', price: 50},
    {name: 'Ajo', price: 50},
    {name: 'Alcachofas', price: 50},
    {name: 'Alcaparras', price: 50},
    {name: 'Anchoa', price: 120},
    {name: 'Atún', price: 90},
    {name: 'Basilico', price: 50},
    {name: 'Berenjena', price: 50},
    {name: 'Camarones', price: 230},
    {name: 'Carne molida', price: 90},
    {name: 'Cebolla', price: 50},
    {name: 'Crema de leche', price: 50},
    {name: 'Gorgonzola', price: 90},
    {name: 'Grana', price: 90},
    {name: 'Hongos', price: 50},
    {name: 'Huevo', price: 30},
    {name: 'Jamón', price: 90},
    {name: 'Jamón serrano', price: 150},
    {name: 'Lechuga', price: 50},
    {name: 'Maíz', price: 50},
    {name: 'Mescla de mariscos', price: 250},
    {name: 'Miel', price: 50},
    {name: 'Mozzarella', price: 70},
    {name: 'Oregano', price: 0},
    {name: 'Papas', price: 50},
    {name: 'Pollo', price: 90},
    {name: 'Peperon chino', price: 0},
    {name: 'Pepperoni', price: 90},
    {name: 'Perejil', price: 0},
    {name: 'Pesto', price: 50},
    {name: 'Piña', price: 50},
    {name: 'Queso', price: 70},
    {name: 'Queso camembert', price: 90},
    {name: 'Queso de cabra', price: 90},
    {name: 'Ricotta', price: 90},
    {name: 'Romero', price: 0},
    {name: 'Roquefort', price: 90},
    {name: 'Rúcula', price: 50},
    {name: 'Salami picante', price: 90},
    {name: 'Salsa picante', price: 0},
    {name: 'Salchicha picante', price: 90},
    {name: 'Tocineta', price: 90},
    {name: 'Tomate fresco', price: 50},
    {name: 'Vegetales', price: 50},
    {name: 'Zucchini', price: 50},
    // Ensalada
    {name: 'Aceitunas', price: 50},
    {name: 'Aguacate', price: 50},
    {name: 'Ají', price: 50},
    {name: 'Alcaparras', price: 50},
    {name: 'Anchoa', price: 120},
    {name: 'Atún', price: 90},
    {name: 'Basilico', price: 50},
    {name: 'Camarones', price: 230},
    {name: 'Cebolla', price: 50},
    {name: 'Cebolla roja', price: 50},
    {name: 'Feta', price: 90},
    {name: 'Grana', price: 90},
    {name: 'Huevo', price: 30},
    {name: 'Jamón', price: 90},
    {name: 'Jamón serrano', price: 150},
    {name: 'Mani', price: 50},
    {name: 'Manzana', price: 50},
    {name: 'Menta', price: 50},
    {name: 'Mescla de mariscos', price: 250},
    {name: 'Mozzarella', price: 70},
    {name: 'Oregano', price: 0},
    {name: 'Pan tostado', price: 30},
    {name: 'Perejil', price: 0},
    {name: 'Pepino', price: 50},
    {name: 'Piña', price: 50},
    {name: 'Pollo', price: 90},
    {name: 'Romero', price: 50},
    {name: 'Roquefort', price: 90},
    {name: 'Rúcula', price: 50},
    {name: 'Tocineta', price: 90},
    {name: 'Tomate', price: 50},
    // Pasta
    {name: 'Aceitunas', price: 50},
    {name: 'Ají', price: 50},
    {name: 'Ajo', price: 50},
    {name: 'Alcachofas', price: 50},
    {name: 'Alcaparras', price: 50},
    {name: 'Anchoa', price: 120},
    {name: 'Atún', price: 90},
    {name: 'Basilico', price: 50},
    {name: 'Berenjena', price: 50},
    {name: 'Camarones', price: 230},
    {name: 'Carne molida', price: 90},
    {name: 'Cebolla', price: 50},
    {name: 'Crema de leche', price: 50},
    {name: 'Gorgonzola', price: 90},
    {name: 'Grana', price: 90},
    {name: 'Hongos', price: 50},
    {name: 'Huevo', price: 30},
    {name: 'Jamón', price: 90},
    {name: 'Jamón serrano', price: 150},
    {name: 'Lechuga', price: 50},
    {name: 'Maíz', price: 50},
    {name: 'Mescla de mariscos', price: 250},
    {name: 'Miel', price: 50},
    {name: 'Mozzarella', price: 70},
    {name: 'Oregano', price: 0},
    {name: 'Papas', price: 50},
    {name: 'Pollo', price: 90},
    {name: 'Peperon chino', price: 0},
    {name: 'Pepperoni', price: 90},
    {name: 'Perejil', price: 0},
    {name: 'Pesto', price: 50},
    {name: 'Piña', price: 50},
    {name: 'Queso', price: 70},
    {name: 'Queso camembert', price: 90},
    {name: 'Queso de cabra', price: 90},
    {name: 'Ricotta', price: 90},
    {name: 'Roquefort', price: 90},
    {name: 'Rúcula', price: 50},
    {name: 'Salami picante', price: 90},
    {name: 'Salsa picante', price: 0},
    {name: 'Salchicha picante', price: 90},
    {name: 'Tocineta', price: 90},
    {name: 'Tomate fresco', price: 50},
    {name: 'Vegetales', price: 50},
    {name: 'Zucchini', price: 50},
  ];

  constructor(private storage: Storage,
              public actionSheet: ActionsheetService,
              private cajipad: CajipadService) {}

  update() {
    console.log('Update menu');
    return new Promise<void>(resolve => {
      this.cajipad.getMenu().then(menu => {
        this._menu = this._formatMenu(menu);
        console.log(this._menu);
        this.storage.set('menu', this._menu);
        resolve();
      });
    });
  }

  _formatMenu(menu:any): MenuType {
    let articleIndex = 0;
    let formattedMenu: MenuType = {
      articles: [],
      articleCategories: [],
      ingredients: this._ingredients,
      ingredientsCategories: [
        {name: 'pizza', ingredientIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]},
        {name: 'pasta', ingredientIndexes: [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121]},
        {name: 'ensalada', ingredientIndexes: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76]},
      ],
      pizzainfos: ['Blanca', 'Roja', 'Poca salsa', 'Poco queso', 'Bien cocida', 'Poca cocida', 'Calzone', 'Abierta', 'Para llevar']
    };
    for (let i = 0, max = menu.categories.length; i < max; ++i) {
      let category = menu.categories[i];
      let ingredientCategoryIndex = formattedMenu.ingredientsCategories.findIndex((c) => c.name == category.name);
      let articleIndexes = [];
      for (let j = 0, maxj = category.articles.length; j < maxj; ++j) {
        let article = category.articles[j];
        formattedMenu.articles[articleIndex] = {id: article.id, name: article.name, price:article.price, ingredientCategoryIndex: ingredientCategoryIndex, category: category.name, deviceCategory: this._getArticleCategory(category), questions: article.questions};
        articleIndexes.push(articleIndex);
        articleIndex++;
      }
      formattedMenu.articleCategories.push({name: category.name, display: category.display, articleIndexes:articleIndexes});
    }
    // Frecuente
    let articleIndexes = [];
    for (let i = 0, max = menu.frecuentes.length; i < max; ++i) {
      articleIndexes.push(formattedMenu.articles.findIndex(a => a.id == menu.frecuentes[i].article_id));
    }
    formattedMenu.articleCategories.unshift({name: 'Frecuente', display: true, articleIndexes: articleIndexes});
    return formattedMenu;
  }

  _getArticleCategory(category) {
    if (category.name == 'pizza')
      return ArticleCategoryEnum['pizza'];
    if (['carne', 'pescado', 'pasta', 'ensalada', 'postre', 'extra', 'desayuno'].findIndex(c => c == category.name) != -1)
      return ArticleCategoryEnum['kitchen'];
    return ArticleCategoryEnum['bar'];
  }

  getArticleIndexById(id) {
    return this._menu.articles.findIndex(a => a.id == id);
  }

  get():Promise<MenuType> {
    return new Promise<MenuType>(resolve => {
      if (!this._menu) {
        this.storage.get('menu').then((menu) => {
          if (!menu) {
            this.update().then(() => {
              resolve(this._menu);
            });
          } else {
            this._menu = menu;
            resolve(this._menu);
          }
        });
      } else {
        resolve(this._menu);
      }
    });
  }

  getPizzas(): number[] {
    return this._menu.articleCategories[this._menu.articleCategories.findIndex(c => c.name == 'pizza')].articleIndexes;
  }

  public getQuestionAnswers(articleIndex) {
    return new Promise((resolve, reject) => {
      let questions = this._menu.articles[articleIndex].questions;
      let questionAnswers = [];
      let questionsLoop = (i) => {
        if (i >= 0) {
          this.actionSheet.choose(questions[i].text, questions[i].answers.map(o => o['text'], true)).then(answer => {
            if (answer !== false) {
              questionAnswers.push(answer);
              questionsLoop(--i);
            } else {
              reject();
            }
          });
        } else {
          resolve(questionAnswers.reverse());
        }
      }
      questionsLoop(questions.length-1);
    });
  }

}
