export interface ChunkType {
  completed: boolean,
  chunk: string
}

export interface DeviceType {
  id: number,
  slug: string,
  name: string,
  serviceUUID: string,
  address: string,
}

export interface UserType {
  name: string,
  device: DeviceType
}

export interface ArticleCategoryMenuType {
  name: string,
  display: boolean,
  articleIndexes: number[],
}

export interface IngredientMenuType {
  name: string,
  price: number
}

export interface IngredientCategoryMenuType {
  name: string,
  ingredientIndexes: number[],
}

export interface MenuType {
  articles: ArticleMenuType[],
  articleCategories: ArticleCategoryMenuType[],
  ingredients: IngredientMenuType[],
  ingredientsCategories: IngredientCategoryMenuType[],
}

export interface ArticleMenuType {
  id: number,
  name: string,
  price: number,
  ingredientCategoryIndex: number, // -1 if has no ingredients
  canBeHalf: boolean
}

export interface ArticleType {
  articleMenuIndex: number,
  half?: ArticleType,
  plusIngredientIndexes?: number[],
  minusIngredientIndexes?: number[],
}

export interface BatchType {
  user: UserType,
  date: string,
  readonly: boolean,
  articles: ArticleType[]
}

export interface BillType {
  id: number,
  name: string,
  service: boolean,
  itbis: boolean,
  newBatch: BatchType,
  batches: BatchType[]
}

export enum OrderStateEnum {
  'new',
  'selected',
  'preparing',
  'ready'
}

export interface PizzaOrderType {
  id: number,
  name: string,
  waiterName: string,
  articles: ArticleType[],
  kitchenArticles: ArticleType[],
  state: OrderStateEnum;
}

export interface TableType {
  id: number;
  name: string; 
  opened: boolean;
  bills: BillType[];
}
