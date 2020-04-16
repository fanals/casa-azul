import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading;

  constructor(public loadingController: LoadingController) {}

  show(message = 'Loading') {
    this._presentLoading(message); 
  }

  dismiss() {
    this._loading.dismiss();
  }

  async _presentLoading(message) {
    this._loading = await this.loadingController.create({
      message: message
    });
    await this._loading.present();
  }

}
