import { ActionSheetController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionsheetService {

  constructor(public actionSheetController: ActionSheetController) {

  }

  choose(title, possibilities, cancelable = true) {
    return new Promise(resolve => {
      let buttons = Array();
      for (const [i, possibility] of possibilities.entries()) {
        buttons.push({
          text: possibility,
          handler: () => resolve(i)
        });
      }
      if (cancelable) {
        buttons.push({
          text: 'Cancelar',
          role: 'cancel',
          handler: () => resolve(false)
        });
      }
      this.actionSheetController.create({
        header: title,
        buttons: buttons
      }).then(a => {
        a.present();
      });
    });
  }

}
