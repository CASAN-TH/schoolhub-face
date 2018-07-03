import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import firebase from 'firebase';
import { SettingGroupPage } from '../pages/setting-group/setting-group';
// import 'tracking/build/data/eye';
// import 'tracking/build/data/mouth';
declare var tracking: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('canvas') canvas: ElementRef;
  rootPage: any = SettingGroupPage;
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

      // let canvas: any = this.canvas.nativeElement;
      // let context: any = canvas.getContext('2d');
      // context.strokeStyle = '#00e000';
      // context.strokeRect(100, 10, 50, 50);

      // let tracker = new tracking.ObjectTracker('face');
      // //let tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
      // tracker.setInitialScale(4);
      // tracker.setStepSize(2);
      // tracker.setEdgesDensity(0.1);
      // let task = tracking.track('#video', tracker, { camera: true });
      // tracker.on('track', function (event) {
      //   context.clearRect(0, 0, canvas.width, canvas.height);
      //   if (event.data.length === 0) {
      //     // No colors were detected in this frame.
      //   } else {
      //     var _video: any = document.querySelector('video');
      //     var _canvas: any = document.createElement('canvas');
      //     _canvas.height = _video.videoHeight;
      //     _canvas.width = _video.videoWidth;
      //     var ctx = _canvas.getContext('2d');
      //     ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
      //     var img = new Image();
      //     img.src = _canvas.toDataURL();
      //     ////////////////////////Upload////////////
      //     let storageRef = firebase.storage().ref();
      //     const filename = Math.floor(Date.now() / 1000);
      //     const imageRef = storageRef.child(`images/${filename}.jpg`);
      //     imageRef.putString(img.src, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      //       imageRef.getDownloadURL().then(url => {
      //         console.log(url);
      //       }).catch(err => {
      //         console.log(err);
      //       });
      //     });
      //     /////////////////////////////////////////
      //     event.data.forEach(function (rect) {
      //       // rect.x, rect.y, rect.height, rect.width, rect.color
      //       console.log(rect.x, rect.y, rect.height, rect.width, event);
      //       context.strokeStyle = '#a64ceb';
      //       context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      //       context.font = '11px Helvetica';
      //       context.fillStyle = "#fff";
      //       context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      //       context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      //     });
      //   }
      // });
    });
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }
}

