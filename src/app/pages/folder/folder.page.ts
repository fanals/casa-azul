import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'src/app/services/printer.service';
import { ToastController } from '@ionic/angular';


declare let cordova: any;

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public devices = [];
  public data = {textToSend: "Hello world"};

  constructor(private activatedRoute: ActivatedRoute,
              private printer: PrinterService,
              private toastCtrl: ToastController) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  trackDevices(device) {
    return device.address;
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  print() {
    this.printer.print();
  }

}
