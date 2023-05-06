import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { ConsoleService } from 'src/app/services/console.service';
import { DeviceService } from 'src/app/services/device.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ServerService } from 'src/app/services/server.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public user: UserType;
  public onStartup: boolean;
  public hideMainMenu: boolean = false;

  constructor(public userService:UserService,
              public console: ConsoleService,
              public server: ServerService,
              public loading: LoadingService,
              public platform: Platform,
              public storage: Storage,
              public navCtrl: NavController,
              public http: HttpClient,
              public route: ActivatedRoute,
              public deviceService: DeviceService,
              public alert: AlertService) {
    this.onStartup = !!Number(this.route.snapshot.paramMap.get('onStartup'));
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.userService.get().then(user => {
      this.console.log('User is', user);
      this.user = user;
      if (user.name == "") {
        this.alert.prompt('Nombre', '').then(name => {
          user.name = name;
          this.save();
        });
      } else if (user.device && this.onStartup) {
        this.hideMainMenu = true;
        this.server.startMonitoring(user).then(() => {
          if (user.device.slug == "waiter") {
            this.navCtrl.navigateRoot('waiter-select-food');
          } else if (user.device.slug == "main") {
            this.navCtrl.navigateRoot('restaurant');
          } else if (user.device.slug == "pizza") {
            this.navCtrl.navigateRoot('orders');
          } else if (user.device.slug == "bar") {
            this.navCtrl.navigateRoot('orders');
          } else if (user.device.slug == "kitchen") {
            this.navCtrl.navigateRoot('orders');
          }
        });
      }
    });
  }

  changedCategory() {
    this.userService.save().then(() => {
      window.location.href = "";
    });
  }

  save() {
    this.userService.save();
  }

  logout() {
    this.storage.set('restaurant', null).then(res => {
      this.navCtrl.navigateRoot('connect');
    }).catch(error => console.log('Error setting restaurant to null', error));
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
