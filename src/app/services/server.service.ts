import { Injectable } from '@angular/core';
import { UserType, ServicesEnum, TableOrderType, OrderType, TableType } from '../types';
import { Socket } from 'ngx-socket-io';
import { ConsoleService } from './console.service';
import { catchError, timeout } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PacketType } from 'src/app/types';
import { TablesService } from './tables.service';
import { OrdersService } from './orders.service';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public isConnected: boolean = false;
  private _kitchenDevices = {};
  private _user:UserType;

  constructor(private console: ConsoleService,
              private tablesService: TablesService,
              private ordersService: OrdersService,
              private http: HttpClient,
              private platform: Platform,
              private alertService: AlertService,
              private statusBar: StatusBar,
              private storage: Storage,
              private socket: Socket) {
  }

  public send(packet: PacketType, retry = false) {
    this.console.log('Sending packet', packet);
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        if (retry) {
          setTimeout(() => {
            this.send(packet, true).then(resolve).catch(reject);
          }, 2000);
        } else {
          reject('El iPad no esta conectado');
        }
      } else {
        this.console.log('Emit packet', packet);
        this.socket.emit('send', packet, (res) => {
          if (res && res.error) {
            this.console.log('Error sending', res.error);
            this.console.log('Adding to storage to send later', packet);
            this.storage.get('packets').then(packets => {
              if (!packets)
                packets = [];
              packets.push(packet);
              this.storage.set('packets', packets);
            });
            reject(res.error);
          } else {
            resolve(res);
          }
        });
      }
    });
  }

  public startMonitoring(user) {
    this._user = user;
    this._listening();
    if (user.device.slug == 'main') {
      if (this.platform.is('cordova')) {
        this._startServer().then(() => {
          this.connect();
        });
      }
    } else {
      this.connect();
    }
  }

  public connect() {
    this.socket.disconnect();
    this._getServerURL().then(url => {
      this.storage.set('serverurl', url);
      this.socket.ioSocket.io.opts.query = { reconnection: true };
      this.socket.ioSocket.io.uri = url;
      this.socket.connect();
    }).catch(e => {
      this.console.log('Error getting url', e);
      if (this.platform.is('cordova')) {
        setTimeout(() => {
          this.connect();
        }, 5000);
      }
    });
  }

  private _startServer() {
    return new Promise((resolve, reject) => {
      nodejs.channel.on('console-log', (...args) => {
        this.console.log('[NODE]', ...args);
      });
      nodejs.channel.on('started', () => {
        this.console.log('Node.js Mobile Engine Started');
        resolve();
      });
      nodejs.start('main.js', (err) => {
        if (err) {
          this.console.log('Error starting node server', err);
          reject();
        }
      });
    });
  }

  private _getServerURL() {
    return new Promise((resolve, reject) => {
      if (this._user.device.slug == 'main') {
        resolve('http://localhost:8081');
      } else {
        this.storage.get('serverurl').then(url => {
          if (url) {
            this._isServer(url).then(success => {
              resolve(url);
            }).catch(() => {
              this._testEveryURL().then(workingURL => {
                resolve(workingURL);
              }).catch((e) => {
                reject(e);
              });
            });
          } else {
            this._testEveryURL().then(workingURL => {
              resolve(workingURL);
            }).catch((e) => {
              reject(e);
            });
          }
        }); 
      }
    });
  }

  private _testEveryURL() {
    return new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        reject("Didn't find server URL");
      }, 3000);
      // for (let i = 2; i < 200; ++i) {
      //   let url = 'http://10.0.0.'+i+':8081';
      //   this._isServer(url).then(serverURL => {
      //     clearTimeout(timer);
      //     resolve(serverURL);
      //   });
      // }
      for (let i = 2; i < 300; ++i) {
        let url = 'http://192.168.0.'+i+':8081';
        this._isServer(url).then(serverURL => {
          clearTimeout(timer);
          resolve(serverURL);
        });
      }
    });
  }

  private _isServer(url) {
    return new Promise((resolve, reject) => {
      this.http.get(url+'/casaazul').pipe(timeout(2000), catchError(e => {
        return new Promise(resolve => {
          resolve({error: e});
        });
      })).subscribe((res:any) => {
        if (res.error) {
          reject()
        } else {
          resolve(url);
        }
      });
    });
  }

  private _setRedStatusBar() {
    this.statusBar.backgroundColorByHexString('#ff6961');
  }

  private _setGreenStatusBar() {
    this.statusBar.backgroundColorByHexString('#5cc593');
  }

  public sendToKitchen(waiterName, tableName, articles) {
    let orders = this.ordersService.createOrders(waiterName, tableName, articles);
    this.console.log('Send to kitchen', orders);
    for (let i = 0, max = orders.length; i<max;++i) {
      let packet = {device: orders[i].device, service: ServicesEnum['service-new-kitchen-order'], data:orders[i].order};
      this.send(packet).then(() => {
        console.log('Packet Sent');
      }).catch(e => {
        console.log('Error sending packet', e);
      });
    }
  }

  private _listeningForMainServices() {
    this.socket.on(ServicesEnum['service-new-table-order'], (tableOrder: TableOrderType, cb) => {
      this.tablesService.addTableOrder(tableOrder).then((table: TableType) => {
        let articles = tableOrder.bills.flatMap(bill => bill.articles);
        this.sendToKitchen(tableOrder.waiterName, table.name, articles);
        cb(table);
      });
    });
    this.socket.on(ServicesEnum['service-get-opened-tables'], (cb) => {
      cb(this.tablesService.getOpenedTables());
    });
    this.socket.on(ServicesEnum['service-get-table'], (tableId:number, cb) => {
      this.tablesService.getTableById(tableId).then((table) => {
        cb(table);
      });
    });
    this.socket.on(ServicesEnum['service-ask-for-bill'], (tableId:number, cb) => {
      this.tablesService.askForBill(tableId).then((table) => {
        cb(table);
      });
    });
  }

  private _listeningForKitchenServices() {
    this.socket.on(ServicesEnum['service-new-kitchen-order'], (order: OrderType, cb) => {
      this.ordersService.add(order);
      cb();
    });
    this.socket.on(ServicesEnum['service-get-orders'], (cb) => {
      this.ordersService.get().then(cb);
    });
    this.socket.on(ServicesEnum['service-get-orders-history'], (cb) => {
      this.ordersService.getHistory().then(cb);
    });
    this.socket.on(ServicesEnum['service-get-waiting-time'], (cb) => {
      this.ordersService.getEstimatedWaitingTime().then(cb);
    });
  }

  private _listeningForSocketConnection() {
    this.socket.fromEvent('connect').subscribe(() => {
      console.log('Connected to server');
      if (this._user.device.slug != 'main')
        this._setGreenStatusBar();
      this.isConnected = true;
      if (['main', 'bar', 'kitchen', 'pizza'].indexOf(this._user.device.slug) != -1) {
        this.socket.emit('device', this._user.device.slug);
      }
    });
    this.socket.fromEvent('disconnect').subscribe((e) => {
      console.log('Disconnected from server', e);
      this._setRedStatusBar();
      this.isConnected = false;
    });
    this.socket.fromEvent('error').subscribe((e) => {
      this.console.log('Socket error', e);
    });
  }

  private _listeningForDeviceConnection() {
    this.socket.fromEvent('device-connected').subscribe((device:string) => {
      this.console.log('Device is connected', device);
      this._kitchenDevices[device] = 'connected';
      console.log('Kitchen Devices are', this._kitchenDevices);
      console.log('Kitchen devices length', Object.keys(this._kitchenDevices).length);
      if (Object.keys(this._kitchenDevices).length == 3)
        this._allDevicesAreConnected();
    });
    this.socket.fromEvent('device-disconnected').subscribe((device:string) => {
      this.console.log('Device is disconnected', device);
      if (this._kitchenDevices[device])
        delete this._kitchenDevices[device];
      this._setRedStatusBar();
    });
  }

  private _listening() {
    this._listeningForSocketConnection();
    if (this._user.device.slug == 'main') {
      this._listeningForDeviceConnection();
      this._listeningForMainServices();
    } else if (['bar', 'pizza', 'kitchen'].indexOf(this._user.device.slug) != -1) {
      this._listeningForKitchenServices();
    }
  }

  private _allDevicesAreConnected() {
    this.console.log('All devices are connected');
    this._setGreenStatusBar();
    this.storage.get('packets').then(packets => {
      this.storage.set('packets', null);
      if (packets) {
        this.console.log('Packets are', packets);
        packets.forEach(packet => {
          this.console.log('Sending packet', packet);
          this.send(packet);
        });
      }
    });
  }
}
