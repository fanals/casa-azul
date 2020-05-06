import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TablesService } from 'src/app/services/tables.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  public tables;

  constructor(public navCtrl: NavController,
              public userService: UserService,
              public tablesService: TablesService) {}

  ngOnInit() {
    this.tablesService.get().then(tables => {
      console.log(tables);
      this.tables = tables;
    });
  }

  openTable(id) {
    this.navCtrl.navigateForward('table/'+id, {animated: false});
  }

  getTableColor(id) {
    if (this.tables[id].billSent)
      return 'success';
    if (this.tables[id].billAsked)
      return 'warning';
    if (this.tables[id].opened)
      return 'dark';
    return 'primary';
  }

}
