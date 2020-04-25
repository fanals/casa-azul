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
  public selectedBillIndex = 0;

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
    this.tablesService.getTableById(this.route.snapshot.paramMap.get('id')).then(table => {
      this.table = table;
      if (!this.table.bills.length) {
        this.table.bills = [{
          id: 0,
          name: 'Principal',
           batches: [],
           service: true,
           itbis: true,
           newBatch:{
            waiterName: this.user.name,
            date: 'Now',
            articles: []
          }
        }, {
          id: 1,
          name: 'Otra cuenta',
           batches: [],
           service: true,
           itbis: true,
           newBatch:{
            waiterName: this.user.name,
            date: 'Now',
            articles: []
          }
        }];
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

  changingBill() {
    if (this.selectedBillIndex == this.table.bills.length - 1) {
      this.alertService.prompt('Nombre').then((name:string) => {
        this.table.bills[this.selectedBillIndex].name = name;
        this.table.bills.push({
          id: 1,
          name: 'Otra cuenta',
          batches: [],
          service: true,
          itbis: true,
          newBatch:{
            waiterName: this.user.name,
            date: 'Now',
            articles: []
          }
        });
      });
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
        batch.articles.splice(i, 1);        
      } else {
        batch.articles[i] = res.data.article;
      }
    });
    return await modal.present();
  }

  shortcut(i) {
    let y = document.getElementById("shortcut-"+i).offsetTop - 137;
    document.getElementById('articles-list').scrollTo(0, y);
  }

  addArticleIndex(articleIndex) {
    this.table.bills[this.selectedBillIndex].newBatch.articles.unshift({q: 1, ami:articleIndex});
  }

  editBillName() {
    this.alertService.prompt('Cuenta', this.table.bills[this.selectedBillIndex].name).then(name => {
      this.table.bills[this.selectedBillIndex].name = name;
    });
  }

  async sendToKitchen() {
    let orders = this.ordersService.createOrders(this.table);
    for (let i = 0, max = orders.length; i<max;++i) {
      let packet = {device: orders[i].device, service: ServicesEnum['service-order'], data:orders[i].order};
      this.server.send(packet).then(() => {
        console.log('Packet Sent');
      }).catch(e => {
        console.log('Error sending packet', e);
      });
    }
    let bill = this.table.bills[this.selectedBillIndex];
    let batch = this.table.bills[this.selectedBillIndex].newBatch;
    bill.batches.unshift(batch);
    this.table.bills[this.selectedBillIndex].newBatch = {
      waiterName: this.user.name,
      date: 'Now',
      articles: []
    };
  }

}
