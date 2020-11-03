import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() {}
  
  getCurrentTime() {
    let d = new Date();
    let hours = (d.getHours() % 12 || 12);
    let minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let ampm = d.getHours() >= 12 ? "PM" : "AM";
    return hours+'h'+minutes+' '+ampm;
  }

}
