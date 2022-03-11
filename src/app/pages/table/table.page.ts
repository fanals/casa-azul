import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from 'src/app/services/tables.service';
import { TableType, UserType, MenuType, ServicesEnum, CondensedBillType, DGII, DGIIEnum } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { ArticlePage } from '../article/article.page';
import { BillService } from 'src/app/services/bill.service';
import { AlertService } from 'src/app/services/alert.service';
import { OrdersService } from 'src/app/services/orders.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ServerService } from 'src/app/services/server.service';
import { PrinterService } from 'src/app/services/printer.service';
import { ActionsheetService } from 'src/app/services/action-sheet.service';
import { rejects } from 'assert';
import { CajipadService } from 'src/app/services/cajipad.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

  public user: UserType;
  public menu: MenuType;
  public table: TableType;
  public tableId:number;
  public condensedBills: CondensedBillType[] = [];
  public selectedBillIndex:number = 0;
  public showingHistory:boolean = false;
  public movingArticles:boolean = false;
  public mergingBills: boolean = false;

  constructor(public menuService: MenuService,
              public route: ActivatedRoute,
              public userService: UserService,
              public loading: LoadingService,
              public printer: PrinterService,
              public ordersService: OrdersService,
              public tablesService: TablesService,
              public navCtrl: NavController,
              public cajipad: CajipadService,
              public billService: BillService,
              public alertService: AlertService,
              public server: ServerService,
              public modalController: ModalController) {

  }

  ngOnInit() {
    this.tableId = Number(this.route.snapshot.paramMap.get('id'));
    this.tablesService.getTableById(this.tableId).then(table => {
      console.log('Table is', table);
      this.table = table;
      this._deleteEmptyBills();
      if (!this.table.bills.length) {
        this.table.bills.push(this.billService.emptyNewBill({generateUUID: true, withItbis: this.table.withItbis, withService: this.table.withService}));
      } else if (this.table.bills.length > 1 || this.table.bills[this.selectedBillIndex].sent) {
        this.selectBill();
      }
    });
    this.menuService.get().then(menu => {
      this.menu = menu;
    });
    this.userService.get().then(user => {
      this.user = user;
    });
  }

  public updateTotalPrice() {
    if (this.selectedBillIndex != -1)
      this.billService.updateTotalPrice(this.table.bills[this.selectedBillIndex]);
    this.tablesService.save();
  }

  private _closeBill(billIndex, bill) {
    bill.sent = false;
    if (bill.total)
      this.table.history.unshift(bill);
    this.table.bills.splice(billIndex, 1);
    if (this.table.bills.length) {
      this.condensedBills.splice(billIndex, 1);
      if (this.table.bills.findIndex(bill => bill.sent) == -1) {
        this.table.billAsked = false;
        this.table.billSent = false;
      }
    } else {
      this.table.billAsked = false;
      this.table.billSent = false;
      this.table.opened = false;
      this.backButton();
    }
    this.updateTotalPrice();
  }

  public closeBill(billIndex) {
    let bill = this.table.bills[billIndex];
    if (bill.hasItbis && !bill.dgii.ncf && bill.subtotal) {
      this.alertService.select("Tarjeta o efectivo ?", [{label: "Tarjeta", value: DGIIEnum['CONSUMIDOR_FINAL']}, {label: "Efectivo", value: DGIIEnum['NORMAL']}], DGIIEnum['NORMAL']).then((dgii: DGIIEnum) => {
        bill.dgii.type = dgii;
        this._closeBill(billIndex, bill);
      });
    } else {
      this._closeBill(billIndex, bill);
    }
  }

  backButton() {
    this.navCtrl.back({animated: false});
  }

  deleteBill() {
    if (this.table.bills.length) { 
      this.alertService.confirm().then(() => {
        if (this.table.bills.length == 1) {
          this.table.opened = false;
          this.table.bills = [];
          this.backButton();
        } else {
          this.table.bills.splice(this.selectedBillIndex, 1);
          this.selectBill();
        }
        this.updateTotalPrice();
      });
    } else {
      this.backButton();
    }
  }

  printBill() {
    this.condensedBills = this.billService.condensed(this.table.bills);
    this.printer.printBill(this.table, this.table.bills[this.selectedBillIndex], this.condensedBills[this.selectedBillIndex]).then(() => {});
    this.table.billAsked = false;
    if (this.table.closeAfterPrint || this.table.bills[this.selectedBillIndex].dgii.type !== DGIIEnum['NORMAL']) {
      this.closeBill(this.selectedBillIndex);
    } else {
      this.table.billSent = true;
      this.table.bills[this.selectedBillIndex].sent = true;  
      this.updateTotalPrice();
      if (this.table.bills.length > 1) {
        this.selectBill();
      } else {
        this.backButton();
      }
    }
  }

  addBill() {
    this.stopMovingArticles();
    let bill = this.billService.emptyNewBill({generateUUID: true, withItbis: this.table.withItbis, withService: this.table.withService});
    bill.name = 'Cuenta';
    this.table.bills.push(bill);
    this.updateTotalPrice();
    this.selectedBillIndex = this.table.bills.length - 1;
  }

  // changingBill() {
  //   if (this.selectedBillIndex == -1) {
  //     this.alertService.prompt('Nombre').then((name:string) => {
  //       this.table.bills.push(this.billService.emptyNewBill({generateUUID: true}));
  //       this.selectedBillIndex = this.table.bills.length - 1;
  //       this.selectedBillIndex = this.selectedBillIndex;
  //       this.table.bills[this.selectedBillIndex].name = name;
  //       this.tablesService.save();
  //     }).catch(() => {
  //       this.selectedBillIndex = this.selectedBillIndex;
  //     });
  //   } else {
  //     this.selectedBillIndex = this.selectedBillIndex;
  //   }
  // }

  async modifyArticle(batch, i) {
    if (this.movingArticles) {
      console.log('article is:', batch.articles[i]);
      batch.articles[i].moving = !batch.articles[i].moving;
    } else {
      const modal = await this.modalController.create({
        component: ArticlePage,
        cssClass: 'fullscreen',
        componentProps: {
          article: batch.articles[i],
        },
        animated: false,
        showBackdrop: false
      });
      modal.onDidDismiss().then((res:any) => {
        if (res.data.delete) {
          this._removeArticleIndex(batch, i);
        } else {
          batch.articles[i] = res.data.article;
        }
        this.updateTotalPrice();
      });
      return await modal.present();
    }
  }

  public shortcut(i) {
    let y = document.getElementById("shortcut-"+i).offsetTop - 45;
    document.getElementById('articles-list').scrollTo(0, y);
  }

  public changeTable() {
    let choices = this.tablesService.getTableChoices();
    this.alertService.select('Cambiar a:', choices, this.tableId).then((tableId:number) => {
      if (tableId != this.tableId) {
        this.tablesService.getTableById(tableId).then(table => {
          table.bills = table.opened ? table.bills.concat(this.table.bills) : this.table.bills;
          table.opened = true;
          this.table.opened = false;
          this.table.bills = [];
          this.table = table;
          this.tableId = tableId;
          this.updateTotalPrice();
        });
      }
    });
  }

  public addArticleIndex(articleIndex) {
    this.menuService.getQuestionAnswers(articleIndex).then((questionsAnswers: []) => {
      this.table.opened = true;
      this.table.bills[this.selectedBillIndex].newBatch.articles.unshift({q: 1, ami:articleIndex, questionsAnswers: questionsAnswers, moving:false});
      this.updateTotalPrice();
    }).catch(e => {
      console.log('Canceled answering questions');
    });
  }

  private _removeArticleIndex(batch, i) {
    batch.articles.splice(i, 1);
    if (!this.tablesService.tableHasArticles(this.table)) {
      this.table.opened = false;
    }
  }

  public renameBill(billIndex = -1) {
    if (billIndex == -1)
      billIndex = this.selectedBillIndex;
    let content = this.table.bills[billIndex].name == "Cuenta" ? "" : this.table.bills[billIndex].name;
    this.alertService.prompt('Cuenta', content).then(name => {
      this.table.bills[billIndex].name = name;
      this.condensedBills[billIndex].name = name;
    });
    this.updateTotalPrice();
  }

  public validateArticles(sendToKitchen = false) {
    let articles = this.table.bills.filter(bill => !!bill.newBatch.articles.length).flatMap(bill => bill.newBatch.articles);
    if (sendToKitchen) {
      this.server.sendToKitchen(this.user.name, this.table.name, articles);
      this._addArticlesToBill(articles);
    } else {
      this.alertService.confirm('Validar sin enviar a la cocina ?', false).then(() => {
        this._addArticlesToBill(articles);
      });
    }
  }

  private _addArticlesToBill(articles) {
    let bill = this.table.bills[this.selectedBillIndex];
    let batch = this.table.bills[this.selectedBillIndex].newBatch;
    bill.batches.unshift(batch);
    this.table.bills[this.selectedBillIndex].newBatch = this.billService.emptyNewBatch();
    this.updateTotalPrice();
  }

  public sendToKitchen() {
    let articles = this.table.bills.filter(bill => !!bill.newBatch.articles.length).flatMap(bill => bill.newBatch.articles);
    let bill = this.table.bills[this.selectedBillIndex];
    let batch = this.table.bills[this.selectedBillIndex].newBatch;
    bill.batches.unshift(batch);
    this.table.bills[this.selectedBillIndex].newBatch = this.billService.emptyNewBatch();
    this.updateTotalPrice();
  }

  public selectBill(i = -1) {
    if (this.showingHistory) {
      if (this.table.bills.length == 1 && !this.table.bills[0].total)
        this.table.bills = [];
      this.table.bills.push(this.table.history[i]);
      this.table.history.splice(i, 1);
      this.selectedBillIndex = this.table.bills.length - 1;
      this.showingHistory = false;
      this.table.opened = true;
      if (!this.table.bills[this.selectedBillIndex].dgii.name)
        this.table.bills[this.selectedBillIndex].dgii.type = DGIIEnum['NORMAL'];
    } else {
      this.selectedBillIndex = i;
      if (i != -1) {
        this.table.bills[this.selectedBillIndex].sent = false;
        this.table.billAsked = false;
        this.table.billSent = false;
      } else {
        this.condensedBills = this.billService.condensed(this.table.bills);
      }
    }
    this.updateTotalPrice();
  }

  public toggleHistory() {
    this.showingHistory = !this.showingHistory;
    if (this.showingHistory)
      this.condensedBills = this.billService.condensed(this.table.history);
  }

  public askingForComprobante() {
    if (!this.table.bills[this.selectedBillIndex].total)
      return;
    this.alertService.select("Cual ?", [
      {label: "Consumidor final", value: DGIIEnum['CONSUMIDOR_FINAL']},
      {label: "Comprobante fiscal", value: DGIIEnum['VALOR_FISCAL']}
    ], DGIIEnum['VALOR_FISCAL']).then((type: DGIIEnum) => {
      if (type == DGIIEnum['VALOR_FISCAL']) { 
        this.alertService.prompt('RNC').then(rnc => {
          this.cajipad.getComprobanteNcf(rnc).then((res:any) => {
            if (res.error) {
              this.alertService.display(res.error);
            } else {
              let bill = this.table.bills[this.selectedBillIndex];
              bill.dgii = {
                type: type,
                rnc: res.rnc,
                name: res.name,
                ncf: res.ncf
              };
              this.printBill();
            }
          });
        });
      } else {
        this.cajipad.getConsumidorNcf().then((res:any) => {
          if (res.error) {
            this.alertService.display(res.error);
          } else {
            let bill = this.table.bills[this.selectedBillIndex];
            bill.dgii = {
              type: type,
              ncf: res.ncf
            };
            this.printBill();
          }
        });
      }
    });
  }

  public toggleMovingArticles() {
    if (!this.movingArticles) {
      this.billService.separate(this.table.bills[this.selectedBillIndex]);
      this.movingArticles = true;
    } else {
      this.stopMovingArticles();
    }
  }

  public stopMovingArticles() {
    for (let i = 0; i < this.table.bills[this.selectedBillIndex].batches.length; i++) {
      let batch = this.table.bills[this.selectedBillIndex].batches[i];
      for (let j = 0; j < batch.articles.length; j++) {
        batch.articles[j].moving = false;
      }
    }
    this.movingArticles = false;
  }

  public moveSelectedArticles(onSameTable:boolean) {
    let newBill;
    if (onSameTable) {
      newBill = this.billService.getMovingArticles(this.table.bills[this.selectedBillIndex]);
      this.table.bills.push(newBill);
      this.updateTotalPrice();
      this.selectBill(this.table.bills.length - 1);
      this.stopMovingArticles();
    } else {
      let choices = this.tablesService.getTableChoices();
      this.alertService.select('Cambiar a:', choices, this.tableId).then((tableId:number) => {
        if (tableId != this.tableId) {
          this.tablesService.getTableById(tableId).then(table => {
            newBill = this.billService.getMovingArticles(this.table.bills[this.selectedBillIndex]);
            this.updateTotalPrice();
            this.stopMovingArticles();
            if (!table.bills)
              table.bills = [];
            table.bills.push(newBill);
            table.opened = true;
            this.table = table;
            this.tableId = tableId;
            this.selectedBillIndex = table.bills.length - 1;
            this.updateTotalPrice();
            this.selectBill();
          });
        }
      });
    }
  }

  private _deleteEmptyBills() {
    this.table.bills = this.table.bills.filter(bill => bill.subtotal);
  }

  private _mergeBills() {
    this.mergingBills = false;
    let indexToMerge = -1;
    for (let i = 0, max = this.table.bills.length;i < max;i++) {
      if (this.table.bills[i].merging) {
        this.table.bills[i].merging = false;
        console.log('Index to merge', indexToMerge);
        if (indexToMerge == -1) {
          indexToMerge = i;
        } else {
          this.table.bills[indexToMerge].batches = this.table.bills[i].batches.concat(this.table.bills[indexToMerge].batches);
          this.table.bills[i].batches = [];
          this.billService.updateTotalPrice(this.table.bills[i]);
        }
      }
    }
    if (indexToMerge != -1) {
      this.selectBill(indexToMerge);
    }
    this._deleteEmptyBills();
  }

  public mergeBills() {
    if (this.mergingBills) {
      this._mergeBills();
    } else {
      if (this.table.bills.length > 2) {
        this.mergingBills = true;
      } else {
        this.alertService.confirm().then(() => {
          this.table.bills.forEach(bill => bill.merging = true);
          this._mergeBills();
        });
      }
    }
  }

}
