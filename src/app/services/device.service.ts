import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DeviceType } from '../types';
import { ConsoleService } from './console.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private _devices: DeviceType[] = [
    {id: 0, slug: 'main', name: 'Principal', serviceUUID: 'a763ce00-7bff-11ea-bc55-0242ac130003', address: null},
    {id: 1, slug: 'waiter', name: 'Camarero', serviceUUID: '60e6fcc6-7c00-11ea-bc55-0242ac130003', address: null},
    {id: 2, slug: 'bar', name: 'Bar', serviceUUID: '60e70040-7c00-11ea-bc55-0242ac130003', address: null},
    {id: 3, slug: 'pizza', name: 'Pizza', serviceUUID: '60e70162-7c00-11ea-bc55-0242ac130003', address: null},
    {id: 4, slug: 'kitchen', name: 'Cocina', serviceUUID: '60e7023e-7c00-11ea-bc55-0242ac130003', address: null}
  ];

  constructor(public storage: Storage, public console: ConsoleService) {
    this._init()
  }

  _init() {
    this.storage.get('devices').then((devices: DeviceType[]) => {
      if (devices)
        this._devices = devices;
    });
  }

  getDeviceBySlug(slug) {
    for (let i = 0, max = this._devices.length; i < max; ++i) {
      if (this._devices[i].slug == slug) {
        return this._devices[i];
      }
    }
  }

  save() {
    return new Promise(resolve => { 
      this.storage.set('devices', this._devices).then(res => {
        this.console.log('Written into storage', this._devices);
        resolve();
      }).catch(error => this.console.log('Error set devices', error));
    });
  }

}
