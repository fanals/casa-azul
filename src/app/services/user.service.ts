import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserType } from '../types';
import { ConsoleService } from './console.service';
import { DeviceService } from './device.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loadingUser: boolean = true;
  private _user:UserType = {name: '', device: null};

  constructor(public storage: Storage,
              public deviceService: DeviceService,
              public console: ConsoleService) {this.init()}

  init() {
    this.storage.get('user').then((user: UserType) => {
      if (user)
        this._user = user;
      this._loadingUser = false;
    });
  }
  
  get() {
    return new Promise<UserType>(resolve => {
      if (this._loadingUser) {
        let timer = setInterval(() => {
          if (!this._loadingUser) {
            clearInterval(timer);
            resolve(this._user);
          }
        }, 100);
      } else {
        resolve(this._user);
      }
    });
  }

  isLoggedIn() {
    return new Promise<UserType>(resolve => {
      this.get().then(user => {
        if (user.device)
          resolve(user);
      });
    });
  }

  save() {
    return new Promise(resolve => {
      this.storage.set('user', this._user).then(res => {
        this.console.log('User saved', res);
        resolve();
      }).catch(error => this.console.log('Error saving user', error));
    });
  }

}
