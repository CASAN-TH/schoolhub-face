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
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('countNumber') countNumber: ElementRef;
  @ViewChild('dismissbtn') dismissbtn: ElementRef;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    let canvas: any = this.canvas.nativeElement;
    let dismissbtn: HTMLButtonElement = this.dismissbtn.nativeElement;
    let countNumber: HTMLDivElement = this.countNumber.nativeElement;
    let context: any = canvas.getContext('2d');
    context.strokeStyle = '#00e000';
    context.strokeRect(100, 10, 50, 50);

    let tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    let task = tracking.track('#video', tracker, { camera: true });
    var countNum = 0;
    var faces = [];
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
          var num = parseInt(countNumber.textContent);
          if (num < 5) {
            console.log(rect.x, rect.y, rect.height, rect.width, event);
            console.log(countNumber.textContent);
            countNumber.textContent = (num + 1).toString();

          }
          else {
            window.localStorage.setItem('faces', JSON.stringify(faces));
          }
        });
      }
    });
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
