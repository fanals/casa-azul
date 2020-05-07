import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuType, IngredientMenuType, ArticleCategoryEnum } from '../types';
import { CajipadService } from './cajipad.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public _menu: MenuType;
  private _ingredients: IngredientMenuType[] = [
    // Pizza
    {name: 'Oregano', price: 0},
    {name: 'Salsa picante', price: 0},
    {name: 'Basilico', price: 30},
    {name: 'Hongos', price: 30},
    {name: 'Tomate fresco', price: 30},
    {name: 'Piña', price: 30},
    {name: 'Huevo', price: 30},
    {name: 'Ají', price: 30},
    {name: 'Zucchini', price: 30},
    {name: 'Ajo', price: 30},
    {name: 'Berenjena', price: 30},
    {name: 'Maíz', price: 30},
    {name: 'Alcaparras', price: 30},
    {name: 'Aceitunas', price: 30},
    {name: 'Alcachofas', price: 30},
    {name: 'Cebolla', price: 30},
    {name: 'Crema de leche', price: 30},
    {name: 'Rúcula', price: 30},
    {name: 'Papas', price: 30},
    {name: 'Miel', price: 30},
    {name: 'Lechuga', price: 30},
    {name: 'Pesto', price: 30},
    {name: 'Grana', price: 30},
    {name: 'Ricotta', price: 70},
    {name: 'Mozzarella', price: 70},
    {name: 'Jamón', price: 70},
    {name: 'Anchoa', price: 70},
    {name: 'Salami picante', price: 70},
    {name: 'Chorizo', price: 70},
    {name: 'Gorgonzola', price: 70},
    {name: 'Queso de cabra', price: 70},
    {name: 'Salchicha picante', price: 70},
    {name: 'Roquefort', price: 70},
    {name: 'Carne molida', price: 70},
    {name: 'Atún', price: 70},
    {name: 'Tocineta', price: 70},
    {name: 'Pechuga de pollo', price: 70},
    {name: 'Queso camembert', price: 70},
    {name: 'Camarones', price: 150},
    {name: 'Mescla de mariscos', price: 150},
    {name: 'Jamón serrano', price: 150},
    // Ensalada
    {name: 'Oregano', price: 0},
    {name: 'Perejil', price: 0},
    {name: 'Pepino', price: 30},
    {name: 'Tomate', price: 30},
    {name: 'Manzana', price: 30},
    {name: 'Pan tostado', price: 30},
    {name: 'Romero', price: 30},
    {name: 'Aguacate', price: 30},
    {name: 'Mani', price: 30},
    {name: 'Menta', price: 30},
    {name: 'Cebolla roja', price: 30},
    {name: 'Cebolla', price: 30},
    {name: 'Piña', price: 30},
    {name: 'Basilico', price: 30},
    {name: 'Rúcula', price: 30},
    {name: 'Huevo', price: 30},
    {name: 'Grana', price: 30},
    {name: 'Ají', price: 30},
    {name: 'Aceitunas', price: 30},
    {name: 'Alcaparras', price: 30},
    {name: 'Feta', price: 70},
    {name: 'Roquefort', price: 70},
    {name: 'Tocineta', price: 70},
    {name: 'Mozzarella', price: 70},
    {name: 'Filete de pollo', price: 70},
    {name: 'Atún', price: 70},
    {name: 'Anchoa', price: 70},
    {name: 'Jamón serrano', price: 150},
    {name: 'Camarones', price: 150},
    {name: 'Mescla de mariscos', price: 150}
  ];

  constructor(private storage: Storage, private cajipad: CajipadService) {}

  update() {
    console.log('Update menu');
    return new Promise(resolve => {
      this.cajipad.getMenu().then(menu => {
        this._menu = this._formatMenu(menu);
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
        {name: 'pizza', ingredientIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]},
        {name: 'ensalada', ingredientIndexes: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]},
      ]
    };
    for (let i = 0, max = menu.categories.length; i < max; ++i) {
      let category = menu.categories[i];
      let ingredientCategoryIndex = formattedMenu.ingredientsCategories.findIndex((c) => c.name == category.name);
      let articleIndexes = [];
      for (let j = 0, maxj = category.articles.length; j < maxj; ++j) {
        let article = category.articles[j];
        formattedMenu.articles[articleIndex] = {id: article.id, name: article.name, price:article.price, ingredientCategoryIndex: ingredientCategoryIndex, category: category.name, deviceCategory: this._getArticleCategory(category)};
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
    if (['carne', 'pescado', 'pasta', 'ensalada', 'postre', 'extra'].findIndex(c => c == category.name) != -1)
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

}
