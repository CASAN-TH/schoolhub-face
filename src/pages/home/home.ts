import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
// import 'tracking/build/data/eye';
// import 'tracking/build/data/mouth';

declare var tracking: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  personGroupId: any;
  person: any = {};
  constructor(public auth: AuthServiceProvider, public navCtrl: NavController, public faceServiceProvider: FaceServiceProvider) {
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
    }
  }

  ionViewDidLoad() {
    let tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    let task = tracking.track('#video', tracker, { camera: true });
    var faces = [];
    var countNumber = 0;
    window.localStorage.removeItem('faces');
    tracker.on('track', function (event) {
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
          faces.push(img.src);
          if (faces.length === 2) {

            window.localStorage.setItem('faces', JSON.stringify(faces));
            let face = JSON.parse(window.localStorage.getItem('faces'));
            console.log(face);
          }
        });
      }
    });

    this.train();
  }

  testClick() {
    let faces = JSON.parse(window.localStorage.getItem('faces'));
    // let faceIDs = [];
    faces.forEach(face => {
      let storageRef = firebase.storage().ref();
      const filename = Math.floor(Date.now() / 1000);
      const imageRef = storageRef.child(`images/${filename}.jpg`);
      imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        imageRef.getDownloadURL().then(url => {
          this.faceServiceProvider.Detect({ url: url }).then(res => {
            let data: any = res;
            console.log(data);
            // data.forEach(itm => {
            //   faceIDs.push(itm.faceId);
            // });
            this.faceServiceProvider.PushFaceIds(data).then(faceIDs => {
              console.log(faceIDs);
              this.faceServiceProvider.Identify({ faceIds: faceIDs, personGroupId: this.personGroupId }).then(res => {
                let cadidates: any = res;
                cadidates.forEach(itm => {
                  if (itm.candidates) {
                    itm.candidates.forEach(element => {
                      this.faceServiceProvider.GetPerson(this.personGroupId, element.personId).then(res => {
                        this.person = res;
                        console.log(this.person);
                      }).catch(err => {
                        console.log(err);
                      });
                    });
                  }
                });
              }).catch(err => {
                console.log(err);
              });
            }).catch(err => {

            });

          }).catch(err => {
            console.log(err);
          });
        }).catch(err => {
          console.log(err);
        });
      });
    });
  }

  train() {
    this.faceServiceProvider.TrainPersonGroup(this.personGroupId).then(data => {
      this.getStatusRecuring();
    }).catch(err => {
      console.log(err);
    });
  }

  getStatusRecuring() {
    this.faceServiceProvider.GetPersonGroupTrainingStatus(this.personGroupId).then(res => {
      let data: any = res;
      if (data.status === 'running') {
        this.getStatusRecuring();
      }
      else {
        console.log(data.status);
        if (data.status === 'succeeded') {

        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  logout() {
    window.localStorage.removeItem('token');
    this.navCtrl.setRoot(LoginPage);
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
