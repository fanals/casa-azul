import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alert: AlertController) {}

  display(message) {
    this._display(message);
  }

  async _display(message) {
    const a = await this.alert.create({
      header: message,
      buttons: ['OK']
    });
    await a.present();
  }

  prompt(header = 'Prompt', value = '') {
    return new Promise<string>((resolve, reject) => {
      this.alert.create({
        backdropDismiss: false,
        header: header,
        inputs: [{
          name: 'text',
          value: value,
          type: 'text'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
          }, {
          text: 'OK',
          handler: (data) => {
            resolve(data.text);
          }
        }]
      }).then(a => {
        a.present().then(() => {
          const firstInput: any = document.querySelector('ion-alert input');
          firstInput.focus();
          return;
        });
      });
    });
  }

}
