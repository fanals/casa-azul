import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { ConsoleService } from 'src/app/services/console.service';
import { DeviceService } from 'src/app/services/device.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LoadingService } from 'src/app/services/loading.service';
import { ServerService } from 'src/app/services/server.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public user: UserType;

  constructor(public userService:UserService,
              public console: ConsoleService,
              public server: ServerService,
              public loading: LoadingService,
              public platform: Platform,
              public splashScreen: SplashScreen,
              public deviceService: DeviceService,
              public alert: AlertService) {
    
  }

  ngOnInit() {
    this.userService.get().then(user => {
      this.console.log('User is', user);
      this.user = user;
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  changedCategory() {
    this.userService.save().then(() => {
      this.alert.fixed('Reiniciar el app');
    });
  }

  save() {
    this.userService.save();
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
