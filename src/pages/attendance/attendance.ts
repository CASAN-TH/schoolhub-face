import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import "tracking/build/tracking";
import "tracking/build/data/face";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { FaceServiceProvider } from "../../providers/face-service/face-service";
import { AttendantServiceProvider } from "../../providers/attendant-service/attendant-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Dialogs } from "@ionic-native/dialogs";

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
      if (this.personGroupId === "5b89127e9bcb300014a221fe") {
        this.personGroupId = "5b4ea676a581760014b38015";
      }
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AttendancePage');
    this.initTracker();
  }

  ionViewWillLeave() {
    this.task.stop();
    console.log("ionViewWillLeave");
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
          //const gradient = ctx.createLinearGradient(0, 0, 170, 0);
          // ctx.strokeStyle = "#a64ceb";
          // ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          // ctx.font = "11px Helvetica";
          // ctx.fillStyle = "#fff";
          // ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          // ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

          var img = new Image();
          img.src = canvas.toDataURL("image/jpeg", 0.75);

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
                this.dataServiceProvider.info(
                  "ตรวจสอบข้อมูล ใบหน้า " + faceIDs.length + " ใบหน้า"
                );
                this.dialogs.beep(1);
                let body: any = {
                  faceIds: faceIDs,
                  personGroupId: this.personGroupId,
                  maxNumOfCandidatesReturned: 1,
                  confidenceThreshold: 0.7
                };
                this.faceService
                  .Identify(body)
                  .then((identifies: any) => {
                    if (identifies) {
                      this.isLock = false;
                      this.dataServiceProvider.info("");
                      identifies.forEach(identity => {
                        identity.candidates.forEach(person => {
                          //****************ค*/
                          // if (this.personIDs.indexOf(person.personId) < 0) {
                          //   this.personIDs.push(person.personId);

                          // }
                          /** */
                          if (this.currentPerson !== person.personId) {

                            this.currentPerson = person.personId;
                            
                            this.faceService
                              .GetPerson(this.personGroupId, person.personId)
                              .then((res: any) => {
                                console.log(res);

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
                                    this.dataServiceProvider.info("");
                                  })
                                  .catch(err => {
                                    this.dataServiceProvider.info("");
                                  });
                              });
                          }
                        });
                      });
                    } else {
                      this.isLock = false;
                      this.dataServiceProvider.info("");
                    }
                  })
                  .catch(err => {
                    this.isLock = false;
                    this.dataServiceProvider.info("");
                  });
              } else {
                this.isLock = false;
                this.dataServiceProvider.info("");
              }
            })
            .catch(err => {});
        })
        .catch(err => {});
    } catch {
      this.isLock = false;
    }
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
