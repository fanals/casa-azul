import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { TablesService } from 'src/app/services/tables.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { MenuType, TableType, BillType, UserType, BatchType, ArticleType, ServicesEnum, PacketType, TableOrderType, TableOrderBillType } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { BillService } from 'src/app/services/bill.service';
import { ArticlePage } from '../../article/article.page';
import { BlesenderService } from 'src/app/services/blesender.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-waiter-select-food',
  templateUrl: './waiter-select-food.page.html',
  styleUrls: ['./waiter-select-food.page.scss'],
})
export class WaiterSelectFoodPage implements OnInit {

  public user:UserType;
  public menu:MenuType;
  public table:TableType;
  public selectedBillIndex = 0;

  constructor(public menuService: MenuService,
              public alertService: AlertService,
              public tablesService: TablesService,
              public route: ActivatedRoute,
              public blesender: BlesenderService,
              public modalController: ModalController,
              public userService: UserService,
              public loading: LoadingService,
              public navCtrl: NavController,
              public billService: BillService) {}

  ngOnInit() {
    this.menuService.get().then(menu => {
      this.menu = menu;
      return this.userService.get();
    }).then(user => {
      this.user = user;
      return this.tablesService.getTableById(this.route.snapshot.paramMap.get('id'));
    }).then(table => {
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
  }

  backButton() {
    this.navCtrl.back({animated: false});
  }

  shortcut(i) {
    let y = document.getElementById("shortcut-"+i).offsetTop - 137;
    document.getElementById('articles-list').scrollTo(0, y);
  }

  addArticleIndex(articleIndex) {
    this.table.bills[this.selectedBillIndex].newBatch.articles.unshift({q:1, ami:articleIndex});
  }

  sendToServer() {
    this.loading.show("Enviando", 5000);
    let tableOrderBills: TableOrderBillType[] = []; 
    for (let i = 0, max = this.table.bills.length; i<max; ++i) {
      let bill = this.table.bills[i];
      tableOrderBills.push({bid: -1, n: bill.name, as: bill.newBatch.articles});
    }
    let tableOrder: TableOrderType = {
      tid: this.table.id,
      wn: this.user.name,
      bs: tableOrderBills
    }
    let packet:PacketType = {s:ServicesEnum['Batch'], d:tableOrder};
    this.blesender.send('main', packet).then(res => {
      this.loading.dismiss();
    });
  }

  async modifyArticle(i) {
    const modal = await this.modalController.create({
      component: ArticlePage,
      componentProps: {
        article: this.table.bills[this.selectedBillIndex].newBatch.articles[i],
      },
      animated: false,
      showBackdrop: false
    });
    modal.onDidDismiss().then((res:any) => {
      if (res.data.delete) {
        this.table.bills[this.selectedBillIndex].newBatch.articles.splice(i, 1);        
      } else {
        this.table.bills[this.selectedBillIndex].newBatch.articles[i] = res.data.article;
      }
    });
    return await modal.present();
  }

}
