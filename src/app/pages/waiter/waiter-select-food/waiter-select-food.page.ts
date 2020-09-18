import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { TablesService } from 'src/app/services/tables.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { MenuType, TableType, BillType, UserType, BatchType, ArticleType, ServicesEnum, PacketType, TableOrderType, TableOrderBillType, DevicesEnum } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { BillService } from 'src/app/services/bill.service';
import { ArticlePage } from '../../article/article.page';
import { LoadingService } from 'src/app/services/loading.service';
import { ServerService } from 'src/app/services/server.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-waiter-select-food',
  templateUrl: './waiter-select-food.page.html',
  styleUrls: ['./waiter-select-food.page.scss'],
})
export class WaiterSelectFoodPage implements OnInit {

  public user:UserType;
  public menu:MenuType;
  public table:TableType;
  public tableId:number;
  public notConnectedToServer = false;
  public selectedBillIndex = 0;
  public currentBillIndex = 0;

  constructor(public menuService: MenuService,
              public alertService: AlertService,
              public tablesService: TablesService,
              public route: ActivatedRoute,
              public modalController: ModalController,
              public userService: UserService,
              public loading: LoadingService,
              public server: ServerService,
              public navCtrl: NavController,
              public billService: BillService) {}

  ngOnInit() {
    this.loading.show().then(() => {
      this.tableId = Number(this.route.snapshot.paramMap.get('id'));
      this.menuService.get().then(menu => {
        this.menu = menu;
        return this.userService.get();
      }).then(user => {
        this.user = user;
        return this.server.send({
          service: ServicesEnum['service-get-table'],
          device: DevicesEnum['main'],
          data: this.tableId
        });
      }).then((table: TableType) => {
        this._setTable(table);
      }).catch((e) => {
        this.alertService.display(e);
        this.notConnectedToServer = true;
        this.tablesService.getTableById(this.tableId).then(table => {
          this._setTable(table);
        });
      });
    });
  }

  private _setTable(table: TableType) {
    console.log('table is', table);
    this.table = table;
    if (!this.table.bills.length) {
      this.table.bills.push(this.billService.emptyNewBill({generateUUID: false, withItbis: this.table.withItbis, withService: this.table.withService}));
    } else {
      this.table.bills.forEach(bill => bill.newBatch = this.billService.emptyNewBatch());  
    }
    this.loading.dismiss();
  }

  public editBillName() {
    this.alertService.prompt('Cuenta', this.table.bills[this.currentBillIndex].name).then(name => {
      this.table.bills[this.currentBillIndex].name = name;
    });
  }

  backButton() {
    if (this.table.bills.findIndex(bill => !!bill.newBatch.articles.length) != -1) {
      let msg = 'No enviaste la orden, si cambias de mesa perdera la orden, seguir como quiera ?';
      this.alertService.confirm(msg).then(() => {
        this.navCtrl.back({animated: false});
      });
    } else {
      this.navCtrl.back({animated: false});
    }
  }

  shortcut(i) {
    let y = document.getElementById("shortcut-"+i).offsetTop - 137;
    document.getElementById('articles-list').scrollTo(0, y);
  }

  addArticleIndex(articleIndex) {
    this.menuService.getQuestionAnswers(articleIndex).then((questionsAnswers: []) => {
      this.table.opened = true;
      this.table.bills[this.currentBillIndex].newBatch.articles.unshift({q:1, ami:articleIndex, questionsAnswers: questionsAnswers});
      this.tablesService.save();
    }).catch(e => {
      console.log('Canceled answering questions');
    });
  }

  changingBill() {
    if (this.selectedBillIndex == -1) {
      //this.alertService.prompt('Nombre').then((name:string) => {
        this.table.bills.push(this.billService.emptyNewBill({generateUUID: false, withItbis: this.table.withItbis, withService: this.table.withService}));
        this.selectedBillIndex = this.table.bills.length - 1;
        this.currentBillIndex = this.selectedBillIndex;
        this.table.bills[this.currentBillIndex].name = 'Cuenta';
      // }).catch(() => {
      //   this.selectedBillIndex = this.currentBillIndex;
      // });
    } else {
      this.currentBillIndex = this.selectedBillIndex;
    }
  }

  sendToServer() {
    this.loading.show().then(() => {
      this.server.send({
        device: DevicesEnum['main'],
        service: ServicesEnum['service-new-table-order'],
        data: {
          tableId: this.tableId,
          merge: this.notConnectedToServer,
          waiterName: this.user.name,
          bills: this.table.bills.map(bill => {
            return {uuid: bill.uuid, name: bill.name, articles: bill.newBatch.articles};
          })
        }
      }).then((table: TableType) => {
        this._setTable(table);
      }).catch((e) => {
        this.loading.dismiss();
        this.alertService.display(e);
      });
    });
  }

  public askForBill() {
    this.alertService.confirm().then(() => {
      this.loading.show();
      this.server.send({
        service: ServicesEnum['service-ask-for-bill'],
        device: DevicesEnum['main'],
        data: this.tableId
      }).then(() => {
        this.alertService.display('Cuenta lista');
        this.loading.dismiss();
      });
    });
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
        batch.articles.splice(i, 1);
      } else {
        batch.articles[i] = res.data.article;
      }
      this.tablesService.save();
    });
    return await modal.present();
  }

}
