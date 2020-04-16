import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BluetoothService } from './services/bluetooth.service';
import { UserService } from './services/user.service';
import { UserType } from './types';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public user: UserType;
  public selectedIndex = 0;
  public appPages = [{
    title: 'Casa Azul',
    url: '/restaurant',
    icon: 'restaurant',
    devices: ['main']
  }, {
    title: 'Empleados',
    url: '/employees',
    icon: 'happy',
    devices: ['main']
  }, {
    title: 'Pedidos',
    url: '/pizzaiolo',
    icon: 'restaurant',
    devices: ['pizza']
  }, {
    title: 'Casa azul',
    url: '/waiter-select-table',
    icon: 'restaurant',
    devices: ['waiter']
  }, {
    title: 'Usuario',
    url: '/user',
    icon: 'person',
    devices: null
  }, {
    title: 'Configuración',
    url: '/config',
    icon: 'construct',
    devices: null
  }, {
    title: 'Bluetooth',
    url: '/connect',
    icon: 'bluetooth',
    devices: null
  }, {
    title: 'Console',
    url: '/console',
    icon: 'book',
    devices: null
  }];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private bluetooth: BluetoothService,
    private userService: UserService,
    private statusBar: StatusBar
  ) {
    
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName('black');
      this.splashScreen.hide();
      this.bluetooth.init();
      this.userService.get().then(user => {
        this.user = user;
      });
    });
  }
}
