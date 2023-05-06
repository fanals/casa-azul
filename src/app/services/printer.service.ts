import { Injectable } from '@angular/core';
import { StarPRNT } from '@ionic-native/star-prnt/ngx';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { AlertService } from './alert.service';
import { BillService } from './bill.service';
import { MenuService } from './menu.service';
import { DGIIEnum, DGII } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor(private starprnt: StarPRNT,
              private platform: Platform,
              private menuService: MenuService,
              private billService: BillService,
              private alert: AlertService) {}

  public _print(commands) {
    this._addLine(commands, '\r\n');
    return new Promise<void>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.starprnt.print("BT:PRNT Star", "EscPosMobile", commands).then(result => {
          console.log('Success print!');
          resolve();
        }).catch(error => {
          reject('La impresora no está conectada');
        });
      } else {
        commands.forEach(element => {
          if (element.append) {
            console.log(element.append);
          }

          if (element.appendMultiple) {
            console.log(element.appendMultiple);
          }
        });
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

  private _addLine(lines, txtLeft:any, txtRight:any = false, bold = false, alignment = 'Left', bigLetters = false) {
    if (typeof txtLeft == 'number')
      txtLeft = this._thousandSeparator(txtLeft, ',');
    if (typeof txtRight == 'number')
      txtRight = this._thousandSeparator(txtRight, ',');
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

  private _header(bill) {
    let title = "FACTURA PROVISIONAL";
    if (bill.dgii.type == DGIIEnum["VALOR_FISCAL"])
      title = "FACTURA CREDITO FISCAL";
    else if (bill.dgii.type == DGIIEnum["CONSUMIDOR_FINAL"])
      title = "FACTURA CONSUMIDOR FINAL";
    let lines = [];
    this._addLine(lines, 'CASA AZUL', false, true, 'Center', true);
    this._addLine(lines, 'Calle libertad, Las Terrenas', false, false, 'Center');
    this._addLine(lines, 'Tel: 829 707 04 04', false, false, 'Center');
    this._addLine(lines, 'RNC: 131865143', false, false, 'Center');
    this._addLine(lines, '');
    this._addLine(lines, moment().format("DD/MM/YYYY HH:mm:ss"));
    this._addLine(lines, '--------------------------------', false, false, 'Center');
    this._addLine(lines, title, false, false, 'Center');
    this._addLine(lines, '--------------------------------', false, false, 'Center');
    
    if (bill.dgii.type == DGIIEnum["VALOR_FISCAL"]) {
      this._addLine(lines, 'NCF: '+bill.dgii.fullncf);
      this._addLine(lines, 'RNC: '+bill.dgii.rnc);
      this._addLine(lines, bill.dgii.name);
      this._addLine(lines, '--------------------------------', false, false, 'Center');
    } else if (bill.dgii.type == DGIIEnum["CONSUMIDOR_FINAL"]) {
      this._addLine(lines, 'NCF: '+bill.dgii.fullncf);
      this._addLine(lines, '--------------------------------', false, false, 'Center');
    }

    return lines;
  }

  public printTotalOfTheDay(date, total, service) {
    let lines = [];
    this._addLine(lines, '');
    this._addLine(lines, 'CASA AZUL', false, true, 'Center', true);
    this._addLine(lines, date, false, true, 'Center');
    this._addLine(lines, '');
    this._addLine(lines, 'Total', total);
    this._addLine(lines, '10%', service);
    this._addLine(lines, "\r\n\r\n\r\n\r");
    return this._print(lines);
  }

  public printBill(table, bill, condensedBill) {
    return new Promise(resolve => {
      console.log("Get menu from printer service");
      this.menuService.get().then(menu => {
        console.log('bill', bill);
        console.log('condensed', condensedBill);
        let lines = this._header(bill);
        condensedBill.articles.forEach(article => {
          this._addLine(lines, article.q+' '+menu.articles[article.ami].name, this.billService.getArticlePrice(article) * article.q);
          if (article.mii) {
            article.mii.forEach(ingredientIndex => {
              this._addLine(lines, 'Menos '+menu.ingredients[ingredientIndex].name);
            });
          }
          if (article.pii) {
            article.pii.forEach(ingredientIndex => {
              this._addLine(lines, 'Mas '+menu.ingredients[ingredientIndex].name);
            });
          }
          if (article.half && article.half.ami != null) {
            this._addLine(lines, 'Mitad '+menu.articles[article.half.ami].name);
            if (article.half.mii) {
              article.half.mii.forEach(ingredientIndex => {
                this._addLine(lines, 'Menos '+menu.ingredients[ingredientIndex].name);
              });
            }
            if (article.half.pii) {
              article.half.pii.forEach(ingredientIndex => {
                this._addLine(lines, 'Mas '+menu.ingredients[ingredientIndex].name);
              });
            }
          }
        });
        if (bill.hasItbis || bill.hasService || bill.delivery) {
          this._addLine(lines, '--------------------------------', false, false, 'Center');
          this._addLine(lines, 'Subtotal', bill.subtotal);
          if (bill.hasItbis)
            this._addLine(lines, 'ITBIS', bill.itbis);
          if (bill.hasService)
            this._addLine(lines, 'Servicio 10%', bill.service);
          if (bill.delivery)
            this._addLine(lines, 'Delivery', bill.delivery);
        }
        this._addLine(lines, '--------------------------------', false, false, 'Center');        
        this._addLine(lines, 'TOTAL '+this._thousandSeparator(bill.total+bill.delivery, ','), false, true, 'Center', true);
        this._addLine(lines, '--------------------------------', false, false, 'Center');
        this._addLine(lines, table.name, false, false, 'Left', true);
        this._addLine(lines, '*** FIN DOCUMENTO NO VENTA ***', false, false, 'Center');
        this._print(lines).then(ok => {
          resolve(ok);
        })
      });
    });
  }

}
