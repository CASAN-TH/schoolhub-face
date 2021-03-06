import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController
} from "ionic-angular";
import "tracking/build/tracking";
import "tracking/build/data/face";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { FaceServiceProvider } from "../../providers/face-service/face-service";
import { AttendantServiceProvider } from "../../providers/attendant-service/attendant-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Dialogs } from "@ionic-native/dialogs";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-attendance",
  templateUrl: "attendance.html"
})
export class AttendancePage {
  tracker: any;
  task: any;
  isLock: boolean = false;
  personGroupId: any;
  personIDs: any = [];
  screenSize: any = {};
  currentPerson: any;
  currentTime: any;
  tickerIn = [9, 17];

  confidenceThreshold = 0.8; //ค่าความแม่นยำ (default)
  tryConfidenceThreshold = 0.7; //ค่าความแม่นยำ (default try)
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataServiceProvider: DataServiceProvider,
    private faceService: FaceServiceProvider,
    private attendantService: AttendantServiceProvider,
    private auth: AuthServiceProvider,
    private platform: Platform,
    private dialogs: Dialogs,
    private modalCtrl: ModalController
  ) {
    this.screenSize = {
      width: this.platform.width(),
      height: this.platform.height()
    };
    console.log(this.screenSize);
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
    }
  }

  ionViewWillEnter() {
    this.tickTime();
    this.initTracker();
  }

  tickTime() {
    this.currentTime = new Date();

    setTimeout(() => {
      if (this.tickerIn.indexOf(new Date().getHours()) > 0) {
        this.task.stop();
        this.navCtrl.pop();
        //this.navCtrl.setRoot(ScreenSaverPage);
      } else {
        this.tickTime();
      }
    }, 1000);
  }

  ionViewWillLeave() {
    this.task.stop();
  }

  initTracker(): void {
    try {
      const global = <any>window;
      this.tracker = new global.tracking.ObjectTracker("face");
      this.task = global.tracking.track("#video", this.tracker, {
        camera: true
      });

      this.tracker.on("track", event => {
        const { data } = event;
        this.tryToDetectFace(data);
      });
      this.tracker.setInitialScale(7);
      this.tracker.setStepSize(3.5);
      this.tracker.setEdgesDensity(0.1);
    } catch (e) {
      console.log(e);
    }
  }

  tryToDetectFace(trackedData: any): void {
    if (trackedData.length > 0) {
      const video = this.getVideo();
      const canvas = this.createCanvas(); //this.getCanvas();
      const ctx = canvas.getContext("2d");

      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        trackedData.forEach(rect => {
          var img = new Image();
          img.src = canvas.toDataURL("image/jpeg", 0.7);

          if (!this.isLock) {
            console.log(trackedData.length);
            this.detect(img.src, this.confidenceThreshold);
          }
        });
      }
    } else {
      if (this.personIDs.length > 0) {
        this.personIDs = [];
      }
    }
  }

  detect(face: any, confidenceThreshold: any) {
    this.isLock = true;
    try {
      this.faceService
        .DetectStream(face)
        .then((faces: any) => {
         if(faces.length > 0){
          this.faceService
            .PushFaceIds(faces)
            .then((faceIDs: any) => {
              if (faceIDs.length > 0) {
                this.dataServiceProvider.info(
                  "ตรวจสอบข้อมูล ใบหน้า " + faceIDs.length + " ใบหน้า"
                );
                let body: any = {
                  faceIds: faceIDs,
                  personGroupId: this.personGroupId,
                  maxNumOfCandidatesReturned: 1,
                  confidenceThreshold: confidenceThreshold //ค่าความแม่นยำ
                };
                this.faceService
                  .Identify(body)
                  .then((identifies: any) => {
                    if (identifies) {
                      // this.dataServiceProvider.info(
                      //   "ตรวจสอบข้อมูล ใบหน้า " + faceIDs.length + " ใบหน้า"
                      // );

                      identifies.forEach(identity => {
                        //แก้ไขเอา candidates สูงสุดที่ array ตัวที่ 0
                        if (
                          identity.candidates &&
                          identity.candidates.length === 0
                        ) {
                          // กรณี Identify ที่ความแม่นยำ 70% แล้วไม่ Match กับบุคคลใด
                          // ระบบจะพยายาม ที่ความแม่นยำ 65% อีกครั้ง
                          if (
                            confidenceThreshold === this.confidenceThreshold
                          ) {
                            this.detect(face, this.tryConfidenceThreshold);
                          } else {
                            this.showFoundFace(face, "ยังไม่ได้ลงทะเบียน");
                          }
                        } else {
                          var person = identity.candidates[0];

                          if (this.currentPerson !== person.personId) {
                            this.currentPerson = person.personId;
                            this.faceService
                              .GetPerson(this.personGroupId, person.personId)
                              .then((res: any) => {
                                let person = res;
                                //this.dataServiceProvider.info(person.name);
                                person.image = face;
                                let bodyReq = {
                                  image: face,
                                  citizenid: person.userData,
                                  faceId: identity.faceId,
                                  personId: person.personId,
                                  personName: person.name,
                                  confidence: identity.candidates[0].confidence
                                };
                                this.showFoundFace(face, "ลงชื่อสำเร็จ");
                                this.attendantService
                                  .Checkin(bodyReq)
                                  .then(res => {
                                    //กรณี ส่งข้อมูลไปลงชื่อสำเร็จ
                                    //this.showFoundFace(face, "ลงชื่อสำเร็จ");
                                  })
                                  .catch(err => {
                                    //กรณี ส่งข้อมูลไปลงชื่อไม่สำเร็จ
                                    // this.showFoundFace(
                                    //   face,
                                    //   "พบข้อผิดพลาด : ข้อมูลบุคคลไม่ถูกต้อง"
                                    // );
                                  });
                              })
                              .catch(err => {
                                //กรณี GetPerson Error
                                this.showFoundFace(
                                  face,
                                  "พบข้อผิดพลาด : ข้อมูลบุคคลไม่ถูกต้อง"
                                );
                              });
                          } else {
                            // กรณีใบหน้าซ้ำกับคนก่อนหน้า
                            // this.showFoundFace(
                            //   face,
                            //   "พบข้อผิดพลาด : ท่านได้ทำการลงชื่อแล้ว"
                            // );
                          }
                        }
                      });
                    } else {
                      // กรณี Identify ไม่มีข้อมูล
                      this.showFoundFace(
                        face,
                        "พบข้อผิดพลาด : ไม่พบข้อมูลบุคคล"
                      );
                    }
                  })
                  .catch(err => {
                    //กรณี Identify Error
                    // this.showFoundFace(
                    //   face,
                    //   "พบข้อผิดพลาด : การยืนยันบุคคลผิดพลาด"
                    // );
                    this.isLock = false;
                  });
              } else {
                // กรณี Detect ไม่เจอใบหน้า
                this.showFoundFace(
                  face,
                  "พบข้อผิดพลาด : ไม่สามารถตรวจจับใบหน้า"
                );
                //this.isLock = false;
              }
            })
            .catch(err => {
              //กรณี PushFaceIds Error
              // this.showFoundFace(
              //   face,
              //   "พบข้อผิดพลาด : ข้อมูลลำดับใบหน้าไม่ถูกต้อง"
              // );
              this.isLock = false;
            });
         }else{
          this.isLock = false;
         }
        })
        .catch(err => {
          //กรณี Detect Error
          this.dataServiceProvider.error("ไม่สามารถเชื่อมต่ออินเตอร์เน๊ต");
          this.isLock = false;
        });
    } catch {
      //กรณี Unhandle Error
      //this.showFoundFace(face, "พบข้อผิดพลาด : การตรวจสอบข้อมูลผิดพลาด");
      this.dataServiceProvider.error("ไม่สามารถเชื่อมต่ออินเตอร์เน๊ต")
      this.isLock = false;
    }
  }

  showFoundFace(face, msg) {
    //วิธีที่ 1 แสดง Modal
    // let modal = this.modalCtrl.create("CompletePage", { face: face, msg: msg });
    // modal.present();
    // this.dialogs.beep(1);
    // modal.onDidDismiss(res => {
    //   this.isLock = false;
    // });

    //วิธีที่ 2 แสดงข้อความ
    this.dialogs.beep(1);
    this.dataServiceProvider.success("ลงชื่อสำเร็จ");
    setTimeout(() => {
      this.dataServiceProvider.info("");
      this.isLock = false;
    }, 1000);
    
  }

  saveImgsToFirebase(face) {
    let storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    imageRef
      .putString(face, firebase.storage.StringFormat.DATA_URL)
      .then(snapshot => {});
  }

  getCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement>document.getElementsByTagName("canvas")[0];
  }

  createCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement>document.createElement("canvas");
  }

  getVideo(): HTMLVideoElement {
    return <HTMLVideoElement>document.getElementsByTagName("video")[0];
  }
}
