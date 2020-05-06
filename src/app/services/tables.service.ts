import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConsoleService } from './console.service';
import { TableType, TableOrderType } from '../types';
import { BillService } from './bill.service';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private _tables: TableType[];

  constructor(private storage: Storage,
              private billService: BillService,
              public console:ConsoleService) {
  }

  private _initTables() {
    this._tables = [
      { name: 'Playa 0', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 1', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 2', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 3', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 4', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 5', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 6', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 7', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 8', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 9', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 10', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 11', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 12', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 14', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 0', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 1', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 2', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 3', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 4', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 5', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 6', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 7', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 8', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 9', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 15', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 16', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 17', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 18', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 19', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 20', opened: false, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Bar 1', opened: false, billAsked: false, billSent: false, canChangePlace:false, bills: [], history: []}
    ];
  }

  public get() {
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

  public getTableById(id) {
    return new Promise<TableType>(resolve => {
      this.get().then(tables => {
        resolve(tables[id]);
      });
    });
  }

  private _atLeastOneBillIsPresentOnTable(bs, table) {
    return !!bs.filter(b => table.bills.findIndex((bill) => bill.uuid == b.uuid) != -1).length;
  }

  private _getBillsWithUUID(tableOrder) {
    return tableOrder.bills.filter(bill => bill.uuid != 'new');
  }

  // Test if the bills have been moved to another table
  private _getTableFromTableOrder(tableOrder: TableOrderType) {
    return new Promise(resolve => {
      this.getTableById(tableOrder.tableId).then((table:TableType) => {
        let billsWithUUID = this._getBillsWithUUID(tableOrder);
        if (billsWithUUID.length) {
          if (this._atLeastOneBillIsPresentOnTable(billsWithUUID, table)) {
            resolve(table);
          } else {
            let foundTables = this._tables.filter(t => this._atLeastOneBillIsPresentOnTable(billsWithUUID, t));
            if (foundTables.length) {
              resolve(foundTables[0]);
            } else {
              resolve(table);
            }
          }
        } else {
          resolve(table);
        }
      });
    });
  }

  public addTableOrder(tableOrder: TableOrderType) {
    return new Promise(resolve => {
      this.console.log('Received table order', tableOrder);
      this._getTableFromTableOrder(tableOrder).then((table:TableType) => {
        table.opened = true;
        for (let i = 0, max = tableOrder.bills.length;i<max;++i) {
          let tableOrderBill = tableOrder.bills[i];
          let bill = this.billService.getOrCreate(tableOrderBill.uuid, table.bills, tableOrder, i);
          if (!tableOrder.merge)
            bill.name = tableOrderBill.name;
          bill.batches.unshift({
            waiterName: tableOrder.waiterName,
            date: '17:30',
            articles: tableOrderBill.articles
          });
        }
        this.save();
        resolve(table);
      });
    });
  }

  public tableHasArticles(table) {
    let hasArticles = false;
    for (let index = 0; index < table.bills.length; index++) {
      let bill = table.bills[index];
      if (bill.newBatch && bill.newBatch.articles && bill.newBatch.articles.length) {
        hasArticles = true;
        break;
      }
      for (let index2 = 0; index2 < bill.batches.length; index2++) {
        let batch = bill.batches[index2];
        if (batch && batch.articles && batch.articles.length) {
          hasArticles = true;
          break;
        }
      }
      if (hasArticles)
        break;
    }
    return hasArticles;
  }

  public save() {
    this.storage.set('tables', this._tables);
  }

  public getOpenedTables() {
    return this._tables.map(table => table.opened);
  }

  public getTableChoices() {
    return this._tables.map((table, index) => {return {value: index, label: table.name+(table.opened ? ' (Abierta)' : '')}});
  }

  public askForBill(tableId) {
    return new Promise(resolve => {
      this.getTableById(tableId).then((table) => {
        table.billAsked = true;
        resolve(table);
      });
    });
  }

}
