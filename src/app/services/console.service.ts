import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  public logs = [];

  constructor() {}

  log(...args) {
    console.log(...args);
    let arr = args.map(arg => {
      return JSON.stringify(arg);
    });
    this.logs.unshift(arr.join(' '));
  }

}
