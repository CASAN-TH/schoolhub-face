import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
declare var tracking: any;
@IonicPage()
@Component({
  selector: 'page-add-face',
  templateUrl: 'add-face.html',
})
export class AddFacePage {
  presonFaces:any=[];
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    // this.faceDetecting();
    // this.theLoop();
  }

  faceDetecting() {
    const tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(0.5);
    tracker.setEdgesDensity(0);
    const trackingTask = tracking.track('#video', tracker, { camera: true });
    trackingTask.run();
    // on tracker start, if we found face (event.data)
    tracker.on('track', function (event) {

      //console.log(event);
      if (event.data.length > 0) {
        var _video: any = document.querySelector('video');
        var _canvas: any = document.createElement('canvas');
        _canvas.height = _video.videoHeight;
        _canvas.width = _video.videoWidth;
        var ctx = _canvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
        var img = new Image();
        img.src = _canvas.toDataURL();
        window.localStorage.setItem('face', img.src);
        setTimeout(() => {
          trackingTask.stop();
        }, 2500);
      }
    });
  }

  theLoop() {
   
    let face = window.localStorage.getItem('face');
    window.localStorage.removeItem('face');
    
    if (face) {
      if(this.presonFaces.length < 5){
        this.presonFaces.push(face);
        this.faceDetecting();
      }else{
        this.viewCtrl.dismiss(this.presonFaces);
      }
     
    }
    setTimeout(() => {
      this.theLoop();
    }, 3000);
  }

  dismiss() {
    let faces: any = JSON.parse(window.localStorage.getItem('faces'));
    this.viewCtrl.dismiss(faces);
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
