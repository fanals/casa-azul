import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  public logs = [];

  constructor() {}

  log(data:any, data2:any = '', data3:any = '', data4:any = '') {
    console.log(data, data2, data3, data4);
    this.logs.unshift(JSON.stringify(data)+' '+JSON.stringify(data2)+' '+JSON.stringify(data3)+' '+JSON.stringify(data4));
  }

}
