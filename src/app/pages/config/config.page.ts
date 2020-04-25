import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { ServerService } from 'src/app/services/server.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(public menu: MenuService,
              public alert: AlertService,
              public loading: LoadingService,
              public server: ServerService) {}

  ngOnInit() {
  }

  updateMenu() {
    this.menu.update();
  }

  forceReconnectionToServer() {
    if (this.server.isConnected) {
      this.alert.display('Ya esta conectado');
    } else {
      this.loading.show('Conexión al iPad', 6000);
      this.server.connect();
    }
  }

}
