import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajipadService {

  private _cajipadUrl = 'http://casazul.fanals.fr';

  constructor(private http: HttpClient) {}

  getMenu() {
    return new Promise(resolve => {
      let url = this._cajipadUrl+'/carte/casazul/json';
      this.http.get(url).subscribe(menu => {
        resolve(menu);
      });
    });
  }

  closeSession(bills) {
    return new Promise(resolve => {
      let url = this._cajipadUrl+'/compta-casaazulv2';
      let headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
      // this.http.post(url, {bills: bills}, {headers: headers}).subscribe(res => {
      //   resolve(res);
      // });
      resolve('ok');
    });
  }

}
