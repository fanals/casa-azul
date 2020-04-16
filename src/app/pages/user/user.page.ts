import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/types';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import { ConsoleService } from 'src/app/services/console.service';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  public user: UserType;

  constructor(public userService:UserService,
              public console: ConsoleService,
              public deviceService: DeviceService,
              public bluetooth:BluetoothService,
              public alert: AlertService) {
    
  }

  ngOnInit() {
    this.userService.get().then(user => {
      this.console.log('User is', user);
      this.user = user;
    });
  }

  changedCategory() {
    this.userService.save().then(() => {
      this.bluetooth.addService();
    });
  }

  save() {
    this.userService.save();
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

}
