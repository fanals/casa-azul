import { Injectable, resolveForwardRef } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';
import { ConsoleService } from './console.service';
import { LoadingService } from './loading.service';
import { BlereceiverService } from './blereceiver.service';
import { ChunkType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  public connectioncharacteristicUUID: string = '823d8e26-7c0a-11ea-bc55-0242ac130003';
  public sendCharacteristicUUID: string = "c5631924-706a-11ea-bc55-0242ac130003";
  public sendServiceUUID: string = "49a9a58d-daf3-4073-8848-c5b1ecad34fb";

  constructor(public platform: Platform,
              public blereceiver: BlereceiverService,
              public console: ConsoleService,
              public loading: LoadingService,
              public bluetoothle: BluetoothLE) {
  }

  init(user) {
    return new Promise(async resolve => {
      if (this.platform.is('cordova')) {
        await this.loading.show('Init');
        await this._initialize();
        await this.loading.show('Init peripheral');
        await this._initPeripheral();
        await this.loading.show('Request permissions');
        await this._requestPermissions();
        await this.loading.show('Adding service');
        await this._addServices(user);
        await this.loading.show('Iniciando bluetooth');
        await this._startAdvertising(user);
        this.loading.dismiss();
      } else {
        this.console.log('Bluetooth init: In browser');
      }
      resolve();
    });
  }

  public write(address, chunk: ChunkType) {
    let chunkString = JSON.stringify(chunk);
    let bytes = this.bluetoothle.stringToBytes(chunkString);
    let encodedString = this.bluetoothle.bytesToEncodedString(bytes);
    return this.bluetoothle.write({address: address, service: this.sendServiceUUID, value: encodedString, characteristic: this.sendCharacteristicUUID});
  }

  private _initialize() {
    return new Promise(resolve => {
      this.bluetoothle.initialize().subscribe(ble => {
        this.console.log('BLE: initialize', ble);
        resolve();
      });
    });
  }

  private _initPeripheral() {
    return new Promise(resolve => {
      this.bluetoothle.initializePeripheral({
        "request": true,
        "restoreKey": "casaazulbluetoothiphone"
      }).subscribe(ble => {
        this.console.log('peripheral', ble);
        if (ble.status == "enabled") {
          resolve();
        } else if (ble.status == 'writeRequested') {
          this.bluetoothle.respond({requestId: ble.requestId, value: ble.value}).then(res => {
            this.blereceiver.receivedChunk(ble.value)
          }).catch(error => {
            this.console.log('respond error', error);
          });
        }
      });
    });
  }

  private _requestPermissions() {
    return new Promise(resolve => {
      if (this.platform.is('android')) {
        this._coarsePermission().then(res => {
          this._locationPermission().then(res => {
            resolve();
          });
        });
      } else {
        resolve();
      }
    });
  }

  private _coarsePermission() {
    return new Promise(resolve => {
      this.bluetoothle.hasPermission().then(res => {
        if (res.hasPermission) {
          resolve();
        } else {
          this.bluetoothle.requestPermission().then(res => {
            this.console.log('Requested coarse permission success: ', res);
            resolve();
          }).catch(error => this.console.log('Error requesting coarse permission: ', error));
        }
      }).catch(error => this.console.log('Error coarse permission: ', error));
    });
  }

  private _locationPermission() {
    return new Promise(resolve => {
      this.bluetoothle.isLocationEnabled().then(res => {
        if (res.isLocationEnabled) {
          resolve();
        } else {
          this.bluetoothle.requestLocation().then(res => {
            this.console.log('Requested location permission success: ', res);
            resolve();
          }).catch(error => this.console.log('Error requesting location permission: ', error));
        }
      }).catch(error => this.console.log('Error location permission: ', error));
    });
  }

  private _addServices(user) {
    return new Promise(async resolve => {
      await this.bluetoothle.removeAllServices();
      // Add connection service
      await this._addService(user.device.serviceUUID, this.connectioncharacteristicUUID);
      // Add communication service
      await this._addService(this.sendServiceUUID, this.sendCharacteristicUUID);
      resolve();
    });
  }

  private _addService(serviceUUID, characteristicsUUID) {
    return new Promise(resolve => {
      this.bluetoothle.addService({
        service: serviceUUID,
        characteristics: [{
          uuid: characteristicsUUID,
          permissions: {
            read: true,
            write: true,
            readEncryptionRequired: false,
            writeEncryptionRequired: false,
          },
          properties : {
            read: true,
            writeWithoutResponse: true,
            write: true,
            notify: true,
            indicate: true,
            notifyEncryptionRequired: false,
            indicateEncryptionRequired: false,
          }
        }]
      }).then(res => {
        this.console.log('Service added', res);
        resolve();
      }).catch(error => {
        this.console.log('Error adding service', error);
      });
    });
  }

  private _startAdvertising(user) {
    return new Promise(resolve => {
      this.console.log('Will start advertising');
      let start = () => {
        this.console.log('Starting advertising as ', user.device.name, user.device.serviceUUID);
        if (this.platform.is('android')) {
          this.bluetoothle.startAdvertising({
            "service": user.device.serviceUUID,
            "name": user.device.name,
            "includeDeviceName": false,
            "includeTxPowerLevel": true
          }).then(res => {
            this.console.log('Advertising started', res);
            resolve();
          }).catch(error => this.console.log('Error advertising', error));
        } else {
          this.bluetoothle.startAdvertising({
            "services":[user.device.serviceUUID],
            "name": user.device.name,
            "includeDeviceName": true
          }).then(res => {
            this.console.log('Advertising started', res);
            resolve();
          }).catch(error => this.console.log('Error advertising', error));
        }
      }
      this.bluetoothle.stopAdvertising().then(start).catch(start);
    });
  }

}
