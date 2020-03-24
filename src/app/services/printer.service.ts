import { Injectable } from '@angular/core';
import { StarPRNT, PrintObj } from '@ionic-native/star-prnt/ngx';
import { AlertController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor(private starprnt: StarPRNT,
              public alertController: AlertController) {}

  print() {
    var date = moment().format("DD/MM/YYYY HH:mm:ss");
    let printObj:PrintObj = {
      text:"Star Clothing Boutique\n123 Star Road\nCity, State 12345\n\n",
      cutReceipt: false,
      openCashDrawer: false
    }
    let commands = [];
    commands.push({append:"\r\n"});
    commands.push({enableEmphasis:true});
    commands.push({appendAlignment:'Center'});
    commands.push({appendMultiple: "CASA AZUL\r\n", width:2, height:2});
    commands.push({enableEmphasis:false});
    commands.push({append: "Calle libertad, Las Terrenas\r\nTel: 829 707 04 04\r\nRNC: 131865143\r\n\r\n"});
    commands.push({appendAlignment:'Left'});
    commands.push({append:date+'\r\n'});
    commands.push({enableEmphasis:true});
    commands.push({appendAlignment:'Center'});
    commands.push({append: '--------------------------------\r\n'});
    commands.push({append: 'FACTURA PROVISIONAL\r\n'});
    commands.push({append: '--------------------------------\r\n'});
    this.starprnt.print("BT:PRNT Star", "EscPosMobile", commands).then(result => {
      console.log('Success!');
    }).catch(error => {
      this._displayPrinterError();
    });
  }

  async _displayPrinterError() {
    const alert = await this.alertController.create({
      header: 'La impresora no está conectada',
      buttons: ['OK']
    });
    await alert.present();
  }

}
