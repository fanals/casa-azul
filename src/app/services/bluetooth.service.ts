import { Injectable } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  public characteristicUUID: string = "c5631924-706a-11ea-bc55-0242ac130003";
  public serviceUUID: string = "49a9a58d-daf3-4073-8848-c5b1ecad34fb";
  public iPhoneSeb: string = "A959DFFA-6C5F-05BD-5D39-951EB38EB3F7";

  constructor(public bluetoothle: BluetoothLE) {}

  displayCharacteristics(address) {
    this.bluetoothle.characteristics({address:address, service: this.serviceUUID}).then(res => {
      console.log(res);
    }).catch(error => {
      console.log(error);
    });
  }

  addBluetoothService() {
    this.bluetoothle.removeAllServices().then(res => {
      console.log('removed all services');
      console.log('adding service');
      this.bluetoothle.addService({
        service: this.serviceUUID,
        characteristics: [{
          uuid: this.characteristicUUID,
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
        alert(res.status);
        console.log('service added', res);
      }).catch(error => {
        alert('error adding service');
        console.log('error adding service', error);
      });
    }).catch(error => {
      console.log('Error removing services', error);
    });
  }

  removeService() {
    this.bluetoothle.removeService({service: this.serviceUUID}).then(res => {
      console.log('remove service', res);
    }).catch(error => {
      console.log('error remove service', error);
    });
  }

  displayDeviceServices(address) {
    this.bluetoothle.services({address: address}).then(services => {
      console.log(services);
    }).catch(error => {
      console.log('services error', error);
    });
  }

  connectToDevice(address) {
    this.bluetoothle.connect({
      address: address,
      autoConnect: true
    }).subscribe(device => {
      if (device.status == 'connected') {
        console.log('Device connected', device.address);
      } else {
        console.log('Device disconnected', device.address);
      }
    });
  }

  readDevice(address) {
    this.bluetoothle.read({address: address, service: this.serviceUUID, characteristic: this.characteristicUUID}).then(res => {
      console.log('read done', res);
    }).catch(error => {
      console.log('read error', error);
    });
  }

  // Max write 524 characters
  writeToDevice(address) {
    console.log('write to device', address);
    let obj = {toto: "seb"};
    var bytes = this.bluetoothle.stringToBytes(JSON.stringify(obj));
    var encodedString = this.bluetoothle.bytesToEncodedString(bytes);
    this.bluetoothle.write({address: address, service: this.serviceUUID, value: encodedString, characteristic: this.characteristicUUID}).then(res => {
      alert('write done');
      alert(JSON.stringify(res));
    }).catch(error => {
      alert('error write');
      alert(JSON.stringify(error));
      this.bluetoothle.reconnect({address: address}).subscribe(res => {
        console.log('reconnect', res);
      });
      //console.log('error write', error);
    });
  }

  subscribeToCharacteristic(address) {
    console.log('Subscribing to characteristic');
    this.bluetoothle.subscribe({characteristic: this.characteristicUUID,
                                address:address,
                                service: this.serviceUUID}).subscribe(res => {
      console.log('new char', res);
    });
  }

  connectedDevices() {
    this.bluetoothle.retrieveConnected({services: ['180F']}).then(res => console.log(res)).catch(e => console.log(e));
  }

  scanForDevices() {
    this.bluetoothle.startScan({
      //services: [this.serviceUUID, "180F"],
      allowDuplicates: false,
      scanMode: 1,
      matchMode: 1,
      matchNum: 1,
      callbackType: 1,
      isConnectable: true
    }).subscribe(device => {
      console.log(device);
      if (device.name == 'iPhone de Seb' || device.name == 'iPad de Casa azul') {
        //this.devices.push(device);
      }
    });
    setTimeout(e => {
      this.bluetoothle.stopScan().then(res => {
        console.log('Scan stopped');
      });
    }, 5000);
  }

  initBluetooth() {
    this.bluetoothle.initialize().subscribe(ble => {
      console.log(ble);
    });
    this.bluetoothle.initializePeripheral({
      "request": true,
      "restoreKey": "casaazulbluetoothiphone"
    }).subscribe(ble => {
      console.log('peripheral', ble);
      if (ble.status == 'writeRequested') {
        let bytes = this.bluetoothle.encodedStringToBytes(ble.value);
        let text = this.bluetoothle.bytesToString(bytes);
        let obj = JSON.parse(text);
        alert('text received');
        alert(obj.toto);
        this.bluetoothle.respond({requestId: ble.requestId, value: ble.value}).then(res => {
          console.log('respond done', res);
        }).catch(error => {
          console.log('respond error', error);
        });
      }
    });
  }

}
