import { Component, OnInit } from '@angular/core';
import { CajipadService } from 'src/app/services/cajipad.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ComptaBillType, TableType, ComptaArticleBillType, ArticleType, MenuType, BatchType } from 'src/app/types';
import { TablesService } from 'src/app/services/tables.service';
import { MenuService } from 'src/app/services/menu.service';
import { BillService } from 'src/app/services/bill.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-totaltoday',
  templateUrl: './totaltoday.page.html',
  styleUrls: ['./totaltoday.page.scss'],
})
export class TotaltodayPage implements OnInit {

  private _menu: MenuType;
  private _tables: TableType[];
  public data;

  constructor(private cajipad: CajipadService,
              private billService: BillService,
              private tablesService: TablesService,
              private menuService: MenuService,
              private alert: AlertService,
              private loading: LoadingService) {}

  ngOnInit() {
    this.tablesService.get().then(tables => {
      this._tables = tables;
      this._setData();
    });
    this.menuService.get().then(menu => {
      this._menu = menu;
    });
  }

  closeSession() {
    this.alert.confirm().then(() => {
      this.loading.show('Cerrando session').then(() => { 
        let bills: ComptaBillType[] = this._getComptaBills();
        console.log('Bills:', bills);
        this.cajipad.closeSession(bills).then(res => {
          this.tablesService.clearHistory();
          this._setData();
          this.loading.dismiss();
          this.alert.display('Session cerrada');
        });
      });
    });
  }

  _getComptaBills() {
    let bills: ComptaBillType[] = this._tables.flatMap(table => {
      return table.history.map(bill => {
        let articles:ComptaArticleBillType[] = bill.batches.flatMap((batch: BatchType) => {
          return batch.articles.map(article => { 
            let a: ComptaArticleBillType = {
              nb: article.q,
              name: this._menu.articles[article.ami].name,
              category: this._menu.articles[article.ami].category,
              price: this._menu.articles[article.ami].price
            };
            return a;
          });
        });
        if (bill.newBatch) { 
          articles = articles.concat(bill.newBatch.articles.map(article => {
            let a: ComptaArticleBillType = {
              nb: article.q,
              name: this._menu.articles[article.ami].name,
              category: this._menu.articles[article.ami].category,
              price: this._menu.articles[article.ami].price
            };
            return a;
          }));
        }
        let b: ComptaBillType = {
          subtotal: this.billService.getSubtotal(bill),
          servicio: this.billService.getService(bill),
          itbis: this.billService.getItbis(bill),
          tableSlug: table.slug,
          articles: articles,
        };
        return b;
      });  
    });
    return bills;
  }

  private _setData() {
    this.data = {
      total: 0,
      service: 0,
      openedTables: 0
    };
    this._tables.forEach(table => {
      table.history.forEach(bill => {
        this.data.total += this.billService.getSubtotal(bill) + this.billService.getItbis(bill);
        this.data.service += this.billService.getService(bill);
      });
      this.data.openedTables = table.bills.reduce((t, bill) => t+this.billService.getTotal(bill), this.data.openedTables);
    });
  }

}
