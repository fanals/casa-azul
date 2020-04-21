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

export enum ArticleCategoryEnum {
  'bar',
  'kitchen',
  'pizza'
}

export interface ArticleMenuType {
  id: number,
  name: string,
  price: number,
  ingredientCategoryIndex: number, // -1 if has no ingredients
  category: ArticleCategoryEnum
}

export interface ArticleType {
  ami: number, // Article Menu Index
  q: number, // Quantity
  half?: ArticleType, // Half pizza
  pii?: number[], // Plus ingredient Indexes
  mii?: number[], // Minus ingredient Indexes
}

export interface BatchType {
  waiterName: string,
  date: string,
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

export interface OrderType {
  n: string, // Name
  wn: string, // Waiter Name
  as: ArticleType[], // Articles
  oas: ArticleType[], // Other articles
  oaso: boolean, // Other articles opened
  st: OrderStateEnum // State
}

export interface TableOrderBillType {
  bid: number, // Bill id
  n: string, // Bill name
  as: ArticleType[], // Articles
}

export interface TableOrderType {
  tid: number, // Table id
  wn: string, // Waiter Name
  bs: TableOrderBillType[] // Bills
}

export interface TableType {
  id: number;
  name: string; 
  opened: boolean;
  bills: BillType[];
}

export interface PacketType {
  s: ServicesEnum;
  d: any; // Data
}

export enum ServicesEnum {
  'Batch',
  'Order'
}
