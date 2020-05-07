import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user.service';
import { UserType } from './types';
import { ServerService } from './services/server.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public user: UserType;
  public selectedIndex = 0;
  public appPages = [{
    title: 'Mesas',
    url: '/restaurant',
    icon: 'restaurant',
    devices: ['main']
  }, {
    title: 'Total del dia',
    url: '/totaltoday',
    icon: 'wallet',
    devices: ['main']
  }, {
    title: 'Empleados',
    url: '/employees',
    icon: 'happy',
    devices: ['main']
  }, {
    title: 'Pedidos',
    url: '/orders',
    icon: 'restaurant',
    devices: ['pizza', 'bar', 'kitchen']
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
    title: 'Console',
    url: '/console',
    icon: 'book',
    devices: null
  }];

  constructor(
    private platform: Platform,
    private server: ServerService,
    private userService: UserService,
    private loading: LoadingService,
    private statusBar: StatusBar
  ) {
    
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName('black');
      this.userService.isLoggedIn().then(user => {
        this.user = user;
        this.server.startMonitoring(user);
      });
    });
  }
}
