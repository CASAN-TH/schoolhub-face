import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';
import 'tracking/build/tracking';
import 'tracking/build/data/face';

declare var window: any;
declare var tracking: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
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
      var cameraPreview = new CameraPreview();
      var video = document.getElementById('videoel');
      //var tracker = new tracking.ObjectTracker('face');
      //tracking.track('#videoel', tracker, { camera: true });
      //var task = tracking.track('#videoel', tracker);


      cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          var tracker = new tracking.ObjectTracker('face');
          tracker.setStepSize(1.7);
          alert('tracking is ready');
          // var img = new Image();
          // img.width = 200;
          // img.height = 200;
          // img.crossOrigin = '*';
          var task = tracking.track('#videoel', tracker, { camera: true });
          alert('task tracking is ready');
          tracker.on('track', function (event) {
            alert(JSON.stringify(event));
          });
        },
        (err) => {
        });
    });
  }
}

