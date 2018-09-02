import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import "tracking/build/tracking";
import "tracking/build/data/face";
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { AttendantServiceProvider } from '../../providers/attendant-service/attendant-service';
/**
 * Generated class for the AttendancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-attendance",
  templateUrl: "attendance.html"
})
export class AttendancePage {
  tracker: any;
  task: any;
  isLock: boolean = false;
  personGroupId: any = "5b4ea676a581760014b38015";
  personIDs: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataServiceProvider: DataServiceProvider,
    private faceService: FaceServiceProvider,
    private attendantService:AttendantServiceProvider
  ) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AttendancePage');

    this.initTracker();
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
      const canvas = this.getCanvas();
      const ctx = canvas.getContext("2d");

      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        trackedData.forEach(rect => {
          //const gradient = ctx.createLinearGradient(0, 0, 170, 0);
          ctx.strokeStyle = "#a64ceb";
          ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
          ctx.font = "11px Helvetica";
          ctx.fillStyle = "#fff";
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
      // if(this.personIDs.length > 0){
      //   //this.personIDs = [];
      // }
    }
  }

  detect(face: any) {
    try {
      this.faceService
        .DetectStream(face)
        .then((faces: any) => {
          this.isLock = true;
          this.faceService.PushFaceIds(faces).then((faceIDs: any) => {
            if (faceIDs.length > 0) {
              let body: any = {
                faceIds: faceIDs,
                personGroupId: this.personGroupId,
                maxNumOfCandidatesReturned: 10,
                confidenceThreshold: 0.7
              };
              this.faceService.Identify(body).then((identifies: any) => {
                if (identifies) {
                  this.isLock = false;
                  //console.log(this.personIDs);
                  identifies.forEach(identity => {
                    identity.candidates.forEach(person => {
                      if (this.personIDs.indexOf(person.personId) < 0) {
                        this.personIDs.push(person.personId);
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
                            this.attendantService.Checkin(bodyReq).then(res => {
                              this.dataServiceProvider.info("");
                            }).catch(err => {
                              this.dataServiceProvider.info("");
                            });
                          });
                      }
                    });
                  });
                } else {
                  this.isLock = false;
                }
              });
            } else {
              this.isLock = false;
            }
          });
        })
        .catch(err => {});
    } catch {
      this.isLock = false;
    }
  }

  getCanvas(): HTMLCanvasElement {
    return <HTMLCanvasElement>document.getElementsByTagName("canvas")[0];
  }

  getVideo(): HTMLVideoElement {
    return <HTMLVideoElement>document.getElementsByTagName("video")[0];
  }

  getWidth() {
    let width: string = screen.width + "px";
    return width;
  }
}
