import { Injectable } from '@angular/core';
import { ConsoleService } from './console.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Injectable({
  providedIn: 'root'
})
export class TestbluetoothService {

  public sendServiceUUID: string = "49a9a58d-daf3-4073-8848-c5b1ecad34fb";

  constructor(public console: ConsoleService,
              public bluetoothle: BluetoothLE) {}

  scanForDevices() {
    return new Promise(resolve => {
      let devices;
      this.console.log('Scanning for device with service');
      this.bluetoothle.startScan({
        //services: [this.sendServiceUUID],
      }).subscribe(device => {
        this.console.log(device);
      }, error => {
        this.console.log('Error scanning', error);
      });
      setTimeout(e => {
        this.bluetoothle.stopScan().then(res => {
          this.console.log('Scan stopped');
          resolve(devices);
        }).catch(error => this.console.log('Error stopping scan', error));
      }, 5000);
    });
  }

    // subscribeToCharacteristic(address) {
  //   this.console.log('Subscribing to characteristic');
  //   this.bluetoothle.subscribe({characteristic: this.characteristicUUID,
  //                               address:address,
  //                               service: this.serviceUUID}).subscribe(res => {
  //     this.console.log('Receive from subscribing', res);
  //   });
  // }

  // getAdapterInfo() {
  //   this.bluetoothle.getAdapterInfo().then(res => {
  //     this.console.log('adapter info', res);
  //   });
  // }

    // _sendFromiOS2(device, data:Object) {
  //   return new Promise((resolve, reject) => {
  //     let bytes = this.bluetoothle.stringToBytes(JSON.stringify(data));
  //     let encodedString = this.bluetoothle.bytesToEncodedString(bytes);
  //     this.bluetoothle.write({address: device.address, service: this.serviceUUID, value: encodedString, characteristic: this.characteristicUUID}).then(res => {
  //       this.console.log('Sent', res);
  //       resolve();
  //     }).catch(error => {
  //       this.console.log('Error while sending', error);
  //       if (error.error == 'neverConnected') {
  //         this._connectToDevice(device.address).then(res => {
  //           this._sendFromiOS2(device, data).then(res => {
  //             resolve();
  //           }).catch(error => reject(error));
  //         });
  //       } else if (error.error = 'isNotConnected' && error.message == "Device isn't connected") {
  //         this.console.log('Reconnecting to device');
  //         this.bluetoothle.reconnect({address: device.address}).pipe(first()).subscribe(res => {
  //           this.console.log('reconnected', res);
  //           this._sendFromiOS2(device, data).then(res => {
  //             resolve();
  //           }).catch(error => reject(error));
  //         }, error => {
  //           this.console.log('Error reconnecting ', error);
  //         });
  //       } else if (error.error == 'service' && error.message == 'Service not found') {
  //         this.console.log('Service not found, displaying services:');
  //         this._displayServices(device.address).then(res => {
  //           reject({error: 'no-service'});
  //         });
  //       } else if (error.error == false && error.message == 'Service not found') {
  //         this.console.log('Service not found, displaying services:');
  //         this._displayServices(device.address).then(res => {
  //           this._sendFromiOS2(device, data).then(res => {
  //             resolve();
  //           }).catch(error => reject(error));
  //         });
  //       } else if (error.error == false && error.message == 'Characteristic not found') {
  //         this.console.log('Characteristic not found, displaying characteristic:');
  //         this._displayCharacteristics(device.address).then(res => {
  //           this._sendFromiOS2(device, data).then(res => {
  //             resolve();
  //           }).catch(error => reject(error));
  //         });
  //       } else if (error.message == 'No device address') {
  //         this._connectToDevice(device.address).then(res => {
  //           this._sendFromiOS2(device, data).then(res => {
  //             resolve();
  //           }).catch(error => reject(error));
  //         });
  //       } else {
  //         this.console.log('Unknown error: ', error);
  //       }
  //     });
  //   });
  // }

   // stopAdvertising() {
  //   this.console.log('Stopping advertising');
  //   this.bluetoothle.stopAdvertising().then(res => {
  //     this.console.log('Stopped advertising', res);
  //   }).catch(error => this.console.log('Error stopping advertising', error));
  // }

  // removeService() {
  //   this.console.log('Removing service');
  //   this.bluetoothle.removeService({service: this.serviceUUID}).then(res => {
  //     this.console.log('remove service', res);
  //   }).catch(error => {
  //     this.console.log('error remove service', error);
  //   });
  // }

  // readDevice(address) {
  //   this.console.log('Reading service');
  //   this.bluetoothle.read({address: address, service: this.serviceUUID, characteristic: this.characteristicUUID}).then(res => {
  //     this.console.log('read done', res);
  //   }).catch(error => {
  //     this.console.log('read error', error);
  //   });
  // }

   // _reconnectToDevice(address) {
  //   this.console.log('Reconnecting to device');
  //   this.bluetoothle.reconnect({address: address}).subscribe(res => {
  //     this.console.log('reconnected', res);
  //   }, error => {
  //     this.console.log('Error reconnecting ', error);
  //   });
  // }

  // closeConnection(address) {
  //   this.bluetoothle.close({address: address}).then(res => {
  //     this.console.log('Closed connection', res);
  //   }).catch(error => this.console.log('Error closing connection', error));
  // }

  // retrieveConnectedDevices() {
  //   this.console.log('Retrieving connected devices');
  //   this.bluetoothle.retrieveConnected({}).then(devices => {
  //     this.console.log('Connected devices', devices);
  //   }).catch(error => this.console.log('Error retrieving devices', error));
  // }

  // enable() {
  //   this.console.log('Enabling bluetooth');
  //   this.bluetoothle.enable();
  // }

  // isEnabled() {
  //   this.bluetoothle.isEnabled().then(enabled => {
  //     this.console.log('Bluetooth is enabled: ', enabled);
  //   });
  // }

  // disable() {
  //   this.console.log('Disabling bluetooth');
  //   this.bluetoothle.disable();
  // }

  // bondToDevice(address) {
  //   this.console.log('Bonding to device', address);
  //   this.bluetoothle.bond({address: address}).subscribe(res => {
  //     this.console.log('Bonded', res);
  //   }, error => this.console.log('Error bonding', error));
  // }

  // unbondDevice(address) {
  //   this.console.log('Unbonding', address);
  //   this.bluetoothle.unbond({address: address}).then(res => {
  //     this.console.log('Unbounded', res);
  //   }).catch(error => this.console.log('Error unbounding', error));
  // }

  // isLocationEnabled() {
  //   this.bluetoothle.isLocationEnabled().then(enabled => {
  //     this.console.log('Is location enabled: ', enabled);
  //   });
  // }

    // _displayServices(address) {
  //   this.console.log('Display services before promise');
  //   return new Promise(resolve => {
  //     this.console.log('Display services:');
  //     this.bluetoothle.services({address: address, services: [this.serviceUUID]}).then(services => {
  //       this.console.log(services);
  //       resolve();
  //     }).catch(error => {
  //       this.console.log('services error', error);
  //     });
  //   });
  // }

  // _displayCharacteristics(address) {
  //   this.console.log('Display characteristic before promise');
  //   return new Promise(resolve => {
  //     this.console.log('Display characteristic:');
  //     this.bluetoothle.characteristics({address:address, service: this.serviceUUID}).then(res => {
  //       this.console.log(res);
  //       resolve();
  //     }).catch(error => {
  //       this.console.log(error);
  //     });
  //   });
  // }

    // _requestPermission() {
  //   this.console.log('Requesting permission');
  //   this.bluetoothle.requestPermission().then(res => {
  //     this.console.log('Requested permission success: ', res);
  //   }).catch(error => this.console.log('Error requestion permission: ', error));
  // }
  
}
