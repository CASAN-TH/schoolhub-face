import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ScreenSaverPage } from '../pages/screen-saver/screen-saver';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';
  constructor(network: Network, cameraPreview: CameraPreview, auth: AuthServiceProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
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

      network.onDisconnect().subscribe(() => {
        alert('ไม่ได้เชื่อมต่ออินเทอร์เน็ต :-(');
      });

      const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: 'front',
        tapPhoto: false,
        previewDrag: false,
        toBack: true,
        alpha: 1
      };

      cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {

        },
        (err) => {
          console.log(err);
        });

      if (auth.authenticated()) {
        this.rootPage = ScreenSaverPage;
      } else {
        this.rootPage = 'LoginPage';
      }
    });
  }
}

