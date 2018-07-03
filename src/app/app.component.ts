import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('canvas') canvas: ElementRef;
  rootPage: any = HomePage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      const firebaseConfig = {
        apiKey: 'AIzaSyAKkCULXo1SNuBRN4KRzHl9D2DxV8LzZWE',
        authDomain: 'testdev-475e6.firebaseapp.com',
        databaseURL: 'testdev-475e6.firebaseio.com',
        storageBucket: 'testdev-475e6.appspot.com',
        messagingSenderId: '307498376583'

      };
      firebase.initializeApp(firebaseConfig);
    });
  }
}

