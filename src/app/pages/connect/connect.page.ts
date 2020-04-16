import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {

  public iPadAddress: string;

  constructor(public bluetooth: BluetoothService,
              public loading: LoadingService,
              public alert: AlertService) {}

  ngOnInit() {
  }

  scan() {
    // this.loading.show('Buscando...');
    // this.bluetooth.getiPadAddress().then(address => {
    //   this.loading.dismiss();
    //   this.iPadAddress = address;
    // }).catch(error => {
    //   this.loading.dismiss();
    //   this.alert.display(error);
    // });
  }

  

}
