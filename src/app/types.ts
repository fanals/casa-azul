export interface ChunkType {
  completed: boolean,
  chunk: string
}

export interface DeviceType {
  id: number,
  slug: string,
  name: string,
  socket: string,
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
  deviceCategory: ArticleCategoryEnum,
  category: string,
}

export interface ArticleType {
  ami: number, // Article Menu Index
  q: number, // Quantity
  half?: ArticleType, // Half pizza
  pii?: number[], // Plus ingredient Indexes
  mii?: number[], // Minus ingredient Indexes
}

export interface BatchType {
  waiterName: string;
  date: string;
  articles: ArticleType[];
}

export interface BillType {
  sent: boolean,
  uuid: string,
  name: string,
  service: boolean,
  itbis: boolean,
  newBatch: BatchType,
  batches: BatchType[]
}

export interface CondensedBillType {
  name: string,
  newBatch: BatchType,
  sent: boolean,
  articles: ArticleType[]
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
  uuid: string;
  name: string;
  articles: ArticleType[];
}

export interface TableOrderType {
  tableId: number;
  merge: boolean;
  waiterName: string;
  bills: TableOrderBillType[];
}

export interface TableType {
  name: string;
  slug: string;
  opened: boolean;
  canChangePlace: boolean;
  withService: boolean;
  withItbis: boolean;
  billAsked: boolean;
  billSent: boolean;
  bills: BillType[];
  history: BillType[];
}

export interface PacketType {
  device: DevicesEnum;
  service: ServicesEnum;
  data?: any;
}

export interface ComptaArticleBillType {
  nb: number;
  name: string;
  category: string;
  price: number;
}

export interface ComptaBillType {
  tableSlug: string;
  subtotal: number;
  servicio: number;
  itbis: number;
  articles: ComptaArticleBillType[]
}

export enum ServicesEnum {
  'service-new-table-order' = 'service-new-table-order',
  'service-new-kitchen-order' = 'service-new-kitchen-order',
  'service-get-opened-tables' = 'service-get-opened-tables',
  'service-ask-for-bill' = 'service-ask-for-bill',
  'service-get-table' = 'service-get-table'
}

export enum DevicesEnum {
  'bar' = 'bar',
  'kitchen' = 'kitchen',
  'pizza' = 'pizza',
  'camarero' = 'camarero',
  'main' = 'main',
}


