import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConsoleService } from './console.service';
import { TableType, TableOrderType, BillType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private _tables: TableType[];

  constructor(private storage: Storage,
              public console:ConsoleService) {
  }

  _initTables() {
    this._tables = [
      {id: 0, name: 'Playa 0', opened: false, bills: []},
      {id: 1, name: 'Playa 1', opened: false, bills: []},
      {id: 2, name: 'Playa 2', opened: false, bills: []},
      {id: 3, name: 'Playa 3', opened: false, bills: []},
      {id: 4, name: 'Playa 4', opened: false, bills: []},
      {id: 5, name: 'Playa 5', opened: false, bills: []},
      {id: 6, name: 'Playa 6', opened: false, bills: []},
      {id: 7, name: 'Playa 7', opened: false, bills: []},
      {id: 8, name: 'Playa 8', opened: false, bills: []},
      {id: 9, name: 'Playa 9', opened: false, bills: []},
      {id: 10, name: 'Playa 10', opened: false, bills: []},
      {id: 11, name: 'Playa 11', opened: false, bills: []},
      {id: 12, name: 'Playa 12', opened: false, bills: []},
      {id: 13, name: 'Playa 14', opened: false, bills: []},
      {id: 14, name: 'Terraza 0', opened: false, bills: []},
      {id: 15, name: 'Terraza 1', opened: false, bills: []},
      {id: 16, name: 'Terraza 2', opened: false, bills: []},
      {id: 17, name: 'Terraza 3', opened: false, bills: []},
      {id: 18, name: 'Terraza 4', opened: false, bills: []},
      {id: 19, name: 'Terraza 5', opened: false, bills: []},
      {id: 20, name: 'Terraza 6', opened: false, bills: []},
      {id: 21, name: 'Terraza 7', opened: false, bills: []},
      {id: 22, name: 'Terraza 8', opened: false, bills: []},
      {id: 23, name: 'Terraza 9', opened: false, bills: []},
      {id: 24, name: 'Extra 15', opened: false, bills: []},
      {id: 25, name: 'Extra 16', opened: false, bills: []},
      {id: 26, name: 'Extra 17', opened: false, bills: []},
      {id: 27, name: 'Extra 18', opened: false, bills: []},
      {id: 28, name: 'Extra 19', opened: false, bills: []},
      {id: 29, name: 'Extra 20', opened: false, bills: []},
      {id: 30, name: 'Bar 1', opened: false, bills: []}
    ];
  }

  get() {
    return new Promise(resolve => {
      if (!this._tables) {
        this.storage.get('tables').then((tables) => {
          if (!tables) {
            this._initTables();
            this.storage.set('tables', this._tables);
          } else {
            this._tables = tables;
          }
          resolve(this._tables);
        });
      } else {
        resolve(this._tables);
      }
    });
  }

  getTableById(id) {
    return new Promise<TableType>(resolve => {
      this.get().then(tables => {
        resolve(tables[id]);
      });
    });
  }

  update() {
    this.storage.set('tables', this._tables);
  }

  addTableOrder(tableOrder: TableOrderType) {
    this.console.log('Received table order', tableOrder);
    this.getTableById(tableOrder.tid).then((table:TableType) => {
      table.opened = true;
      for (let i = 0, max = tableOrder.bs.length;i<max;++i) {
        table.bills.push({
          id: 0,
          service: true,
          itbis: true,
          newBatch: {
            waiterName: 'iPad',
            date: 'Now',
            articles: []
          },
          name: tableOrder.bs[i].n,
          batches: [{
            waiterName: tableOrder.wn,
            date: '17:30',
            articles: tableOrder.bs[i].as
          }]
        });
      }
    });
  }

}
