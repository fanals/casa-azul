import { Injectable } from '@angular/core';
import { ConsoleService } from './console.service';
import { ChunkType, PacketType } from '../types';
import { DeviceService } from './device.service';
import { BluetoothService } from './bluetooth.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Injectable({
  providedIn: 'root'
})
export class BlesenderService {

  constructor(public console: ConsoleService,
              public bluetoothle: BluetoothLE,
              public bluetoothService: BluetoothService,
              public deviceService: DeviceService) {}

  send(deviceSlug:string, packet: PacketType) {
    return new Promise(resolve => {
      this.console.log('Sending', packet, 'to', deviceSlug);  
      this._getDevice(deviceSlug)
      .then((device:any) => this._connectToDevice(device))
      .then((device:any) => this._discoverDevice(device))
      .then((device:any) => this._send(device, packet))
      .then(() => resolve())
      .catch(error => this.console.log('Error send from ios', error));
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

  _send(device, data) {
    return new Promise(async resolve => {
      let chunk: ChunkType;
      let hasError = false;
      let dataString = JSON.stringify(data);
      let dataChunks = dataString.match(/.{1,350}/g);
      for (let i = 0, max = dataChunks.length; i < max; ++i) {
        chunk = {completed: i+1 == max, chunk:dataChunks[i]};
        await this.bluetoothService.write(device.address, chunk).then(res => {
          this.console.log('Sent trunk', i);
        }).catch(error => {
          hasError = true;
          this.console.log(error);  
        });
        if (hasError)
          break;
      }
      if (!hasError)
        resolve();
    });
  }

  _findDevice(device) {
    return new Promise((resolve, reject) => {
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
  }

}
