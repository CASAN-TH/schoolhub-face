import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CameraPreview } from '@ionic-native/camera-preview';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { CreatePersonModalPage } from '../create-person-modal/create-person-modal';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-take-photo',
  templateUrl: 'take-photo.html',
})
export class TakePhotoPage {
  faces: Array<any> = [];
  person: any;
  constructor(public auth: AuthServiceProvider, public modalCtrl: ModalController, public faceServiceProvider: FaceServiceProvider, public cameraPreview: CameraPreview, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    let modal = this.modalCtrl.create(CreatePersonModalPage);
    modal.onDidDismiss(res => {
      if (res) {
        this.faceServiceProvider.CreatePerson(this.auth.Uesr().schoolid, res).then(res => {
          //alert(JSON.stringify(res));
          this.person = res;
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      } else {
        this.navCtrl.pop();
      }
    });
    modal.present();
  }

  cameraSwitch() {
    console.log('object');
    this.cameraPreview.switchCamera();
  }

  takePhoto() {
    this.cameraPreview.takePicture().then((imageData) => {
      let img = 'data:image/jpeg;base64,' + imageData;
      //this.detect(img);
      this.faceServiceProvider.DetectStream(img).then(res => {
        let data: any = res;
        //alert(JSON.stringify(data));
        if (data.length > 0) {
          this.faceServiceProvider.AddPersonFaceStream(this.auth.Uesr().schoolid, this.person.personId, img).then(res => {
            //alert(JSON.stringify(res));
            this.faces.push(res);
            if (this.faces.length >= 3) {
              this.faceServiceProvider.TrainPersonGroup(this.auth.Uesr().schoolid).then(res => {
                this.navCtrl.pop();
              }).catch(err => {
                alert(JSON.stringify(err));
              });
            }
          }).catch(err => {
            alert(JSON.stringify(err));
          });
        }
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }, (err) => {
      console.log(err);
    });
  }

  gotoHome() {
    this.navCtrl.pop();
  }

  setting() {

  }

}
