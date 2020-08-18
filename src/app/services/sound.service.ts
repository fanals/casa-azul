import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ConsoleService } from './console.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor(private nativeAudio: NativeAudio,
              private platform: Platform,
              private console: ConsoleService) {
    this.platform.ready().then(() => {
      this.nativeAudio.preloadSimple('pizza', 'assets/sounds/pizza.mp3').then(() => {
        this.console.log('Pizza sound loaded');
      }, (error) => {
        this.console.log('Pizza sound Error', error);
      });
      this.nativeAudio.preloadSimple('kitchen', 'assets/sounds/kitchen.mp3').then(() => {
        this.console.log('kitchen sound loaded');
      }, (error) => {
        this.console.log('kitchen sound Error', error);
      });
      this.nativeAudio.preloadSimple('bar', 'assets/sounds/bar.mp3').then(() => {
        this.console.log('bar sound loaded');
      }, (error) => {
        this.console.log('bar sound Error', error);
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
