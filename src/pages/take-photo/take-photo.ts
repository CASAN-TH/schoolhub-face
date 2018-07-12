import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CameraPreview } from '@ionic-native/camera-preview';
import { FaceServiceProvider } from '../../providers/face-service/face-service';
import { CreatePersonModalPage } from '../create-person-modal/create-person-modal';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoadingProvider } from '../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-take-photo',
  templateUrl: 'take-photo.html',
})
export class TakePhotoPage {
  faces: Array<any> = [];
  person: any;
  constructor(public loadingProvider: LoadingProvider, public auth: AuthServiceProvider, public modalCtrl: ModalController, public faceServiceProvider: FaceServiceProvider, public cameraPreview: CameraPreview, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    let modal = this.modalCtrl.create(CreatePersonModalPage);
    modal.onDidDismiss(res => {
      if (res) {
        this.loadingProvider.onLoading();
        this.faceServiceProvider.CreatePerson(this.auth.Uesr().schoolid, res).then(res => {
          this.loadingProvider.dismiss();
          this.person = res;
        }).catch(err => {
          this.loadingProvider.dismiss();
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
    this.loadingProvider.onLoading();
    this.cameraPreview.takePicture().then((imageData) => {
      let img = 'data:image/jpeg;base64,' + imageData;
      this.faceServiceProvider.DetectStream(img).then(res => {
        let data: any = res;
        if (data.length > 0) {
          this.faceServiceProvider.AddPersonFaceStream(this.auth.Uesr().schoolid, this.person.personId, img).then(res => {
            this.faces.push(res);
            if (this.faces.length >= 3) {
              this.faceServiceProvider.TrainPersonGroup(this.auth.Uesr().schoolid).then(res => {
                this.navCtrl.pop();
              }).catch(err => {
                alert(JSON.stringify(err));
              });
            }
            this.loadingProvider.dismiss();
          }).catch(err => {
            this.loadingProvider.dismiss();
            alert(JSON.stringify(err));
          });
        } else {
          this.loadingProvider.dismiss();
        }
      }).catch(err => {
        this.loadingProvider.dismiss();
        alert(JSON.stringify(err));
      });
    }, (err) => {
      this.loadingProvider.dismiss();
      console.log(err);
    });
  }

  gotoHome() {
    this.navCtrl.pop();
  }

  setting() {

  }

}
