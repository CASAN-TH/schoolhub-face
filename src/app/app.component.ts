import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ScreenSaverPage } from '../pages/screen-saver/screen-saver';
import { TakePhotoPage } from '../pages/take-photo/take-photo';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;
  constructor(cameraPreview: CameraPreview,auth: AuthServiceProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
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
          alert(err);
        });

      if (auth.authenticated()) {
        this.rootPage = ScreenSaverPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }
}

