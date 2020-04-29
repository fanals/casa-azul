import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from 'src/app/services/tables.service';
import { TableType, UserType, MenuType, ServicesEnum } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { ArticlePage } from '../article/article.page';
import { BillService } from 'src/app/services/bill.service';
import { AlertService } from 'src/app/services/alert.service';
import { OrdersService } from 'src/app/services/orders.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ServerService } from 'src/app/services/server.service';

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
  public selectedBillIndex = 0;
  public currentBillIndex = 0;

  constructor(public menuService: MenuService,
              public route: ActivatedRoute,
              public userService: UserService,
              public loading: LoadingService,
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
        this.table.bills.push(this.billService.emptyNewBill({generateUUID: true}));
      }
    });
    this.menuService.get().then(menu => {
      this.menu = menu;
    });
    this.userService.get().then(user => {
      this.user = user;
    });
  }

  backButton() {
    this.navCtrl.back({animated: false});
  }

  deleteBill() {
    this.alertService.validate().then(() => {
      if (this.table.bills.length == 1) {
        this.table.opened = false;
        this.table.bills = [];
        this.backButton();
      } else {
        this.table.bills.splice(this.currentBillIndex, 1);
      }
      this.tablesService.save();
    });
  }

  changingBill() {
    if (this.selectedBillIndex == -1) {
      this.alertService.prompt('Nombre').then((name:string) => {
        this.table.bills.push(this.billService.emptyNewBill({generateUUID: true}));
        this.selectedBillIndex = this.table.bills.length - 1;
        this.currentBillIndex = this.selectedBillIndex;
        this.table.bills[this.currentBillIndex].name = name;
        this.tablesService.save();
      }).catch(() => {
        this.selectedBillIndex = this.currentBillIndex;
      });
    } else {
      this.currentBillIndex = this.selectedBillIndex;
    }
  }

  async modifyArticle(batch, i) {
    const modal = await this.modalController.create({
      component: ArticlePage,
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
    if (this.table.opened) {
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
  }

  public addArticleIndex(articleIndex) {
    this.table.opened = true;
    this.table.bills[this.currentBillIndex].newBatch.articles.unshift({q: 1, ami:articleIndex});
    this.tablesService.save();
  }

  private _removeArticleIndex(batch, i) {
    batch.articles.splice(i, 1);
    if (!this.tablesService.tableHasArticles(this.table)) {
      this.table.opened = false;
    }
  }

  public editBillName() {
    this.alertService.prompt('Cuenta', this.table.bills[this.currentBillIndex].name).then(name => {
      this.table.bills[this.currentBillIndex].name = name;
    });
    this.tablesService.save();
  }

  public sendToKitchen() {
    let orders = this.ordersService.createOrders(this.table);
    for (let i = 0, max = orders.length; i<max;++i) {
      let packet = {device: orders[i].device, service: ServicesEnum['service-order'], data:orders[i].order};
      this.server.send(packet).then(() => {
        console.log('Packet Sent');
      }).catch(e => {
        console.log('Error sending packet', e);
      });
    }
    let bill = this.table.bills[this.currentBillIndex];
    let batch = this.table.bills[this.currentBillIndex].newBatch;
    bill.batches.unshift(batch);
    this.table.bills[this.currentBillIndex].newBatch = this.billService.emptyNewBatch();
    this.tablesService.save();
  }

}
