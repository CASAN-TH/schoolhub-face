import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { ClassField } from '@angular/compiler/src/output/output_ast';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';
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
  faces: any;
  tracker: any;
  task: any;
  constructor(public attendantServiceProvider: AttendantServiceProvider, public auth: AuthServiceProvider, public navCtrl: NavController, public faceServiceProvider: FaceServiceProvider) {
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
    }
    // this.tracker = new tracking.ObjectTracker('face');
    // this.tracker.setInitialScale(4);
    // this.tracker.setStepSize(2);
    // this.tracker.setEdgesDensity(0.1);
  }

  ionViewDidLoad() {
    this.faceDetecting();
    this.train();
    //this.theLoop();
  }

  faceDetecting(){
    const tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(0.5);
    tracker.setEdgesDensity(0);
    const trackingTask = tracking.track('#video', tracker, { camera: true });
    trackingTask.run();
    trackingTask.stop();
    // on tracker start, if we found face (event.data)
    // tracker.on('track', function (event) {
      
    //   //console.log(event);
    //   // if (event.data.length > 0) {
    //   //   var _video: any = document.querySelector('video');
    //   //   var _canvas: any = document.createElement('canvas');
    //   //   _canvas.height = _video.videoHeight;
    //   //   _canvas.width = _video.videoWidth;
    //   //   var ctx = _canvas.getContext('2d');
    //   //   ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
    //   //   var img = new Image();
    //   //   img.src = _canvas.toDataURL();
    //   //   window.localStorage.setItem('face', img.src);
    //   // }
    //   setTimeout(() => {
    //     trackingTask.stop();
    //   }, 5500);
    // });
  }

  theLoop() {
    this.person = {}
    let face = window.localStorage.getItem('face');
    window.localStorage.removeItem('face');
    //console.log(face);
    if (face) {
      this.detect(face)
    }
    setTimeout(() => {
      this.theLoop();
    }, 6000);
  }

  detect(face) {

    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then(url => {
        console.log(url);
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
                      let bodyReq = {
                        image: url,
                        citizenid: this.person.userData
                      };
                      this.attendantServiceProvider.Checkin(bodyReq).then(res => {
                        console.log(res);
                      }).catch(err => {
                        console.log(err);
                      });
                    }).catch(err => {
                      //console.log(err);
                    });
                  });
                }
              });
            }).catch(err => {
              //console.log(err);
            });
          }).catch(err => {

          });

        }).catch(err => {
          //console.log(err);
        });
      }).catch(err => {
        //console.log(err);
      });
    });
  }

  testClick() {
    let face = window.localStorage.getItem('face');
    this.detect(face);
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
        // console.log(data.status);
        if (data.status === 'succeeded') {

        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
