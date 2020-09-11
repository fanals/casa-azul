import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from 'src/app/services/tables.service';
import { TableType, UserType, MenuType, ServicesEnum, CondensedBillType } from 'src/app/types';
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

  constructor(public menuService: MenuService,
              public route: ActivatedRoute,
              public userService: UserService,
              public loading: LoadingService,
              public printer: PrinterService,
              public ordersService: OrdersService,
              public tablesService: TablesService,
              public navCtrl: NavController,
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

  public closeBill(billIndex) {
    let bill = this.table.bills[billIndex];
    bill.sent = false;
    if (this.billService.getTotal(bill))
      this.table.history.unshift(bill);
    this.table.bills.splice(billIndex, 1);
    if (this.table.bills.length) {
      this.condensedBills.splice(billIndex, 1);
    } else {
      this.table.billAsked = false;
      this.table.billSent = false;
      this.table.opened = false;
      this.backButton();
    }
    this.tablesService.save();
  }

  backButton() {
    this.navCtrl.back({animated: false});
  }

  deleteBill() {
    this.alertService.confirm().then(() => {
      if (this.table.bills.length == 1) {
        this.table.opened = false;
        this.table.bills = [];
        this.backButton();
      } else {
        this.table.bills.splice(this.selectedBillIndex, 1);
      }
      this.tablesService.save();
    });
  }

  printBill() {
    this.alertService.confirm().then(() => {
      //this.printer.print();
      this.table.billAsked = false;
      this.table.billSent = true;
      this.table.bills[this.selectedBillIndex].sent = true;
      this.tablesService.save();
      if (this.table.bills.length > 1) {
        this.selectBill();
      } else {
        this.backButton();
      }
    });
  }

  addBill() {
    this.alertService.prompt('Nombre').then((name:string) => {
      let bill = this.billService.emptyNewBill({generateUUID: true, withItbis: this.table.withItbis, withService: this.table.withService});
      bill.name = name;
      this.table.bills.push(bill);
      this.tablesService.save();
      this.selectedBillIndex = this.table.bills.length - 1;
    }).catch(() => {});
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
      this.tablesService.save();
    });
    return await modal.present();
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
          this.tablesService.save();
        });
      }
    });
  }

  public addArticleIndex(articleIndex) {
    this.menuService.getQuestionAnswers(articleIndex).then((questionsAnswers: []) => {
      this.table.opened = true;
      this.table.bills[this.selectedBillIndex].newBatch.articles.unshift({q: 1, ami:articleIndex, questionsAnswers: questionsAnswers});
      this.tablesService.save();
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

  public renameBill(billIndex) {
    this.alertService.prompt('Cuenta', this.table.bills[billIndex].name).then(name => {
      this.table.bills[billIndex].name = name;
      this.condensedBills[billIndex].name = name;
    });
    this.tablesService.save();
  }

  public sendToKitchen() {
    let articles = this.table.bills.filter(bill => !!bill.newBatch.articles.length).flatMap(bill => bill.newBatch.articles);
    this.server.sendToKitchen(this.user.name, this.table.name, articles);
    let bill = this.table.bills[this.selectedBillIndex];
    let batch = this.table.bills[this.selectedBillIndex].newBatch;
    bill.batches.unshift(batch);
    this.table.bills[this.selectedBillIndex].newBatch = this.billService.emptyNewBatch();
    this.tablesService.save();
  }

  public selectBill(i = -1) {
    if (this.showingHistory) {
      if (this.table.bills.length == 1 && !this.billService.getTotal(this.table.bills[0]))
        this.table.bills = [];
      this.table.bills.push(this.table.history[i]);
      this.table.history.splice(i, 1);
      this.selectedBillIndex = this.table.bills.length - 1;
      this.showingHistory = false;
      this.table.opened = true;
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
    this.tablesService.save();
  }

  public toggleHistory() {
    this.showingHistory = !this.showingHistory;
    if (this.showingHistory)
      this.condensedBills = this.billService.condensed(this.table.history);
  }

}
