import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import 'tracking/build/tracking';
import 'tracking/build/data/face';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import firebase from 'firebase';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { ClassField } from '@angular/compiler/src/output/output_ast';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';
import { CompletePage } from '../complete/complete';
import { ScreenSaverPage } from '../screen-saver/screen-saver';
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
  currentPerson: any;
  interval: any;
  noFaceCount: number = 0;
  constructor(public modalCtrl: ModalController, public attendantServiceProvider: AttendantServiceProvider, public auth: AuthServiceProvider, public navCtrl: NavController, public faceServiceProvider: FaceServiceProvider) {
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
    }

  }

  ionViewDidLoad() {
    this.faceDetecting();
    this.train();
    //this.theLoop();
  }

  faceDetecting() {
    var _video: any = document.querySelector('video');
    var _canvas: any = document.createElement('canvas');
    if (_video) {
      const tracker = new tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(0.5);
      tracker.setEdgesDensity(0);
      const trackingTask = tracking.track('#video', tracker, { camera: true });
      trackingTask.run();
      // on tracker start, if we found face (event.data)
      tracker.on('track', function (event) {
        //console.log(event);
        if (event.data.length > 0 && event.data[0].total >= 10) {

          _canvas.height = _video.videoHeight;
          _canvas.width = _video.videoWidth;
          var ctx = _canvas.getContext('2d');
          ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
          var img = new Image();
          img.src = _canvas.toDataURL();
          window.localStorage.setItem('face', img.src);

          // event.data.forEach(function (rect) {
          //   console.log(rect);
          // });

        }
        setTimeout(() => {
          trackingTask.stop();
        }, 100);
      });
    }
    //tracker stop just get face for detect
    //console.log('detect');
    this.interval = setTimeout(() => {
      let face = window.localStorage.getItem('face');
      window.localStorage.removeItem('face');
      //console.log(face);
      if (face) {
        console.log('detect');
        this.detect2(face)
      } else {
        console.log('no face');
        
        this.faceDetecting();
      }
    }, 1000);

    if (this.noFaceCount <= 50) {
      this.noFaceCount++;
    }else{
      clearTimeout(this.interval);
      this.navCtrl.setRoot(ScreenSaverPage);
    }

  }

  theLoop() {
    this.person = {}
    let face = window.localStorage.getItem('face');
    window.localStorage.removeItem('face');
    //console.log(face);
    if (face) {
      this.detect(face)
    } else {
      console.log('wakeup tracker');
      setTimeout(() => {
        this.faceDetecting();
      }, 5000);
    }
    this.interval = setTimeout(() => {
      this.theLoop();
    }, 10000);
  }

  detect(face) {
    console.log('in detecting');
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then(url => {
        console.log('firebase success');
        this.faceServiceProvider.Detect({ url: url }).then(res => {
          console.log('Detect success');
          let data: any = res;
          if (data.length > 0) {
            console.log('found ' + data.length + ' face(s)');
            this.faceServiceProvider.PushFaceIds(data).then(faceIDs => {
              console.log(faceIDs);
              this.faceServiceProvider.Identify({ faceIds: faceIDs, personGroupId: this.personGroupId }).then(res => {
                let cadidates: any = res;
                console.log('Identify success');
                if (cadidates) {
                  cadidates.forEach(itm => {
                    if (itm.candidates) {
                      if (itm.candidates.length > 0) {
                        console.log('found ' + itm.candidates.length + ' person(s)');
                        itm.candidates.forEach(element => {
                          if (this.currentPerson !== element.personId) {
                            this.currentPerson = element.personId;
                            this.faceServiceProvider.GetPerson(this.personGroupId, element.personId).then(res => {
                              this.person = res;
                              this.person.image = url;

                              let bodyReq = {
                                image: url,
                                citizenid: this.person.userData
                              };

                              let modal = this.modalCtrl.create(CompletePage, { person: this.person });
                              modal.onDidDismiss(res => {
                                this.faceDetecting();
                              });
                              modal.present();

                              this.attendantServiceProvider.Checkin(bodyReq).then(res => {
                                console.log(res);
                              }).catch(err => {
                                console.log(err);
                              });
                            }).catch(err => {
                              //console.log(err);
                            });
                          } else {
                            this.faceDetecting();
                          }

                        });
                      } else {
                        this.faceDetecting();
                      }

                    }
                    else {
                      this.faceDetecting();
                    }
                  });
                } else {
                  this.faceDetecting();
                }
              }).catch(err => {
                //console.log(err);
                this.faceDetecting();
              });
            }).catch(err => {
              this.faceDetecting();
            });
          } else {
            this.faceDetecting();
          }


        }).catch(err => {
          //console.log(err);
        });
      }).catch(err => {
        //console.log(err);
      });
    });
  }

  detect2(face) {
    console.log('in detecting');
    this.faceServiceProvider.DetectStream(face).then(res => {
      console.log('Detect success');
      let data: any = res;
      if (data.length > 0) {
        console.log('found ' + data.length + ' face(s)');
        this.faceServiceProvider.PushFaceIds(data).then(faceIDs => {
          console.log(faceIDs);
          this.faceServiceProvider.Identify({ faceIds: faceIDs, personGroupId: this.personGroupId }).then(res => {
            let cadidates: any = res;
            console.log('Identify success');
            if (cadidates) {
              cadidates.forEach(itm => {
                if (itm.candidates) {
                  if (itm.candidates.length > 0) {
                    console.log('found ' + itm.candidates.length + ' person(s)');
                    itm.candidates.forEach(element => {
                      if (this.currentPerson !== element.personId) {
                        this.currentPerson = element.personId;
                        this.faceServiceProvider.GetPerson(this.personGroupId, element.personId).then(res => {
                          this.person = res;
                          this.person.image = face;

                          let bodyReq = {
                            image: face,
                            citizenid: this.person.userData
                          };

                          let modal = this.modalCtrl.create(CompletePage, { person: this.person });
                          modal.onDidDismiss(res => {
                            this.faceDetecting();
                          });
                          modal.present();

                          // this.attendantServiceProvider.Checkin(bodyReq).then(res => {
                          //   console.log(res);
                          // }).catch(err => {
                          //   console.log(err);
                          // });
                        }).catch(err => {
                          //console.log(err);
                        });
                      } else {
                        this.faceDetecting();
                      }

                    });
                  } else {
                    this.faceDetecting();
                  }

                }
                else {
                  this.faceDetecting();
                }
              });
            } else {
              this.faceDetecting();
            }
          }).catch(err => {
            //console.log(err);
            this.faceDetecting();
          });
        }).catch(err => {
          this.faceDetecting();
        });
      } else {
        this.faceDetecting();
      }


    }).catch(err => {
      //console.log(err);
      this.faceDetecting();
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
