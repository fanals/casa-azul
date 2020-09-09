import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ConsoleService } from './console.service';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor(private nativeAudio: NativeAudio,
              private platform: Platform,
              private userService:UserService,
              private console: ConsoleService) {
    this.platform.ready().then(() => {
      this.userService.get().then(user => {
        let device = user.device.slug;
        if (['pizza', 'bar', 'kitchen'].indexOf(device)) {
          this.nativeAudio.preloadSimple(device, 'assets/sounds/'+device+'.mp3').then(() => {
            this.console.log(device+' sound loaded');
          }, (error) => {
            this.console.log(device+' sound Error', error);
          });
        }
      });
    });
  }

  play(sound) {
    if (['pizza', 'bar', 'kitchen'].indexOf(sound) != -1) {
      this.nativeAudio.play(sound).then(() => {
        this.console.log('Sound played: ', sound);
      }, (error) => {
        this.console.log('Sound error', sound, error);
      });
    }
  }
}
