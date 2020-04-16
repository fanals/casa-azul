import { Injectable, ReflectiveInjector } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';
import { TablesService } from './tables.service';
import { ConsoleService } from './console.service';
import { UserService } from './user.service';
import { UserType, ChunkType } from '../types';
import { Storage } from '@ionic/storage';
import { DeviceService } from './device.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  public connectioncharacteristicUUID: string = '823d8e26-7c0a-11ea-bc55-0242ac130003';
  public characteristicUUID: string = "c5631924-706a-11ea-bc55-0242ac130003";
  public serviceUUID: string = "49a9a58d-daf3-4073-8848-c5b1ecad34fb";

  constructor(public platform: Platform,
              public storage: Storage,
              public deviceService: DeviceService,
              public console: ConsoleService,
              public userService: UserService,
              public tablesService: TablesService,
              public bluetoothle: BluetoothLE) {
  }

  init() {
    if (this.platform.is('cordova')) {
      this.bluetoothle.initialize().subscribe(ble => {
        this.console.log(ble);
        this._initPeripheral();
      });     
    } else {
      this.console.log('Bluetooth init: In browser');
    }
  }

  _initPeripheral() {
    let dataString = '';
    this.bluetoothle.initializePeripheral({
      "request": true,
      "restoreKey": "casaazulbluetoothiphone"
    }).subscribe(ble => {
      this.console.log('peripheral', ble);
      if (ble.status == "enabled") {
        this.addService();
      } else if (ble.status == 'writeRequested') {
        let bytes = this.bluetoothle.encodedStringToBytes(ble.value);
        let text = this.bluetoothle.bytesToString(bytes);
        let dataChunk: ChunkType = JSON.parse(text);
        this.console.log('chunk received', dataChunk);
        this.bluetoothle.respond({requestId: ble.requestId, value: ble.value}).then(res => {
          this.console.log('respond done', res);
          dataString += dataChunk.chunk;
          if (dataChunk.completed) {
            this.console.log('Completed, data string:', dataString);
            let data = JSON.parse(dataString);
            this.console.log('Completed, data object:', data);
            this._receivedData(data);
            dataString = '';
          }
        }).catch(error => {
          this.console.log('respond error', error);
        });
      }
    });
  }

  _getScanPermission() {
    return new Promise(resolve => {
      if (this.platform.is('android')) {
        this.bluetoothle.hasPermission().then(res => {
          if (res.hasPermission) {
            resolve();
          } else {
            this.bluetoothle.requestPermission().then(res => {
              this.console.log('Requested permission success: ', res);
              resolve();
            }).catch(error => this.console.log('Error requestion permission: ', error));
          }
        }).catch(error => this.console.log('Error haspermission: ', error));
      } else {
        resolve();
      }
    });
  }

  requestPermission() {
    this.console.log('Requesting permission');
    this.bluetoothle.requestPermission().then(res => {
      this.console.log('Requested permission success: ', res);
    }).catch(error => this.console.log('Error requestion permission: ', error));
  }

  _addConnectionService(user) {
    this.bluetoothle.addService({
      service: user.device.serviceUUID,
      characteristics: [{
        uuid: this.connectioncharacteristicUUID,
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
      this.console.log('Connection service added', res);      
      this._startAdvertising(user);
    }).catch(error => {
      this.console.log('error adding connection service', error);
    });
  }

  addService() {
    this.userService.isLoggedIn().then((user: UserType) => { 
      this.bluetoothle.removeAllServices().then(res => {
        this.console.log('removed all services');
        this.console.log('adding service');
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
          this.console.log('service added', res);
          this._addConnectionService(user);
        }).catch(error => {
          this.console.log('error adding service', error);
        });
      }).catch(error => {
        this.console.log('Error removing services', error);
      });
    });
  }

  _displayServices(address) {
    this.console.log('Display services before promise');
    return new Promise(resolve => {
      this.console.log('Display services:');
      this.bluetoothle.services({address: address, services: [this.serviceUUID]}).then(services => {
        this.console.log(services);
        resolve();
      }).catch(error => {
        this.console.log('services error', error);
      });
    });
  }

  _displayCharacteristics(address) {
    this.console.log('Display characteristic before promise');
    return new Promise(resolve => {
      this.console.log('Display characteristic:');
      this.bluetoothle.characteristics({address:address, service: this.serviceUUID}).then(res => {
        this.console.log(res);
        resolve();
      }).catch(error => {
        this.console.log(error);
      });
    });
  }

  _connectToDevice(device) {
    return new Promise(resolve => {
      this.console.log('Connecting to ', device);
      this.bluetoothle.isConnected(device).then(isConnectedRes => {
        this.console.log('Is connected ? ', isConnectedRes);
        if (isConnectedRes.isConnected) {
          resolve(device);
        } else {
          this.bluetoothle.connect(device).subscribe(res => {
            if (res.status == 'connected') {
              this.console.log('Device connected', device);
              resolve(device);
            } else {
              this.console.log(res);
            }
          }, error => {
            if (error.error == 'connect') {
              this.bluetoothle.reconnect(device).subscribe(reconnectRes => {
                this.console.log(reconnectRes);
                resolve(device);
              }, error => this.console.log('Reconnect error ', error));
            } else {
              this.console.log('Connect error ', error);
            }
          });
        }
      }).catch(error => {
        if (error.error == 'neverConnected') {
          this.bluetoothle.connect(device).subscribe(res => {
            if (res.status == 'connected') {
              this.console.log('Device connected', device);
              resolve(device);
            } else {
              this.console.log(res);
            }
          }, error => {
            this.console.log('Connect error ', error);
          });
        } else {
          this.console.log('Error is connected', error);
        }
      });
    });
  }

  _reconnectToDevice(address) {
    this.console.log('Reconnecting to device');
    this.bluetoothle.reconnect({address: address}).subscribe(res => {
      this.console.log('reconnected', res);
    }, error => {
      this.console.log('Error reconnecting ', error);
    });
  }

  closeConnection(address) {
    this.bluetoothle.close({address: address}).then(res => {
      this.console.log('Closed connection', res);
    }).catch(error => this.console.log('Error closing connection', error));
  }

  retrieveConnectedDevices() {
    this.console.log('Retrieving connected devices');
    this.bluetoothle.retrieveConnected({}).then(devices => {
      this.console.log('Connected devices', devices);
    }).catch(error => this.console.log('Error retrieving devices', error));
  }

  enable() {
    this.console.log('Enabling bluetooth');
    this.bluetoothle.enable();
  }

  isEnabled() {
    this.bluetoothle.isEnabled().then(enabled => {
      this.console.log('Bluetooth is enabled: ', enabled);
    });
  }

  disable() {
    this.console.log('Disabling bluetooth');
    this.bluetoothle.disable();
  }

  bondToDevice(address) {
    this.console.log('Bonding to device', address);
    this.bluetoothle.bond({address: address}).subscribe(res => {
      this.console.log('Bonded', res);
    }, error => this.console.log('Error bonding', error));
  }

  unbondDevice(address) {
    this.console.log('Unbonding', address);
    this.bluetoothle.unbond({address: address}).then(res => {
      this.console.log('Unbounded', res);
    }).catch(error => this.console.log('Error unbounding', error));
  }

  isLocationEnabled() {
    this.bluetoothle.isLocationEnabled().then(enabled => {
      this.console.log('Is location enabled: ', enabled);
    });
  }

  _startAdvertising(user) {
    this.console.log('Will start advertising');
    let start = () => {
      setTimeout(() => {
        this.console.log('Starting advertising as ', user.device.name);
        this.bluetoothle.startAdvertising({
          "services":[user.device.serviceUUID], //iOS
          "service":user.device.serviceUUID, //Android
          "name": user.device.name,
          "includeDeviceName": false
        }).then(res => {
          this.console.log('Advertising started', res);
        }).catch(error => this.console.log('Error advertising', error));
      }, 5000);
    }
    this.bluetoothle.stopAdvertising().then(start).catch(start);
  }

  stopAdvertising() {
    this.console.log('Stopping advertising');
    this.bluetoothle.stopAdvertising().then(res => {
      this.console.log('Stopped advertising', res);
    }).catch(error => this.console.log('Error stopping advertising', error));
  }

  removeService() {
    this.console.log('Removing service');
    this.bluetoothle.removeService({service: this.serviceUUID}).then(res => {
      this.console.log('remove service', res);
    }).catch(error => {
      this.console.log('error remove service', error);
    });
  }

  readDevice(address) {
    this.console.log('Reading service');
    this.bluetoothle.read({address: address, service: this.serviceUUID, characteristic: this.characteristicUUID}).then(res => {
      this.console.log('read done', res);
    }).catch(error => {
      this.console.log('read error', error);
    });
  }

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

  _findDevice(device) {
    return new Promise((resolve, reject) => {
      this._getScanPermission().then(() => { 
        let deviceFound = false;
        this.console.log('Scanning for devices');
          let timer = setTimeout(e => {
            this.console.log('Not found, stop scanning');
            this.bluetoothle.stopScan().then(res => {
              reject('Device '+device.name+' not found');
            }).catch(error => this.console.log('Error stopping scanning', error));
          }, 5000);
          this.console.log('Start scan for service UUID', device.serviceUUID);
          this.bluetoothle.startScan({services: [device.serviceUUID]}).subscribe(scannedDevice => {
            this.console.log('Device Scanned:', scannedDevice);
            if (!deviceFound && scannedDevice.status == 'scanResult') {
              deviceFound = true;
              clearTimeout(timer);
              this.bluetoothle.stopScan().then(res => {}).catch(error => this.console.log('Error stopping scanning', error));
              device.address = scannedDevice.address;
              this.deviceService.save().then(res => {
                resolve(device);
              });
            }
          }, error => this.console.log('Error scanning', error));
      });
    });
  }

  _getDevice(deviceSlug) {
    return new Promise((resolve, reject) => {
      let device = this.deviceService.getDeviceBySlug(deviceSlug);
      if (device.address) {
        resolve(device);
      } else {
        this._findDevice(device).then(device => {
          resolve(device);
        }).catch(error => reject(error));
      }
    });
  }

  _discoverDevice(device) {
    this.console.log('Will discover');
    return new Promise(resolve => {
      this.bluetoothle.isDiscovered(device).then(res => {
        if (!res.isDiscovered) {
          this.console.log('Starting discovering');
          this.bluetoothle.discover({address: device.address, clearCache: true}).then(discovered => {
            this.console.log('Discovered', discovered);
            resolve(device);
          }).catch(error => this.console.log('Discover error', error));
        } else {
          this.console.log('Already discovered');
          resolve(device);
        }
      }).catch(error => this.console.log('Error is discovered', error));
    });
  }

  _send(device, data) {
    return new Promise(async resolve => {
      let hasError = false;
      let dataString = JSON.stringify(data);
      let dataChunks = dataString.match(/.{1,350}/g);
      for (let i = 0, max = dataChunks.length; i < max; ++i) {
        let chunk: ChunkType = {completed: i+1 == max, chunk:dataChunks[i]};
        let chunkString = JSON.stringify(chunk);
        let bytes = this.bluetoothle.stringToBytes(chunkString);
        let encodedString = this.bluetoothle.bytesToEncodedString(bytes);
        await this.bluetoothle.write({address: device.address, service: this.serviceUUID, value: encodedString, characteristic: this.characteristicUUID}).then(res => {
          this.console.log('Sent trunk', i);
        }).catch(error => {
          hasError = true;
          this.console.log(error)
        });
        if (hasError)
          break;
      }
      if (!hasError)
        resolve();
    });
  }

  _receivedData(data) {
    this.console.log('Received data', data);
    if (data.service == 'batch') {
      this.tablesService.addBatch(data.batch);
    } else {
      alert('Received unknow service: '+data.service);
    }
  }

  // subscribeToCharacteristic(address) {
  //   this.console.log('Subscribing to characteristic');
  //   this.bluetoothle.subscribe({characteristic: this.characteristicUUID,
  //                               address:address,
  //                               service: this.serviceUUID}).subscribe(res => {
  //     this.console.log('Receive from subscribing', res);
  //   });
  // }

  getAdapterInfo() {
    this.bluetoothle.getAdapterInfo().then(res => {
      this.console.log('adapter info', res);
    });
  }

  scanForDevices() {
    return new Promise(resolve => {
      let devices;
      this.console.log('Scanning for device with service');
      this.bluetoothle.startScan({
        services: [this.serviceUUID],
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

  send(deviceSlug, data: Object) {
    this.console.log('Sending', data, 'to', deviceSlug);
    return new Promise(resolve => {
      this._getDevice(deviceSlug)
      .then((device:any) => this._connectToDevice(device))
      .then((device:any) => this._discoverDevice(device))
      .then((device:any) => this._send(device, data))
      .then(() => resolve())
      .catch(error => this.console.log('Error send from ios', error));
    });
  }

}
