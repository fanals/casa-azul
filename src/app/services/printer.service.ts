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

  public _print(commands) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.starprnt.print("BT:PRNT Star", "EscPosMobile", commands).then(result => {
          console.log('Success print!');
          resolve();
        }).catch(error => {
          reject('La impresora no está conectada');
        });
      } else {
        resolve();
      }
    });
  }

  private _lineWithSpace(a, b) {
    let spaceLength = 33-a.length-b.length;
    return a+(new Array(spaceLength < 0 ? 0 : spaceLength).join(' '))+b+'\r\n';
  }

  private _format(txt) {
    txt = txt+'';
    return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  private _thousandSeparator(nb, separator) {
    return nb.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  private _addLine(lines, txtLeft, txtRight = false, bold = false, alignment = 'Left', bigLetters = false) {
    if (typeof txtLeft == 'number')
      txtLeft = this._thousandSeparator(txtLeft, ' ');
    if (typeof txtRight == 'number')
      txtRight = this._thousandSeparator(txtRight, ' ');
    if (bold)
      lines.push({enableEmphasis:true});
    lines.push({appendAlignment:alignment});
    let line = txtRight !== false ? {append:this._lineWithSpace(this._format(txtLeft), this._format(txtRight))} : {append:this._format(txtLeft)+ "\r\n"};
    if (bigLetters) {
      line['appendMultiple'] = line['append'];
      line['width'] = 2;
      line['height'] = 2;
      delete line['append'];
    }
    lines.push(line);
    lines.push({enableEmphasis:false});
    lines.push({appendAlignment:'Left'});
  }

  public printTotalOfTheDay(date, total, service) {
    let lines = [];
    this._addLine(lines, '');
    this._addLine(lines, 'CASA AZUL', false, true, 'Center', true);
    this._addLine(lines, date, false, true, 'Center');
    this._addLine(lines, '');
    this._addLine(lines, 'Total', total);
    this._addLine(lines, '10%', service);
    this._addLine(lines, "\r\n\r\n\r\n\r\n\r\n\r");
    return this._print(lines);
  }

}
