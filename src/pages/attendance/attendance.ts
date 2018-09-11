import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataServiceProvider: DataServiceProvider,
    private faceService: FaceServiceProvider,
    private attendantService: AttendantServiceProvider,
    private auth: AuthServiceProvider,
    private platform: Platform,
    private dialogs: Dialogs
  ) {
    this.screenSize = {
      width: this.platform.width(),
      height: this.platform.height()
    };
    console.log(this.screenSize);
    if (this.auth.authenticated()) {
      this.personGroupId = this.auth.Uesr().schoolid;
      // if (this.personGroupId === "5b89127e9bcb300014a221fe") {
      //   this.personGroupId = "5b4ea676a581760014b38015"; // กลุ่มเด็ก
      // }
    }
  }

  ionViewDidLoad() {
    this.initTracker();
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
      this.tracker.setInitialScale(4);
      this.tracker.setStepSize(2);
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
            this.detect(img.src);
          }
        });
      }
    } else {
      if (this.personIDs.length > 0) {
        this.personIDs = [];
      }
    }
  }

  detect(face: any) {
    //ยกเลิกมันช้า
    // try {
    //   this.saveImgsToFirebase(face);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      this.faceService
        .DetectStream(face)
        .then((faces: any) => {
          this.isLock = true;
          this.dataServiceProvider.info("");
          this.faceService
            .PushFaceIds(faces)
            .then((faceIDs: any) => {
              if (faceIDs.length > 0) {
                let body: any = {
                  faceIds: faceIDs,
                  personGroupId: this.personGroupId,
                  maxNumOfCandidatesReturned: 1,
                  confidenceThreshold: 0.8 //ค่าความแม่นยำ
                };
                this.faceService
                  .Identify(body)
                  .then((identifies: any) => {
                    if (identifies) {
                      // แก้ไขย้ายไปให้ปลดล๊อคเมื่อเจอข้อมูลบุคคล หรือไม่เจอ
                      // this.isLock = false;
                      //this.dataServiceProvider.info("");

                      this.dataServiceProvider.info(
                        "ตรวจสอบข้อมูล ใบหน้า " + faceIDs.length + " ใบหน้า"
                      );

                      identifies.forEach(identity => {
                        //แก้ไขเอา candidates สูงสุดที่ array ตัวที่ 0
                        if (
                          identity.candidates &&
                          identity.candidates.length === 0
                        ) {
                          // กรณี Identify ที่ความแม่นยำ 85% แล้วไม่ Match กับบุคคลใด
                          // ต้องการเก็บข้อมูลคนที่ No one identified
                          this.isLock = false;
                          this.dataServiceProvider.info(
                            "..."
                          );
                          this.dialogs.beep(1);
                        } else {
                          var person = identity.candidates[0];
                          if (this.currentPerson !== person.personId) {
                            this.currentPerson = person.personId;
                            this.faceService
                              .GetPerson(this.personGroupId, person.personId)
                              .then((res: any) => {
                                let person = res;
                                this.dataServiceProvider.info(person.name);
                                person.image = face;
                                let bodyReq = {
                                  image: face,
                                  citizenid: person.userData
                                };
                                this.attendantService
                                  .Checkin(bodyReq)
                                  .then(res => {
                                    //กรณี ส่งข้อมูลไปลงชื่อสำเร็จ
                                    this.isLock = false;
                                    this.dataServiceProvider.info(
                                      "ลงชื่อสำเร็จ"
                                    );
                                    this.dialogs.beep(1);
                                  })
                                  .catch(err => {
                                    //กรณี ส่งข้อมูลไปลงชื่อไม่สำเร็จ
                                    this.isLock = false;
                                    this.dataServiceProvider.info("");
                                    this.dialogs.beep(1);
                                  });
                              })
                              .catch(err => {
                                //กรณี GetPerson Error
                                this.isLock = false;
                                this.dataServiceProvider.info("");
                                this.dialogs.beep(1);
                              });
                          } else {
                            // กรณีใบหน้าซ้ำกับคนก่อนหน้า
                            this.isLock = false;
                            this.dataServiceProvider.info(
                              "ลงชื่อเข้าไปแล้วครับ"
                            );
                            this.dialogs.beep(1);
                          }
                        }
                      });
                    } else {
                      // กรณี Identify ไม่มีข้อมูล
                      this.isLock = false;
                      this.dataServiceProvider.info("");
                    }
                  })
                  .catch(err => {
                    //กรณี Identify Error
                    this.isLock = false;
                    this.dataServiceProvider.info("");
                  });
              } else {
                // กรณี Detect ไม่เจอใบหน้า
                this.isLock = false;
                this.dataServiceProvider.info("");
              }
            })
            .catch(err => {
              //กรณี PushFaceIds Error
              this.isLock = false;
              this.dataServiceProvider.info("");
            });
        })
        .catch(err => {
          //กรณี Detect Error
          this.isLock = false;
          this.dataServiceProvider.info("");
        });
    } catch {
      //กรณี Unhandle Error
      this.isLock = false;
      this.dataServiceProvider.info("");
    }
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
