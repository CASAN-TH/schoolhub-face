import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import 'tracking/build/data/eye';
import 'tracking/build/data/mouth';
declare var tracking: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('video') video: ElementRef;
  rootPage: any = HomePage;
  react: any = 'dook';
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      let canvas: any = this.canvas.nativeElement;
      let video: any = this.video.nativeElement;
      let context: any = canvas.getContext('2d');
      context.strokeStyle = '#00e000';
      //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.strokeRect(100, 10, 50, 50);


      let tracker = new tracking.ObjectTracker('face');
      //let tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
      tracker.setInitialScale(6);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);
      let task = tracking.track('#video', tracker, { camera: true });
      tracker.on('track', function (event) {
        // //alert(JSON.stringify(event));
        // console.log('event ready');
        // //context.clearRect(0, 0, canvas.width, canvas.height);
        // event.data.forEach(function (rect) {
        //   console.log(rect);
        //   context.strokeStyle = '#00e000';
        //    context.clearRect(0, 0, canvas.width, canvas.height);
        //   //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        //   context.strokeRect(rect.x, 10, rect.width, rect.height);
        //   context.font = '11px Helvetica';
        //   context.fillStyle = "#00e000";
        //   context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //   context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        // });
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (event.data.length === 0) {
          // No colors were detected in this frame.
        } else {
          event.data.forEach(function (rect) {

            // if (navigator.mediaDevices) {
            //   // access the web cam
            //   navigator.mediaDevices.getUserMedia({video: true})
            //   // permission granted:
            //     .then(function(stream) {
            //       video.src = window.URL.createObjectURL(stream);
            //       console.log(stream);
            //     })
            //     // permission denied:
            //     .catch(function(error) {
            //       document.body.textContent = 'Could not access the camera. Error: ' + error.name;
            //     });
            // }

            // rect.x, rect.y, rect.height, rect.width, rect.color
            console.log(rect.x, rect.y, rect.height, rect.width, event);
            // context.strokeStyle = '#00e000';
            // context.clearRect(0, 0, canvas.width, canvas.height);
            // context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            //context.strokeRect(rect.x, 10, rect.width, rect.height);
            context.strokeStyle = '#00e000';
            context.strokeRect(rect.x, rect.y, 100, 100);
          });
        }
      });
    });
  }
}

