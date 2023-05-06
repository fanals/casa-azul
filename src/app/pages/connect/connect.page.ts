import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {

  public restaurant: string;
  public displayRestaurants: boolean = false;

  constructor(public platform: Platform,
              public storage: Storage,
              public navCtrl: NavController,
              public alertService: AlertService) {
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.storage.get('restaurant').then((restaurant: string) => {
        if (restaurant == "casaazul") {
          this.navCtrl.navigateRoot('user/1');
        } else {
          this.displayRestaurants = true;
        }
      });
    });
  }

  askP() {
    this.alertService.prompt('Contraseña', '').then(p => {
      if (this.restaurant == "casaazul" && p == "sachaCHAUD89") {
        this.storage.set('restaurant', "casaazul").then(res => {
          this.navCtrl.navigateRoot('user/1');
        }).catch(error => console.log('Error saving restaurant', error));
      } else {
        this.alertService.display("Contraseña incorrecta");
      }
    });
  }

}
