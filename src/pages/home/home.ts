import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import firebase from 'firebase';
// import 'tracking/build/data/eye';
// import 'tracking/build/data/mouth';

declare var tracking: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('canvas') canvas: ElementRef;
  constructor(public navCtrl: NavController, public faceServiceProvider: FaceServiceProvider) {

  }

  ionViewDidLoad() {
    let canvas: any = this.canvas.nativeElement;
    let context: any = canvas.getContext('2d');
    context.strokeStyle = '#00e000';
    context.strokeRect(100, 10, 50, 50);
    let tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    let task = tracking.track('#video', tracker, { camera: true });
    var faces = [];
    var countNumber = 0;
    window.localStorage.removeItem('faces');
    tracker.on('track', function (event) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (event.data.length === 0) {
        // No colors were detected in this frame.
      } else {
        var _video: any = document.querySelector('video');
        var _canvas: any = document.createElement('canvas');
        _canvas.height = _video.videoHeight;
        _canvas.width = _video.videoWidth;
        var ctx = _canvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
        var img = new Image();
        img.src = _canvas.toDataURL();
        event.data.forEach(function (rect) {
          if (faces.length < 5) {
            faces.push(img.src);
          }
          if (countNumber < 5) {
            countNumber++;
            console.log(countNumber);
          }
          else {
            window.localStorage.setItem('faces', JSON.stringify(faces));
            // let face = JSON.parse(window.localStorage.getItem('faces'));
            // console.log(face);
          }
        });
      }
    });
  }

  testClick() {
    let faces = JSON.parse(window.localStorage.getItem('faces'));
    let faceIDs = [];
    faces.forEach(face => {
      let storageRef = firebase.storage().ref();
      const filename = Math.floor(Date.now() / 1000);
      const imageRef = storageRef.child(`images/${filename}.jpg`);
      imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        imageRef.getDownloadURL().then(url => {
          this.faceServiceProvider.Detect({ url: url }).then(res => {
            let data: any = res;
            data.forEach(itm => {
              faceIDs.push(itm.faceId);
            });
            console.log(faceIDs);
          }).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      });
      
    });
   
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
