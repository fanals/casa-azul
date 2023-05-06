import { Injectable, resolveForwardRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = null;
  private _timer = null;

  constructor(public loadingController: LoadingController) {}

  public show(message = 'Loading', timer = 6000) {
    return new Promise<void>(async (resolve) => {
      this.dismiss();
      this._loading = await this.loadingController.create({
        message: message
      });
      setTimeout(() => {
        if (this._loading) { 
          this._loading.present();
          if (timer) {
            this._timer = setTimeout(() => {
              this._timer = null;
              this.dismiss();
            }, timer);
          }
        }
      }, Math.random() * 1000);
      resolve();
    }); 
  }

  public dismiss() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._loading) {
      this._loading.dismiss();
      this._loading = null;
    }
  }

}
