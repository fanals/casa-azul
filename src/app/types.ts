import * as moment from 'moment';

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
  pizzainfos: string[]
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
  questions: any[]
}

export interface ArticleType {
  ami: number, // Article Menu Index
  q: number, // Quantity
  questionsAnswers: number[], // Answers to question
  moving: boolean,
  half?: ArticleType, // Half pizza
  pii?: number[], // Plus ingredient Indexes
  mii?: number[], // Minus ingredient Indexes
  infos?: string
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
  subtotal: number,
  service: number,
  itbis: number,
  delivery: number,
  total: number,
  hasService: boolean,
  hasItbis: boolean,
  merging: boolean,
  newBatch: BatchType,
  batches: BatchType[],
  dgii: DGII
}

export interface CondensedBillType {
  name: string,
  newBatch: BatchType,
  sent: boolean,
  articles: ArticleType[],
  service: number,
  itbis: number,
  total: number,
}

export enum OrderStateEnum {
  'new',
  'selected',
  'preparing',
  'ready'
}

export interface OrderType {
  name: string,
  waiterName: string,
  articles: ArticleType[],
  otherArticles: ArticleType[],
  otherArticlesOpened: boolean,
  state: OrderStateEnum,
  nbArticles: number,
  receivedAt?: moment.Moment,
  readyIn?: number,
  startingPreparingAt?: moment.Moment,
}

export interface TableOrderBillType {
  uuid: string;
  name: string;
  delivery: number,
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
  withDelivery: boolean,
  closeAfterPrint: boolean,
  opened: boolean;
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
  dgii: DGII;
  articles: ComptaArticleBillType[];
}

export enum ServicesEnum {
  'service-new-table-order' = 'service-new-table-order',
  'service-new-kitchen-order' = 'service-new-kitchen-order',
  'service-get-opened-tables' = 'service-get-opened-tables',
  'service-ask-for-bill' = 'service-ask-for-bill',
  'service-get-table' = 'service-get-table',
  'service-get-orders' = 'service-get-orders',
  'service-get-orders-history' = 'service-get-orders-history',
  'service-get-waiting-time' = 'service-get-waiting-time'
}

export enum DevicesEnum {
  'bar' = 'bar',
  'kitchen' = 'kitchen',
  'pizza' = 'pizza',
  'camarero' = 'camarero',
  'main' = 'main'
}

export enum DGIIEnum {
  'PREFACTURA',
  'NORMAL',
  'REGIMENES_ESPECIALES',
  'CONSUMIDOR_FINAL',
  'VALOR_FISCAL',
  'NOTA_CREDITO',
  'GUBERNAMENTAL'
}

export interface DGII {
  type: DGIIEnum;
  ncf?: string;
  fullncf?: string;
  rnc?: string;
  name?: string;
}
