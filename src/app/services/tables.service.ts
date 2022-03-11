import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConsoleService } from './console.service';
import { TableType, TableOrderType } from '../types';
import { BillService } from './bill.service';
import { HelpersService } from './helpers.service';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private _tables: TableType[];

  constructor(private storage: Storage,
              private helpers: HelpersService,
              private billService: BillService,
              private sound: SoundService,
              public console:ConsoleService) {
  }

  private _initTables() {
    this._tables = [
      { name: 'Playa 0', slug:'playa0', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 1', slug:'playa1', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 2', slug:'playa2', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 3', slug:'playa3', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 4', slug:'playa4', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 5', slug:'playa5', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 6', slug:'playa6', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 7', slug:'playa7', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 8', slug:'playa8', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 9', slug:'playa9', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 10', slug:'playa10', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 11', slug:'playa11', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 14', slug:'playa14', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Playa 15', slug:'playa15', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 0', slug:'terraza0', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 1', slug:'terraza1', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 2', slug:'terraza2', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 3', slug:'terraza3', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 4', slug:'terraza4', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 5', slug:'terraza5', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 6', slug:'terraza6', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 7', slug:'terraza7', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 8', slug:'terraza8', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Terraza 9', slug:'terraza9', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 16', slug:'playa16', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 17', slug:'playa17', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 18', slug:'playa18', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 19', slug:'playa19', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 20', slug:'playa20', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},      
      { name: 'Bar 1', slug:'bar', withDelivery: false, closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Komida', slug:'komida', withDelivery: true, closeAfterPrint: true, opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Fito', slug:'fito', withDelivery: true, closeAfterPrint: true, opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Viene a buscar', withDelivery: false, slug:'buscar', closeAfterPrint: false, opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Para llevar', withDelivery: false, slug:'parallevar', closeAfterPrint: false, opened: false, withService: false, withItbis: false, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 21', withDelivery: false, slug:'playa21', closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 22', withDelivery: false, slug:'playa21', closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 23', withDelivery: false, slug:'playa21', closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []},
      { name: 'Extra 24', withDelivery: false, slug:'playa21', closeAfterPrint: false, opened: false, withService: true, withItbis: true, billAsked: false, billSent: false, bills: [], history: []}
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
          bill.delivery = tableOrderBill.delivery;
          if (!tableOrder.merge)
            bill.name = tableOrderBill.name;
          bill.batches.unshift({
            waiterName: tableOrder.waiterName,
            date: this.helpers.getCurrentTime(),
            articles: tableOrderBill.articles
          });
          this.billService.updateTotalPrice(bill);
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
        this.sound.play('cuenta');
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
