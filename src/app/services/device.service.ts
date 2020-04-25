import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DeviceType } from '../types';
import { ConsoleService } from './console.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private _devices: DeviceType[] = [
    {id: 0, slug: 'main', name: 'Principal', socket: null},
    {id: 1, slug: 'waiter', name: 'Camarero', socket: null},
    {id: 2, slug: 'bar', name: 'Bar', socket: null},
    {id: 3, slug: 'pizza', name: 'Pizza', socket: null},
    {id: 4, slug: 'kitchen', name: 'Cocina', socket: null}
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
