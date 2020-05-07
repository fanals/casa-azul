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
      { name: 'Playa 0', slug:'playa0', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 1', slug:'playa1', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 2', slug:'playa2', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 3', slug:'playa3', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 4', slug:'playa4', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 5', slug:'playa5', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 6', slug:'playa6', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 7', slug:'playa7', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 8', slug:'playa8', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 9', slug:'playa9', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 10', slug:'playa10', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 11', slug:'playa11', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 12', slug:'playa12', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Playa 14', slug:'playa14', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 0', slug:'terraza0', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 1', slug:'terraza1', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 2', slug:'terraza2', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 3', slug:'terraza3', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 4', slug:'terraza4', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 5', slug:'terraza5', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 6', slug:'terraza6', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 7', slug:'terraza7', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 8', slug:'terraza8', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Terraza 9', slug:'terraza9', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 15', slug:'playa15', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 16', slug:'playa16', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 17', slug:'playa17', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 18', slug:'playa18', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 19', slug:'playa19', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Extra 20', slug:'playa20', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:true, bills: [], history: []},
      { name: 'Bar', slug:'bar1', opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, canChangePlace:false, bills: [], history: []},
      { name: 'Komida', slug:'komida', opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, canChangePlace:false, bills: [], history: []},
      { name: 'Fito', slug:'fito', opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, canChangePlace:false, bills: [], history: []},
      { name: 'Para llevar', slug:'llevar', opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, canChangePlace:false, bills: [], history: []}
    ];
  }

  public get() {
    return new Promise<TableType[]>(resolve => {
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
          let bill = this.billService.getOrCreate(tableOrderBill.uuid, table, tableOrder, i);
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
    return this._tables.filter(table => table.canChangePlace).map((table, index) => {return {value: index, label: table.name+(table.opened ? ' (Abierta)' : '')}});
  }

  public askForBill(tableId) {
    return new Promise(resolve => {
      this.getTableById(tableId).then((table) => {
        table.billAsked = true;
        resolve(table);
      });
    });
  }

  public clearHistory() {
    this._tables.forEach(table => {
      table.history = [];
    });
    this.save();
  }

}
