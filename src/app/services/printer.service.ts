import { Injectable } from '@angular/core';
import { StarPRNT, PrintObj } from '@ionic-native/star-prnt/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { async } from '@angular/core/testing';
import * as moment from 'moment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor(private starprnt: StarPRNT,
              private platform: Platform,
              private alert: AlertService) {}

  private _header() {
    var date = moment().format("DD/MM/YYYY HH:mm:ss");
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
    return commands;
  }

  public print() {
    let commands = this._header();
    if (this.platform.is('cordova')) {
      this.starprnt.print("BT:PRNT Star", "EscPosMobile", commands).then(result => {
        console.log('Success!');
      }).catch(error => {
        this.alert.display('La impresora no está conectada');
      });
    }
  }

}
