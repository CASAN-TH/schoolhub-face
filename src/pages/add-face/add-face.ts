import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
declare var tracking: any;
var tracker: any;
var trackingTask: any;
@IonicPage()
@Component({
  selector: 'page-add-face',
  templateUrl: 'add-face.html',
})
export class AddFacePage {
  interval: any;
  presonFaces:any=[];
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.initTracking();
    this.Tracking();
  }
  initTracking() {
    console.log('initail traking task');
    tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(0.5);
    tracker.setEdgesDensity(0);
    trackingTask = tracking.track('#video', tracker, { camera: true });
  }

  Tracking() {
    clearTimeout(this.interval);
    trackingTask.run();
    // on tracker start, if we found face (event.data)
    tracker.on('track', function (event) {
      console.log('tracking in Run()');
      if (event.data.length > 0 && event.data[0].total > 1) {
        var _video: any = document.querySelector('video');
        var _canvas: any = document.createElement('canvas');
        _canvas.height = _video.videoHeight;
        _canvas.width = _video.videoWidth;
        var ctx = _canvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
        var img = new Image();
        img.src = _canvas.toDataURL();
        window.localStorage.setItem('face', img.src);

        event.data.forEach(function (rect) {
          console.log(rect);
        });

      }
      setTimeout(() => {
        trackingTask.stop();
      }, 100);
    });


    this.interval = setTimeout(() => {
      let face = window.localStorage.getItem('face');
      window.localStorage.removeItem('face');
      //console.log(face);
      if (face) {
        this.presonFaces.push(face);
        console.log(this.presonFaces.length);
        if(this.presonFaces.length > 10){
          clearTimeout(this.interval);
          this.dismiss();
        }else{
          this.Tracking();
        }
      } else {
        console.log('no face');
        this.Tracking();
      }
    }, 3000);

    
  }
 

  dismiss() {
    this.viewCtrl.dismiss(this.presonFaces);
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
