import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alert: AlertController) {}

  display(message) {
    this.alert.create({
      header: message,
      buttons: ['OK']
    }).then(a => {
      a.present()
    });
  }

  fixed(message) {
    this.alert.create({
      header: message,
      backdropDismiss: false,
      buttons: []
    }).then(a => {
      a.present();
    });
  }

  confirm(message: string = 'Confirmar') {
    return new Promise<string>((resolve) => {
      this.alert.create({
        backdropDismiss: true,
        header: message,
        buttons: [{
          text: 'No',
          role: 'cancel'
          }, {
          text: 'Si',
          handler: () => {
            resolve();
          }
        }]
      }).then(a => {
        a.present();
      });
    });
  }

  prompt(header = 'Prompt', value = '') {
    return new Promise<string>((resolve, reject) => {
      this.alert.create({
        backdropDismiss: true,
        header: header,
        inputs: [{
          name: 'text',
          value: value,
          type: 'text'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            reject();
          }}, {
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

  select(title, choices, checkedValue) {
    return new Promise((resolve) => {
      let inputs = choices.map((choice, index) => {
        return {
          name: 'radio'+index,
          type: 'radio',
          label: choice.label,
          value: choice.value,
          checked: choice.value == checkedValue
        };
      });
      this.alert.create({
        header: title,
        backdropDismiss: true,
        inputs: inputs,
        buttons: [{
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: (value) => {
            resolve(value);
          }
        }
      ]}).then(a => {
        a.present();
      });
    });
  }

  special() {
    let buttons = [{
      text: 'Modificar',
      handler: () => {
        console.log('Modificar');
      },
      cssClass: "warning"
    }, {
      text: 'Cerrar',
      handler: () => {
        console.log('Cerrar');
      },
      cssClass: "success"
    }];
    this.alert.create({
      header: 'Cerrar mesa',
      backdropDismiss: true,
      buttons: buttons
    }).then(a => {
      a.present();
    });
  }
}
