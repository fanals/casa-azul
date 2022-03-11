import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class CajipadService {

  private _cajipadUrl = 'http://casazul.fanals.fr';

  constructor(private http: HttpClient, private loading: LoadingService) {}

  getMenu() {
    return new Promise(resolve => {
      this.loading.show().then(() => {
        let url = this._cajipadUrl+'/carte/casazul/json';
        this.http.get(url).subscribe(menu => {
          this.loading.dismiss();
          resolve(menu);
        });
      });
    });
  }

  closeSession(bills) {
    return new Promise(resolve => {
      this.loading.show().then(() => {
        let url = this._cajipadUrl+'/compta-casaazulv2';
        let headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        this.http.post(url, {bills: bills}, {headers: headers}).subscribe(res => {
          this.loading.dismiss();
          console.log('Sessions closed', res);
          resolve('ok');
        });
      });
    });
  }

  getComprobanteNcf(rnc) {
    return new Promise(resolve => {
      this.loading.show().then(() => {
        let url = this._cajipadUrl+'/get-verified-ncf-number';
        this.http.get(url).subscribe((res: any) => {
          url = this._cajipadUrl+'/get-comprobante-ncf/'+res.verify+'/'+rnc;
          this.http.get(url).subscribe(res => {
            this.loading.dismiss();
            resolve(res);
          });
        });
      });
    });
  }

  getConsumidorNcf() {
    return new Promise(resolve => {
      this.loading.show().then(() => {
        let url = this._cajipadUrl+'/get-verified-ncf-number';
        this.http.get(url).subscribe((res: any) => {
          url = this._cajipadUrl+'/get-consumidor-ncf/'+res.verify;
          this.http.get(url).subscribe(res => {
            this.loading.dismiss();
            resolve(res);
          });
        });
      });
    });
  }

}
