import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview } from '@ionic-native/camera-preview';

/**
 * Generated class for the TakePhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-take-photo',
  templateUrl: 'take-photo.html',
})
export class TakePhotoPage {

  constructor(public cameraPreview: CameraPreview, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  cameraSwitch() {
    console.log('object');
    this.cameraPreview.switchCamera();
  }

  takePhoto() {
    this.cameraPreview.takePicture().then((imageData) => {
      let img = 'data:image/jpeg;base64,' + imageData;
      //this.detect(img);
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
