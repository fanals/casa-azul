import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StarPRNT } from '@ionic-native/star-prnt/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { ArticlePageModule } from './pages/article/article.module';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const socketIoConfig: SocketIoConfig = {url: 'http://localhost:8081', options: {autoConnect : false}};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ArticlePageModule,
    BrowserModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'ios'
    }),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__casaazuldbseb',
        driverOrder: ['sqlite', 'websql']
    }),
    AppRoutingModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  providers: [
    StatusBar,
    NativeAudio,
    StarPRNT,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
