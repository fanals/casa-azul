import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { TestbluetoothService } from 'src/app/services/testbluetooth.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(public menu: MenuService,
              public testBluetooth: TestbluetoothService) {}

  ngOnInit() {
  }

  updateMenu() {
    this.menu.update();
  }

  connect() {
    //this.bluetooth._connectToDevice(this.bluetooth.iPadCasaAzulAndroid);
  }

  reconnect() {
    //this.bluetooth._reconnectToDevice(this.bluetooth.iPadCasaAzulAndroid);
  }

  discover() {
    //this.bluetooth._discover(this.bluetooth.iPadCasaAzulAndroid);
  }

  scan() {
    this.testBluetooth.scanForDevices();
  }

  close() {
    //this.bluetooth.closeConnection(this.bluetooth.iPadCasaAzulAndroid);
  }

  retrieveConnectedDevices() {
    //this.bluetooth.retrieveConnectedDevices();
  }

  enable() {
    //this.bluetooth.enable();
  }

  disable() {
    //this.bluetooth.disable();
  }

  isEnabled() {
    //this.bluetooth.isEnabled();
  }

  isLocationEnabled() {
    //this.bluetooth.isLocationEnabled();
  }

  bond() {
    //this.bluetooth.bondToDevice(this.bluetooth.iPadCasaAzulAndroid);
  }

  unbound() {
    //this.bluetooth.unbondDevice(this.bluetooth.iPadCasaAzulAndroid);
  }

  hasPermission() {
    //this.bluetooth.hasPermission();
  }

  requestPermission() {
    //this.bluetooth.requestPermission();
  }

  addService() {
    //this.bluetooth.addService();
  }

  readDevice() {
    //this.bluetooth.readDevice(this.bluetooth.iPadCasaAzulAndroid);
  }

  writeDevice() {
    //this.bluetooth.send(UserCategories['main'], {test: "Hello world"});
  }

  getAdapterInfo() {
    //this.bluetooth.getAdapterInfo();
  }

  startAdvertising() {
    //this.bluetooth.startAdvertising();
  }

  stopAdvertising() {
    //this.bluetooth.stopAdvertising();
  }

}
