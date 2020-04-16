import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { AlertService } from 'src/app/services/alert.service';
import { TablesService } from 'src/app/services/tables.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { MenuType, TableType, BillType, UserType, BatchType, ArticleType } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { BillService } from 'src/app/services/bill.service';
import { ArticlePage } from '../../article/article.page';

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
              public modalController: ModalController,
              public userService: UserService,
              public navCtrl: NavController,
              public billService: BillService,
              public bluetoothService: BluetoothService) {}

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
            user: this.user,
            date: 'Now',
            readonly: false,
            articles: []
          }
        }, {
          id: 1,
          name: 'Otra cuenta',
           batches: [],
           service: true,
           itbis: true,
           newBatch:{
            user: this.user,
            date: 'Now',
            readonly: false,
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
    this.table.bills[this.selectedBillIndex].newBatch.articles.unshift({articleMenuIndex:articleIndex});
  }

  sendToServer() {
    // let toSend = {s:'ba',ba:this.batch};
    // this.bluetoothService.send('main', toSend).then(res => {
    //   this.alertService.display('Enviado');
    // }).catch(error => {
    //   if (error.error == "no-service") {
    //     this.alertService.display('El servicio no esta activado en el iPad');
    //   }
    // });
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
