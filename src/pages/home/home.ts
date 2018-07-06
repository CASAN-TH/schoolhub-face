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
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { NoDataPage } from '../no-data/no-data';
// import 'tracking/build/data/eye';
// import 'tracking/build/data/mouth';

declare var tracking: any;
var tracker: any;
var trackingTask: any;

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
  constructor(private dataServiceProvider: DataServiceProvider, public modalCtrl: ModalController, public attendantServiceProvider: AttendantServiceProvider, public auth: AuthServiceProvider, public navCtrl: NavController, public faceServiceProvider: FaceServiceProvider) {
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
    }

  }

  ionViewDidLoad() {
    //this.faceDetecting();
    this.train();

    clearTimeout(this.interval);
    this.initTracking();
    this.Tracking();

    //this.theLoop();
  }

  ionViewWillLeave() {
    clearTimeout(this.interval);
  }

  initTracking() {
    var _video: any = document.querySelector('video');
    if (_video) {
      this.dataServiceProvider.info('initail traking task');
      tracker = new tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(0.5);
      tracker.setEdgesDensity(0);
      trackingTask = tracking.track('#video', tracker, { camera: true });
    } else {
      clearTimeout(this.interval);
    }

  }

  Tracking() {

    trackingTask.run();
    // on tracker start, if we found face (event.data)
    tracker.on('track', function (event) {
      console.log('tracking in Run()');
      if (event.data.length > 0 && event.data[0].total > 5) {

        var _video: any = document.querySelector('video');
        var _canvas: any = document.createElement('canvas');
        if (_video) {
          _canvas.height = _video.videoHeight;
          _canvas.width = _video.videoWidth;
          var ctx = _canvas.getContext('2d');
          ctx.drawImage(_video, 0, 0, _canvas.width, _canvas.height);
          var img = new Image();
          img.src = _canvas.toDataURL();
          if (!window.localStorage.getItem('face')) {
            window.localStorage.setItem('face', img.src);
          }
        }

        event.data.forEach(function (rect) {
          //console.log(rect);
        });

      }
      setTimeout(() => {
        trackingTask.stop();
      }, 10);
    });

    clearTimeout(this.interval);
    this.interval = setTimeout(() => {
      let face = window.localStorage.getItem('face');
      window.localStorage.removeItem('face');
      if (face) {
        this.dataServiceProvider.info('ดำเนินการตรวจสอบใบหน้า...');
        this.noFaceCount = 0;
        this.detect2(face)
      } else {
        this.dataServiceProvider.warning('ค้นหาใบหน้า...');
        this.Tracking();
      }
    }, 2000);

    if (this.noFaceCount <= 20) {
      this.noFaceCount++;
    } else {
      clearTimeout(this.interval);
      this.navCtrl.setRoot(ScreenSaverPage);
    }
  }



  detect(face) {
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    imageRef.putString(face, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
      imageRef.getDownloadURL().then(url => {
        this.faceServiceProvider.Detect({ url: url }).then(res => {
          this.dataServiceProvider.success('Detect success');
          let data: any = res;
          if (data.length > 0) {
            this.dataServiceProvider.info('found ' + data.length + ' face(s)');
            this.faceServiceProvider.PushFaceIds(data).then(faceIDs => {
              this.faceServiceProvider.Identify({ faceIds: faceIDs, personGroupId: this.personGroupId }).then(res => {
                let cadidates: any = res;
                this.dataServiceProvider.success('Identify success');
                if (cadidates) {
                  cadidates.forEach(itm => {
                    if (itm.candidates) {
                      if (itm.candidates.length > 0) {
                        this.dataServiceProvider.success('found ' + itm.candidates.length + ' person(s)');
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
                                //this.faceDetecting();
                                this.Tracking();
                              });
                              modal.present();

                              this.attendantServiceProvider.Checkin(bodyReq).then(res => {
                                this.dataServiceProvider.success('Checkin Success');
                              }).catch(err => {
                                this.dataServiceProvider.error(JSON.stringify(err));
                              });
                            }).catch(err => {
                              this.dataServiceProvider.error(JSON.stringify(err));
                            });
                          } else {
                            //this.faceDetecting();


                            this.Tracking();
                          }

                        });
                      } else {
                        //this.faceDetecting();




                        this.Tracking();
                      }

                    }
                    else {
                      //this.faceDetecting();
                      this.Tracking();
                    }
                  });
                } else {
                  //this.faceDetecting();
                  this.Tracking();
                }
              }).catch(err => {
                //this.faceDetecting();
                this.Tracking();
              });
            }).catch(err => {
              //this.faceDetecting();
              this.Tracking();
            });
          } else {
            //this.faceDetecting();
            this.Tracking();
          }


        }).catch(err => {
          //this.faceDetecting();
          this.Tracking();
        });
      }).catch(err => {
        //this.faceDetecting();
        this.Tracking();
      });
    });
  }

  showNoDataFound(face) {
    let modal = this.modalCtrl.create(NoDataPage, { face: face });
    modal.present();
    modal.onDidDismiss(res => {
      this.Tracking();
    });
  }
  detect2(face) {
    this.faceServiceProvider.DetectStream(face).then(res => {
      let data: any = res;
      if (data.length > 0) {
        this.dataServiceProvider.info('ตรวจสอบข้อมมูล ใบหน้า ' + data.length + ' ใบหน้า');
        this.faceServiceProvider.PushFaceIds(data).then(faceIDs => {
          this.faceServiceProvider.Identify({ faceIds: faceIDs, personGroupId: this.personGroupId }).then(res => {
            let cadidates: any = res;
            if (cadidates) {
              cadidates.forEach(itm => {
                if (itm.candidates) {
                  if (itm.candidates.length > 0) {
                    this.dataServiceProvider.info('พบข้อมูลเจ้าของใบหน้า ' + itm.candidates.length + ' ข้อมูล');
                    itm.candidates.forEach(element => {
                      if (this.currentPerson !== element.personId) {
                        
                        this.faceServiceProvider.GetPerson(this.personGroupId, element.personId).then(res => {
                          this.person = res;
                          this.person.image = face;

                          let bodyReq = {
                            image: face,
                            citizenid: this.person.userData
                          };
                          this.dataServiceProvider.info('ดำเนินการบันทึกข้อมูลการลงเวลา...');
                          this.attendantServiceProvider.Checkin(bodyReq).then(res => {
                            this.currentPerson = element.personId;
                            let modal = this.modalCtrl.create(CompletePage, { person: this.person });
                            modal.onDidDismiss(res => {
                              //this.faceDetecting();
                              this.Tracking();
                            });
                            modal.present();
                          }).catch(err => {
                            this.dataServiceProvider.error('บันทึกข้อมูลลงเวลาไม่สำเร็จ!!');
                            this.Tracking();
                          });
                        }).catch(err => {
                          this.showNoDataFound(face);
                        });
                      } else {
                        this.dataServiceProvider.warning('พบการบันทึกลงเวลาแล้ว!!');
                        this.Tracking();
                      }

                    });
                  } else {
                    this.showNoDataFound(face);
                  }

                }
                else {
                  this.showNoDataFound(face);
                }
              });
            } else {

              this.showNoDataFound(face);

            }
          }).catch(err => {
            this.showNoDataFound(face);
          });
        }).catch(err => {
          //Face is Empty
          this.showNoDataFound(face);
        });
      } else {
        this.showNoDataFound(face);
      }


    }).catch(err => {
      //Detect Service Return Error
      this.showNoDataFound(face);
    });
  }


  train() {
    this.faceServiceProvider.TrainPersonGroup(this.personGroupId).then(data => {
      this.getStatusRecuring();
    }).catch(err => {
      this.dataServiceProvider.error(JSON.stringify(err));
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
      this.dataServiceProvider.error(JSON.stringify(err));
    });
  }

  getWidth() {
    let width: string = screen.width + 'px';
    return width;
  }

}
