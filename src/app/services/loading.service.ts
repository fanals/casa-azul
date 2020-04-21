import { Injectable, resolveForwardRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = null;
  private _timer = null;

  constructor(public loadingController: LoadingController) {}

  public show(message = 'Loading', timer = 0) {
    return new Promise(async (resolve) => {
      this.dismiss();
      this._loading = await this.loadingController.create({
        message: message
      });
      this._loading.present();
      if (timer) {
        this._timer = setTimeout(() => {
          this._timer = null;
          this.dismiss();
        }, timer);
      }
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
